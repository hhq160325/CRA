import { useState, useMemo } from 'react';

export const useBookingFilters = (bookingActivities) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredBookings = useMemo(() => {
    return (bookingActivities || []).filter(booking => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        (booking.bookingId || '').toLowerCase().includes(searchLower) ||
        (booking.customer || '').toLowerCase().includes(searchLower) ||
        (booking.car || '').toLowerCase().includes(searchLower);
      
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      const matchesPaymentStatus = paymentStatusFilter === 'all' || booking.paymentStatus === paymentStatusFilter;
      
      return matchesSearch && matchesStatus && matchesPaymentStatus;
    });
  }, [bookingActivities, searchTerm, statusFilter, paymentStatusFilter]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    dateFilter,
    setDateFilter,
    filteredBookings
  };
};