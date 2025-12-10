import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { filterBookingData } from '../utils/filterUtils';
import {
  CAR_ENDPOINTS,
  USER_ENDPOINTS,
  BOOKING_ENDPOINTS
} from '../../../config/api';
import Pagination from '../../../shared/components/Pagination';

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
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch all data from APIs
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all required data in parallel
        const [carsRes, usersRes, bookingsRes] = await Promise.all([
          axios.get(CAR_ENDPOINTS.GET_ALL_CARS),
          axios.get(USER_ENDPOINTS.GET_ALL_USERS),
          axios.get(BOOKING_ENDPOINTS.GET_ALL_BOOKINGS)
        ]);

        const cars = carsRes.data;
        const users = usersRes.data;
        const allBookings = bookingsRes.data;

        // Create lookup maps for efficient data access
        const carMap = new Map(cars.map(car => [car.id, car]));
        const userMap = new Map(users.map(user => [user.id, user]));

        // Transform and enrich booking data
        const enrichedBookings = allBookings.map(booking => {
          const car = carMap.get(booking.carId) || {};
          const customer = userMap.get(booking.userId) || {};
          console.log("customerName",booking);
          
          return {
            id: booking.id,
            bookingId: booking.bookingNumber || 'N/A',
            carId: booking.carId || 'N/A',
            carName: car.manufacturer && car.model ? `${car.manufacturer} ${car.model}` : 'Unknown Car',
            licensePlate: car.licensePlate || 'N/A',
            customer: customer.fullname || customer.username || 'Unknown Customer',
            customerEmail: customer.email || 'N/A',
            customerPhone: customer.phoneNumber || 'N/A',
            startDate: booking.pickupTime ? new Date(booking.pickupTime).toISOString().split('T')[0] : 'N/A',
            endDate: booking.dropoffTime ? new Date(booking.dropoffTime).toISOString().split('T')[0] : 'N/A',
            pickupTime: booking.pickupTime ? new Date(booking.pickupTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : 'N/A',
            returnTime: booking.dropoffTime ? new Date(booking.dropoffTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : 'N/A',
            status: booking.status || 'N/A',
          };
        });
        console.log(enrichedBookings);
        
        setBookings(enrichedBookings);
      } catch (err) {
        console.error('Error fetching booking data:', err);
        setError(err.message || 'Failed to load booking data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Mock data for bookings (fallback - will be replaced by API data)
  const mockBookings = [
  ];

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'confirmed':
        return { className: `${baseClasses} bg-green-100 text-green-800`, label: 'Đã xác nhận' };
      case 'completed':
        return { className: `${baseClasses} bg-blue-100 text-blue-800`, label: 'Hoàn thành' };
      case 'cancelled':
        return { className: `${baseClasses} bg-red-100 text-red-800`, label: 'Đã hủy' };
      default:
        return { className: `${baseClasses} bg-gray-100 text-gray-800`, label: 'N/A' };
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
    const dataToFilter = bookings.length > 0 ? bookings : mockBookings;
    return dataToFilter.filter(booking =>
      filterBookingData(booking, {
        searchTerm,
        statusFilter,
      })
    );
  }, [bookings, searchTerm, statusFilter]);

  // Paginated bookings
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredBookings.slice(startIndex, endIndex);
  }, [filteredBookings, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Calculate statistics
  const dataForStats = bookings.length > 0 ? bookings : mockBookings;
  const confirmedCount = dataForStats.filter(b => b.status === 'confirmed').length;
  const checkedInCount = dataForStats.filter(b => b.status === 'checked_in').length;
  const checkedOutCount = dataForStats.filter(b => b.status === 'checked_out').length;
  const todayCheckIns = dataForStats.filter(b => b.checkInDate && b.checkInDate.split(' ')[0] === new Date().toISOString().split('T')[0]).length;

  return (
    <div className="p-8 space-y-6 min-h-full bg-gray-50">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Đang tải dữ liệu đặt xe...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Header */}
      {!loading && (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quản lý đặt xe (Nhận/Trả xe)</h1>
              <p className="text-gray-600">Xử lý việc nhận xe và trả xe cho các đặt xe đang hoạt động</p>
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
      </div> */}

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
                    placeholder="Tìm kiếm theo mã đặt xe, khách hàng hoặc xe"
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
                  <option value="all">Tất cả trạng thái</option>
                  <option value="confirmed">Đã xác nhận</option>
                  <option value="checked_in">Đã nhận xe</option>
                  <option value="checked_out">Đã trả xe</option>
                  <option value="completed">Hoàn thành</option>
                </select>
              </div>
              <div className="text-sm text-gray-600">
                Hiển thị {filteredBookings.length} trong tổng số {dataForStats.length} đặt xe
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Mã đặt xe</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Thông tin xe</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Khách hàng</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Thời gian thuê</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Thời gian nhận/trả xe</th>
                    {/* <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Mileage</th> */}
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Trạng thái</th>
                    {/* <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Payment</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Actions</th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedBookings.map((booking) => (
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
                        <div className="text-xs text-gray-500">đến {booking.endDate}</div>
                        <div className="text-xs text-gray-400">{booking.endDate === new Date().toISOString().split('T')[0] ? 'Hôm nay' : ''}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">Nhận xe: {booking.pickupTime}</div>
                        <div className="text-sm text-gray-900">Trả xe: {booking.returnTime}</div>
                        {booking.checkInDate && (
                          <div className="text-xs text-green-600">Đã nhận xe: {booking.checkInDate.split(' ')[1]}</div>
                        )}
                        {booking.checkOutDate && (
                          <div className="text-xs text-purple-600">Đã trả xe: {booking.checkOutDate.split(' ')[1]}</div>
                        )}
                      </td>
                      {/* <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">
                      {booking.currentMileage ? booking.currentMileage.toLocaleString() : booking.mileageAtBooking.toLocaleString()} km
                    </div>
                    {booking.currentMileage && booking.mileageAtBooking && (
                      <div className="text-xs text-gray-500">
                        Used: {(booking.currentMileage - booking.mileageAtBooking)} km
                      </div>
                    )}
                  </td> */}
                      <td className="py-4 px-6">
                          {(() => {
                            const badge = getStatusBadge(booking.status);
                            return <span className={badge.className}>{badge.label}</span>;
                          })()}
                      </td>
                      {/* <td className="py-4 px-6">
                        <div className="text-sm font-medium text-gray-900">${booking.paidAmount} </div>
                        <span className={getPaymentBadge(booking.paymentStatus)}>
                          {booking.paymentStatus}
                        </span>
                      </td> */}
                      {/* <td className="py-4 px-6">
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
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalItems={filteredBookings.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
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
                  {/* <div className="bg-gray-50 rounded-lg p-4">
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
                  </div> */}

                  {/* Check In Form */}
                  {/* {modalType === 'checkin' && (
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
                  )} */}

                  {/* Check Out Form */}
                  {/* {modalType === 'checkout' && (
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
                  )} */}

                  {/* View Details */}
                  {/* {modalType === 'view' && (
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
                  )} */}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookingManagement;

