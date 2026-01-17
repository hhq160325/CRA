import { useState, useEffect } from 'react';
import { axiosInstance } from '../../../../../shared/utils/axiosInstance';
import { BOOKING_ENDPOINTS } from '../../../../../config/api';
import { convertToVietnamTime } from '../../../../../shared/utils/CheckUTC';

// Helper function to generate booking breakdown data based on period
const generateBookingBreakdownData = (ownerBookings = [], period = '7days') => {
  const today = new Date();
  const breakdown = [];

  // Validate inputs
  if (!Array.isArray(ownerBookings)) {
    console.warn('ownerBookings is not an array:', ownerBookings);
    return [];
  }

  switch (period) {
    case '7days': {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        const vietnamNow = new Date(date.getTime() + (7 * 60 * 60 * 1000));
        vietnamNow.setUTCDate(vietnamNow.getUTCDate() - i);
        vietnamNow.setUTCHours(0, 0, 0, 0);

        const dayBookings = ownerBookings.filter(booking => {
          let bookingDate;
          if (booking.updateDate && booking.createDate && booking.updateDate !== booking.createDate) {
            bookingDate = convertToVietnamTime(booking.updateDate);
          } else {
            bookingDate = convertToVietnamTime(booking.createDate || booking.pickupTime);
          }
          
          if (bookingDate) {
            bookingDate.setUTCHours(0, 0, 0, 0);
            return bookingDate.getTime() === vietnamNow.getTime();
          }
          return false;
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

        const dayName = days[vietnamNow.getUTCDay() === 0 ? 6 : vietnamNow.getUTCDay() - 1];

        breakdown.push({
          day: dayName,
          date: vietnamNow.toLocaleDateString('en-GB'),
          rawDate: vietnamNow.toISOString().split('T')[0],
          ...statusCounts,
        });
      }
      break;
    }
    
    case '7weeks': {
      for (let i = 6; i >= 0; i--) {
        const baseDate = new Date();
        const vietnamNow = new Date(baseDate.getTime() + (7 * 60 * 60 * 1000));
        
        // Calculate the Monday of the week for i weeks ago
        const targetDate = new Date(vietnamNow);
        targetDate.setUTCDate(targetDate.getUTCDate() - (i * 7));
        
        // Find Monday of that week
        const dayOfWeek = targetDate.getUTCDay();
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        
        const weekStart = new Date(targetDate);
        weekStart.setUTCDate(weekStart.getUTCDate() - daysToMonday);
        weekStart.setUTCHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
        weekEnd.setUTCHours(23, 59, 59, 999);

        // console.log(`Week ${i}: ${weekStart.toISOString()} to ${weekEnd.toISOString()}`);

        const weekBookings = ownerBookings.filter(booking => {
          let bookingDate;
          if (booking.updateDate && booking.createDate && booking.updateDate !== booking.createDate) {
            bookingDate = convertToVietnamTime(booking.updateDate);
          } else {
            bookingDate = convertToVietnamTime(booking.createDate || booking.pickupTime);
          }
          
          if (bookingDate) {
            // Convert booking date to UTC for comparison
            const bookingUTC = new Date(bookingDate.getTime());
            const isInRange = bookingUTC >= weekStart && bookingUTC <= weekEnd;
            if (isInRange) {
              // console.log(`Booking found in week ${i}:`, booking, 'Date:', bookingDate.toISOString());
            }
            return isInRange;
          }
          return false;
        });

        const statusCounts = {
          pending: 0,
          confirmed: 0,
          completed: 0,
          cancelled: 0,
        };

        weekBookings.forEach(booking => {
          const status = booking.status?.toLowerCase() || 'unknown';
          if (statusCounts.hasOwnProperty(status)) {
            statusCounts[status]++;
          }
        });
        
        const weekLabel = `W${7 - i}`;
        
        breakdown.push({
          day: weekLabel,
          date: `${weekStart.toLocaleDateString('en-GB')} - ${weekEnd.toLocaleDateString('en-GB')}`,
          rawDate: weekStart.toISOString().split('T')[0],
          ...statusCounts,
        });
        
      }
      break;
    }
    
    case '7months': {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

        const monthBookings = ownerBookings.filter(booking => {
          let bookingDate;
          if (booking.updateDate && booking.createDate && booking.updateDate !== booking.createDate) {
            bookingDate = convertToVietnamTime(booking.updateDate);
          } else {
            bookingDate = convertToVietnamTime(booking.createDate || booking.pickupTime);
          }
          
          return bookingDate && bookingDate >= monthStart && bookingDate <= monthEnd;
        });

        const statusCounts = {
          pending: 0,
          confirmed: 0,
          completed: 0,
          cancelled: 0,
        };

        monthBookings.forEach(booking => {
          const status = booking.status?.toLowerCase() || 'unknown';
          if (statusCounts.hasOwnProperty(status)) {
            statusCounts[status]++;
          }
        });

        const monthName = months[date.getMonth()];
        
        breakdown.push({
          day: monthName,
          date: `${monthName} ${date.getFullYear()}`,
          rawDate: date.toISOString().split('T')[0],
          ...statusCounts,
        });
      }
      break;
    }
    
    default:
      return [];
  }

  return breakdown;
};

export const useDashboardBookingData = (ownerCars = [], period = '7days') => {
  const [bookingData, setBookingData] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(true);

  const fetchBookingData = async () => {
    try {
      setBookingLoading(true);

      // Fetch all bookings and filter by owner's cars
      const bookingsResponse = await axiosInstance.get(BOOKING_ENDPOINTS.GET_ALL_BOOKINGS);
      const allBookings = bookingsResponse.data || [];

      // Filter bookings for owner's cars
      const ownerCarIds = ownerCars.map(car => car.id);
      const ownerBookings = ownerCarIds.length > 0 
        ? allBookings.filter(booking => ownerCarIds.includes(booking.carId))
        : [];

      // Generate booking data based on selected period
      const weeklyBookingData = generateBookingBreakdownData(ownerBookings, period);
      // console.log("weeklyBookingData", weeklyBookingData);

      setBookingData(weeklyBookingData);
    } catch (error) {
      console.error('Error fetching booking data:', error);
      setBookingData([]);
    } finally {
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch booking data when owner cars are available
    if (ownerCars.length > 0) {
      fetchBookingData();
    }
  }, [ownerCars, period]);

  return { 
    bookingData, 
    bookingLoading, 
    refetchBookingData: fetchBookingData 
  };
};