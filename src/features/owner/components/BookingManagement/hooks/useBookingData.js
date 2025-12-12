import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchAllBookingData } from '../api/bookingApi';
import { transformBookingData } from '../utils/dataTransform';

export const useBookingData = () => {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBookingData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { bookings: allBookings } = await fetchAllBookingData();
      
      // Transform and enrich booking data
      const enrichedBookings = transformBookingData(allBookings, t);
      
      setBookings(enrichedBookings);
    } catch (err) {
      console.error('Error fetching booking data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookingData();
  }, [t]);

  return { bookings, loading, error, refetch: loadBookingData };
};