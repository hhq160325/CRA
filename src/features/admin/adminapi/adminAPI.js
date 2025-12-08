import { axiosInstance } from "../../../shared/utils/axiosInstance";
import { 
  CAR_ENDPOINTS, 
  BOOKING_ENDPOINTS, 
  INVOICE_ENDPOINTS,
  USER_ENDPOINTS 
} from "../../../config/api";

// ============================================
// ADMIN API - DATA FETCHING
// ============================================

/**
 * Get all cars
 * @returns {Promise<Array>} List of all cars
 */
export const getAllCars = async () => {
  try {
    const response = await axiosInstance.get(CAR_ENDPOINTS.GET_ALL_CARS);
    return response.data;
  } catch (error) {
    console.error('Error fetching all cars:', error);
    throw error;
  }
};

/**
 * Get all bookings
 * @returns {Promise<Array>} List of all bookings
 */
export const getAllBookings = async () => {
  try {
    const response = await axiosInstance.get(BOOKING_ENDPOINTS.GET_ALL_BOOKINGS);
    return response.data;
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    throw error;
  }
};

/**
 * Get all invoices
 * @returns {Promise<Array>} List of all invoices
 */
export const getAllInvoices = async () => {
  try {
    const response = await axiosInstance.get(INVOICE_ENDPOINTS.GET_ALL);
    return response.data;
  } catch (error) {
    console.error('Error fetching all invoices:', error);
    throw error;
  }
};

/**
 * Get all users
 * @returns {Promise<Array>} List of all users
 */
export const getAllUsers = async () => {
  try {
    const response = await axiosInstance.get(USER_ENDPOINTS.GET_ALL_USERS);
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
};

/**
 * Fetch all admin data (cars, bookings, invoices) in parallel
 * @returns {Promise<Object>} Object containing cars, bookings, and invoices
 */
export const fetchAllAdminData = async () => {
  try {
    const [carsResponse, bookingsResponse, invoicesResponse] = await Promise.all([
      axiosInstance.get(CAR_ENDPOINTS.GET_ALL_CARS),
      axiosInstance.get(BOOKING_ENDPOINTS.GET_ALL_BOOKINGS),
      axiosInstance.get(INVOICE_ENDPOINTS.GET_ALL)
    ]);

    return {
      cars: carsResponse.data || [],
      bookings: bookingsResponse.data || [],
      invoices: invoicesResponse.data || []
    };
  } catch (error) {
    console.error('Error fetching admin data:', error);
    throw error;
  }
};
