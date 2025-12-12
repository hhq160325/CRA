import { useState, useMemo, useEffect } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { filterBookingData } from '../utils/filterUtils';
import {
  CAR_ENDPOINTS,
  USER_ENDPOINTS,
  BOOKING_ENDPOINTS
} from '../../../config/api';
import Pagination from '../../../shared/components/Pagination';

const BookingManagement = () => {
  const { t } = useTranslation();
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
          console.log("customerName", booking);

          return {
            id: booking.id,
            bookingId: booking.bookingNumber || 'N/A',
            carId: booking.carId || 'N/A',
            carName: car.manufacturer && car.model ? `${car.manufacturer} ${car.model}` : t('bookingManagement.unknownCar'),
            licensePlate: car.licensePlate || t('bookingManagement.notAvailable'),
            customer: customer.fullname || customer.username || t('bookingManagement.unknownCustomer'),
            customerEmail: customer.email || t('bookingManagement.notAvailable'),
            customerPhone: customer.phoneNumber || t('bookingManagement.notAvailable'),
            startDate: booking.pickupTime ? new Date(booking.pickupTime).toISOString().split('T')[0] : t('bookingManagement.notAvailable'),
            endDate: booking.dropoffTime ? new Date(booking.dropoffTime).toISOString().split('T')[0] : t('bookingManagement.notAvailable'),
            pickupTime: booking.pickupTime ? new Date(booking.pickupTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : t('bookingManagement.notAvailable'),
            returnTime: booking.dropoffTime ? new Date(booking.dropoffTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : t('bookingManagement.notAvailable'),
            status: booking.status || t('bookingManagement.notAvailable'),
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
        return { className: `${baseClasses} bg-green-100 text-green-800`, label: t('bookingManagement.confirmedStatus') };
      case 'completed':
        return { className: `${baseClasses} bg-blue-100 text-blue-800`, label: t('bookingManagement.completedStatus') };
      case 'cancelled':
        return { className: `${baseClasses} bg-red-100 text-red-800`, label: t('bookingManagement.cancelledStatus') };
      case 'pending':
        return { className: `${baseClasses} bg-yellow-100 text-yellow-800`, label: t('bookingManagement.pending') };
      default:
        return { className: `${baseClasses} bg-gray-100 text-gray-800`, label: t('bookingManagement.notAvailable') };
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
            <p className="mt-4 text-gray-600">{t('bookingManagement.loadingBookings')}</p>
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
              <h1 className="text-2xl font-bold text-gray-900">{t('bookingManagement.title')}</h1>
              <p className="text-gray-600">{t('bookingManagement.subtitle')}</p>
            </div>
            <div className="flex space-x-3">
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                {t('bookingManagement.exportReport')}
              </button>
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
                    placeholder={t('bookingManagement.searchPlaceholder')}
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
                  <option value="all">{t('bookingManagement.allStatuses')}</option>
                  <option value="confirmed">{t('bookingManagement.confirmed')}</option>
                  <option value="checked_in">{t('bookingManagement.checkedIn')}</option>
                  <option value="checked_out">{t('bookingManagement.checkedOut')}</option>
                  <option value="completed">{t('bookingManagement.completed')}</option>
                </select>
              </div>
              <div className="text-sm text-gray-600">
                {t('bookingManagement.showingResults', { filtered: filteredBookings.length, total: dataForStats.length })}
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('bookingManagement.bookingId')}</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('bookingManagement.vehicleInfo')}</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('bookingManagement.customer')}</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('bookingManagement.rentalPeriod')}</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('bookingManagement.pickupReturnTime')}</th>
                    <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('bookingManagement.status')}</th>
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
                        <div className="text-xs text-gray-500">{t('bookingManagement.to')} {booking.endDate}</div>
                        <div className="text-xs text-gray-400">{booking.endDate === new Date().toISOString().split('T')[0] ? t('bookingManagement.today') : ''}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">{t('bookingManagement.pickup')}: {booking.pickupTime}</div>
                        <div className="text-sm text-gray-900">{t('bookingManagement.return')}: {booking.returnTime}</div>
                        {booking.checkInDate && (
                          <div className="text-xs text-green-600">{t('bookingManagement.pickedUp')}: {booking.checkInDate.split(' ')[1]}</div>
                        )}
                        {booking.checkOutDate && (
                          <div className="text-xs text-purple-600">{t('bookingManagement.returned')}: {booking.checkOutDate.split(' ')[1]}</div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {(() => {
                          const badge = getStatusBadge(booking.status);
                          return <span className={badge.className}>{badge.label}</span>;
                        })()}
                      </td>
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

