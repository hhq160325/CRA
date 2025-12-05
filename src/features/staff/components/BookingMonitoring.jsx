import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { updateBookingStatus, setBookingActivities, setLoading, setError } from '../staffSlice';
import BookingModal from './modals/bookingModal/BookingModal';
import { getAllBookings } from '../api/bookingApi';
import { getAllPayments } from '../api/paymentApi';

const BookingMonitoring = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const bookingActivities = useSelector((state) => state.staff.bookingActivities);
  const loading = useSelector((state) => state.staff.loading.bookings);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalType, setModalType] = useState(null); // 'view', 'edit', 'cancel', 'resolve'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Fetch all bookings on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      dispatch(setLoading({ section: 'bookings', loading: true }));
      try {
        // Fetch bookings (required) and payments (optional)
        const bookingsData = await getAllBookings();

        // Try to fetch payments, but don't fail if it errors
        let paymentsData = [];
        try {
          paymentsData = await getAllPayments();
          console.log('BookingMonitoring - Successfully fetched payments');
        } catch (paymentError) {
          console.warn('BookingMonitoring - Failed to fetch payments (continuing without payment data):', paymentError.message);
        }

        // Ensure data is an array
        const bookingsArray = Array.isArray(bookingsData) ? bookingsData : [];
        const paymentsArray = Array.isArray(paymentsData) ? paymentsData : [];

        // Log all invoiceIds from bookings
        console.log('BookingMonitoring - Booking Invoice IDs:', bookingsArray.map(booking => ({
          bookingId: booking.id,
          invoiceId: booking.invoiceId
        })));

        // Create payment map by invoiceId for quick lookup
        const paymentMap = {};
        if (paymentsArray.length > 0) {
          paymentsArray.forEach(payment => {
            const invoiceId = payment.invoiceId || payment.orderCode;
            if (invoiceId) {
              paymentMap[invoiceId] = payment;
            }
          });

          // Log all invoiceIds from payments
          console.log('BookingMonitoring - Payment Invoice IDs:', paymentsArray.map(payment => ({
            paymentId: payment.id,
            invoiceId: payment.invoiceId || payment.orderCode,
            status: payment.status
          })));

          // Compare invoiceIds
          const bookingInvoiceIds = new Set(bookingsArray.map(b => b.invoiceId).filter(Boolean));
          const paymentInvoiceIds = new Set(paymentsArray.map(p => p.invoiceId || p.orderCode).filter(Boolean));

          console.log('BookingMonitoring - Comparison Results:');
          console.log('  - Bookings with invoiceId:', bookingInvoiceIds.size);
          console.log('  - Payments with invoiceId:', paymentInvoiceIds.size);

          // Find matching invoiceIds
          const matchingInvoiceIds = [...bookingInvoiceIds].filter(id => paymentInvoiceIds.has(id));
          console.log('  - Matching invoiceIds:', matchingInvoiceIds);

          // Find bookings without matching payments
          const bookingsWithoutPayment = [...bookingInvoiceIds].filter(id => !paymentInvoiceIds.has(id));
          console.log('  - Bookings without matching payment:', bookingsWithoutPayment);

          // Find payments without matching bookings
          const paymentsWithoutBooking = [...paymentInvoiceIds].filter(id => !bookingInvoiceIds.has(id));
          console.log('  - Payments without matching booking:', paymentsWithoutBooking);
        } else {
          console.log('BookingMonitoring - No payment data available for comparison');
        }

        // Transform API data to match component structure
        const transformedData = bookingsArray.map((booking, index) => {
          const bookingStatus = booking.status ? String(booking.status).toLowerCase() : 'pending';

          // Get payment status and paidAmount from PayOS if available
          let paymentStatus = 'pending';
          let paidAmount = null;

          if (booking.invoiceId && paymentMap[booking.invoiceId]) {
            const paymentData = paymentMap[booking.invoiceId];
            const payosStatus = paymentData.status ? String(paymentData.status).toLowerCase() : '';

            // Get paidAmount from PayOS
            paidAmount = paymentData.paidAmount || paymentData.amount || paymentData.totalAmount || null;

            // Map PayOS status to our payment status
            if (payosStatus === 'paid' || payosStatus === 'success' || payosStatus === 'completed') {
              paymentStatus = 'paid';
            } else if (payosStatus === 'cancelled' || payosStatus === 'canceled') {
              paymentStatus = 'failed';
            } else if (payosStatus === 'pending' || payosStatus === 'processing') {
              paymentStatus = 'pending';
            } else {
              paymentStatus = payosStatus || 'pending';
            }

            console.log(`BookingMonitoring - Booking ${booking.id}:`, {
              payosStatus,
              mappedStatus: paymentStatus,
              paidAmount,
              invoiceId: booking.invoiceId
            });
          } else if (booking.paymentStatus) {
            // Fallback to booking's own payment status
            paymentStatus = String(booking.paymentStatus).toLowerCase();
          }

          return {
            id: booking.id || index + 1,
            bookingId: `BK${String(booking.id || index + 1).padStart(3, '0')}`,
            customer: booking.customerName || 'N/A',
            carOwner: booking.ownerName || 'N/A',
            car: booking.carModel || booking.carName || 'N/A',
            status: bookingStatus,
            startDate: booking.pickupTime ? new Date(booking.pickupTime).toISOString().split('T')[0] : 'N/A',
            endDate: booking.dropoffTime ? new Date(booking.dropoffTime).toISOString().split('T')[0] : 'N/A',
            totalAmount: booking.totalPrice || booking.totalAmount || 0,
            paidAmount: paidAmount,
            paymentStatus: paymentStatus,
            createdAt: booking.createdAt ? new Date(booking.createdAt).toLocaleString() : 'N/A',
            notes: booking.notes || '',
            invoiceId: booking.invoiceId
          };
        });

        dispatch(setBookingActivities(transformedData));
      } catch (error) {
        dispatch(setError({ section: 'bookings', error: error.message }));
        dispatch(setBookingActivities([]));
        console.error('Failed to fetch bookings:', error);
      } finally {
        dispatch(setLoading({ section: 'bookings', loading: false }));
      }
    };

    fetchBookings();
  }, [dispatch]);

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'confirmed':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'cancelled':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'overdue':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active':
        return t('active');
      case 'pending':
        return t('pending');
      case 'confirmed':
        return t('confirmed');
      case 'cancelled':
        return t('cancelled');
      case 'overdue':
        return t('overdue');
      case 'completed':
        return t('completed');
      default:
        return status;
    }
  };

  const getPaymentBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'paid':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'refunded':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'expired':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getPaymentStatusText = (status) => {
    switch (status) {
      case 'paid':
        return t('paid');
      case 'pending':
        return t('pending');
      case 'refunded':
        return t('refunded');
      case 'failed':
        return t('failed');
      case 'expired':
        return t('expired');
      default:
        return status;
    }
  };

  const handleStatusUpdate = (bookingId, newStatus, notes = '') => {
    dispatch(updateBookingStatus({ id: bookingId, status: newStatus, notes }));
  };

  const openModal = (booking, type) => {
    setSelectedBooking(booking);
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
    setModalType(null);
  };

  const handleCancel = (reason) => {
    if (selectedBooking) {
      handleStatusUpdate(selectedBooking.id, 'cancelled', reason);
      closeModal();
    }
  };

  const handleResolve = () => {
    if (selectedBooking) {
      handleStatusUpdate(selectedBooking.id, 'completed');
      closeModal();
    }
  };

  const handleEdit = (formData) => {
    // Handle edit logic here
    console.log('Editing booking:', selectedBooking.id, formData);
    closeModal();
  };

  const handleChangeModalType = (newType) => {
    setModalType(newType);
  };

  // Format amount to Vietnamese currency format
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    return `${Number(amount).toLocaleString('vi-VN')} đ`;
  };

  const filteredBookings = (bookingActivities || []).filter(booking => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (booking.bookingId || '').toLowerCase().includes(searchLower) ||
      (booking.customer || '').toLowerCase().includes(searchLower) ||
      (booking.car || '').toLowerCase().includes(searchLower);
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesPaymentStatus = paymentStatusFilter === 'all' || booking.paymentStatus === paymentStatusFilter;
    return matchesSearch && matchesStatus && matchesPaymentStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredBookings.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-8 space-y-6 min-h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('bookingMonitoring')}</h1>
          <p className="text-gray-600">{t('monitorAndManageBookings')}</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            {t('exportReport')}
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            {t('createManualBooking')}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative">
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={t('searchBookings')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t('allStatus')}</option>
              <option value="active">{t('active')}</option>
              <option value="pending">{t('pending')}</option>
              <option value="completed">{t('completed')}</option>
              <option value="cancelled">{t('cancelled')}</option>
              <option value="overdue">{t('overdue')}</option>
            </select>
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t('allPaymentStatus')}</option>
              <option value="paid">{t('paid')}</option>
              <option value="pending">{t('pending')}</option>
              <option value="refunded">{t('refunded')}</option>
              <option value="failed">{t('failed')}</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">{t('allDates')}</option>
              <option value="today">{t('today')}</option>
              <option value="week">{t('thisWeek')}</option>
              <option value="month">{t('thisMonth')}</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            {t('showing')} {filteredBookings.length} {t('of')} {bookingActivities.length} {t('bookings')}
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg font-medium">{t('noBookingsFound')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('bookingId')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('customer')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('car')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('duration')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('amount')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('status')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('paymentStatus')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {currentItems.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900 text-sm">{booking.bookingId}</div>
                      {/* <div className="text-xs text-gray-500">{booking.createdAt}</div> // TODO */}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900 text-sm">{booking.customer}</div>
                      {/* <div className="text-xs text-gray-500">{t('owner')}: {booking.carOwner}</div> // TODO */}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900 text-sm">{booking.car}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-600">{booking.startDate}</div>
                      <div className="text-sm text-gray-600">{t('to')} {booking.endDate}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900 text-sm">{formatCurrency(booking.paidAmount || booking.totalAmount)}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={getStatusBadge(booking.status)}>
                        {getStatusText(booking.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={getPaymentBadge(booking.paymentStatus)}>
                        {getPaymentStatusText(booking.paymentStatus)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openModal(booking, 'view')}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          {t('view')}
                        </button>
                        <button
                          onClick={() => openModal(booking, 'edit')}
                          className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                        >
                          {t('edit')}
                        </button>
                        {booking.status === 'overdue' && (
                          <button
                            onClick={() => openModal(booking, 'resolve')}
                            className="text-green-600 hover:text-green-700 text-sm font-medium"
                          >
                            {t('resolve')}
                          </button>
                        )}
                        {(booking.status === 'pending' || booking.status === 'active') && (
                          <button
                            onClick={() => openModal(booking, 'cancel')}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            {t('cancel')}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredBookings.length > 0 && totalPages > 1 && (
          <div className="px-4 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {t('previous')}
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {t('next')}
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  {t('showing')} <span className="font-medium">{startIndex + 1}</span> {t('to')}{' '}
                  <span className="font-medium">{Math.min(endIndex, filteredBookings.length)}</span> {t('of')}{' '}
                  <span className="font-medium">{filteredBookings.length}</span> {t('bookings')}
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    <span className="sr-only">{t('previous')}</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    // Show first page, last page, current page, and pages around current
                    if (
                      pageNumber === 1 ||
                      pageNumber === totalPages ||
                      (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNumber
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    } else if (
                      pageNumber === currentPage - 2 ||
                      pageNumber === currentPage + 2
                    ) {
                      return (
                        <span
                          key={pageNumber}
                          className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                  >
                    <span className="sr-only">{t('next')}</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedBooking={selectedBooking}
        modalType={modalType}
        onEdit={handleEdit}
        onCancel={handleCancel}
        onResolve={handleResolve}
        onChangeModalType={handleChangeModalType}
        getStatusBadge={getStatusBadge}
        getPaymentBadge={getPaymentBadge}
      />
    </div>
  );
};

export default BookingMonitoring;