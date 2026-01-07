import { axiosInstance } from "../../../shared/utils/axiosInstance";
import {
  CAR_ENDPOINTS,
  BOOKING_ENDPOINTS,
  INVOICE_ENDPOINTS,
  USER_ENDPOINTS,
  SCHEDULE_ENDPOINTS
} from "../../../config/api";

// ============================================
// CAR REGISTRATION DOCUMENTS API
// ============================================

/* Upload car registration documents */
export const uploadCarRegistrationDocuments = async (carId, userId, files) => {
  const formData = new FormData();
  formData.append('CarId', carId);
  formData.append('UserId', userId);

  Array.from(files).forEach((file) => {
    formData.append('images', file);
  });

  const response = await axiosInstance.post('/Car/registerCar/regDoc', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/* Get all cars */
export const getAllCars = async () => {
  const response = await axiosInstance.get(CAR_ENDPOINTS.GET_ALL_CARS);
  console.log("getAllCars",response.data);
  return response.data;

};

/* Get all registration documents */
export const getAllRegDocs = async () => {
  const response = await axiosInstance.get(CAR_ENDPOINTS.GET_ALL_REG_DOCS);
  return response.data;
};

// ============================================
// PAYMENTS API
// ============================================

/* Get all invoices */
export const getAllInvoices = async () => {
  const response = await axiosInstance.get(INVOICE_ENDPOINTS.GET_ALL_INVOICES);
  return response.data;
};

/* Get invoices by vendor ID */
export const getInvoicesByVendorId = async (vendorId) => {
  const response = await axiosInstance.get(INVOICE_ENDPOINTS.GET_INVOICE_BY_VENDOR_ID(vendorId));
  return response.data;
};

/* Get all payments */
export const getAllPayments = async () => {
  const response = await axiosInstance.get(INVOICE_ENDPOINTS.GET_ALL);
  return response.data;
};

/* Get all users */
export const getAllUsers = async () => {
  const response = await axiosInstance.get(USER_ENDPOINTS.GET_ALL_USERS);
  return response.data;
};

// ============================================
// RENTAL HISTORY API
// ============================================

/* Get customer bookings */
export const getCustomerBookings = async (customerId) => {
  try {
    const response = await axiosInstance.get(BOOKING_ENDPOINTS.GET_CUSTOMER_BOOKINGS(customerId));
    return response.data;
  } catch (error) {
    console.error(`Error fetching bookings for customer ${customerId}:`, error);
    return [];
  }
};

/* Get car bookings */
export const getCarBookings = async (carId) => {
  try {
    const response = await axiosInstance.get(BOOKING_ENDPOINTS.GET_CAR_BOOKINGS(carId));
    return response.data;
  } catch (error) {
    console.error(`Error fetching bookings for car ${carId}:`, error);
    return [];
  }
};

// ============================================
// USAGE TRACKING API
// ============================================

/* Create car maintenance schedule */
export const createCarSchedule = async (scheduleData) => {
  const response = await axiosInstance.post(SCHEDULE_ENDPOINTS.CREATE_CAR_SCHEDULES, scheduleData);
  return response.data;
};

// ============================================
// WALLET API
// ============================================

/* Get all car wallets */
export const getAllCarWallets = async () => {
  try {
    const response = await axiosInstance.get(CAR_ENDPOINTS.GET_ALL_CAR_WALLET);
    return response.data;
  } catch (error) {
    console.error('Error fetching car wallets:', error);
    return [];
  }
};

/* Add funds to car wallet */
export const addFundToWallet = async (carId, amount) => {
  const formData = new FormData();
  formData.append('CarId', carId);
  formData.append('Amount', amount);

  const response = await axiosInstance.post(CAR_ENDPOINTS.ADD_FUND_TO_WALLET, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// ============================================
// COMBINED DATA FETCHING 
// ============================================

/* Fetch all data needed for payments page */
export const fetchOwnerPaymentsData = async () => {
  const [invoicesResponse, paymentsResponse, usersResponse, carsResponse] = await Promise.all([
    axiosInstance.get(INVOICE_ENDPOINTS.GET_ALL_INVOICES),
    axiosInstance.get(INVOICE_ENDPOINTS.GET_ALL),
    axiosInstance.get(USER_ENDPOINTS.GET_ALL_USERS),
    axiosInstance.get(CAR_ENDPOINTS.GET_ALL_CARS)
  ]);

  return {
    invoices: invoicesResponse.data || [],
    payments: paymentsResponse.data || [],
    users: usersResponse.data || [],
    cars: carsResponse.data || []
  };
};

/* Fetch all data needed for rental history page */
export const fetchRentalHistoryData = async () => {
  const [invoicesResponse, carsResponse, usersResponse, paymentsResponse] = await Promise.all([
    axiosInstance.get(INVOICE_ENDPOINTS.GET_ALL_INVOICES),
    axiosInstance.get(CAR_ENDPOINTS.GET_ALL_CARS),
    axiosInstance.get(USER_ENDPOINTS.GET_ALL_USERS),
    axiosInstance.get(INVOICE_ENDPOINTS.GET_ALL)
  ]);

  return {
    invoices: invoicesResponse.data || [],
    cars: carsResponse.data || [],
    users: usersResponse.data || [],
    payments: paymentsResponse.data || []
  };
};
