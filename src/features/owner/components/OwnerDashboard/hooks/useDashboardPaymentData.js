import { useState, useEffect } from 'react';
import { getAllInvoices } from '../../../api/ownerApi';
import { getUserIdFromToken } from '../../../../user/api';
import { convertToVietnamTime } from '../../../../../shared/utils/CheckUTC';

// Helper function to get filtered invoices based on period
const getFilteredInvoices = (invoices, period) => {
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

  const completedInvoices = invoices.filter(invoice => {
    const isCompleted = invoice.status === "Completed";
    const vietnamDate = convertToVietnamTime(invoice.createDate);
    const isWithinPeriod = vietnamDate >= startDate;
    return isCompleted && isWithinPeriod;
  });

  return { startDate, completedInvoices };
};

// Helper function to generate breakdown data based on period
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
        
        const dayInvoices = completedInvoices.filter(invoice => {
          const vietnamDate = convertToVietnamTime(invoice.createDate);
          vietnamDate.setUTCHours(0, 0, 0, 0);
          return vietnamDate.getTime() === vietnamNow.getTime();
        });
        
        const dayTotal = dayInvoices.reduce((sum, invoice) => sum + (invoice.grandTotal || 0), 0);
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
        
        const monthInvoices = completedInvoices.filter(invoice => {
          const vietnamDate = convertToVietnamTime(invoice.createDate);
          return vietnamDate >= monthStart && vietnamDate <= monthEnd;
        });
        
        const monthTotal = monthInvoices.reduce((sum, invoice) => sum + (invoice.grandTotal || 0), 0);
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
        
        const yearInvoices = completedInvoices.filter(invoice => {
          const vietnamDate = convertToVietnamTime(invoice.createDate);
          return vietnamDate >= yearStart && vietnamDate <= yearEnd;
        });
        
        const yearTotal = yearInvoices.reduce((sum, invoice) => sum + (invoice.grandTotal || 0), 0);
        
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

      // Fetch invoices data
      const allInvoices = await getAllInvoices();
      const invoices = allInvoices.filter(invoice => invoice.vendorId === currentUserId);

      // Filter completed invoices based on selected period
      const { startDate, completedInvoices } = getFilteredInvoices(invoices, period);

      const totalReceived = completedInvoices.reduce((sum, invoice) => sum + (invoice.grandTotal || 0), 0);
      console.log("totalReceived", totalReceived);
      
      // Generate breakdown data based on period
      const breakdown = generateBreakdownData(completedInvoices, period);
      console.log("breakdown", breakdown);
      
      setChartData(breakdown);

      // Temporarily commented out - only counting completed invoices for now
      // const pendingPayments = invoices.filter(invoice => 
      //   invoice.status === "Pending"
      // ).reduce((sum, invoice) => sum + (invoice.grandTotal || 0), 0);

      // const bookingFeeTotal = completedInvoices.filter(invoice =>
      //   invoice.item?.toLowerCase().includes('booking')
      // ).reduce((sum, invoice) => sum + (invoice.grandTotal || 0), 0);

      // const rentalFeeTotal = completedInvoices.filter(invoice =>
      //   !invoice.item?.toLowerCase().includes('booking')
      // ).reduce((sum, invoice) => sum + (invoice.grandTotal || 0), 0);

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