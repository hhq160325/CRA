import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { axiosInstance } from '../../../shared/utils/axiosInstance';
import { CAR_ENDPOINTS, BOOKING_ENDPOINTS } from '../../../config/api';
import { getUserIdFromToken } from '../../user/api';
import { fetchRentalHistoryData } from '../ownerApi';
import OwnerBookingOverview from './OwnerDashboardComponent/OwnerBookingOverview';
import OwnerBookingStatus from './OwnerDashboardComponent/OwnerBookingStatus';
import OwnerEarningsSummary from './OwnerDashboardComponent/OwnerEarningsSummary';

const OwnerDashboard = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    newBookings: 0,
    rentedCars: 0,
    availableCars: 0,
    revenueGrowth: 0,
    bookingsGrowth: 0,
    rentedGrowth: 0,
    availableGrowth: 0,
    carTypes: {},
    bookingStatusData: {},
    monthlyEarnings: [],
    monthlyBookings: [],
    weeklyBookingData: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const currentUserId = getUserIdFromToken();

      // Fetch cars data
      const carsResponse = await axiosInstance.get(CAR_ENDPOINTS.GET_ALL_CARS);
      const allCars = carsResponse.data || [];
      const ownerCars = allCars.filter(car => car.owner.id === currentUserId);
      console.log(ownerCars);

      // Calculate car statistics
      const availableCars = ownerCars.filter(car => car.status?.toLowerCase() === 'active').length;
      console.log(availableCars);

      const rentedCars = ownerCars.filter(car =>
        car.status?.toLowerCase() === 'reserved' || car.status?.toLowerCase() === 'pending'
      ).length;

      // Calculate car types distribution
      const carTypes = ownerCars.reduce((acc, car) => {
        const type = car.type || 'Other';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      // Fetch rental history data
      const { invoices: allInvoices, payments } = await fetchRentalHistoryData();
      const invoices = allInvoices.filter(invoice => invoice.vendorId === currentUserId);

      // Create payment lookup map
      const paymentMap = payments.reduce((acc, payment) => {
        if (!acc[payment.invoiceId]) {
          acc[payment.invoiceId] = [];
        }
        acc[payment.invoiceId].push(payment);
        return acc;
      }, {});

      // Fetch all bookings and filter by owner's cars
      const bookingsResponse = await axiosInstance.get(BOOKING_ENDPOINTS.GET_ALL_BOOKINGS);
      const allBookings = bookingsResponse.data || [];
      console.log(allBookings);

      // Filter bookings for owner's cars
      const ownerCarIds = ownerCars.map(car => car.id);
      const ownerBookings = allBookings.filter(booking => ownerCarIds.includes(booking.carId));

      // Create booking map by invoice ID
      const bookingMap = {};
      ownerBookings.forEach(booking => {
        if (booking.invoiceId) {
          bookingMap[booking.invoiceId] = booking;
        }
      });

      // Sort bookings by createDate to get latest bookings
      const sortedBookings = [...ownerBookings].sort((a, b) => {
        const dateA = new Date(a.createDate || 0);
        const dateB = new Date(b.createDate || 0);
        return dateB - dateA; // Most recent first
      });

      // Calculate booking status distribution
      const bookingStatusData = ownerBookings.reduce((acc, booking) => {
        const status = booking.status?.toLowerCase() || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      // Calculate rental statistics
      let totalRevenue = 0;
      let newBookings = 0;
      const monthlyEarnings = Array(6).fill(0);
      const monthlyBookings = Array(6).fill(0);

      const currentDate = new Date();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(currentDate.getMonth() - 6);

      invoices.forEach(invoice => {
        const booking = bookingMap[invoice.id];
        const bookingStatus = booking?.status?.toLowerCase();

        if (bookingStatus === 'confirmed' || bookingStatus === 'completed') {
          // Calculate revenue from payments
          const paymentsForInvoice = paymentMap[invoice.id] || [];
          const totalPaid = paymentsForInvoice.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
          totalRevenue += totalPaid;

          // Calculate monthly earnings
          if (booking?.pickupTime) {
            const bookingDate = new Date(booking.pickupTime);
            if (bookingDate >= sixMonthsAgo) {
              const monthDiff = (currentDate.getFullYear() - bookingDate.getFullYear()) * 12 +
                (currentDate.getMonth() - bookingDate.getMonth());
              if (monthDiff >= 0 && monthDiff < 6) {
                monthlyEarnings[5 - monthDiff] += totalPaid;
                monthlyBookings[5 - monthDiff]++;
              }
            }
          }
        }

        // Count new bookings (pending status)
        if (bookingStatus === 'confirmed') {
          newBookings++;
        }
      });

      // Calculate weekly booking data (last 7 days)
      const weeklyBookingData = [];
      const today = new Date();

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);

        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + 1);

        const dayBookings = ownerBookings.filter(booking => {
          // Use updateDate if it differs from createDate, otherwise use createDate
          let bookingDate;
          if (booking.updateDate && booking.createDate && booking.updateDate !== booking.createDate) {
            bookingDate = new Date(booking.updateDate);
          } else {
            bookingDate = new Date(booking.createDate || booking.pickupTime);
          }
          return bookingDate >= date && bookingDate < nextDate;
        });

        const statusCounts = {
          pending: 0,
          confirmed: 0,
          completed: 0,
          cancelled: 0,
        };

        dayBookings.forEach(booking => {
          const status = booking.status?.toLowerCase() || 'unknown';
          if (statusCounts.hasOwnProperty(status)) {
            statusCounts[status]++;
          }
        });

        weeklyBookingData.push({
          day: date.toLocaleDateString('en-US', { weekday: 'short' }),
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          ...statusCounts,
        });
      }

      // Calculate growth percentages (mock data for now)
      const revenueGrowth = 15.2;
      const bookingsGrowth = 5.2;
      const rentedGrowth = 21.2;
      const availableGrowth = 7.2;

      setStats({
        totalRevenue,
        newBookings,
        rentedCars,
        availableCars,
        revenueGrowth,
        bookingsGrowth,
        rentedGrowth,
        availableGrowth,
        carTypes,
        bookingStatusData,
        monthlyEarnings,
        monthlyBookings,
        weeklyBookingData,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(3);
    }
    return num.toString();
  };

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
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate percentages for car types
  const totalCars = Object.values(stats.carTypes).reduce((sum, count) => sum + count, 0);
  const carTypePercentages = Object.entries(stats.carTypes).map(([type, count]) => ({
    type,
    count,
    percentage: totalCars > 0 ? Math.round((count / totalCars) * 100) : 0
  }));

  // Prepare booking status data for pie chart
  const bookingStatusChartData = [
    { name: 'Pending', value: stats.bookingStatusData.pending || 0, color: '#f59e0b' },
    { name: 'Confirmed', value: stats.bookingStatusData.confirmed || 0, color: '#3b82f6' },
    { name: 'Completed', value: stats.bookingStatusData.completed || 0, color: '#10b981' },
    { name: 'Cancelled', value: stats.bookingStatusData.cancelled || 0, color: '#ef4444' },
  ].filter(item => item.value > 0); // Only show statuses with bookings

  return (
    <div className="p-8 space-y-6 min-h-full bg-gray-50">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('ownerDashboardTitle')}</h1>
        <p className="text-gray-600">Overview of your car rental business</p>
      </div>
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-900 rounded-xl p-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalRevenue / 1000)}</p>
                <p className="text-sm text-gray-500 mt-1">Total Revenue</p>
              </div>
            </div>
            <span className="text-green-600 text-sm font-medium flex items-center">
              {stats.revenueGrowth}% ↑
            </span>
          </div>
        </div>

        {/* New Booking */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-900 rounded-xl p-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.newBookings)}</p>
                <p className="text-sm text-gray-500 mt-1">New Booking</p>
              </div>
            </div>
            <span className="text-green-600 text-sm font-medium flex items-center">
              {stats.bookingsGrowth}% ↑
            </span>
          </div>
        </div>

        {/* Rented Cars */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-900 rounded-xl p-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.rentedCars)}</p>
                <p className="text-sm text-gray-500 mt-1">Rented Cars</p>
              </div>
            </div>
            <span className="text-green-600 text-sm font-medium flex items-center">
              {stats.rentedGrowth}% ↑
            </span>
          </div>
        </div>

        {/* Available Cars */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-900 rounded-xl p-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.availableCars)}</p>
                <p className="text-sm text-gray-500 mt-1">Available Cars</p>
              </div>
            </div>
            <span className="text-green-600 text-sm font-medium flex items-center">
              {stats.availableGrowth}% ↑
            </span>
          </div>
        </div>
      </div>

      {/* Second Row - Earnings Summary and Car Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Summary */}
        <OwnerEarningsSummary monthlyEarnings={stats.monthlyEarnings} />

        {/* Car Availability - Placeholder */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Car Availability</h2>
          <div className="space-y-4">
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm">
              <option>Car Number</option>
            </select>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm">
              <option>Jan 20, 2025</option>
            </select>
            <select className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm">
              <option>10 AM</option>
            </select>
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition-colors">
              Check
            </button>
          </div>
        </div>
      </div>

      {/* Third Row - Booking Overview, Car Type, Booking Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Overview */}
        <OwnerBookingOverview weeklyBookingData={stats.weeklyBookingData} />

        {/* Car Type */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Car Type</h2>
          <div className="space-y-4">
            {carTypePercentages.slice(0, 4).map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{item.type}</span>
                  <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Status Pie Chart */}
        <OwnerBookingStatus bookingStatusChartData={bookingStatusChartData} />
      </div>
    </div>
  );
};

export default OwnerDashboard;
