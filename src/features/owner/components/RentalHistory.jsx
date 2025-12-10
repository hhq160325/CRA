import { useState, useEffect } from 'react';
import { axiosInstance } from '../../../shared/utils/axiosInstance';
import { BOOKING_ENDPOINTS, CAR_ENDPOINTS, USER_ENDPOINTS, INVOICE_ENDPOINTS, PAYMENT_ENDPOINTS, FEEDBACK_ENDPOINTS } from '../../../config/api';
import RentalDetailsModal from './modal/RentalDetailsModal';
import { getUserIdFromToken } from '../../user/api';
import DropdownTemplate from '../../../shared/components/DropdownTemplate';
import Pagination from '../../../shared/components/Pagination';

const RentalHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [carFilter, setCarFilter] = useState('all');
  const [bookingFeeStatusFilter, setBookingFeeStatusFilter] = useState('all');
  const [rentalFeeStatusFilter, setRentalFeeStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedRental, setSelectedRental] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
      // const currentUserId = getUserIdFromToken();

      // Filter invoices to show only those where the current user is the vendor
      // TEMPORARILY DISABLED: Show all invoices regardless of vendor
      const invoices = allInvoices;
      // const invoices = allInvoices.filter(invoice => invoice.vendorId === currentUserId);

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

        // Calculate total paid amount from all payments
        const totalPaidAmount = paymentsForInvoice.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
        const totalPaidAmountShow = paymentsForInvoice.reduce((sum, p) => sum + (p.paidAmount || 0), 0); //Uncomment
        // Get payment methods for each payment type
        const bookingFeePaymentMethod = bookingFeePayment?.paymentMethod || 'Chưa có phương thức thanh toán';
        const rentalFeePaymentMethod = rentalFeePayment?.paymentMethod || 'Chưa có phương thức thanh toán';

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

        // Determine separate payment statuses for booking fee and rental fee
        const bookingFeeStatus = bookingFeePayment?.status ? bookingFeePayment.status.toLowerCase() : 'pending';
        const rentalFeeStatus = rentalFeePayment?.status ? rentalFeePayment.status.toLowerCase() : 'pending';

        // Determine booking status
        const bookingStatus = booking?.status ? booking.status.toLowerCase() : 'pending';

        return {
          id: index + 1,
          bookingId: invoice.invoiceNo || invoice.id.substring(0, 8).toUpperCase(),
          carName: car.model || 'Xe không xác định',
          carId: carId || 'Không có',
          licensePlate: car.licensePlate || 'Không có',
          customer: user.fullname || user.fullName || 'Khách hàng không xác định',
          customerEmail: user.email || 'Không có',
          customerPhone: user.phoneNumber || 'Không có',
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
          status: bookingStatus,
          // Payment details from PayOS
          bookingFeePaid: bookingFeePayment?.paidAmount || 0,
          rentalFeePaid: rentalFeePayment?.paidAmount || 0,
          totalPaidAmount: bookingStatus === 'cancelled' ? (bookingFeePayment?.paidAmount || 0) : totalPaidAmount,
          totalPaidAmountShow:totalPaidAmount,
          bookingFeePaymentMethod: bookingFeePaymentMethod,
          rentalFeePaymentMethod: rentalFeePaymentMethod,
          paymentMethod: bookingFeePaymentMethod || rentalFeePaymentMethod || 'Chưa có phương thức thanh toán',
          invoiceId: invoice.id,
          invoiceItems: invoice.invoiceItems || [],
          mileageAtPickup: 0,
          mileageAtReturn: 0,
          mileageUsed: 0,
          conditionAtPickup: 'Không có',
          conditionAtReturn: 'Không có',
          notes: invoice.note || '',
          rating: carFeedback?.averageRating || 0,
          totalFeedbacks: carFeedback?.totalFeedbacks || 0,
          feedback: carFeedback?.feedbacks || []
        };
      });

      setRentalHistory(enrichedBookings);
    } catch (err) {
      console.error('Lỗi khi tải lịch sử thuê xe:', err);
      setError('Không thể tải lịch sử thuê xe. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // Get unique car names for filter
  const uniqueCars = [...new Set(rentalHistory.map(rental => rental.carName))].sort();

  // Prepare dropdown options
  const carOptions = [
    { id: 'all', value: 'all', label: 'Tất cả xe' },
    ...uniqueCars.map(car => ({ id: car, value: car, label: car }))
  ];

  const statusOptions = [
    { id: 'all', value: 'all', label: 'Tất cả trạng thái' },
    { id: 'confirmed', value: 'confirmed', label: 'Đã xác nhận' },
    { id: 'completed', value: 'completed', label: 'Hoàn thành' },
    { id: 'cancelled', value: 'cancelled', label: 'Đã hủy' }
  ];

  const bookingFeeStatusOptions = [
    { id: 'all', value: 'all', label: 'Tất cả trạng thái phí đặt cọc' },
    { id: 'paid', value: 'paid', label: 'Đã thanh toán' },
    { id: 'pending', value: 'pending', label: 'Chờ thanh toán' },
    { id: 'refunded', value: 'refunded', label: 'Đã hoàn tiền' },
    { id: 'cancelled', value: 'cancelled', label: 'Đã hủy' }
  ];

  const rentalFeeStatusOptions = [
    { id: 'all', value: 'all', label: 'Tất cả trạng thái phí thuê xe' },
    { id: 'paid', value: 'paid', label: 'Đã thanh toán' },
    { id: 'pending', value: 'pending', label: 'Chờ thanh toán' },
    { id: 'refunded', value: 'refunded', label: 'Đã hoàn tiền' },
    { id: 'cancelled', value: 'cancelled', label: 'Đã hủy' }
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

  // Function to translate status values to Vietnamese
  const translateStatus = (status) => {
    const statusTranslations = {
      'confirmed': 'Đã xác nhận',
      'completed': 'Hoàn thành',
      'cancelled': 'Đã hủy',
      'active': 'Đang hoạt động',
      'overdue': 'Quá hạn',
      'paid': 'Đã thanh toán',
      'pending': 'Chờ thanh toán',
      'refunded': 'Đã hoàn tiền',
      'failed': 'Thất bại'
    };
    return statusTranslations[status?.toLowerCase()] || status || 'Không có';
  };

  // const getConditionBadge = (condition) => {
  //   const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
  //   switch (condition) {
  //     case 'excellent':
  //       return `${baseClasses} bg-green-100 text-green-800`;
  //     case 'good':
  //       return `${baseClasses} bg-blue-100 text-blue-800`;
  //     case 'fair':
  //       return `${baseClasses} bg-yellow-100 text-yellow-800`;
  //     case 'poor':
  //       return `${baseClasses} bg-red-100 text-red-800`;
  //     default:
  //       return `${baseClasses} bg-gray-100 text-gray-800`;
  //   }
  // };

  const openModal = (rental) => {
    setSelectedRental(rental);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRental(null);
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

    return matchesSearch && matchesStatus && matchesCar && matchesBookingFeeStatus && matchesRentalFeeStatus && matchesDateRange;
  });

  // Pagination calculations
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRentals = filteredRentals.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, carFilter, bookingFeeStatusFilter, rentalFeeStatusFilter, startDate, endDate]);

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
          <p className="mt-4 text-gray-600">Đang tải lịch sử thuê xe...</p>
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
            Thử lại
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
            <h1 className="text-2xl font-bold text-gray-900">Lịch sử thuê xe</h1>
            <p className="text-gray-600">Duyệt lịch sử thuê xe, lọc theo xe và ngày tháng</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Xuất báo cáo
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng số lượt thuê</p>
                <p className="text-2xl font-bold text-blue-600">{totalRentals}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-green-600">{formatVND(totalRevenue)}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đánh giá trung bình</p>
                <p className="text-2xl font-bold text-yellow-600">{averageRating} ⭐</p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng số km</p>
                <p className="text-2xl font-bold text-purple-600">{(totalMileage / 1000).toFixed(1)}k km</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
          </div>
        </div> */}

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
                    placeholder="Tìm kiếm theo mã đặt xe, khách hàng hoặc xe"
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
                    placeholder="Tất cả xe"
                    searchable={true}
                    searchPlaceholder="Tìm kiếm xe..."
                  />
                </div>

                <div className="w-full sm:w-auto sm:min-w-[140px]">
                  <DropdownTemplate
                    value={statusFilter}
                    onChange={(option) => setStatusFilter(option.value)}
                    options={statusOptions}
                    placeholder="Tất cả trạng thái"
                    searchable={false}
                  />
                </div>

                <div className="w-full sm:w-auto sm:min-w-[180px]">
                  <DropdownTemplate
                    value={bookingFeeStatusFilter}
                    onChange={(option) => setBookingFeeStatusFilter(option.value)}
                    options={bookingFeeStatusOptions}
                    placeholder="Trạng thái phí đặt cọc"
                    searchable={false}
                  />
                </div>

                <div className="w-full sm:w-auto sm:min-w-[180px]">
                  <DropdownTemplate
                    value={rentalFeeStatusFilter}
                    onChange={(option) => setRentalFeeStatusFilter(option.value)}
                    options={rentalFeeStatusOptions}
                    placeholder="Trạng thái phí thuê xe"
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
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Khoảng thời gian tùy chỉnh:</label>
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 whitespace-nowrap">Từ:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 whitespace-nowrap">Đến:</label>
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
                    Xóa ngày
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
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Mã hóa đơn</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Thông tin xe</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Khách hàng</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Thời gian thuê</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Thời lượng</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Số tiền</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Trạng thái phí đặt cọc</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Trạng thái phí thuê xe</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Trạng thái đặt xe</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedRentals.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="py-8 text-center text-gray-500">
                      Không tìm thấy lịch sử thuê xe
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
                        <div className="text-xs text-gray-500">đến {rental.endDate}</div>
                        <div className="text-xs text-gray-400">{rental.pickupDate.split(' ')[1]}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">{rental.duration} ngày</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900 text-sm">{formatVND(rental.totalPaidAmountShow)}</div>
                        <div className="text-xs text-gray-500">Đặt cọc: {formatVND(rental.bookingFeePaid)}</div>
                        <div className="text-xs text-gray-500">Thuê xe: {formatVND(rental.rentalFeePaid)}</div>
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
                        <span className={getStatusBadge(rental.status)}>
                          {translateStatus(rental.status)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => openModal(rental)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          Xem chi tiết
                        </button>
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
      />
    </>
  );
};

export default RentalHistory;

