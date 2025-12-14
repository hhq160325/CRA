import { useState, useEffect } from 'react';
import { fetchRentalHistoryData, fetchOwnerPaymentsData } from '../../../api/ownerApi';
import { getUserIdFromToken } from '../../../../user/api';

export const useDashboardPaymentData = () => {
  const [paymentStats, setPaymentStats] = useState({
    totalReceived: 0,
    pendingPayments: 0,
    bookingFeeTotal: 0,
    rentalFeeTotal: 0,
  });
  const [paymentLoading, setPaymentLoading] = useState(true);

  const fetchPaymentData = async () => {
    try {
      setPaymentLoading(true);
      const currentUserId = getUserIdFromToken();

      // Fetch rental history data to get invoices
      const { invoices: allInvoices } = await fetchRentalHistoryData();
      const invoices = allInvoices.filter(invoice => invoice.vendorId === currentUserId);

      // Fetch payment data for payment statistics
      const { payments: allPayments } = await fetchOwnerPaymentsData();

      // Filter payments for current vendor's invoices
      const vendorInvoiceIds = invoices.map(invoice => invoice.id);
      const vendorPayments = allPayments.filter(payment => vendorInvoiceIds.includes(payment.invoiceId));

      // Calculate payment statistics
      const totalReceived = vendorPayments.filter(p =>
        p.status?.toLowerCase() === 'paid' ||
        p.status?.toLowerCase() === 'completed' ||
        p.status?.toLowerCase() === 'success'
      ).reduce((sum, p) => sum + (p.paidAmount || 0), 0);

      const pendingPayments = vendorPayments.filter(p =>
        p.status?.toLowerCase() === 'pending'
      ).reduce((sum, p) => sum + (p.paidAmount || 0), 0);

      const bookingFeeTotal = vendorPayments.filter(p =>
        p.item?.toLowerCase().includes('booking') &&
        (p.status?.toLowerCase() === 'paid' ||
          p.status?.toLowerCase() === 'completed' ||
          p.status?.toLowerCase() === 'success')
      ).reduce((sum, p) => sum + (p.paidAmount || 0), 0);

      const rentalFeeTotal = vendorPayments.filter(p =>
        !p.item?.toLowerCase().includes('booking') &&
        (p.status?.toLowerCase() === 'paid' ||
          p.status?.toLowerCase() === 'completed' ||
          p.status?.toLowerCase() === 'success')
      ).reduce((sum, p) => sum + (p.paidAmount || 0), 0);

      setPaymentStats({
        totalReceived,
        pendingPayments,
        bookingFeeTotal,
        rentalFeeTotal,
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

  return { paymentStats, paymentLoading, refetchPaymentData: fetchPaymentData };
};