import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useRentalFilters = (rentalHistory) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [carFilter, setCarFilter] = useState('all');
  const [bookingFeeStatusFilter, setBookingFeeStatusFilter] = useState('all');
  const [rentalFeeStatusFilter, setRentalFeeStatusFilter] = useState('all');
  const [additionalFeeStatusFilter, setAdditionalFeeStatusFilter] = useState('all');
  const [extendBookingFeeStatusFilter, setExtendBookingFeeStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique car names for filter
  const uniqueCars = useMemo(() =>
    [...new Set(rentalHistory.map(rental => rental.carName))].sort(),
    [rentalHistory]
  );

  // Prepare dropdown options
  const carOptions = useMemo(() => [
    { id: 'all', value: 'all', label: t('rentalHistory.allCars') },
    ...uniqueCars.map(car => ({ id: car, value: car, label: car }))
  ], [uniqueCars, t]);
  
  const statusOptions = useMemo(() => [
    { id: 'all', value: 'all', label: t('rentalHistory.allStatuses') },
    { id: 'confirmed', value: 'confirmed', label: t('rentalHistory.confirmed') },
    { id: 'completed', value: 'completed', label: t('rentalHistory.completed') },
    { id: 'pending', value: 'pending', label: t('rentalHistory.pending') },
    { id: 'cancelled', value: 'cancelled', label: t('rentalHistory.cancelled') }
  ], [t]);

  const bookingFeeStatusOptions = useMemo(() => [
    { id: 'all', value: 'all', label: t('rentalHistory.allBookingFeeStatuses') },
    { id: 'paid', value: 'paid', label: t('rentalHistory.paid') },
    { id: 'pending', value: 'pending', label: t('rentalHistory.pending') },
    { id: 'cancelled', value: 'cancelled', label: t('rentalHistory.cancelled') }
  ], [t]);

  const rentalFeeStatusOptions = useMemo(() => [
    { id: 'all', value: 'all', label: t('rentalHistory.allRentalFeeStatuses') },
    { id: 'paid', value: 'paid', label: t('rentalHistory.paid') },
    { id: 'pending', value: 'pending', label: t('rentalHistory.pending') },
    { id: 'cancelled', value: 'cancelled', label: t('rentalHistory.cancelled') }
  ], [t]);

  const additionalFeeStatusOptions = useMemo(() => [
    { id: 'all', value: 'all', label: t('rentalHistory.allAdditionalFeeStatuses') },
    { id: 'paid', value: 'paid', label: t('rentalHistory.paid') },
    { id: 'pending', value: 'pending', label: t('rentalHistory.pending') },
    { id: 'cancelled', value: 'cancelled', label: t('rentalHistory.cancelled') }
  ], [t]);

  const extendBookingFeeStatusOptions = useMemo(() => [
    { id: 'all', value: 'all', label: t('rentalHistory.allExtendBookingFeeStatuses') },
    { id: 'paid', value: 'paid', label: t('rentalHistory.paid') },
    { id: 'pending', value: 'pending', label: t('rentalHistory.pending') },
    { id: 'cancelled', value: 'cancelled', label: t('rentalHistory.cancelled') }
  ], [t]);

  const filteredRentals = useMemo(() => {
    return rentalHistory.filter(rental => {
      const matchesSearch = rental.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rental.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (rental.invoiceNo && rental.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchesStatus = statusFilter === 'all' || rental.status === statusFilter;
      const matchesCar = carFilter === 'all' || rental.carName === carFilter;
      
      // Helper function to check if status matches filter (handles success/paid and cancelled/canceled)
      const statusMatches = (actualStatus, filterStatus, hasFee) => {
        if (filterStatus === 'all') return true;
        
        // If filtering by a specific status but the fee doesn't exist, don't show it
        if (!hasFee) return false;
        
        if (filterStatus === 'paid') {
          return actualStatus === 'paid' || actualStatus === 'success';
        }
        if (filterStatus === 'cancelled') {
          return actualStatus === 'cancelled' || actualStatus === 'canceled';
        }
        return actualStatus === filterStatus;
      };
      
      const matchesBookingFeeStatus = statusMatches(rental.bookingFeeStatus, bookingFeeStatusFilter, true); // Booking fee always exists
      const matchesRentalFeeStatus = statusMatches(rental.rentalFeeStatus, rentalFeeStatusFilter, true); // Rental fee always exists
      const matchesAdditionalFeeStatus = statusMatches(rental.additionalFeeStatus, additionalFeeStatusFilter, rental.hasAdditionalFee);
      const matchesExtendBookingFeeStatus = statusMatches(rental.extendBookingFeeStatus, extendBookingFeeStatusFilter, rental.hasExtendBookingFee);

      // Custom date range filter (when startDate or endDate is set)
      let matchesDateRange = true;
      if (startDate || endDate) {
        const rentalStartDate = new Date(rental.startDate);
        const rentalEndDate = new Date(rental.endDate);

        if (startDate && endDate) {
          const filterStart = new Date(startDate);
          const filterEnd = new Date(endDate);
          // Check if rental period overlaps with filter range
          matchesDateRange = rentalStartDate <= filterEnd && rentalEndDate >= filterStart;
        } else if (startDate) {
          const filterStart = new Date(startDate);
          matchesDateRange = rentalEndDate >= filterStart;
        } else if (endDate) {
          const filterEnd = new Date(endDate);
          matchesDateRange = rentalStartDate <= filterEnd;
        }
      }

      return matchesSearch && matchesStatus && matchesCar && matchesBookingFeeStatus && matchesRentalFeeStatus && matchesAdditionalFeeStatus && matchesExtendBookingFeeStatus && matchesDateRange;
    });
  }, [rentalHistory, searchTerm, statusFilter, carFilter, bookingFeeStatusFilter, rentalFeeStatusFilter, additionalFeeStatusFilter, extendBookingFeeStatusFilter, startDate, endDate]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, carFilter, bookingFeeStatusFilter, rentalFeeStatusFilter, additionalFeeStatusFilter, extendBookingFeeStatusFilter, startDate, endDate]);

  const clearDateFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  return {
    // Filter states
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    carFilter,
    setCarFilter,
    bookingFeeStatusFilter,
    setBookingFeeStatusFilter,
    rentalFeeStatusFilter,
    setRentalFeeStatusFilter,
    additionalFeeStatusFilter,
    setAdditionalFeeStatusFilter,
    extendBookingFeeStatusFilter,
    setExtendBookingFeeStatusFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    currentPage,
    setCurrentPage,

    // Options
    carOptions,
    statusOptions,
    bookingFeeStatusOptions,
    rentalFeeStatusOptions,
    additionalFeeStatusOptions,
    extendBookingFeeStatusOptions,

    // Filtered data
    filteredRentals,

    // Actions
    clearDateFilters
  };
};