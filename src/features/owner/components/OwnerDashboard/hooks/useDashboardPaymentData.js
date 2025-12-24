import { useState, useEffect } from 'react';
import { axiosInstance } from '../../../../../shared/utils/axiosInstance';
import { PAYMENT_ENDPOINTS } from '../../../../../config/api';
import { getUserIdFromToken } from '../../../../user/api';
import { convertToVietnamTime } from '../../../../../shared/utils/CheckUTC';

// Helper function to get filtered payments based on period and status
const getFilteredInvoices = (payments, period) => {
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
  const completedInvoices = payments.filter(invoice => {
    // Check if payment status is "Success" or "Paid" (case insensitive)
    const status = invoice.status?.toLowerCase();
    const isCompleted = status === 'success' || status === 'paid';
    
    if (!isCompleted) return false;

    // Check if payment is within the time period
    const invoiceDate = convertToVietnamTime(invoice.createDate || invoice.createdDate);
    const isWithinPeriod = invoiceDate >= startDate;
    
    return isWithinPeriod;
  });

  return { startDate, completedInvoices };
};

// Helper function to generate breakdown data based on period using completed payments
const generateBreakdownData = (completedInvoices, period) => {
  const today = new Date();
  const breakdown = [];

  switch (period) {
    case '7days': {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        const vietnamNow = new Date(date.getTime() + (7 * 60 * 60 * 1000));
        vietnamNow.setUTCDate(vietnamNow.getUTCDate() - i);
        vietnamNow.setUTCHours(0, 0, 0, 0);
        
        const dayInvoices = completedInvoices.filter(payment => {
          const vietnamDate = convertToVietnamTime(payment.createDate || payment.createdDate);
          vietnamDate.setUTCHours(0, 0, 0, 0);
          return vietnamDate.getTime() === vietnamNow.getTime();
        });
        
        const dayTotal = dayInvoices.reduce((sum, payment) => sum + (payment.paidAmount || 0), 0);
        const dayName = days[vietnamNow.getUTCDay() === 0 ? 6 : vietnamNow.getUTCDay() - 1];
        
        breakdown.push({
          name: dayName,
          date: vietnamNow.toLocaleDateString('en-GB'),
          amount: dayTotal,
          rawDate: vietnamNow.toISOString().split('T')[0]
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
        
        const monthInvoices = completedInvoices.filter(payment => {
          const vietnamDate = convertToVietnamTime(payment.createDate || payment.createdDate);
          return vietnamDate >= monthStart && vietnamDate <= monthEnd;
        });
        
        const monthTotal = monthInvoices.reduce((sum, payment) => sum + (payment.paidAmount || 0), 0);
        const monthName = months[date.getMonth()];
        
        breakdown.push({
          name: monthName,
          date: `${monthName} ${date.getFullYear()}`,
          amount: monthTotal,
          rawDate: date.toISOString().split('T')[0]
        });
      }
      break;
    }
    
    case '7years': {
      for (let i = 6; i >= 0; i--) {
        const year = today.getFullYear() - i;
        const yearStart = new Date(year, 0, 1);
        const yearEnd = new Date(year, 11, 31, 23, 59, 59);
        
        const yearInvoices = completedInvoices.filter(payment => {
          const vietnamDate = convertToVietnamTime(payment.createDate || payment.createdDate);
          return vietnamDate >= yearStart && vietnamDate <= yearEnd;
        });
        
        const yearTotal = yearInvoices.reduce((sum, payment) => sum + (payment.paidAmount || 0), 0);
        
        breakdown.push({
          name: year.toString(),
          date: year.toString(),
          amount: yearTotal,
          rawDate: `${year}-01-01`
        });
      }
      break;
    }
    
    default:
      return [];
  }

  return breakdown;
};

export const useDashboardPaymentData = (period = '7days') => {
  const [paymentStats, setPaymentStats] = useState({
    totalReceived: 0,
    pendingPayments: 0,
    bookingFeeTotal: 0,
    rentalFeeTotal: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(true);

  const fetchPaymentData = async () => {
    try {
      setPaymentLoading(true);
      const currentUserId = getUserIdFromToken();

      if (!currentUserId) {
        console.error('User not authenticated');
        return;
      }

      // Fetch payments for the current vendor only
      const response = await axiosInstance.get(PAYMENT_ENDPOINTS.GET_PAYMENT_BY_VENDOR_ID(currentUserId));
      const vendorPayments = response.data;
      
      // Filter payments with "Success" or "Paid" status and within the time period
      const { completedInvoices } = getFilteredInvoices(vendorPayments, period);

      console.log("completedInvoices", completedInvoices);
      
      // Calculate total received from completed payments using paidAmount
      const totalReceived = completedInvoices.reduce((sum, invoice) => sum + (invoice.paidAmount || 0), 0);
      
      // Generate breakdown data based on period using completed payments
      const breakdown = generateBreakdownData(completedInvoices, period);
      
      setChartData(breakdown);

      setPaymentStats({
        totalReceived,
        pendingPayments: 0, // Temporarily set to 0
        bookingFeeTotal: 0, // Temporarily set to 0
        rentalFeeTotal: 0,  // Temporarily set to 0
      });
    } catch (error) {
      console.error('Error fetching payment data:', error);
    } finally {
      setPaymentLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentData();
  }, [period]);

  return { paymentStats, chartData, paymentLoading, refetchPaymentData: fetchPaymentData };
};