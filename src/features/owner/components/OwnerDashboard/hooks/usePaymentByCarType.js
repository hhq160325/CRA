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

          // Calculate total revenue for this car type (all-time)
          const carTypeTotalRevenue = allCompletedPayments.reduce((sum, payment) => sum + (payment.paidAmount || 0), 0);

          // Calculate revenue for this car type within the period
          const carTypePeriodRevenue = completedPayments.reduce((sum, payment) => sum + (payment.paidAmount || 0), 0);

          console.log(`${carType} - Period Revenue: ${carTypePeriodRevenue}, Total Revenue: ${carTypeTotalRevenue}`);

          if (carTypePeriodRevenue > 0 || carTypeTotalRevenue > 0) {
            carTypeRevenueMap.set(carType, {
              carType: carType,
              revenue: carTypePeriodRevenue,
              totalRevenue: carTypeTotalRevenue,
              paymentCount: completedPayments.length,
              totalPaymentCount: allCompletedPayments.length
            });
          }
        } catch (error) {
          console.error(`Error fetching payments for car type ${carType}:`, error);
        }
      }

      console.log('Car type revenue map:', carTypeRevenueMap);

      // Convert map to array and sort by revenue
      const carTypeRevenueArray = Array.from(carTypeRevenueMap.values())
        .sort((a, b) => b.revenue - a.revenue);

      console.log('Final car type revenue array:', carTypeRevenueArray);

      // Calculate total revenue from ALL completed payments (all-time stats)
      const total = carTypeRevenueArray.reduce((sum, carType) => sum + carType.totalRevenue, 0);
      console.log('Total revenue:', total);

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
