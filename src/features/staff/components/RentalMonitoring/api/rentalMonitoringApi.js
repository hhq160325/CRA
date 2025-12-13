import { axiosInstance } from '../../../../../shared/utils/axiosInstance';
import { BOOKING_ENDPOINTS, CAR_ENDPOINTS, USER_ENDPOINTS, INVOICE_ENDPOINTS, FEEDBACK_ENDPOINTS } from '../../../../../config/api';

/* API functions for rental history data fetching */
export const rentalMonitoringApi = {
  /* Fetch all invoices */
  async getAllInvoices() {
    const response = await axiosInstance.get(INVOICE_ENDPOINTS.GET_ALL_INVOICES);
    return response.data || [];
  },

  /* Fetch all cars */
  async getAllCars() {
    const response = await axiosInstance.get(CAR_ENDPOINTS.GET_ALL_CARS);
    return response.data || [];
  },

  /* Fetch all users */
  async getAllUsers() {
    const response = await axiosInstance.get(USER_ENDPOINTS.GET_ALL_USERS);
    return response.data || [];
  },

  /* Fetch all payments */
  async getAllPayments() {
    const response = await axiosInstance.get(INVOICE_ENDPOINTS.GET_ALL);
    return response.data || [];
  },

  /* Fetch customer bookings */
  async getCustomerBookings(customerId) {
    try {
      const response = await axiosInstance.get(BOOKING_ENDPOINTS.GET_CUSTOMER_BOOKINGS(customerId));
      return response.data || [];
    } catch (error) {
      console.error(`Lỗi khi tải đặt xe cho khách hàng ${customerId}:`, error);
      return [];
    }
  },

  /* Fetch feedback for a specific car */
  async getCarFeedback(carId) {
    try {
      const response = await axiosInstance.get(FEEDBACK_ENDPOINTS.GET_FEEDBACK_BY_CAR(carId));
      return response.data || [];
    } catch (error) {
      console.error(`Lỗi khi tải đánh giá cho xe ${carId}:`, error);
      return [];
    }
  },

  /* Fetch all required data in parallel */
  async fetchAllData() {
    const [allInvoices, cars, users, payments] = await Promise.all([
      this.getAllInvoices(),
      this.getAllCars(),
      this.getAllUsers(),
      this.getAllPayments()
    ]);

    return {
      allInvoices,
      cars,
      users,
      payments
    };
  },

  /* Fetch bookings for multiple customers in parallel */
  async fetchMultipleCustomerBookings(customerIds) {
    const bookingsResponses = await Promise.all(
      customerIds.map(customerId => this.getCustomerBookings(customerId))
    );
    return bookingsResponses;
  },

  /* Fetch feedback for multiple cars in parallel */
  async fetchMultipleCarFeedback(carIds) {
    const feedbackResponses = await Promise.all(
      carIds.map(carId => this.getCarFeedback(carId))
    );
    return feedbackResponses;
  }
};