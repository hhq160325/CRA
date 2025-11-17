import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { updateBookingStatus } from '../staffSlice';
import BookingModal from './modals/bookingModal/BookingModal';

const BookingMonitoring = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalType, setModalType] = useState(null); // 'view', 'edit', 'cancel', 'resolve'
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data for booking activities
  const bookingActivities = [
    {
      id: 1,
      bookingId: 'BK001',
      customer: 'Alice Cooper',
      carOwner: 'John Smith',
      car: 'Tesla Model 3',
      status: 'active',
      startDate: '2024-10-07',
      endDate: '2024-10-10',
      totalAmount: 450,
      paymentStatus: 'paid',
      createdAt: '2024-10-06 14:30',
      notes: ''
    },
    {
      id: 2,
      bookingId: 'BK002',
      customer: 'Bob Johnson',
      carOwner: 'Sarah Wilson',
      car: 'BMW X5',
      status: 'pending',
      startDate: '2024-10-08',
      endDate: '2024-10-12',
      totalAmount: 680,
      paymentStatus: 'pending',
      createdAt: '2024-10-06 16:45',
      notes: 'Customer requested early pickup'
    },
    {
      id: 3,
      bookingId: 'BK003',
      customer: 'Carol Smith',
      carOwner: 'Mike Davis',
      car: 'Audi A4',
      status: 'cancelled',
      startDate: '2024-10-09',
      endDate: '2024-10-11',
      totalAmount: 320,
      paymentStatus: 'refunded',
      createdAt: '2024-10-05 10:15',
      notes: 'Cancelled due to emergency'
    },
    {
      id: 4,
      bookingId: 'BK004',
      customer: 'David Wilson',
      carOwner: 'Emma Johnson',
      car: 'Mercedes C-Class',
      status: 'completed',
      startDate: '2024-10-01',
      endDate: '2024-10-05',
      totalAmount: 750,
      paymentStatus: 'paid',
      createdAt: '2024-09-28 09:20',
      notes: 'Excellent customer, no issues'
    },
    {
      id: 5,
      bookingId: 'BK005',
      customer: 'Eva Brown',
      carOwner: 'Tom Wilson',
      car: 'Honda Civic',
      status: 'overdue',
      startDate: '2024-10-02',
      endDate: '2024-10-05',
      totalAmount: 280,
      paymentStatus: 'paid',
      createdAt: '2024-09-30 11:30',
      notes: 'Customer has not returned car'
    }
  ];

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'completed':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'cancelled':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'overdue':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
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
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
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

  const filteredBookings = bookingActivities.filter(booking => {
    const matchesSearch = booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.car.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900 text-sm">{booking.bookingId}</div>
                    <div className="text-xs text-gray-500">{booking.createdAt}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900 text-sm">{booking.customer}</div>
                    <div className="text-xs text-gray-500">{t('owner')}: {booking.carOwner}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900 text-sm">{booking.car}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-600">{booking.startDate}</div>
                    <div className="text-sm text-gray-600">{t('to')} {booking.endDate}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900 text-sm">${booking.totalAmount}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={getStatusBadge(booking.status)}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={getPaymentBadge(booking.paymentStatus)}>
                      {booking.paymentStatus}
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

        {/* Pagination */}
        <div className="flex items-center justify-center py-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">{t('previous')}</button>
            <div className="flex space-x-1">
              <button className="w-8 h-8 text-sm bg-blue-600 text-white rounded">1</button>
              <button className="w-8 h-8 text-sm text-gray-600 hover:bg-gray-100 rounded">2</button>
              <button className="w-8 h-8 text-sm text-gray-600 hover:bg-gray-100 rounded">3</button>
            </div>
            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">{t('next')}</button>
          </div>
        </div>
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