import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { axiosInstance } from '../../../shared/utils/axiosInstance';
import { BOOKING_ENDPOINTS, CAR_ENDPOINTS, USER_ENDPOINTS, INVOICE_ENDPOINTS, PAYMENT_ENDPOINTS, FEEDBACK_ENDPOINTS } from '../../../config/api';
import RentalDetailsModal from './modal/RentalDetailsModal';
import ExtendedBooking from './modal/ExtendedBooking';
import { getUserIdFromToken } from '../../user/api';
import DropdownTemplate from '../../../shared/components/DropdownTemplate';
import Pagination from '../../../shared/components/Pagination';

const RentalHistory = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [carFilter, setCarFilter] = useState('all');
  const [bookingFeeStatusFilter, setBookingFeeStatusFilter] = useState('all');
  const [rentalFeeStatusFilter, setRentalFeeStatusFilter] = useState('all');
  const [additionalFeeStatusFilter, setAdditionalFeeStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedRental, setSelectedRental] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [rentalHistory, setRentalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchRentalHistory();
  }, []);

  const fetchRentalHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all invoices, cars, users, and payments
      const [invoicesResponse, carsResponse, usersResponse, paymentsResponse] = await Promise.all([
        axiosInstance.get(INVOICE_ENDPOINTS.GET_ALL_INVOICES),
        axiosInstance.get(CAR_ENDPOINTS.GET_ALL_CARS),
        axiosInstance.get(USER_ENDPOINTS.GET_ALL_USERS),
        axiosInstance.get(INVOICE_ENDPOINTS.GET_ALL)
      ]);

      const allInvoices = invoicesResponse.data || [];
      const cars = carsResponse.data || [];
      const users = usersResponse.data || [];
      const payments = paymentsResponse.data || [];

      // Get logged-in user's ID (vendorId)
      const currentUserId = getUserIdFromToken();

      // Filter invoices to show only those where the current user is the vendor
      const invoices = allInvoices.filter(invoice => invoice.vendorId === currentUserId);

      // Create lookup maps
      const carMap = cars.reduce((acc, car) => {
        acc[car.id] = car;
        return acc;
      }, {});

      const userMap = users.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {});

      // Create payment lookup map by invoiceId
      // Store as array because multiple payments can exist per invoice (Booking Fee + Rental Fee)
      const paymentMap = payments.reduce((acc, payment) => {
        if (!acc[payment.invoiceId]) {
          acc[payment.invoiceId] = [];
        }
        acc[payment.invoiceId].push(payment);
        return acc;
      }, {});

      // Fetch bookings for each unique customer to get booking status
      const uniqueCustomerIds = [...new Set(invoices.map(inv => inv.customerId))];
      const bookingsResponses = await Promise.all(
        uniqueCustomerIds.map(customerId =>
          axiosInstance.get(BOOKING_ENDPOINTS.GET_CUSTOMER_BOOKINGS(customerId))
            .catch(err => {
              console.error(`Lỗi khi tải đặt xe cho khách hàng ${customerId}:`, err);
              return { data: [] };
            })
        )
      );

      // Create booking lookup map by invoiceId
      const bookingMap = {};
      bookingsResponses.forEach(response => {
        const bookings = response.data || [];
        bookings.forEach(booking => {
          if (booking.invoiceId) {
            bookingMap[booking.invoiceId] = booking;
          }
        });
      });

      // Helper function to extract car ID from invoice
      const extractCarIdFromInvoice = (invoice) => {
        const carRentalItem = invoice.invoiceItems?.find(item =>
          item.description?.includes('Car ID:')
        );
        const carIdMatch = carRentalItem?.description?.match(/Car ID: ([a-f0-9-]+)/i);
        return carIdMatch ? carIdMatch[1] : null;
      };

      // Fetch feedback/ratings for each unique car
      const uniqueCarIds = [...new Set(
        invoices.map(extractCarIdFromInvoice).filter(Boolean)
      )];

      const feedbackResponses = await Promise.all(
        uniqueCarIds.map(carId =>
          axiosInstance.get(FEEDBACK_ENDPOINTS.GET_FEEDBACK_BY_CAR(carId))
            .catch(err => {
              console.error(`Lỗi khi tải đánh giá cho xe ${carId}:`, err);
              return { data: [] };
            })
        )
      );

      // Create feedback lookup map by carId with average rating
      const feedbackMap = {};
      feedbackResponses.forEach((response, index) => {
        const carId = uniqueCarIds[index];
        const feedbacks = response.data || [];
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

      // Process invoices to create rental history
      const enrichedBookings = invoices.map((invoice, index) => {
        const user = userMap[invoice.customerId] || {};
        const paymentsForInvoice = paymentMap[invoice.id] || [];
        const booking = bookingMap[invoice.id] || null;

        // Separate booking fee and rental fee payments
        const rentalFeePayment = paymentsForInvoice.find(p => p.item?.toLowerCase().includes('rental fee'));
        const bookingFeePayment = paymentsForInvoice.find(p => p.item?.toLowerCase().includes('booking fee'));
        const additionalPayment = paymentsForInvoice.find(p => p.item?.toLowerCase().includes('additional payment'));
        const additionalFeePayment = paymentsForInvoice.find(p => p.item?.toLowerCase().includes('additional fee')); 
        // Calculate total paid amount from all payments
        const allPaymentsTotal = paymentsForInvoice.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
        console.log(paymentsForInvoice);

        // Determine separate payment statuses for booking fee and rental fee
        const bookingFeeStatus = bookingFeePayment?.status ? bookingFeePayment.status.toLowerCase() : 'pending';
        const rentalFeeStatus = rentalFeePayment?.status ? rentalFeePayment.status.toLowerCase() : 'pending';
        const additionalFeeStatus = additionalFeePayment?.status ? additionalFeePayment.status.toLowerCase() : 'pending';

        // Calculate total paid amount based on payment statuses
        let totalPaidAmount = 0;
        
        // If booking fee is paid and rental fee is pending, only count booking fee
        if (bookingFeeStatus === 'paid' && rentalFeeStatus === 'pending') {
          totalPaidAmount = (bookingFeePayment?.paidAmount || 0) + (additionalFeePayment?.paidAmount || 0);
        } else {
          // Otherwise, count all payments
          totalPaidAmount = allPaymentsTotal;
        }

        const totalPaidAmountShow = (bookingFeePayment?.paidAmount || 0) + (rentalFeePayment?.paidAmount || 0);
        console.log(totalPaidAmountShow);
        
        // Get payment methods for each payment type
        const bookingFeePaymentMethod = bookingFeePayment?.paymentMethod || t('rentalHistory.noPaymentMethod');
        const rentalFeePaymentMethod = rentalFeePayment?.paymentMethod || t('rentalHistory.noPaymentMethod');
        const additionalPaymentMethod = additionalPayment?.paymentMethod || t('rentalHistory.noPaymentMethod');
        const additionalFeePaymentMethod = additionalFeePayment?.paymentMethod || t('rentalHistory.noPaymentMethod');

        // Debug log to check payment status mapping
        // if (paymentsForInvoice.length > 0) {
        //   console.log(`Invoice ${invoice.id}:`, {
        //     bookingFee: { status: bookingFeePayment?.status, amount: bookingFeePayment?.paidAmount },
        //     rentalFee: { status: rentalFeePayment?.status, amount: rentalFeePayment?.paidAmount }
        //   });
        // }

        // Check booking status for invoice item selection
        const bookingStatusRaw = booking?.status?.toLowerCase();
        const isConfirmed = bookingStatusRaw === 'confirmed';
        const isCompleted = bookingStatusRaw === 'completed';

        // Extract car ID from invoice items using helper function
        const carId = extractCarIdFromInvoice(invoice);

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
        const carFeedback = carId ? (feedbackMap[carId] || null) : null;

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
          hasAdditionalFee: hasAdditionalFee,
          status: bookingStatus,
          // Payment details from PayOS
          bookingFeePaid: bookingFeePayment?.paidAmount || 0,
          rentalFeePaid: rentalFeePayment?.paidAmount || 0,
          additionalFeePaid: additionalFeePayment?.paidAmount || 0,
          totalPaidAmount: bookingStatus === 'cancelled' ? (bookingFeePayment?.paidAmount || 0) : totalPaidAmount,
          totalPaidAmountShow: totalPaidAmountShow,
          bookingFeePaymentMethod: bookingFeePaymentMethod,
          rentalFeePaymentMethod: rentalFeePaymentMethod,
          additionalFeePaymentMethod: additionalFeePaymentMethod,
          paymentMethod: bookingFeePaymentMethod || rentalFeePaymentMethod || additionalFeePaymentMethod || t('rentalHistory.noPaymentMethod'),
          invoiceId: invoice.id,
          invoiceItems: invoice.invoiceItems || [],
          notes: invoice.note || '',
        };
      });

      setRentalHistory(enrichedBookings);
    } catch (err) {
      console.error('Error loading rental history:', err);
      setError(t('rentalHistory.errorLoadingRentalHistory'));
    } finally {
      setLoading(false);
    }
  };

  // Get unique car names for filter
  const uniqueCars = [...new Set(rentalHistory.map(rental => rental.carName))].sort();

  // Prepare dropdown options
  const carOptions = [
    { id: 'all', value: 'all', label: t('rentalHistory.allCars') },
    ...uniqueCars.map(car => ({ id: car, value: car, label: car }))
  ];

  const statusOptions = [
    { id: 'all', value: 'all', label: t('rentalHistory.allStatuses') },
    { id: 'confirmed', value: 'confirmed', label: t('rentalHistory.confirmed') },
    { id: 'completed', value: 'completed', label: t('rentalHistory.completed') },
    { id: 'cancelled', value: 'cancelled', label: t('rentalHistory.cancelled') }
  ];

  const bookingFeeStatusOptions = [
    { id: 'all', value: 'all', label: t('rentalHistory.allBookingFeeStatuses') },
    { id: 'paid', value: 'paid', label: t('rentalHistory.paid') },
    { id: 'pending', value: 'pending', label: t('rentalHistory.pending') },
    { id: 'refunded', value: 'refunded', label: t('rentalHistory.refunded') },
    { id: 'cancelled', value: 'cancelled', label: t('rentalHistory.cancelled') }
  ];

  const rentalFeeStatusOptions = [
    { id: 'all', value: 'all', label: t('rentalHistory.allRentalFeeStatuses') },
    { id: 'paid', value: 'paid', label: t('rentalHistory.paid') },
    { id: 'pending', value: 'pending', label: t('rentalHistory.pending') },
    { id: 'refunded', value: 'refunded', label: t('rentalHistory.refunded') },
    { id: 'cancelled', value: 'cancelled', label: t('rentalHistory.cancelled') }
  ];

  const additionalFeeStatusOptions = [
    { id: 'all', value: 'all', label: t('rentalHistory.allAdditionalFeeStatuses') },
    { id: 'paid', value: 'paid', label: t('rentalHistory.paid') },
    { id: 'pending', value: 'pending', label: t('rentalHistory.pending') },
    { id: 'refunded', value: 'refunded', label: t('rentalHistory.refunded') },
    { id: 'cancelled', value: 'cancelled', label: t('rentalHistory.cancelled') }
  ];

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'confirmed':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'active':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'overdue':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getPaymentBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'paid':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'refunded':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'failed':
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Function to translate status values
  const translateStatus = (status) => {
    const statusTranslations = {
      'confirmed': t('rentalHistory.confirmed'),
      'completed': t('rentalHistory.completed'),
      'cancelled': t('rentalHistory.cancelled'),
      'active': t('active'),
      'overdue': t('overdue'),
      'paid': t('rentalHistory.paid'),
      'pending': t('rentalHistory.pending'),
      'refunded': t('rentalHistory.refunded'),
      'failed': t('rentalHistory.failed')
    };
    return statusTranslations[status?.toLowerCase()] || status || t('none');
  };

  const openModal = (rental) => {
    setSelectedRental(rental);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRental(null);
  };

  const openExtendModal = (rental) => {
    setSelectedRental(rental);
    setIsExtendModalOpen(true);
  };

  const closeExtendModal = () => {
    setIsExtendModalOpen(false);
    setSelectedRental(null);
  };

  const handleExtendSuccess = () => {
    // Refresh rental history after successful extension
    fetchRentalHistory();
  };

  const filteredRentals = rentalHistory.filter(rental => {
    const matchesSearch = rental.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rental.status === statusFilter;
    const matchesCar = carFilter === 'all' || rental.carName === carFilter;
    const matchesBookingFeeStatus = bookingFeeStatusFilter === 'all' ||
      rental.bookingFeeStatus === bookingFeeStatusFilter;
    const matchesRentalFeeStatus = rentalFeeStatusFilter === 'all' ||
      rental.rentalFeeStatus === rentalFeeStatusFilter;
    const matchesAdditionalFeeStatus = additionalFeeStatusFilter === 'all' ||
      rental.additionalFeeStatus === additionalFeeStatusFilter;

    // Custom date range filter (when startDate or endDate is set)
    let matchesDateRange = true;
    if (startDate || endDate) {
      const rentalStartDate = new Date(rental.startDate);
      const rentalEndDate = new Date(rental.endDate);

      if (startDate && endDate) {
        const filterStart = new Date(startDate);
        const filterEnd = new Date(endDate);
        // Check if rental period overlaps with filter range
        matchesDateRange = rentalStartDate <= filterEnd && rentalEndDate >= filterStart;
      } else if (startDate) {
        const filterStart = new Date(startDate);
        matchesDateRange = rentalEndDate >= filterStart;
      } else if (endDate) {
        const filterEnd = new Date(endDate);
        matchesDateRange = rentalStartDate <= filterEnd;
      }
    }

    return matchesSearch && matchesStatus && matchesCar && matchesBookingFeeStatus && matchesRentalFeeStatus && matchesAdditionalFeeStatus && matchesDateRange;
  });

  // Pagination calculations
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRentals = filteredRentals.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, carFilter, bookingFeeStatusFilter, rentalFeeStatusFilter, additionalFeeStatusFilter, startDate, endDate]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // console.log("FilterRentals",filteredRentals);
  // Calculate statistics
  const totalRevenue = rentalHistory
    .filter(rental => rental.status === 'confirmed' || rental.status === 'completed')
    .reduce((sum, rental) => sum + rental.paidAmount, 0);
  const totalRentals = rentalHistory.length;
  const averageRating = (rentalHistory.reduce((sum, rental) => sum + rental.rating, 0) / totalRentals).toFixed(1);
  const totalMileage = rentalHistory.reduce((sum, rental) => sum + rental.mileageUsed, 0);

  // Format currency to VND
  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-full bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('rentalHistory.loadingRentalHistory')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 min-h-full bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-800 font-medium">{error}</p>
          <button
            onClick={fetchRentalHistory}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            {t('rentalHistory.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-8 space-y-6 min-h-full bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{t('rentalHistory.title')}</h1>
            <p className="text-gray-600">{t('rentalHistory.subtitle')}</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              {t('rentalHistory.exportReport')}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder={t('rentalHistory.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  />
                </div>

                <div className="w-full sm:w-auto sm:min-w-[180px]">
                  <DropdownTemplate
                    value={carFilter}
                    onChange={(option) => setCarFilter(option.value)}
                    options={carOptions}
                    placeholder={t('rentalHistory.allCars')}
                    searchable={true}
                    searchPlaceholder={t('search')}
                  />
                </div>

                <div className="w-full sm:w-auto sm:min-w-[140px]">
                  <DropdownTemplate
                    value={statusFilter}
                    onChange={(option) => setStatusFilter(option.value)}
                    options={statusOptions}
                    placeholder={t('rentalHistory.allStatuses')}
                    searchable={false}
                  />
                </div>

                <div className="w-full sm:w-auto sm:min-w-[180px]">
                  <DropdownTemplate
                    value={bookingFeeStatusFilter}
                    onChange={(option) => setBookingFeeStatusFilter(option.value)}
                    options={bookingFeeStatusOptions}
                    placeholder={t('rentalHistory.allBookingFeeStatuses')}
                    searchable={false}
                  />
                </div>

                <div className="w-full sm:w-auto sm:min-w-[180px]">
                  <DropdownTemplate
                    value={rentalFeeStatusFilter}
                    onChange={(option) => setRentalFeeStatusFilter(option.value)}
                    options={rentalFeeStatusOptions}
                    placeholder={t('rentalHistory.allRentalFeeStatuses')}
                    searchable={false}
                  />
                </div>

                <div className="w-full sm:w-auto sm:min-w-[180px]">
                  <DropdownTemplate
                    value={additionalFeeStatusFilter}
                    onChange={(option) => setAdditionalFeeStatusFilter(option.value)}
                    options={additionalFeeStatusOptions}
                    placeholder={t('rentalHistory.allAdditionalFeeStatuses')}
                    searchable={false}
                  />
                </div>
              </div>

              {/* <div className="text-sm text-gray-600 whitespace-nowrap">
                Showing {filteredRentals.length} of {rentalHistory.length} rentals
              </div> */}
            </div>

            {/* Date Range Filter */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-2 border-t border-gray-100">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">{t('rentalHistory.customDateRange')}</label>
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 whitespace-nowrap">{t('rentalHistory.from')}</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 whitespace-nowrap">{t('rentalHistory.to')}</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                {(startDate || endDate) && (
                  <button
                    onClick={() => {
                      setStartDate('');
                      setEndDate('');
                    }}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
                  >
                    {t('rentalHistory.clearDates')}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rental History Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('rentalHistory.invoiceCode')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('rentalHistory.carInfo')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('rentalHistory.customer')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('rentalHistory.rentalTime')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('rentalHistory.duration')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('rentalHistory.amount')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('rentalHistory.bookingFeeStatus')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('rentalHistory.rentalFeeStatus')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('rentalHistory.additionalFeeStatus')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('rentalHistory.bookingStatus')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('rentalHistory.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedRentals.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="py-8 text-center text-gray-500">
                      {t('rentalHistory.noRentalHistory')}
                    </td>
                  </tr>
                ) : (
                  paginatedRentals.map((rental) => (
                    <tr key={rental.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900 text-sm">{rental.bookingId}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900 text-sm">{rental.carName}</div>
                        <div className="text-xs text-gray-500">{rental.licensePlate}</div>
                        <div className="text-xs text-gray-400">{rental.carId}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900 text-sm">{rental.customer}</div>
                        <div className="text-xs text-gray-500">{rental.customerEmail}</div>
                        <div className="text-xs text-gray-400">{rental.customerPhone}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">{rental.startDate}</div>
                        <div className="text-xs text-gray-500">{t('to')} {rental.endDate}</div>
                        <div className="text-xs text-gray-400">{rental.pickupDate.split(' ')[1]}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">{rental.duration} {t('rentalHistory.days')}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900 text-sm">{formatVND(rental.totalPaidAmountShow)}</div>
                        <div className="text-xs text-gray-500">{t('rentalHistory.bookingFee')}: {formatVND(rental.bookingFeePaid)}</div>
                        <div className="text-xs text-gray-500">{t('rentalHistory.rentalFee')}: {formatVND(rental.rentalFeePaid)}</div>
                        {rental.hasAdditionalFee && (
                          <div className="text-xs text-gray-500">{t('rentalHistory.additionalFee')}: {formatVND(rental.additionalFeePaid)}</div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className={getPaymentBadge(rental.bookingFeeStatus)}>
                          {translateStatus(rental.bookingFeeStatus)}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">{formatVND(rental.bookingFeePaid)}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{rental.bookingFeePaymentMethod}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={getPaymentBadge(rental.rentalFeeStatus)}>
                          {translateStatus(rental.rentalFeeStatus)}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">{formatVND(rental.rentalFeePaid)}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{rental.rentalFeePaymentMethod}</div>
                      </td>
                      <td className="py-4 px-6">
                        {rental.hasAdditionalFee ? (
                          <>
                            <span className={getPaymentBadge(rental.additionalFeeStatus)}>
                              {translateStatus(rental.additionalFeeStatus)}
                            </span>
                            <div className="text-xs text-gray-500 mt-1">{formatVND(rental.additionalFeePaid)}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{rental.additionalFeePaymentMethod}</div>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className={getStatusBadge(rental.status)}>
                          {translateStatus(rental.status)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => openModal(rental)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            {t('rentalHistory.viewDetails')}
                          </button>
                          {(rental.status === 'confirmed' || rental.status === 'checkedIn') && (
                            <button
                              onClick={() => openExtendModal(rental)}
                              className="text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              Gia hạn
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalItems={filteredRentals.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Modal for detailed rental view */}
      <RentalDetailsModal
        isOpen={isModalOpen}
        rental={selectedRental}
        onClose={closeModal}
        getStatusBadge={getStatusBadge}
        getPaymentBadge={getPaymentBadge}
        onExtendBooking={openExtendModal}
      />

      {/* Modal for extending booking */}
      <ExtendedBooking
        isOpen={isExtendModalOpen}
        rental={selectedRental}
        onClose={closeExtendModal}
        onSuccess={handleExtendSuccess}
      />
    </>
  );
};

export default RentalHistory;

