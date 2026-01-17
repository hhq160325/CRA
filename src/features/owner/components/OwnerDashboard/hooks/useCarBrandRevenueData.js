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
    // Check if payment status is "Success" or "Paid" (case insensitive)
    const status = payment.status?.toLowerCase();
    const isCompleted = status === 'success' || status === 'paid';
    
    if (!isCompleted) return false;

    // Check if payment is within the time period
    const paymentDate = convertToVietnamTime(payment.createDate || payment.createdDate);
    const isWithinPeriod = paymentDate >= startDate;
    
    return isWithinPeriod;
  });

  return { startDate, completedPayments };
};

export const useCarBrandRevenueData = (period = '7days') => {
  const [brandRevenueData, setBrandRevenueData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCarBrandRevenue = async () => {
    try {
      setLoading(true);
      const currentUserId = getUserIdFromToken();

      if (!currentUserId) {
        // console.error('User not authenticated');
        return;
      }

      // Step 1: Fetch all cars
      const carsResponse = await axiosInstance.get(CAR_ENDPOINTS.GET_ALL_CARS);
      const allCars = carsResponse.data;
      // console.log('All cars:', allCars);
      // console.log('Current user ID:', currentUserId);

      // Use all cars instead of filtering by owner
      const userCars = allCars;
      // console.log('User cars:', userCars);

      // Step 2: Fetch payments for each car and aggregate by manufacturer
      const manufacturerRevenueMap = new Map();

      for (const car of userCars) {
        try {
          // console.log(`Fetching payments for car ${car.id}...`);
          const paymentsResponse = await axiosInstance.get(PAYMENT_ENDPOINTS.GET_PAYMENT_BY_CAR_ID(car.id));
          const carPayments = paymentsResponse.data;
          // console.log(`Car ${car.id} payments:`, carPayments);

          // Get all completed payments for all-time stats
          const allCompletedPayments = carPayments.filter(payment => {
            const status = payment.status?.toLowerCase();
            return status === 'success' || status === 'paid';
          });
          // console.log(`Car ${car.id} completed payments:`, allCompletedPayments);

          // Filter payments with "Success" or "Paid" status and within the time period
          const { completedPayments } = getFilteredPayments(carPayments, period);

          // Calculate total revenue for this car (all-time)
          const carTotalRevenue = allCompletedPayments.reduce((sum, payment) => sum + (payment.paidAmount || 0), 0);

          // Calculate revenue for this car within the period
          const carPeriodRevenue = completedPayments.reduce((sum, payment) => sum + (payment.paidAmount || 0), 0);

          const manufacturer = car.manufacturer;
          const model = car.model;

          // Aggregate revenue by manufacturer
          if (manufacturerRevenueMap.has(manufacturer)) {
            const existing = manufacturerRevenueMap.get(manufacturer);
            
            // Check if this model already exists
            const existingModel = existing.models.find(m => m.name === model);
            if (existingModel) {
              existingModel.revenue += carPeriodRevenue;
              existingModel.totalRevenue += carTotalRevenue;
              existingModel.carCount += 1;
            } else {
              existing.models.push({
                name: model,
                revenue: carPeriodRevenue,
                totalRevenue: carTotalRevenue,
                carCount: 1
              });
            }
            
            existing.revenue += carPeriodRevenue;
            existing.totalRevenue += carTotalRevenue;
            existing.carCount += 1;
            existing.payments = [...existing.payments, ...completedPayments];
          } else {
            manufacturerRevenueMap.set(manufacturer, {
              manufacturer,
              revenue: carPeriodRevenue,
              totalRevenue: carTotalRevenue,
              carCount: 1,
              models: [{
                name: model,
                revenue: carPeriodRevenue,
                totalRevenue: carTotalRevenue,
                carCount: 1
              }],
              payments: completedPayments
            });
          }
        } catch (error) {
          // console.error(`Error fetching payments for car ${car.id}:`, error);
        }
      }

      // Convert map to array and sort by revenue
      const brandRevenueArray = Array.from(manufacturerRevenueMap.values())
        .map(manufacturer => ({
          ...manufacturer,
          models: manufacturer.models.sort((a, b) => b.revenue - a.revenue)
        }))
        .sort((a, b) => b.revenue - a.revenue);
      // console.log('Brand revenue array:', brandRevenueArray);

      // Calculate total revenue from ALL completed payments (all-time stats)
      const total = brandRevenueArray.reduce((sum, brand) => sum + brand.totalRevenue, 0);
      // console.log('Total revenue:', total);

      setBrandRevenueData(brandRevenueArray);
      setTotalRevenue(total);
    } catch (error) {
      // console.error('Error fetching car brand revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarBrandRevenue();
  }, [period]);

  return { brandRevenueData, totalRevenue, loading, refetch: fetchCarBrandRevenue };
};
