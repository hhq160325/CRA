import { useState, useMemo } from 'react';
import { filterBookingData } from '../utils/filterUtils';

const BookingManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalType, setModalType] = useState(null); // 'checkin', 'checkout', 'view'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkInData, setCheckInData] = useState({
    mileage: '',
    condition: 'excellent',
    notes: ''
  });
  const [checkOutData, setCheckOutData] = useState({
    mileage: '',
    condition: 'excellent',
    notes: ''
  });

  // Mock data for bookings
  const bookings = [
    {
      id: 1,
      bookingId: 'BK001',
      carId: 'C001',
      carName: 'Tesla Model 3',
      licensePlate: 'ABC-1234',
      customer: 'Alice Cooper',
      customerEmail: 'alice.cooper@email.com',
      customerPhone: '+1 (555) 111-2222',
      startDate: '2024-10-08',
      endDate: '2024-10-12',
      pickupTime: '10:00',
      returnTime: '14:00',
      totalAmount: 396,
      paymentStatus: 'paid',
      status: 'confirmed', // confirmed, checked_in, checked_out, completed
      mileageAtBooking: 17500,
      currentMileage: null,
      conditionAtCheckIn: null,
      conditionAtCheckOut: null,
      checkInDate: null,
      checkOutDate: null,
      notes: ''
    },
    {
      id: 2,
      bookingId: 'BK002',
      carId: 'C002',
      carName: 'BMW X5',
      licensePlate: 'XYZ-5678',
      customer: 'Bob Johnson',
      customerEmail: 'bob.johnson@email.com',
      customerPhone: '+1 (555) 222-3333',
      startDate: '2024-10-07',
      endDate: '2024-10-09',
      pickupTime: '09:00',
      returnTime: '17:00',
      totalAmount: 310,
      paymentStatus: 'paid',
      status: 'checked_in',
      mileageAtBooking: 28500,
      currentMileage: 28550,
      conditionAtCheckIn: 'excellent',
      conditionAtCheckOut: null,
      checkInDate: '2024-10-07 09:15',
      checkOutDate: null,
      notes: 'Customer arrived on time'
    },
    {
      id: 3,
      bookingId: 'BK003',
      carId: 'C003',
      carName: 'Honda Civic',
      licensePlate: 'DEF-9012',
      customer: 'Carol Smith',
      customerEmail: 'carol.smith@email.com',
      customerPhone: '+1 (555) 333-4444',
      startDate: '2024-10-05',
      endDate: '2024-10-06',
      pickupTime: '11:00',
      returnTime: '16:00',
      totalAmount: 72,
      paymentStatus: 'paid',
      status: 'checked_out',
      mileageAtBooking: 9200,
      currentMileage: 9500,
      conditionAtCheckIn: 'excellent',
      conditionAtCheckOut: 'excellent',
      checkInDate: '2024-10-05 11:10',
      checkOutDate: '2024-10-06 16:20',
      notes: 'Car returned in perfect condition'
    },
    {
      id: 4,
      bookingId: 'BK004',
      carId: 'C004',
      carName: 'Mercedes C-Class',
      licensePlate: 'GHI-3456',
      customer: 'David Wilson',
      customerEmail: 'david.wilson@email.com',
      customerPhone: '+1 (555) 444-5555',
      startDate: '2024-10-10',
      endDate: '2024-10-15',
      pickupTime: '08:30',
      returnTime: '18:00',
      totalAmount: 725,
      paymentStatus: 'pending',
      status: 'confirmed',
      mileageAtBooking: 31200,
      currentMileage: null,
      conditionAtCheckIn: null,
      conditionAtCheckOut: null,
      checkInDate: null,
      checkOutDate: null,
      notes: ''
    },
    {
      id: 5,
      bookingId: 'BK005',
      carId: 'C005',
      carName: 'Toyota Camry',
      licensePlate: 'JKL-7890',
      customer: 'Eva Brown',
      customerEmail: 'eva.brown@email.com',
      customerPhone: '+1 (555) 555-6666',
      startDate: '2024-10-06',
      endDate: '2024-10-08',
      pickupTime: '10:00',
      returnTime: '15:00',
      totalAmount: 160,
      paymentStatus: 'paid',
      status: 'checked_in',
      mileageAtBooking: 14800,
      currentMileage: 14820,
      conditionAtCheckIn: 'excellent',
      conditionAtCheckOut: null,
      checkInDate: '2024-10-06 10:05',
      checkOutDate: null,
      notes: 'Early pickup requested'
    }
  ];

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'confirmed':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'checked_in':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'checked_out':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'completed':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'cancelled':
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
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getConditionBadge = (condition) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (condition) {
      case 'excellent':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'good':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'fair':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'poor':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const openModal = (booking, type) => {
    setSelectedBooking(booking);
    setModalType(type);
    setIsModalOpen(true);
    
    if (type === 'checkin') {
      setCheckInData({
        mileage: booking.mileageAtBooking.toString(),
        condition: 'excellent',
        notes: ''
      });
    } else if (type === 'checkout') {
      setCheckOutData({
        mileage: booking.currentMileage?.toString() || '',
        condition: booking.conditionAtCheckIn || 'excellent',
        notes: ''
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
    setModalType(null);
    setCheckInData({ mileage: '', condition: 'excellent', notes: '' });
    setCheckOutData({ mileage: '', condition: 'excellent', notes: '' });
  };

  const handleCheckIn = () => {
    if (selectedBooking && checkInData.mileage) {
      // Handle check-in logic
      console.log('Checking in booking:', selectedBooking.id, checkInData);
      closeModal();
    }
  };

  const handleCheckOut = () => {
    if (selectedBooking && checkOutData.mileage) {
      // Handle check-out logic
      console.log('Checking out booking:', selectedBooking.id, checkOutData);
      closeModal();
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => 
      filterBookingData(booking, {
        searchTerm,
        statusFilter,
      })
    );
  }, [bookings, searchTerm, statusFilter]);

  // Calculate statistics
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const checkedInCount = bookings.filter(b => b.status === 'checked_in').length;
  const checkedOutCount = bookings.filter(b => b.status === 'checked_out').length;
  const todayCheckIns = bookings.filter(b => b.checkInDate && b.checkInDate.split(' ')[0] === new Date().toISOString().split('T')[0]).length;

  return (
    <div className="p-8 space-y-6 min-h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Booking Management (Check In/Out)</h1>
          <p className="text-gray-600">Handle check-in and check-out for active bookings</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-blue-600">{confirmedCount}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Checked In</p>
              <p className="text-2xl font-bold text-green-600">{checkedInCount}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Checked Out</p>
              <p className="text-2xl font-bold text-purple-600">{checkedOutCount}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Check-ins</p>
              <p className="text-2xl font-bold text-orange-600">{todayCheckIns}</p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by booking ID, customer, or car"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked In</option>
              <option value="checked_out">Checked Out</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredBookings.length} of {bookings.length} bookings
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Booking ID</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Car Information</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Customer</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Rental Period</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Pickup/Return Time</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Mileage</th>
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
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900 text-sm">{booking.carName}</div>
                    <div className="text-xs text-gray-500">{booking.licensePlate}</div>
                    <div className="text-xs text-gray-400">{booking.carId}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900 text-sm">{booking.customer}</div>
                    <div className="text-xs text-gray-500">{booking.customerEmail}</div>
                    <div className="text-xs text-gray-400">{booking.customerPhone}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{booking.startDate}</div>
                    <div className="text-xs text-gray-500">to {booking.endDate}</div>
                    <div className="text-xs text-gray-400">{booking.endDate === new Date().toISOString().split('T')[0] ? 'Today' : ''}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">Pickup: {booking.pickupTime}</div>
                    <div className="text-sm text-gray-900">Return: {booking.returnTime}</div>
                    {booking.checkInDate && (
                      <div className="text-xs text-green-600">Checked in: {booking.checkInDate.split(' ')[1]}</div>
                    )}
                    {booking.checkOutDate && (
                      <div className="text-xs text-purple-600">Checked out: {booking.checkOutDate.split(' ')[1]}</div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">
                      {booking.currentMileage ? booking.currentMileage.toLocaleString() : booking.mileageAtBooking.toLocaleString()} km
                    </div>
                    {booking.currentMileage && booking.mileageAtBooking && (
                      <div className="text-xs text-gray-500">
                        Used: {(booking.currentMileage - booking.mileageAtBooking)} km
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={getStatusBadge(booking.status)}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-medium text-gray-900">${booking.totalAmount}</div>
                    <span className={getPaymentBadge(booking.paymentStatus)}>
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => openModal(booking, 'view')}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View
                      </button>
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => openModal(booking, 'checkin')}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          Check In
                        </button>
                      )}
                      {booking.status === 'checked_in' && (
                        <button
                          onClick={() => openModal(booking, 'checkout')}
                          className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                        >
                          Check Out
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

      {/* Modal for Check In/Check Out/View */}
      {isModalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {modalType === 'checkin' && 'Check In - '}
                  {modalType === 'checkout' && 'Check Out - '}
                  {modalType === 'view' && 'Booking Details - '}
                  {selectedBooking.bookingId}
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
            </div>
            <div className="p-6 space-y-6">
              {/* Booking Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Booking Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Car</p>
                    <p className="font-medium text-gray-900">{selectedBooking.carName} ({selectedBooking.licensePlate})</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Customer</p>
                    <p className="font-medium text-gray-900">{selectedBooking.customer}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Rental Period</p>
                    <p className="font-medium text-gray-900">{selectedBooking.startDate} to {selectedBooking.endDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Amount</p>
                    <p className="font-medium text-gray-900">${selectedBooking.totalAmount}</p>
                  </div>
                </div>
              </div>

              {/* Check In Form */}
              {modalType === 'checkin' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Mileage (km) *
                    </label>
                    <input
                      type="number"
                      value={checkInData.mileage}
                      onChange={(e) => setCheckInData({ ...checkInData, mileage: e.target.value })}
                      placeholder={selectedBooking.mileageAtBooking.toString()}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Previous mileage: {selectedBooking.mileageAtBooking.toLocaleString()} km</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Car Condition *
                    </label>
                    <select
                      value={checkInData.condition}
                      onChange={(e) => setCheckInData({ ...checkInData, condition: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      rows="3"
                      value={checkInData.notes}
                      onChange={(e) => setCheckInData({ ...checkInData, notes: e.target.value })}
                      placeholder="Add any notes about the check-in..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCheckIn}
                      disabled={!checkInData.mileage}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Confirm Check In
                    </button>
                  </div>
                </div>
              )}

              {/* Check Out Form */}
              {modalType === 'checkout' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Return Mileage (km) *
                    </label>
                    <input
                      type="number"
                      value={checkOutData.mileage}
                      onChange={(e) => setCheckOutData({ ...checkOutData, mileage: e.target.value })}
                      placeholder={selectedBooking.currentMileage?.toString() || ''}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Check-in mileage: {selectedBooking.currentMileage?.toLocaleString()} km
                      {checkOutData.mileage && selectedBooking.currentMileage && (
                        <span className="ml-2 text-blue-600">
                          Used: {(parseInt(checkOutData.mileage) - selectedBooking.currentMileage).toLocaleString()} km
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Car Condition *
                    </label>
                    <select
                      value={checkOutData.condition}
                      onChange={(e) => setCheckOutData({ ...checkOutData, condition: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="excellent">Excellent</option>
                      <option value="good">Good</option>
                      <option value="fair">Fair</option>
                      <option value="poor">Poor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      rows="3"
                      value={checkOutData.notes}
                      onChange={(e) => setCheckOutData({ ...checkOutData, notes: e.target.value })}
                      placeholder="Add any notes about damages, issues, or other observations..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCheckOut}
                      disabled={!checkOutData.mileage}
                      className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                      Confirm Check Out
                    </button>
                  </div>
                </div>
              )}

              {/* View Details */}
              {modalType === 'view' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <span className={getStatusBadge(selectedBooking.status)}>{selectedBooking.status}</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Status</p>
                      <span className={getPaymentBadge(selectedBooking.paymentStatus)}>{selectedBooking.paymentStatus}</span>
                    </div>
                    {selectedBooking.conditionAtCheckIn && (
                      <div>
                        <p className="text-sm text-gray-600">Condition at Check-in</p>
                        <span className={getConditionBadge(selectedBooking.conditionAtCheckIn)}>
                          {selectedBooking.conditionAtCheckIn}
                        </span>
                      </div>
                    )}
                    {selectedBooking.conditionAtCheckOut && (
                      <div>
                        <p className="text-sm text-gray-600">Condition at Check-out</p>
                        <span className={getConditionBadge(selectedBooking.conditionAtCheckOut)}>
                          {selectedBooking.conditionAtCheckOut}
                        </span>
                      </div>
                    )}
                  </div>
                  {selectedBooking.checkInDate && (
                    <div>
                      <p className="text-sm text-gray-600">Check-in Date</p>
                      <p className="font-medium text-gray-900">{selectedBooking.checkInDate}</p>
                    </div>
                  )}
                  {selectedBooking.checkOutDate && (
                    <div>
                      <p className="text-sm text-gray-600">Check-out Date</p>
                      <p className="font-medium text-gray-900">{selectedBooking.checkOutDate}</p>
                    </div>
                  )}
                  {selectedBooking.notes && (
                    <div>
                      <p className="text-sm text-gray-600">Notes</p>
                      <p className="text-gray-900">{selectedBooking.notes}</p>
                    </div>
                  )}
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Close
                    </button>
                    {selectedBooking.status === 'confirmed' && (
                      <button
                        onClick={() => {
                          closeModal();
                          openModal(selectedBooking, 'checkin');
                        }}
                        className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Check In
                      </button>
                    )}
                    {selectedBooking.status === 'checked_in' && (
                      <button
                        onClick={() => {
                          closeModal();
                          openModal(selectedBooking, 'checkout');
                        }}
                        className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        Check Out
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingManagement;

