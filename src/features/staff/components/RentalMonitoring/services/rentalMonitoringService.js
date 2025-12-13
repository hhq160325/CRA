import { getUserIdFromToken } from '../../../../user/api';
import { rentalMonitoringApi } from '../api/rentalMonitoringApi';

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

    return invoices.map((invoice, index) => {
      const user = userMap[invoice.customerId] || {};
      const paymentsForInvoice = paymentMap[invoice.id] || [];
      const booking = bookingMap[invoice.id] || null;

      // Separate booking fee and rental fee payments
      const rentalFeePayment = paymentsForInvoice.find(p => p.item?.toLowerCase().includes('rental fee'));
      const bookingFeePayment = paymentsForInvoice.find(p => p.item?.toLowerCase().includes('booking fee'));
      const bookingExtensionFeePayment = paymentsForInvoice.find(p => p.item?.toLowerCase().includes('booking extension'));
      const additionalFeePayment = paymentsForInvoice.find(p => p.item?.toLowerCase().includes('additional fee'));

      // Calculate total paid amount from all payments
      const allPaymentsTotal = paymentsForInvoice.reduce((sum, p) => sum + (p.paidAmount || 0), 0);

      // Determine separate payment statuses for booking fee and rental fee
      const bookingFeeStatus = bookingFeePayment?.status ? bookingFeePayment.status.toLowerCase() : 'pending';
      const rentalFeeStatus = rentalFeePayment?.status ? rentalFeePayment.status.toLowerCase() : 'pending';
      const additionalFeeStatus = additionalFeePayment?.status ? additionalFeePayment.status.toLowerCase() : 'pending';
      const extendBookingFeeStatus = bookingExtensionFeePayment?.status ? bookingExtensionFeePayment.status.toLowerCase() : 'pending';
      // Calculate total paid amount based on payment statuses
      let totalPaidAmount = 0;

      // If booking fee is success and rental fee is pending, only count booking fee
      if (bookingFeeStatus === 'success' && rentalFeeStatus === 'pending') {
        totalPaidAmount = (bookingFeePayment?.paidAmount || 0) + (additionalFeePayment?.paidAmount || 0) + (bookingExtensionFeePayment?.paidAmount || 0);
      } else {
        // Otherwise, count all payments
        totalPaidAmount = allPaymentsTotal;
      }

      const totalPaidAmountShow = (bookingFeePayment?.paidAmount || 0) + (rentalFeePayment?.paidAmount || 0);

      // Get payment methods for each payment type
      const bookingFeePaymentMethod = bookingFeePayment?.paymentMethod || t('rentalHistory.noPaymentMethod');
      const rentalFeePaymentMethod = rentalFeePayment?.paymentMethod || t('rentalHistory.noPaymentMethod');
      const bookingExtensionFeePaymentMethod  = bookingExtensionFeePayment?.paymentMethod || t('rentalHistory.noPaymentMethod');
      const additionalFeePaymentMethod = additionalFeePayment?.paymentMethod || t('rentalHistory.noPaymentMethod');

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
      // Get remaining after return cars
      const remainingPayment = carRentalAfterReturnedItem?.total || 0;

      const car = carId ? (carMap[carId] || {}) : {};

      // Calculate dates from invoice
      const issueDate = new Date(invoice.issueDate);
      const dueDate = new Date(invoice.dueDate);
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
        status: bookingStatus,
        // Payment details from PayOS
        bookingFeePaid: bookingFeePayment?.paidAmount || 0,
        rentalFeePaid: rentalFeePayment?.paidAmount || 0,
        additionalFeePaid: additionalFeePayment?.paidAmount || 0,
        extendBookingFeePaid: bookingExtensionFeePayment?.paidAmount || 0,
        totalPaidAmount: bookingStatus === 'cancelled' ? (bookingFeePayment?.paidAmount || 0) : totalPaidAmount,
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