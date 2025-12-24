import axios from 'axios';
import {
  BOOKING_ENDPOINTS, BOOKING_API_CONFIG
} from '../../../../../config/api';

export const fetchAllBookingData = async () => {
  try {
    // Fetch only booking data
    const bookingsRes = await axios.get(
      BOOKING_ENDPOINTS.GET_ALL_BOOKINGS,
      // BOOKING_API_CONFIG.header
      {
        headers: {
          ...BOOKING_API_CONFIG.headers,
          // Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      bookings: bookingsRes.data
    };
  } catch (error) {
    throw new Error(error.message || 'Failed to load booking data');
  }
};

