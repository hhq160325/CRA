import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setBookingActivities, setLoading, setError } from '../../../staffSlice';
import { fetchBookingsWithReports } from '../services/reportCarService';

export const useReportCarData = () => {
  const dispatch = useDispatch();

  const fetchBookings = async () => {
    dispatch(setLoading({ section: 'bookings', loading: true }));
    try {
      const transformedData = await fetchBookingsWithReports();
      dispatch(setBookingActivities(transformedData));
    } catch (error) {
      dispatch(setError({ section: 'bookings', error: error.message }));
      dispatch(setBookingActivities([]));
      console.error('Failed to fetch bookings:', error);
    } finally {
      dispatch(setLoading({ section: 'bookings', loading: false }));
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [dispatch]);

  return { refetchBookings: fetchBookings };
};