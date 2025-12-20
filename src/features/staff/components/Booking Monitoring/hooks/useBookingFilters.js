import { useState, useMemo } from 'react';
import { sortBookingsByCreateDate, sortBookingsByStartDate, sortBookingsByStatus } from '../utils/bookingUtils';

export const useBookingFilters = (bookingActivities) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createDate'); // 'createDate', 'startDate', 'status'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc', 'desc'

  const filteredBookings = useMemo(() => {
    // First, filter the bookings
    const filtered = (bookingActivities || []).filter(booking => {
      const searchLower = searchTerm.toLowerCase();
      
      // Enhanced search functionality for booking numbers
      const bookingNumber = booking.bookingNumber || booking.bookingId || '';
      const customer = booking.customer || '';
      const car = booking.car || '';
      
      // Create searchable strings
      const searchableBookingNumber = bookingNumber.toLowerCase();
      const searchableCustomer = customer.toLowerCase();
      const searchableCar = car.toLowerCase();
      
      // Enhanced booking number search - handle different formats
      const matchesBookingNumber = searchableBookingNumber.includes(searchLower) ||
        // Remove dashes and search (e.g., "BK29181220205" matches "BK29-18-12-2025")
        searchableBookingNumber.replace(/-/g, '').includes(searchLower.replace(/-/g, '')) ||
        // Search without prefix (e.g., "29-18-12-2025" matches "BK29-18-12-2025")
        searchableBookingNumber.replace(/^bk/i, '').includes(searchLower.replace(/^bk/i, '')) ||
        // Search just the number part without dashes
        searchableBookingNumber.replace(/^bk/i, '').replace(/-/g, '').includes(searchLower.replace(/^bk/i, '').replace(/-/g, ''));
      
      const matchesCustomer = searchableCustomer.includes(searchLower);
      const matchesCar = searchableCar.includes(searchLower);
      
      const matchesSearch = matchesBookingNumber || matchesCustomer || matchesCar;
      
      // Normalize status comparison for case-insensitive matching
      const normalizedBookingStatus = booking.status?.toLowerCase();
      const normalizedStatusFilter = statusFilter?.toLowerCase();
      const matchesStatus = statusFilter === 'all' || normalizedBookingStatus === normalizedStatusFilter;
      
      // Normalize payment status comparison for case-insensitive matching
      const normalizedPaymentStatus = booking.paymentStatus?.toLowerCase();
      const normalizedPaymentFilter = paymentStatusFilter?.toLowerCase();
      const matchesPaymentStatus = paymentStatusFilter === 'all' || normalizedPaymentStatus === normalizedPaymentFilter;
      
      return matchesSearch && matchesStatus && matchesPaymentStatus;
    });

    // Then, sort the filtered results
    let sorted = [...filtered];
    const isDescending = sortOrder === 'desc';

    switch (sortBy) {
      case 'createDate':
        sorted = sortBookingsByCreateDate(sorted, isDescending);
        break;
      case 'startDate':
        sorted = sortBookingsByStartDate(sorted, isDescending);
        break;
      case 'status':
        sorted = sortBookingsByStatus(sorted);
        break;
      default:
        // Default to createDate sorting
        sorted = sortBookingsByCreateDate(sorted, isDescending);
    }

    return sorted;
  }, [bookingActivities, searchTerm, statusFilter, paymentStatusFilter, sortBy, sortOrder]);

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    dateFilter,
    setDateFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filteredBookings
  };
};