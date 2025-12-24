import { getUserIdFromToken } from '../../../../user/api';
import { rentalMonitoringApi } from '../api/rentalMonitoringApi';
import { convertToVietnamTime } from '../../../../../shared/utils/CheckUTC';

export const rentalMonitoringService = {
  /* Fetch all required data for rental history */
  async fetchAllData() {
    return await rentalMonitoringApi.fetchAllData();
  },

  /* Filter invoices by current user (vendor) - DISABLED */
  filterUserInvoices(allInvoices) {
    // const currentUserId = getUserIdFromToken();
    // return allInvoices.filter(invoice => invoice.vendorId === currentUserId);
    return allInvoices; // Return all invoices without filtering
  },

  /* Create lookup maps for efficient data access */
  createLookupMaps(cars, users, payments) {
    const carMap = cars.reduce((acc, car) => {
      acc[car.id] = car;
      return acc;
    }, {});

    const userMap = users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});

    const paymentMap = payments.reduce((acc, payment) => {
      if (!acc[payment.invoiceId]) {
        acc[payment.invoiceId] = [];
      }
      acc[payment.invoiceId].push(payment);
      return acc;
    }, {});

    return { carMap, userMap, paymentMap };
  },

  /* Fetch bookings for customers */
  async fetchBookings(invoices) {
    const uniqueCustomerIds = [...new Set(invoices.map(inv => inv.customerId))];
    const bookingsResponses = await rentalMonitoringApi.fetchMultipleCustomerBookings(uniqueCustomerIds);

    const bookingMap = {};
    bookingsResponses.forEach(bookings => {
      bookings.forEach(booking => {
        if (booking.invoiceId) {
          bookingMap[booking.invoiceId] = booking;
        }
      });
    });

    return bookingMap;
  },

  /* Fetch feedback for cars */
  async fetchFeedback(invoices) {
    const uniqueCarIds = [...new Set(
      invoices.map(this.extractCarIdFromInvoice).filter(Boolean)
    )];

    const feedbackResponses = await rentalMonitoringApi.fetchMultipleCarFeedback(uniqueCarIds);

    const feedbackMap = {};
    feedbackResponses.forEach((feedbacks, index) => {
      const carId = uniqueCarIds[index];
      if (feedbacks.length > 0) {
        const totalRating = feedbacks.reduce((sum, fb) => sum + (fb.rating || 0), 0);
        const avgRating = totalRating / feedbacks.length;
        feedbackMap[carId] = {
          averageRating: avgRating,
          totalFeedbacks: feedbacks.length,
          feedbacks: feedbacks
        };
      }
    });

    return feedbackMap;
  },

  /* Extract car ID from invoice */
  extractCarIdFromInvoice(invoice) {
    const carRentalItem = invoice.invoiceItems?.find(item =>
      item.description?.includes('Car ID:')
    );
    const carIdMatch = carRentalItem?.description?.match(/Car ID: ([a-f0-9-]+)/i);
    return carIdMatch ? carIdMatch[1] : null;
  },

  /* Process invoices to create enriched rental history */
  processInvoices(invoices, lookupMaps, bookingMap, t) {
    const { carMap, userMap, paymentMap } = lookupMaps;

    // Sort invoices by createDate (latest first) using UTC conversion
    const sortedInvoices = invoices.sort((a, b) => {
      const dateA = convertToVietnamTime(a.createDate || a.issueDate);
      const dateB = convertToVietnamTime(b.createDate || b.issueDate);
      return dateB - dateA; // Latest first
    });

    return sortedInvoices.map((invoice, index) => {
      const user = userMap[invoice.customerId] || {};
      const paymentsForInvoice = paymentMap[invoice.id] || [];
      const booking = bookingMap[invoice.id] || null;

      // Separate booking fee and rental fee payments
      const rentalFeePayment = paymentsForInvoice.find(p => p.item?.toLowerCase().includes('rental fee'));
      const bookingFeePayment = paymentsForInvoice.find(p => p.item?.toLowerCase().includes('booking fee'));
      const bookingExtensionFeePayment = paymentsForInvoice.find(p => p.item?.toLowerCase().includes('booking extension'));
      
      // Handle multiple additional fees
      const additionalFeePayments = paymentsForInvoice.filter(p => p.item?.toLowerCase().includes('additional fee'));
      const additionalFeePayment = additionalFeePayments[0]; // Keep first one for backward compatibility

      // Calculate total paid amount from all payments
      const allPaymentsTotal = paymentsForInvoice.reduce((sum, p) => sum + (p.paidAmount || 0), 0);

      // Determine separate payment statuses for booking fee and rental fee
      const bookingFeeStatus = bookingFeePayment?.status ? bookingFeePayment.status.toLowerCase() : 'pending';
      const rentalFeeStatus = rentalFeePayment?.status ? rentalFeePayment.status.toLowerCase() : 'pending';
      
      // Handle multiple additional fees - check if all are paid/success
      const additionalFeeStatuses = additionalFeePayments.map(p => p.status?.toLowerCase() || 'pending');
      const uniqueStatuses = [...new Set(additionalFeeStatuses)];
      
      // Only consider non-cancelled and non-pending fees for "all paid" check
      const nonCancelledPendingFees = additionalFeePayments.filter(p => {
        const status = p.status?.toLowerCase() || 'pending';
        return status !== 'cancelled' && status !== 'pending';
      });
      const allAdditionalFeesPaid = nonCancelledPendingFees.length > 0 && 
        nonCancelledPendingFees.every(p => {
          const status = p.status?.toLowerCase() || 'pending';
          return status === 'paid' || status === 'success';
        });
      
      // If there are multiple different statuses, show them; otherwise use the logic for single status
      let additionalFeeStatus;
      if (uniqueStatuses.length > 1) {
        // Multiple different statuses - show the most relevant one (success > paid > pending > cancelled)
        const statusPriority = { 'success': 4, 'paid': 3, 'pending': 2, 'cancelled': 1 };
        additionalFeeStatus = uniqueStatuses.reduce((prev, current) => 
          (statusPriority[current] || 0) > (statusPriority[prev] || 0) ? current : prev
        );
      } else {
        additionalFeeStatus = additionalFeePayments.length > 0 ? 
          (allAdditionalFeesPaid ? 'paid' : uniqueStatuses[0] || 'pending') : 'pending';
      }
      
      const extendBookingFeeStatus = bookingExtensionFeePayment?.status ? bookingExtensionFeePayment.status.toLowerCase() : 'pending';
      // Calculate total paid amount based on payment statuses
      let totalPaidAmount = 0;
      
      // Calculate total additional fees paid - only count successful payments
      const totalAdditionalFeesPaid = additionalFeePayments.reduce((sum, p) => {
        const status = p.status?.toLowerCase() || 'pending';
        // Only count if status is success or paid, exclude cancelled and pending
        if (status === 'success' || status === 'paid') {
          return sum + (p.paidAmount || 0);
        }
        return sum;
      }, 0);

      // If booking fee is success and rental fee is pending, only count booking fee and successful additional/extension fees
      if (bookingFeeStatus === 'success' && rentalFeeStatus === 'pending') {
        totalPaidAmount = (bookingFeePayment?.paidAmount || 0);
        
        // Only add additional fee if its status is success
        if (additionalFeeStatus === 'success') {
          totalPaidAmount += totalAdditionalFeesPaid;
        }
        
        // Only add booking extension fee if its status is success
        if (extendBookingFeeStatus === 'success') {
          totalPaidAmount += (bookingExtensionFeePayment?.paidAmount || 0);
        }
      } else {
        // Otherwise, count all payments
        totalPaidAmount = allPaymentsTotal;
      }

      const totalPaidAmountShow = (bookingFeePayment?.paidAmount || 0) + (rentalFeePayment?.paidAmount || 0) + totalAdditionalFeesPaid + (bookingExtensionFeePayment?.paidAmount || 0);

      // Get payment methods for each payment type
      const bookingFeePaymentMethod = bookingFeePayment?.paymentMethod || t('rentalHistory.noPaymentMethod');
      const rentalFeePaymentMethod = rentalFeePayment?.paymentMethod || t('rentalHistory.noPaymentMethod');
      const bookingExtensionFeePaymentMethod  = bookingExtensionFeePayment?.paymentMethod || t('rentalHistory.noPaymentMethod');
      
      // Handle multiple additional fee payment methods
      const additionalFeePaymentMethods = additionalFeePayments.map(p => p.paymentMethod).filter(Boolean);
      let additionalFeePaymentMethod = t('rentalHistory.noPaymentMethod');
      
      if (additionalFeePaymentMethods.length > 0) {
        // Check if all payment methods are the same
        const uniqueMethods = [...new Set(additionalFeePaymentMethods)];
        if (uniqueMethods.length === 1) {
          // All methods are the same, show method with count
          additionalFeePaymentMethod = additionalFeePaymentMethods.length > 1 ? 
            `${uniqueMethods[0]} x${additionalFeePaymentMethods.length}` : 
            uniqueMethods[0];
        } else {
          // Different methods, show all separated by commas
          additionalFeePaymentMethod = additionalFeePaymentMethods.join(', ');
        }
      }

      // Check booking status for invoice item selection
      const bookingStatusRaw = booking?.status?.toLowerCase();
      const isConfirmed = bookingStatusRaw === 'confirmed';
      const isCompleted = bookingStatusRaw === 'completed';

      // Extract car ID from invoice items using helper function
      const carId = this.extractCarIdFromInvoice(invoice);

      // Find the appropriate invoice item based on booking status
      let carRentalItem;
      if (isCompleted) {
        carRentalItem = invoice.invoiceItems?.find(item => item.item === 'Car Rental After returned');
      } else if (isConfirmed) {
        carRentalItem = invoice.invoiceItems?.find(item => item.item === 'Booking Fees');
      } else {
        carRentalItem = invoice.invoiceItems?.find(item => item.description?.includes('Car ID:'));
      }

      // Always get daily rate from "Car Rental After returned" item
      const carRentalAfterReturnedItem = invoice.invoiceItems?.find(item => item.item === 'Car Rental After returned');
      const dailyRate = carRentalAfterReturnedItem?.unitPrice || 0;

      const car = carId ? (carMap[carId] || {}) : {};

      // Calculate dates from invoice using Vietnam time conversion
      const issueDate = convertToVietnamTime(invoice.issueDate);
      const dueDate = convertToVietnamTime(invoice.dueDate);
      const calculatedDuration = Math.ceil((dueDate - issueDate) / (1000 * 60 * 60 * 24));

      // Get rental duration - prioritize "Car Rental After returned" quantity, then calculated duration
      const rentalDays = carRentalAfterReturnedItem?.quantity || calculatedDuration;

      // Determine booking status
      const bookingStatus = booking?.status ? booking.status.toLowerCase() : 'pending';

      // Check if Additional Fee exists in invoice items
      const hasAdditionalFee = invoice.invoiceItems?.some(item =>
        item.item?.toLowerCase().includes('additional fee')
      ) || additionalFeePayment;

      // Check if Extend Booking Fee exists in invoice items
      const hasExtendBookingFee = invoice.invoiceItems?.some(item =>
        item.item?.toLowerCase().includes('booking extension')
      ) || bookingExtensionFeePayment;

      // Calculate remaining payment based on unpaid fees from invoice items
      let remainingPayment = 0;
      
      // Get fee amounts from invoice items
      const bookingFeeItem = invoice.invoiceItems?.find(item => item.item?.toLowerCase().includes('booking fee'));
      const rentalFeeItem = invoice.invoiceItems?.find(item => item.item === 'Car Rental After returned');
      const additionalFeeItems = invoice.invoiceItems?.filter(item => item.item?.toLowerCase().includes('additional fee')) || [];
      const extendBookingFeeItems = invoice.invoiceItems?.filter(item => item.item?.toLowerCase().includes('booking extension')) || [];
      
      // Add unpaid booking fee
      if (bookingFeeStatus !== 'paid' && bookingFeeStatus !== 'success' && bookingFeeItem) {
        remainingPayment += (bookingFeeItem.total || 0);
      }
      
      // Add unpaid rental fee
      if (rentalFeeStatus !== 'paid' && rentalFeeStatus !== 'success' && rentalFeeItem) {
        remainingPayment += (rentalFeeItem.total || 0);
      }
      
      // Add unpaid additional fees
      if (hasAdditionalFee && additionalFeeStatus !== 'paid' && additionalFeeStatus !== 'success') {
        const additionalFeeTotal = additionalFeeItems.reduce((sum, item) => sum + (item.total || 0), 0);
        remainingPayment += additionalFeeTotal;
      }
      
      // Add unpaid extend booking fees
      if (hasExtendBookingFee && extendBookingFeeStatus !== 'paid' && extendBookingFeeStatus !== 'success') {
        const extendBookingFeeTotal = extendBookingFeeItems.reduce((sum, item) => sum + (item.total || 0), 0);
        remainingPayment += extendBookingFeeTotal;
      }

      return {
        id: index + 1,
        bookingId: invoice.invoiceNo || invoice.id.substring(0, 8).toUpperCase(),
        carName: car.model || t('unspecified'),
        carId: carId || t('none'),
        licensePlate: car.licensePlate || t('none'),
        customer: user.fullname || user.fullName || t('unspecified'),
        customerEmail: user.email || t('none'),
        customerPhone: user.phoneNumber || t('none'),
        startDate: issueDate.toISOString().split('T')[0],
        endDate: dueDate.toISOString().split('T')[0],
        pickupDate: issueDate.toLocaleString(),
        returnDate: dueDate.toLocaleString(),
        createDate: convertToVietnamTime(invoice.createDate || invoice.issueDate),
        duration: rentalDays,
        totalAmount: invoice.grandTotal || invoice.subTotal || 0,
        dailyRate: dailyRate,
        remainingPayment: remainingPayment,
        bookingFeeStatus: bookingFeeStatus,
        rentalFeeStatus: rentalFeeStatus,
        additionalFeeStatus: additionalFeeStatus,
        extendBookingFeeStatus: extendBookingFeeStatus,
        hasAdditionalFee: hasAdditionalFee,
        hasExtendBookingFee: hasExtendBookingFee,
        additionalFeeCount: additionalFeePayments.length,
        additionalFeeHasMultipleStatuses: uniqueStatuses.length > 1,
        additionalFeeUniqueStatuses: uniqueStatuses,
        additionalFeeDetails: additionalFeePayments.map(payment => ({
          amount: payment.paidAmount || 0,
          status: payment.status?.toLowerCase() || 'pending',
          paymentMethod: payment.paymentMethod || t('rentalHistory.noPaymentMethod'),
          item: payment.item || 'Additional Fee'
        })),
        status: bookingStatus,
        // Payment details from PayOS
        bookingFeePaid: bookingFeePayment?.paidAmount || 0,
        rentalFeePaid: rentalFeePayment?.paidAmount || 0,
        additionalFeePaid: totalAdditionalFeesPaid,
        extendBookingFeePaid: bookingExtensionFeePayment?.paidAmount || 0,
        totalPaidAmount: (() => {
          let total = 0;
          // Only count fees with 'paid' or 'success' status
          if (bookingFeeStatus === 'paid' || bookingFeeStatus === 'success') {
            total += (bookingFeePayment?.paidAmount || 0);
          }
          if (rentalFeeStatus === 'paid' || rentalFeeStatus === 'success') {
            total += (rentalFeePayment?.paidAmount || 0);
          }
          if (additionalFeeStatus === 'paid' || additionalFeeStatus === 'success') {
            total += totalAdditionalFeesPaid;
          }
          if (extendBookingFeeStatus === 'paid' || extendBookingFeeStatus === 'success') {
            total += (bookingExtensionFeePayment?.paidAmount || 0);
          }
          return total;
        })(),
        totalPaidAmountShow: totalPaidAmountShow,
        bookingFeePaymentMethod: bookingFeePaymentMethod,
        rentalFeePaymentMethod: rentalFeePaymentMethod,
        additionalFeePaymentMethod: additionalFeePaymentMethod,
        bookingExtensionFeePaymentMethod: bookingExtensionFeePaymentMethod,
        paymentMethod: bookingFeePaymentMethod || rentalFeePaymentMethod || additionalFeePaymentMethod || bookingExtensionFeePaymentMethod || t('rentalHistory.noPaymentMethod'),
        invoiceId: invoice.id,
        invoiceItems: invoice.invoiceItems || [],
        notes: invoice.note || '',
      };
    });
  }
};