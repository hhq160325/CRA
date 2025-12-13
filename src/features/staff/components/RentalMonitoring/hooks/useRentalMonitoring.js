import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { rentalMonitoringService } from '../services/rentalMonitoringService';

export const useRentalMonitoring = () => {
  const { t } = useTranslation();
  const [rentalHistory, setRentalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRentalHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all required data
      const { allInvoices, cars, users, payments } = await rentalMonitoringService.fetchAllData();

      // Filter invoices for current user
      const invoices = rentalMonitoringService.filterUserInvoices(allInvoices);

      // Create lookup maps
      const lookupMaps = rentalMonitoringService.createLookupMaps(cars, users, payments);

      // Fetch bookings and feedback
      const [bookingMap] = await Promise.all([
        rentalMonitoringService.fetchBookings(invoices),
        // Note: feedback fetching is currently not used in the final processing
        // but kept for potential future use
        // rentalMonitoringService.fetchFeedback(invoices)
      ]);

      // Process invoices to create enriched rental history
      const enrichedBookings = rentalMonitoringService.processInvoices(
        invoices,
        lookupMaps,
        bookingMap,
        t
      );

      setRentalHistory(enrichedBookings);
    } catch (err) {
      console.error('Error loading rental history:', err);
      setError(t('rentalHistory.errorLoadingRentalHistory'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRentalHistory();
  }, []);

  return {
    rentalHistory,
    loading,
    error,
    fetchRentalHistory
  };
};