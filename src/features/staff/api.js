import { axiosInstance } from "../../shared/utils/axiosInstance";
import { ADMIN_STAFF_ENDPOINTS } from "../../config/api";

// Fetch all users for admin/staff dashboards
export const fetchAllUsers = async () => {
  const response = await axiosInstance.get(
    ADMIN_STAFF_ENDPOINTS.GET_ALL_USERS
  );
  return response.data;
};

// Fetch all bookings
export const fetchAllBookings = async () => {
  const response = await axiosInstance.get(
    ADMIN_STAFF_ENDPOINTS.GET_ALL_BOOKINGS
  );
  return response.data;
};

// Fetch all invoices (used to enrich booking/payment info)
export const fetchAllInvoices = async () => {
  const response = await axiosInstance.get(
    ADMIN_STAFF_ENDPOINTS.GET_ALL_INVOICES
  );
  return response.data;
};


