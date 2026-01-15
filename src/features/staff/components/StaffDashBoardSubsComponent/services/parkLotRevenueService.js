import axios from 'axios';
import { PARKLOT_ENDPOINTS, PARKLOT_API_CONFIG } from '../../../../../config/api';

export const parkLotRevenueService = {
  // Get all park lots
  getAllParkLots: async () => {
    try {
      const response = await axios.get(PARKLOT_ENDPOINTS.GET_ALL, PARKLOT_API_CONFIG);
      return response.data;
    } catch (error) {
      console.error('Error fetching park lots:', error);
      throw error;
    }
  },

  // Get payments for a specific park lot
  getParkLotPayments: async (parkLotId) => {
    try {
      const response = await axios.get(
        PARKLOT_ENDPOINTS.GET_PAYMENT_BY_PARKING_ID(parkLotId), 
        PARKLOT_API_CONFIG
      );
      
      // Handle case where API returns "No payments found" message
      if (typeof response.data === 'string' && 
          response.data.includes('No payments found for the specified parking ID')) {
        // console.log(`No payments found for park lot ${parkLotId}`);
        return []; // Return empty array instead of error message
      }
      
      // Ensure we return an array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error(`Error fetching payments for park lot ${parkLotId}:`, error);
      // Return empty array instead of throwing error to prevent breaking the entire revenue calculation
      return [];
    }
  },

  // Process revenue data for a specific park lot
  getParkLotRevenue: async (parkLotId, period) => {
    try {
      const payments = await parkLotRevenueService.getParkLotPayments(parkLotId);
      
      // console.log(`Processing revenue for park lot ${parkLotId}:`, {
      //   paymentsFound: payments.length,
      //   period
      // });
      
      return parkLotRevenueService.processRevenueData(payments, period);
    } catch (error) {
      console.error('Error processing park lot revenue:', error);
      // Return empty revenue data instead of throwing error
      return {
        totalRevenue: 0,
        chartData: parkLotRevenueService.generateEmptyChartData(period)
      };
    }
  },

  // Process revenue data for all park lots
  getAllParkLotsRevenue: async (period) => {
    try {
      const parkLots = await parkLotRevenueService.getAllParkLots();
      let allPayments = [];
      let parkLotsWithData = 0;
      let parkLotsWithoutData = 0;

      // console.log(`Processing revenue for ${parkLots.length} park lots`);

      // Fetch payments for all park lots
      for (const parkLot of parkLots) {
        try {
          const payments = await parkLotRevenueService.getParkLotPayments(parkLot.id);
          if (payments.length > 0) {
            allPayments = [...allPayments, ...payments];
            parkLotsWithData++;
          } else {
            parkLotsWithoutData++;
          }
        } catch (error) {
          console.warn(`Failed to fetch payments for park lot ${parkLot.id}:`, error);
          parkLotsWithoutData++;
          // Continue with other park lots even if one fails
        }
      }

      // console.log(`Park lots summary:`, {
      //   total: parkLots.length,
      //   withData: parkLotsWithData,
      //   withoutData: parkLotsWithoutData,
      //   totalPayments: allPayments.length
      // });

      return parkLotRevenueService.processRevenueData(allPayments, period);
    } catch (error) {
      console.error('Error processing all park lots revenue:', error);
      throw error;
    }
  },

  // Process raw payment data into chart format
  processRevenueData: (payments, period) => {
    if (!payments || payments.length === 0) {
      return {
        totalRevenue: 0,
        chartData: parkLotRevenueService.generateEmptyChartData(period)
      };
    }

    // Filter only successful payments (status: "Paid" or "Success")
    const successfulPayments = payments.filter(payment => {
      const status = payment.status?.toLowerCase();
      return status === 'paid' || status === 'success';
    });

    // console.log('Payment Filtering:', {
    //   totalPayments: payments.length,
    //   successfulPayments: successfulPayments.length,
    //   filteredOut: payments.length - successfulPayments.length,
    //   period
    // });

    // Calculate total revenue from successful payments only
    const totalRevenue = successfulPayments.reduce((sum, payment) => {
      return sum + (payment.paidAmount || payment.amount || 0);
    }, 0);

    // Generate chart data based on period
    const chartData = parkLotRevenueService.generateChartData(successfulPayments, period);

    return {
      totalRevenue,
      chartData
    };
  },

  // Generate chart data based on period
  generateChartData: (payments, period) => {
    let chartData = [];

    switch (period) {
      case '7days':
        chartData = parkLotRevenueService.generateDailyData(payments, 7);
        break;
      case '7months':
        chartData = parkLotRevenueService.generateMonthlyData(payments, 7);
        break;
      case '7years':
        chartData = parkLotRevenueService.generateYearlyData(payments, 7);
        break;
      default:
        chartData = parkLotRevenueService.generateDailyData(payments, 7);
    }

    return chartData;
  },

  // Generate daily data for the last N days
  generateDailyData: (payments, days) => {
    const data = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayPayments = payments.filter(payment => {
        // Use createDate from API response, fallback to createdDate or date
        const paymentDateValue = payment.createDate || payment.createdDate || payment.date;
        if (!paymentDateValue) return false;
        
        const paymentDate = new Date(paymentDateValue);
        if (isNaN(paymentDate.getTime())) return false; // Check if date is valid
        
        return paymentDate.toISOString().split('T')[0] === dateStr;
      });

      const amount = dayPayments.reduce((sum, payment) => sum + (payment.paidAmount || payment.amount || 0), 0);

      data.push({
        name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        date: date.toLocaleDateString('vi-VN'),
        amount
      });
    }

    return data;
  },

  // Generate monthly data for the last N months
  generateMonthlyData: (payments, months) => {
    const data = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = date.getMonth();
      
      const monthPayments = payments.filter(payment => {
        // Use createDate from API response, fallback to createdDate or date
        const paymentDateValue = payment.createDate || payment.createdDate || payment.date;
        if (!paymentDateValue) return false;
        
        const paymentDate = new Date(paymentDateValue);
        if (isNaN(paymentDate.getTime())) return false; // Check if date is valid
        
        return paymentDate.getFullYear() === year && paymentDate.getMonth() === month;
      });

      const amount = monthPayments.reduce((sum, payment) => sum + (payment.paidAmount || payment.amount || 0), 0);

      data.push({
        name: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
        date: date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }),
        amount
      });
    }

    return data;
  },

  // Generate yearly data for the last N years
  generateYearlyData: (payments, years) => {
    const data = [];
    const now = new Date();

    for (let i = years - 1; i >= 0; i--) {
      const year = now.getFullYear() - i;
      
      const yearPayments = payments.filter(payment => {
        // Use createDate from API response, fallback to createdDate or date
        const paymentDateValue = payment.createDate || payment.createdDate || payment.date;
        if (!paymentDateValue) return false;
        
        const paymentDate = new Date(paymentDateValue);
        if (isNaN(paymentDate.getTime())) return false; // Check if date is valid
        
        return paymentDate.getFullYear() === year;
      });

      const amount = yearPayments.reduce((sum, payment) => sum + (payment.paidAmount || payment.amount || 0), 0);

      data.push({
        name: year.toString(),
        date: year.toString(),
        amount
      });
    }

    return data;
  },

  // Generate empty chart data when no payments exist
  generateEmptyChartData: (period) => {
    switch (period) {
      case '7days':
        return parkLotRevenueService.generateDailyData([], 7);
      case '7months':
        return parkLotRevenueService.generateMonthlyData([], 7);
      case '7years':
        return parkLotRevenueService.generateYearlyData([], 7);
      default:
        return parkLotRevenueService.generateDailyData([], 7);
    }
  }
};