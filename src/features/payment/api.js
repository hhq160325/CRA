// Import utilities
import { axiosInstance } from "../../shared/utils/axiosInstance";
import { BOOKING_ENDPOINTS } from "../../config/api";

// Create booking
export const createBooking = async (bookingData) => {
  try {
    // console.log('API - createBooking called with data:', bookingData);
    // console.log('API - Car ID in request:', bookingData.carId);
    // console.log('API - Endpoint:', BOOKING_ENDPOINTS.CREATE_BOOKING);
    
    const response = await axiosInstance.post(BOOKING_ENDPOINTS.CREATE_BOOKING, bookingData);
    
    // console.log('API - Response received:', response);
    // console.log('API - Response data:', response.data);
    
    return response.data;
  } catch (error) {
    // console.error("API - Error creating booking:", error);
    // console.error("API - Error response:", error.response?.data);
    // console.error("API - Error status:", error.response?.status);
    throw error;
  }
};

// Update booking status
export const updateBooking = async (bookingId, status) => {
  try {
    console.log('API - updateBooking called with:', { bookingId, status });
    
    const response = await axiosInstance.patch(BOOKING_ENDPOINTS.UPDATE_BOOKING, {
      bookingId,
      status
    });
    
    console.log('API - Update booking response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error("API - Error updating booking:", error);
    console.error("API - Error response:", error.response?.data);
    throw error;
  }
};
