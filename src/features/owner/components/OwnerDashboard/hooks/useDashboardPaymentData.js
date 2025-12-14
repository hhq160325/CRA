import { useState, useEffect } from 'react';
import { getAllInvoices } from '../../../api/ownerApi';
import { getUserIdFromToken } from '../../../../user/api';

export const useDashboardPaymentData = () => {
  const [paymentStats, setPaymentStats] = useState({
    totalReceived: 0,
    pendingPayments: 0,
    bookingFeeTotal: 0,
    rentalFeeTotal: 0,
  });
  const [dailyData, setDailyData] = useState([]);
  const [paymentLoading, setPaymentLoading] = useState(true);

  const fetchPaymentData = async () => {
    try {
      setPaymentLoading(true);
      const currentUserId = getUserIdFromToken();

      // Fetch invoices data
      const allInvoices = await getAllInvoices();
      const invoices = allInvoices.filter(invoice => invoice.vendorId === currentUserId);

      // Calculate payment statistics - Update: we only count invoices with "status": "Completed" 
      // Show totalReceived in last 7 days with "createDate"
      // Temporarily commented pendingPayments, bookingFeeTotal and rentalFeeTotal
      
      // Get date 7 days ago
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      // Filter invoices to only include "Completed" status and created in last 7 days
      const completedInvoices = invoices.filter(invoice => {
        const isCompleted = invoice.status === "Completed";
        const invoiceDate = new Date(invoice.createDate);
        const isWithinLast7Days = invoiceDate >= sevenDaysAgo;
        return isCompleted && isWithinLast7Days;
      });

      const totalReceived = completedInvoices.reduce((sum, invoice) => sum + (invoice.grandTotal || 0), 0);

      // Generate daily breakdown for last 7 days
      const dailyBreakdown = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        date.setHours(0, 0, 0, 0);
        
        const nextDate = new Date(date);
        nextDate.setDate(date.getDate() + 1);
        
        const dayInvoices = completedInvoices.filter(invoice => {
          const invoiceDate = new Date(invoice.createDate);
          return invoiceDate >= date && invoiceDate < nextDate;
        });
        
        const dayTotal = dayInvoices.reduce((sum, invoice) => sum + (invoice.grandTotal || 0), 0);
        
        dailyBreakdown.push({
          date: date.toISOString(),
          amount: dayTotal
        });
      }

      setDailyData(dailyBreakdown);

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
  }, []);

  return { paymentStats, dailyData, paymentLoading, refetchPaymentData: fetchPaymentData };
};