import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateBookingStatus } from '../staffSlice';

const BookingMonitoring = () => {
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
          <h1 className="text-2xl font-bold text-gray-900">Booking Monitoring</h1>
          <p className="text-gray-600">Monitor and manage all booking activities</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Export Report
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Create Manual Booking
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
                placeholder="Search bookings..."
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
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="overdue">Overdue</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredBookings.length} of {bookingActivities.length} bookings
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Booking ID</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Customer</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Car</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Duration</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Amount</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Payment</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Actions</th>
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
                    <div className="text-xs text-gray-500">Owner: {booking.carOwner}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900 text-sm">{booking.car}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-600">{booking.startDate}</div>
                    <div className="text-sm text-gray-600">to {booking.endDate}</div>
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
                        View
                      </button>
                      <button
                        onClick={() => openModal(booking, 'edit')}
                        className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                      >
                        Edit
                      </button>
                      {booking.status === 'overdue' && (
                        <button
                          onClick={() => openModal(booking, 'resolve')}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          Resolve
                        </button>
                      )}
                      {(booking.status === 'pending' || booking.status === 'active') && (
                        <button
                          onClick={() => openModal(booking, 'cancel')}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          Cancel
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
            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">Previous</button>
            <div className="flex space-x-1">
              <button className="w-8 h-8 text-sm bg-blue-600 text-white rounded">1</button>
              <button className="w-8 h-8 text-sm text-gray-600 hover:bg-gray-100 rounded">2</button>
              <button className="w-8 h-8 text-sm text-gray-600 hover:bg-gray-100 rounded">3</button>
            </div>
            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">Next</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {modalType === 'view' && 'Booking Details'}
                {modalType === 'edit' && 'Edit Booking'}
                {modalType === 'cancel' && 'Cancel Booking'}
                {modalType === 'resolve' && 'Resolve Overdue Booking'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            {modalType === 'view' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Booking ID</label>
                    <p className="text-gray-900">{selectedBooking.bookingId}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={getStatusBadge(selectedBooking.status)}>
                      {selectedBooking.status}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                    <p className="text-gray-900">{selectedBooking.customer}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Car Owner</label>
                    <p className="text-gray-900">{selectedBooking.carOwner}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Car</label>
                    <p className="text-gray-900">{selectedBooking.car}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                    <p className="text-gray-900">${selectedBooking.totalAmount}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <p className="text-gray-900">{selectedBooking.startDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <p className="text-gray-900">{selectedBooking.endDate}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                    <span className={getPaymentBadge(selectedBooking.paymentStatus)}>
                      {selectedBooking.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                    <p className="text-gray-900">{selectedBooking.createdAt}</p>
                  </div>
                </div>
                {selectedBooking.notes && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedBooking.notes}</p>
                  </div>
                )}
              </div>
            )}

            {modalType === 'edit' && (
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleEdit(Object.fromEntries(formData));
              }}>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                      <input
                        type="text"
                        name="customer"
                        defaultValue={selectedBooking.customer}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Car Owner</label>
                      <input
                        type="text"
                        name="carOwner"
                        defaultValue={selectedBooking.carOwner}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input
                        type="date"
                        name="startDate"
                        defaultValue={selectedBooking.startDate}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input
                        type="date"
                        name="endDate"
                        defaultValue={selectedBooking.endDate}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
                      <input
                        type="number"
                        name="totalAmount"
                        defaultValue={selectedBooking.totalAmount}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        name="status"
                        defaultValue={selectedBooking.status}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="overdue">Overdue</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      name="notes"
                      rows={3}
                      defaultValue={selectedBooking.notes}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Add any notes about this booking..."
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            )}

            {modalType === 'cancel' && (
              <div className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Cancel Booking
                      </h3>
                      <p className="mt-2 text-sm text-red-700">
                        Are you sure you want to cancel booking <strong>{selectedBooking.bookingId}</strong>?
                        This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Booking Details:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Customer:</span> {selectedBooking.customer}</p>
                    <p><span className="font-medium">Car:</span> {selectedBooking.car}</p>
                    <p><span className="font-medium">Duration:</span> {selectedBooking.startDate} to {selectedBooking.endDate}</p>
                    <p><span className="font-medium">Amount:</span> ${selectedBooking.totalAmount}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Reason</label>
                  <textarea
                    id="cancellationReason"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Please provide a reason for cancellation..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Keep Booking
                  </button>
                  <button
                    onClick={() => {
                      const reason = document.getElementById('cancellationReason').value;
                      handleCancel(reason);
                    }}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            )}

            {modalType === 'resolve' && (
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Resolve Overdue Booking
                      </h3>
                      <p className="mt-2 text-sm text-yellow-700">
                        Mark booking <strong>{selectedBooking.bookingId}</strong> as completed.
                        This will resolve the overdue status.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Booking Details:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Customer:</span> {selectedBooking.customer}</p>
                    <p><span className="font-medium">Car:</span> {selectedBooking.car}</p>
                    <p><span className="font-medium">Expected End:</span> {selectedBooking.endDate}</p>
                    <p><span className="font-medium">Amount:</span> ${selectedBooking.totalAmount}</p>
                    <p><span className="font-medium">Current Notes:</span> {selectedBooking.notes || 'No notes'}</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResolve}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Mark as Completed
                  </button>
                </div>
              </div>
            )}

            {/* View Mode Action Buttons */}
            {modalType === 'view' && (
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setModalType('edit')}
                  className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  Edit
                </button>
                {selectedBooking.status === 'overdue' && (
                  <button
                    onClick={() => setModalType('resolve')}
                    className="px-4 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    Resolve
                  </button>
                )}
                {(selectedBooking.status === 'pending' || selectedBooking.status === 'active') && (
                  <button
                    onClick={() => setModalType('cancel')}
                    className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingMonitoring;