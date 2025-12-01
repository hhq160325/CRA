// Central API configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "https://localhost:7269/api",
  TIMEOUT: 10000,
  HEADERS: {
    "Content-Type": "application/json",
  },
};

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_CONFIG.BASE_URL}/User/authenticate`,
  REGISTER: `${API_CONFIG.BASE_URL}/User/SignUp`,
  FORGOT_PASSWORD: `${API_CONFIG.BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${API_CONFIG.BASE_URL}/auth/reset-password`,
  VERIFY_TOKEN: `${API_CONFIG.BASE_URL}/auth/verify-token`,
  REFRESH_TOKEN: `${API_CONFIG.BASE_URL}/auth/refresh-token`,
  LOGOUT: `${API_CONFIG.BASE_URL}/auth/logout`,
};

export const AUTH_API_CONFIG = {
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
};

// User endpoints
export const USER_ENDPOINTS = {
  GET_ALL_USERS: `${API_CONFIG.BASE_URL}/User/GetAllUsers`,
  GET_USER_BY_ID: (userId) => `${API_CONFIG.BASE_URL}/User/GetUserById?userId=${userId}`,
  UPDATE_USER_INFO: `${API_CONFIG.BASE_URL}/User/UpdateUserInfo`,
  PROFILE: `${API_CONFIG.BASE_URL}/user/profile`,
  UPDATE_PROFILE: `${API_CONFIG.BASE_URL}/user/profile`,
};

export const USER_API_CONFIG = {
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
};

// Admin / staff endpoints
export const ADMIN_STAFF_ENDPOINTS = {
  GET_ALL_USERS: USER_ENDPOINTS.GET_ALL_USERS,
  GET_ALL_BOOKINGS: `${API_CONFIG.BASE_URL}/Booking/GetAllBookings`,
  GET_ALL_INVOICES: `${API_CONFIG.BASE_URL}/Invoice/AllInvoices`,
};