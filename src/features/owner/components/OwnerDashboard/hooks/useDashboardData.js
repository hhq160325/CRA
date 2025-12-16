import { useState, useEffect } from 'react';
import { axiosInstance } from '../../../../../shared/utils/axiosInstance';
import { BOOKING_ENDPOINTS } from '../../../../../config/api';
import { getUserIdFromToken } from '../../../../user/api';
import { fetchRentalHistoryData } from '../../../api/ownerApi';
import { useDashboardPaymentData } from './useDashboardPaymentData';
import { useDashboardCarData } from './useDashboardCarData';
import { convertToVietnamTime } from '../../../../../shared/utils/CheckUTC';

export const useDashboardData = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    newBookings: 0,
    revenueGrowth: 0,
    bookingsGrowth: 0,
    bookingStatusData: {},
    monthlyEarnings: [],
    monthlyBookings: [],
    weeklyBookingData: [],
    recentBookings: [],
  });

  // Use the separate payment data hook
  const { paymentStats, dailyData, paymentLoading, refetchPaymentData } = useDashboardPaymentData();
  
  // Use the separate car data hook
  const { carStats, carLoading, ownerCars, manufacturerMap, refetchCarData, updateTopManufacturers } = useDashboardCarData();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const currentUserId = getUserIdFromToken();

      // Fetch rental history data
      const { invoices: allInvoices, payments, users } = await fetchRentalHistoryData();
      const invoices = allInvoices.filter(invoice => invoice.vendorId === currentUserId);

      // Create user lookup map for customer names
      const userMap = users.reduce((acc, user) => {
        acc[user.id] = user.fullname || user.username || user.email || 'Unknown User';
        return acc;
      }, {});
      
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

      // Filter bookings for owner's cars - wait for ownerCars to be available
      const ownerCarIds = ownerCars.map(car => car.id);
      const ownerBookings = ownerCarIds.length > 0 
        ? allBookings.filter(booking => ownerCarIds.includes(booking.carId))
        : [];

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
          const dateA = a.createDate ? convertToVietnamTime(a.createDate) : new Date(0);
          const dateB = b.createDate ? convertToVietnamTime(b.createDate) : new Date(0);
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
      const topManufacturers = {};

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
            const bookingDate = convertToVietnamTime(booking.pickupTime);
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

        // Count new bookings (confirmed status)
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
          let bookingDate;
          if (booking.updateDate && booking.createDate && booking.updateDate !== booking.createDate) {
            bookingDate = convertToVietnamTime(booking.updateDate);
          } else {
            bookingDate = convertToVietnamTime(booking.createDate || booking.pickupTime);
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

      // Update top manufacturers in car data
      updateTopManufacturers(topManufacturers);

      // Calculate growth percentages (mock data for now)
      const revenueGrowth = 15.2;
      const bookingsGrowth = 5.2;

      setStats({
        totalRevenue,
        newBookings,
        revenueGrowth,
        bookingsGrowth,
        bookingStatusData,
        monthlyEarnings,
        monthlyBookings,
        weeklyBookingData,
        recentBookings: sortedBookings,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch dashboard data when car data is available
    if (ownerCars.length > 0 || !carLoading) {
      fetchDashboardData();
    }
  }, [ownerCars, carLoading]);

  return { 
    stats: { ...stats, ...paymentStats, ...carStats }, 
    dailyData,
    loading: loading || paymentLoading || carLoading, 
    refetch: () => {
      fetchDashboardData();
      refetchPaymentData();
      refetchCarData();
    }
  };
};