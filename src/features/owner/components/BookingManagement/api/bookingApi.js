import axios from 'axios';
import {
  BOOKING_ENDPOINTS
} from '../../../../../config/api';

export const fetchAllBookingData = async () => {
  try {
    // Fetch only booking data
    const bookingsRes = await axios.get(BOOKING_ENDPOINTS.GET_ALL_BOOKINGS);

    return {
      bookings: bookingsRes.data
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to load booking data');
  }
};

