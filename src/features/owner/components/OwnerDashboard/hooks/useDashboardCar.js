import { useState, useEffect } from 'react';
import { axiosInstance } from '../../../../../shared/utils/axiosInstance';
import { BOOKING_ENDPOINTS } from '../../../../../config/api';

// Helper function to generate trending data based on period
const generateTrendingData = (ownerBookings, period) => {
  const today = new Date();
  const trending = [];
  
  // Get unique car models for the owner from bookings
  const uniqueModels = [...new Set(ownerBookings
    .filter(booking => booking.car && (booking.car.manufacturer || booking.car.brand))
    .map(booking => {
      const manufacturerName = booking.car.manufacturer || booking.car.brand;
      const modelName = booking.car.model || booking.car.name;
      return `${manufacturerName} ${modelName}`;
    })
  )];



  switch (period) {
    case '7days': {
      for (let i = 6; i >= 0; i--) {
        // Create date for the specific day
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() - i);
        targetDate.setHours(0, 0, 0, 0);

        const nextDate = new Date(targetDate);
        nextDate.setDate(nextDate.getDate() + 1);

        // Get successful bookings for this day
        const dayBookings = ownerBookings.filter(booking => {
          const createDate = new Date(booking.createDate);
          const status = booking.status?.toLowerCase();
          return createDate >= targetDate && createDate < nextDate && 
                 (status === 'confirmed' || status === 'completed');
        });

        // Count bookings per car model for this day
        const dayData = {
          date: targetDate.toISOString(),
          day: targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        };

        // Initialize all models with 0 bookings
        uniqueModels.forEach(model => {
          dayData[model] = 0;
        });

        // Count actual bookings per model
        dayBookings.forEach(booking => {
          if (booking.car && (booking.car.manufacturer || booking.car.brand)) {
            const manufacturerName = booking.car.manufacturer || booking.car.brand;
            const modelName = booking.car.model || booking.car.name;
            const modelKey = `${manufacturerName} ${modelName}`;
            if (dayData.hasOwnProperty(modelKey)) {
              dayData[modelKey]++;
            }
          }
        });

        trending.push(dayData);
        
      }
      break;
    }
    
    case '7weeks': {
      for (let i = 6; i >= 0; i--) {
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - (i * 7) - weekStart.getDay() + 1); // Monday of the week
        weekStart.setHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6); // Sunday of the week
        weekEnd.setHours(23, 59, 59, 999);

        // Get successful bookings for this week
        const weekBookings = ownerBookings.filter(booking => {
          const createDate = new Date(booking.createDate);
          const status = booking.status?.toLowerCase();
          return createDate >= weekStart && createDate <= weekEnd && 
                 (status === 'confirmed' || status === 'completed');
        });

        // Count bookings per car model for this week
        // Calculate week number more accurately
        const weekNumber = 7 - i;
        const weekLabel = `W${weekNumber}`;
        const weekData = {
          date: weekStart.toISOString(),
          weekEnd: weekEnd.toISOString(),
          day: weekLabel,
        };

        // Initialize all models with 0 bookings
        uniqueModels.forEach(model => {
          weekData[model] = 0;
        });

        // Count actual bookings per model
        weekBookings.forEach(booking => {
          if (booking.car && (booking.car.manufacturer || booking.car.brand)) {
            const manufacturerName = booking.car.manufacturer || booking.car.brand;
            const modelName = booking.car.model || booking.car.name;
            const modelKey = `${manufacturerName} ${modelName}`;
            if (weekData.hasOwnProperty(modelKey)) {
              weekData[modelKey]++;
            }
          }
        });

        trending.push(weekData);
      }
      break;
    }
    
    case '7months': {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

        // Get successful bookings for this month
        const monthBookings = ownerBookings.filter(booking => {
          const createDate = new Date(booking.createDate);
          const status = booking.status?.toLowerCase();
          return createDate >= monthStart && createDate <= monthEnd && 
                 (status === 'confirmed' || status === 'completed');
        });

        // Count bookings per car model for this month
        const monthName = months[date.getMonth()];
        const monthData = {
          date: date.toISOString(),
          day: monthName,
        };

        // Initialize all models with 0 bookings
        uniqueModels.forEach(model => {
          monthData[model] = 0;
        });

        // Count actual bookings per model
        monthBookings.forEach(booking => {
          if (booking.car && (booking.car.manufacturer || booking.car.brand)) {
            const manufacturerName = booking.car.manufacturer || booking.car.brand;
            const modelName = booking.car.model || booking.car.name;
            const modelKey = `${manufacturerName} ${modelName}`;
            if (monthData.hasOwnProperty(modelKey)) {
              monthData[modelKey]++;
            }
          }
        });

        trending.push(monthData);
      }
      break;
    }
    
    default:
      return [];
  }

  return trending;
};

export const useDashboardCar = (ownerCars = [], carLoading = false, period = '7days') => {
  const [loading, setLoading] = useState(true);
  const [trendingData, setTrendingData] = useState([]);
  const [topModels, setTopModels] = useState([]);
  const [topManufacturers, setTopManufacturers] = useState([]);

  const fetchTrendingData = async () => {
    try {
      setLoading(true);

      // Fetch all bookings data
      const bookingsResponse = await axiosInstance.get(BOOKING_ENDPOINTS.GET_ALL_BOOKINGS);
      const allBookings = bookingsResponse.data || [];

      // Filter bookings for owner's cars
      const ownerCarIds = ownerCars.map(car => car.id);
      let ownerBookings = ownerCarIds.length > 0 
        ? allBookings.filter(booking => ownerCarIds.includes(booking.carId))
        : [];

      // Populate car data if missing from booking response
      ownerBookings = ownerBookings.map(booking => {
        if (!booking.car) {
          const carData = ownerCars.find(car => car.id === booking.carId);
          return { ...booking, car: carData };
        }
        return booking;
      });



      // Filter only confirmed and completed bookings for popularity analysis
      const successfulBookings = ownerBookings.filter(booking => {
        const status = booking.status?.toLowerCase();
        return status === 'confirmed' || status === 'completed';
      });

      // Calculate model and manufacturer popularity from successful bookings
      const modelCounts = {};
      const manufacturerCounts = {};

      successfulBookings.forEach(booking => {
        if (booking.car && (booking.car.manufacturer || booking.car.brand)) {
          // Count models (manufacturer + model combination)
          const manufacturerName = booking.car.manufacturer || booking.car.brand;
          const modelName = booking.car.model || booking.car.name;
          const modelKey = `${manufacturerName} ${modelName}`;
          modelCounts[modelKey] = (modelCounts[modelKey] || 0) + 1;

          // Count manufacturers
          manufacturerCounts[manufacturerName] = (manufacturerCounts[manufacturerName] || 0) + 1;
        }
      });

      // Convert to sorted arrays for top models
      const topModelsList = Object.entries(modelCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Top 5 models

      // Convert to sorted arrays for top manufacturers
      const topManufacturersList = Object.entries(manufacturerCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5); // Top 5 manufacturers


      // Generate trending data based on selected period
      const trending = generateTrendingData(ownerBookings, period);

      setTrendingData(trending);
      setTopModels(topModelsList);
      setTopManufacturers(topManufacturersList);
    } catch (error) {
      console.error('Error fetching trending data:', error);
      setTrendingData([]);
      setTopModels([]);
      setTopManufacturers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch trending data when car data is available
    if (ownerCars.length > 0 || !carLoading) {
      fetchTrendingData();
    }
  }, [ownerCars, carLoading, period]);

  return {
    trendingData,
    topModels,
    topManufacturers,
    trendingLoading: loading,
    refetchTrendingData: fetchTrendingData,
  };
};