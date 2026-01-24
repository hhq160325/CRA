import { useState, useEffect } from 'react';
import { axiosInstance } from '../../../../../shared/utils/axiosInstance';
import { CAR_ENDPOINTS, PAYMENT_ENDPOINTS } from '../../../../../config/api';
import { getUserIdFromToken } from '../../../../user/api';
import { convertToVietnamTime } from '../../../../../shared/utils/CheckUTC';

// Helper function to get filtered payments based on period and status
const getFilteredPayments = (payments, period) => {
  const today = new Date();
  let startDate;

  switch (period) {
    case '7days':
      startDate = new Date();
      startDate.setDate(today.getDate() - 7);
      break;
    case '7months':
      startDate = new Date();
      startDate.setMonth(today.getMonth() - 7);
      break;
    case '7years':
      startDate = new Date();
      startDate.setFullYear(today.getFullYear() - 7);
      break;
    default:
      startDate = new Date();
      startDate.setDate(today.getDate() - 7);
  }

  // Filter payments with "Success" or "Paid" status and within the time period
  const completedPayments = payments.filter(payment => {
    const status = payment.status?.toLowerCase();
    const isCompleted = status === 'success' || status === 'paid';
    
    if (!isCompleted) return false;

    const paymentDate = convertToVietnamTime(payment.createDate || payment.createdDate);
    const isWithinPeriod = paymentDate >= startDate;
    
    return isWithinPeriod;
  });

  return { startDate, completedPayments };
};

// Helper function to generate time-series data for a specific car type
const generateTimeSeriesData = (payments, period) => {
  const today = new Date();
  const timeSeriesMap = new Map();

  // Initialize time periods
  if (period === '7days') {
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      timeSeriesMap.set(dayName, { name: dayName, revenue: 0, paymentCount: 0 });
    }
  } else if (period === '7months') {
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setMonth(today.getMonth() - i);
      const monthName = date.toLocaleDateString('en-US', { month: 'short' });
      timeSeriesMap.set(monthName, { name: monthName, revenue: 0, paymentCount: 0 });
    }
  } else if (period === '7years') {
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setFullYear(today.getFullYear() - i);
      const year = date.getFullYear().toString();
      timeSeriesMap.set(year, { name: year, revenue: 0, paymentCount: 0 });
    }
  }

  // Aggregate payments into time periods
  payments.forEach(payment => {
    const paymentDate = convertToVietnamTime(payment.createDate || payment.createdDate);
    let key;

    if (period === '7days') {
      key = paymentDate.toLocaleDateString('en-US', { weekday: 'short' });
    } else if (period === '7months') {
      key = paymentDate.toLocaleDateString('en-US', { month: 'short' });
    } else if (period === '7years') {
      key = paymentDate.getFullYear().toString();
    }

    if (timeSeriesMap.has(key)) {
      const existing = timeSeriesMap.get(key);
      existing.revenue += payment.paidAmount || 0;
      existing.paymentCount += 1;
    }
  });

  return Array.from(timeSeriesMap.values());
};

export const usePaymentByCarType = (period = '7days') => {
  const [carTypePaymentData, setCarTypePaymentData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchPaymentByCarType = async () => {
    try {
      setLoading(true);
      const currentUserId = getUserIdFromToken();

      if (!currentUserId) {
        console.log('No user ID found');
        return;
      }

      console.log('Current User ID:', currentUserId);
      console.log('Selected Period:', period);

      // Step 1: Fetch all manufacturers
      const manufacturersResponse = await axiosInstance.get(CAR_ENDPOINTS.GET_ALL_MANUFACTURER);
      const manufacturers = manufacturersResponse.data;
      console.log('Fetched manufacturers:', manufacturers);

      // Step 2: Create a map of all unique car types first
      const carTypeSet = new Set();
      
      for (const manufacturer of manufacturers) {
        try {
          const modelsResponse = await axiosInstance.get(CAR_ENDPOINTS.GET_MODEL_BY_MANUFACTURERID(manufacturer.id));
          const models = modelsResponse.data;
          console.log(`Models for manufacturer ${manufacturer.name}:`, models);

          // Extract car types from models
          models.forEach(model => {
            if (model.carType) {
              carTypeSet.add(model.carType);
            }
          });
        } catch (error) {
          console.error(`Error fetching models for manufacturer ${manufacturer.id}:`, error);
        }
      }

      const uniqueCarTypes = Array.from(carTypeSet);
      console.log('Unique car types found:', uniqueCarTypes);

      // Step 3: Fetch payments for each unique car type
      const carTypeRevenueMap = new Map();

      for (const carType of uniqueCarTypes) {
        try {
          console.log(`Fetching payments for car type: ${carType}`);
          const paymentsResponse = await axiosInstance.get(
            PAYMENT_ENDPOINTS.GET_PAYMENT_BY_CAR_TYPE(currentUserId, carType)
          );
          const carTypePayments = paymentsResponse.data;
          console.log("paymentsResponse",carTypePayments);
          
          console.log(`Payments for ${carType}:`, carTypePayments);

          // Get all completed payments for all-time stats
          const allCompletedPayments = carTypePayments.filter(payment => {
            const status = payment.status?.toLowerCase();
            return status === 'success' || status === 'paid';
          });
          console.log(`Completed payments for ${carType}:`, allCompletedPayments);

          // Filter payments within the time period
          const { completedPayments } = getFilteredPayments(carTypePayments, period);
          console.log(`Period-filtered payments for ${carType}:`, completedPayments);

          // Generate time-series data for this car type
          const timeSeriesData = generateTimeSeriesData(completedPayments, period);
          console.log(`Time-series data for ${carType}:`, timeSeriesData);

          // Calculate total revenue for this car type (all-time)
          const carTypeTotalRevenue = allCompletedPayments.reduce((sum, payment) => sum + (payment.paidAmount || 0), 0);

          // Calculate revenue for this car type within the period
          const carTypePeriodRevenue = completedPayments.reduce((sum, payment) => sum + (payment.paidAmount || 0), 0);

          console.log(`${carType} - Period Revenue: ${carTypePeriodRevenue}, Total Revenue: ${carTypeTotalRevenue}`);

          // Include all car types, even those with no revenue
          carTypeRevenueMap.set(carType, {
            carType: carType,
            revenue: carTypePeriodRevenue,
            totalRevenue: carTypeTotalRevenue,
            paymentCount: completedPayments.length,
            totalPaymentCount: allCompletedPayments.length,
            timeSeriesData: timeSeriesData
          });
        } catch (error) {
          console.error(`Error fetching payments for car type ${carType}:`, error);
          
          // If 404 or any error, still include the car type with zero data
          if (error.response?.status === 404 || error.response?.status) {
            console.log(`No payment data found for ${carType} (404), adding with zero values`);
          }
          
          // Generate empty time-series data
          const emptyTimeSeriesData = generateTimeSeriesData([], period);
          
          // Add car type with zero values
          carTypeRevenueMap.set(carType, {
            carType: carType,
            revenue: 0,
            totalRevenue: 0,
            paymentCount: 0,
            totalPaymentCount: 0,
            timeSeriesData: emptyTimeSeriesData
          });
        }
      }

      console.log('Car type revenue map:', carTypeRevenueMap);

      // Convert map to array and sort by revenue
      const carTypeRevenueArray = Array.from(carTypeRevenueMap.values())
        .sort((a, b) => b.revenue - a.revenue);

      console.log('Final car type revenue array:', carTypeRevenueArray);

      // Calculate total revenue based on the selected period (not all-time)
      const total = carTypeRevenueArray.reduce((sum, carType) => sum + carType.revenue, 0);
      console.log('Total revenue for period:', total);

      setCarTypePaymentData(carTypeRevenueArray);
      setTotalRevenue(total);
    } catch (error) {
      console.error('Error fetching payment by car type data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentByCarType();
  }, [period]);

  return { carTypePaymentData, totalRevenue, loading, refetch: fetchPaymentByCarType };
};
