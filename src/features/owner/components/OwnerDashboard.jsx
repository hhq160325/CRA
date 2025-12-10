import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { axiosInstance } from '../../../shared/utils/axiosInstance';
import { CAR_ENDPOINTS, BOOKING_ENDPOINTS } from '../../../config/api';
import { getUserIdFromToken } from '../../user/api';
import { fetchRentalHistoryData, fetchOwnerPaymentsData } from '../ownerApi';
import OwnerBookingOverview from './OwnerDashboardComponent/OwnerBookingOverview';
import OwnerBookingStatus from './OwnerDashboardComponent/OwnerBookingStatus';

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
    topManufacturers: {},
    bookingStatusData: {},
    monthlyEarnings: [],
    monthlyBookings: [],
    weeklyBookingData: [],
    // Payment statistics
    totalReceived: 0,
    pendingPayments: 0,
    bookingFeeTotal: 0,
    rentalFeeTotal: 0,
    // Car status statistics
    carStatusData: {},
    regDocStatusData: {},
    // Recent bookings
    recentBookings: [],
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

      // Fetch manufacturers data
      const manufacturersResponse = await axiosInstance.get(CAR_ENDPOINTS.GET_ALL_MANUFACTURER);
      const manufacturers = manufacturersResponse.data || [];
      
      // Create manufacturer lookup map
      const manufacturerMap = manufacturers.reduce((acc, manufacturer) => {
        acc[manufacturer.id] = manufacturer.name;
        return acc;
      }, {});

      // Calculate car statistics
      const availableCars = ownerCars.filter(car => car.status?.toLowerCase() === 'active').length;
      console.log(availableCars);

      const rentedCars = ownerCars.filter(car =>
        car.status?.toLowerCase() === 'reserved' || car.status?.toLowerCase() === 'pending'
      ).length;

      // Calculate car status distribution
      const carStatusData = ownerCars.reduce((acc, car) => {
        const status = car.status?.toLowerCase() || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      // Calculate registration document status
      const regDocStatusData = ownerCars.reduce((acc, car) => {
        const regDocStatus = car.registrationPaper?.toLowerCase() || 'pending';
        acc[regDocStatus] = (acc[regDocStatus] || 0) + 1;
        return acc;
      }, {});

      // Calculate car types distribution
      const carTypes = ownerCars.reduce((acc, car) => {
        const type = car.type || 'Other';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      // Calculate top manufacturers with cars in confirmed/completed bookings
      const topManufacturers = {};

      // Fetch rental history data
      const { invoices: allInvoices, payments, users } = await fetchRentalHistoryData();
      const invoices = allInvoices.filter(invoice => invoice.vendorId === currentUserId);

      // Create user lookup map for customer names
      const userMap = users.reduce((acc, user) => {
        acc[user.id] = user.fullname || user.username || user.email || 'Unknown User';
        return acc;
      }, {});
      console.log("User Map",userMap);
      
      // Create payment lookup map
      const paymentMap = payments.reduce((acc, payment) => {
        if (!acc[payment.invoiceId]) {
          acc[payment.invoiceId] = [];
        }
        acc[payment.invoiceId].push(payment);
        return acc;
      }, {});

      // Fetch payment data for payment statistics
      const { payments: allPayments } = await fetchOwnerPaymentsData();

      // Filter payments for current vendor's invoices
      const vendorInvoiceIds = invoices.map(invoice => invoice.id);
      const vendorPayments = allPayments.filter(payment => vendorInvoiceIds.includes(payment.invoiceId));

      // Calculate payment statistics
      const totalReceived = vendorPayments.filter(p =>
        p.status?.toLowerCase() === 'paid' ||
        p.status?.toLowerCase() === 'completed' ||
        p.status?.toLowerCase() === 'success'
      ).reduce((sum, p) => sum + (p.paidAmount || 0), 0);

      const pendingPayments = vendorPayments.filter(p =>
        p.status?.toLowerCase() === 'pending'
      ).reduce((sum, p) => sum + (p.paidAmount || 0), 0);

      const bookingFeeTotal = vendorPayments.filter(p =>
        p.item?.toLowerCase().includes('booking') &&
        (p.status?.toLowerCase() === 'paid' ||
          p.status?.toLowerCase() === 'completed' ||
          p.status?.toLowerCase() === 'success')
      ).reduce((sum, p) => sum + (p.paidAmount || 0), 0);

      const rentalFeeTotal = vendorPayments.filter(p =>
        !p.item?.toLowerCase().includes('booking') &&
        (p.status?.toLowerCase() === 'paid' ||
          p.status?.toLowerCase() === 'completed' ||
          p.status?.toLowerCase() === 'success')
      ).reduce((sum, p) => sum + (p.paidAmount || 0), 0);

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

      // Sort bookings by createDate to get latest bookings and add customer names
      const sortedBookings = [...ownerBookings]
        .map(booking => ({
          ...booking,
          customerName: userMap[booking.userId] || 'Unknown Customer'
        }))
        .sort((a, b) => {
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

          // Count manufacturers for confirmed/completed bookings
          if (booking?.carId) {
            const car = ownerCars.find(c => c.id === booking.carId);
            if (car && car.manufacturerId) {
              const manufacturerName = manufacturerMap[car.manufacturerId] || 'Unknown';
              topManufacturers[manufacturerName] = (topManufacturers[manufacturerName] || 0) + 1;
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
        totalReceived,
        pendingPayments,
        bookingFeeTotal,
        rentalFeeTotal,
        carStatusData,
        regDocStatusData,
        topManufacturers,
        recentBookings: sortedBookings,
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
          <p className="mt-4 text-gray-600">{t('loadingDashboard')}</p>
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

  // Calculate percentages for top manufacturers
  const totalManufacturerBookings = Object.values(stats.topManufacturers).reduce((sum, count) => sum + count, 0);
  const manufacturerPercentages = Object.entries(stats.topManufacturers)
    .sort(([,a], [,b]) => b - a) // Sort by count descending
    .map(([manufacturer, count]) => ({
      manufacturer,
      count,
      percentage: totalManufacturerBookings > 0 ? Math.round((count / totalManufacturerBookings) * 100) : 0
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
        <p className="text-gray-600">{t('ownerDashboardOverview')}</p>
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
                <p className="text-sm text-gray-500 mt-1">{t('totalRevenue')}</p>
              </div>
            </div>
            {/* <span className="text-green-600 text-sm font-medium flex items-center">
              {stats.revenueGrowth}% ↑
            </span> */}
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
                <p className="text-sm text-gray-500 mt-1">{t('newCarBookingRequest')}</p>
              </div>
            </div>
            {/* <span className="text-green-600 text-sm font-medium flex items-center">
              {stats.bookingsGrowth}% ↑
            </span> */}
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
                <p className="text-sm text-gray-500 mt-1">{t('vehiclesCurrentlyRented')}</p>
              </div>
            </div>
            {/* <span className="text-green-600 text-sm font-medium flex items-center">
              {stats.rentedGrowth}% ↑
            </span> */}
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
                <p className="text-sm text-gray-500 mt-1">{t('vehiclesAvailable')}</p>
              </div>
            </div>
            {/* <span className="text-green-600 text-sm font-medium flex items-center">
              {stats.availableGrowth}% ↑
            </span> */}
          </div>
        </div>
      </div>

      {/* Second Row - Payment Summary and Car Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('paymentSummary')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">{t('totalReceived')}</p>
                  <p className="text-2xl font-bold text-green-600">{formatVND(stats.totalReceived)}</p>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-700">{t('paymentPending')}</p>
                  <p className="text-2xl font-bold text-yellow-600">{formatVND(stats.pendingPayments)}</p>
                </div>
                <div className="bg-yellow-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">{t('bookingFee')}</p>
                  <p className="text-2xl font-bold text-blue-600">{formatVND(stats.bookingFeeTotal)}</p>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700">{t('rentalFee')}</p>
                  <p className="text-2xl font-bold text-purple-600">{formatVND(stats.rentalFeeTotal)}</p>
                </div>
                <div className="bg-purple-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">{t('recentBookings')}</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              {t('viewAll')}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">{t('bookingCode')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">{t('customer')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">{t('rentalDuration')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">{t('pickUpTime')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">{t('returnTime')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.recentBookings.slice(0, 5).map((booking) => {
                  const pickupDate = booking.pickupTime ? new Date(booking.pickupTime) : null;
                  const dropoffDate = booking.dropoffTime ? new Date(booking.dropoffTime) : null;
                  const rentalDays = pickupDate && dropoffDate ? 
                    Math.ceil((dropoffDate - pickupDate) / (1000 * 60 * 60 * 24)) : 0;
                  
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900 text-sm">
                          BK{String(booking.id).padStart(3, '0')}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900 text-sm">
                          {booking.customerName || 'N/A'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-600">
                          {rentalDays > 0 ? `${rentalDays} ${t('days')}` : 'N/A'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-600">
                          {pickupDate ? pickupDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'N/A'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm text-gray-600">
                          {dropoffDate ? dropoffDate.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'N/A'}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {stats.recentBookings.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-gray-500">
                      {t('noBookingsFound')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Booking Status Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-1">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Booking Status Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Completed Bookings</p>
                  <p className="text-2xl font-bold text-green-600">{stats.bookingStatusData.completed || 0}</p>
                </div>
                <div className="bg-green-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Confirmed Bookings</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.bookingStatusData.confirmed || 0}</p>
                </div>
                <div className="bg-blue-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-700">Pending Bookings</p>
                  <p className="text-2xl font-bold text-yellow-600">{stats.bookingStatusData.pending || 0}</p>
                </div>
                <div className="bg-yellow-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-red-700">Cancelled Bookings</p>
                  <p className="text-2xl font-bold text-red-600">{stats.bookingStatusData.cancelled || 0}</p>
                </div>
                <div className="bg-red-100 rounded-full p-3">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:col-span-2">
          {/* Car Availability*/}
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('carStatusSummary')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700">{t('available')}</p>
                    <p className="text-2xl font-bold text-green-600">{stats.carStatusData?.active || 0}</p>
                  </div>
                  <div className="bg-green-100 rounded-full p-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-700">{t('underMaintenance')}</p>
                    <p className="text-2xl font-bold text-orange-600">{stats.carStatusData?.maintenance || 0}</p>
                  </div>
                  <div className="bg-orange-100 rounded-full p-3">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700">{t('booked')}</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.carStatusData?.reserved || 0}</p>
                  </div>
                  <div className="bg-blue-100 rounded-full p-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-700">{t('pending')}</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.carStatusData?.pending || 0}</p>
                  </div>
                  <div className="bg-yellow-100 rounded-full p-3">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Car RegDoc */}
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('registrationDocumentStatus')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-700">{t('approved')}</p>
                    <p className="text-2xl font-bold text-green-600">{stats.regDocStatusData?.approved || 0}</p>
                  </div>
                  <div className="bg-green-100 rounded-full p-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-yellow-700">{t('pendingApproval')}</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.regDocStatusData?.pending || 0}</p>
                  </div>
                  <div className="bg-yellow-100 rounded-full p-3">
                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-red-700">{t('rejected')}</p>
                    <p className="text-2xl font-bold text-red-600">{stats.regDocStatusData?.rejected || 0}</p>
                  </div>
                  <div className="bg-red-100 rounded-full p-3">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Booking Status Pie Chart */}
          <OwnerBookingStatus bookingStatusChartData={bookingStatusChartData} />
        </div>

      </div>

      {/* Fourth Row - Booking Overview and Top Manufacturers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Overview */}
        <OwnerBookingOverview weeklyBookingData={stats.weeklyBookingData} />

        {/* Top Manufacturers */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('topManufacturersConfirmedCompleted')}</h2>
          <div className="space-y-4">
            {manufacturerPercentages.slice(0, 4).map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{item.manufacturer}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">({item.count} {t('bookingsText')})</span>
                    <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
            {manufacturerPercentages.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                {t('noConfirmedCompletedBookings')}
              </div>
            )}
          </div>
        </div>

        {/* Booking Status Pie Chart */}
        {/* <OwnerBookingStatus bookingStatusChartData={bookingStatusChartData} /> */}
      </div>
    </div>
  );
};

export default OwnerDashboard;
