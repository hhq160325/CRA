// Central API configuration
//https://localhost:7269/api
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "https://localhost:7269/api",
  TIMEOUT: 10000,
  HEADERS: {
    "Content-Type": "application/json",
  },
};

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_CONFIG.BASE_URL}/Authen/authenticate`,
  REGISTER: `${API_CONFIG.BASE_URL}/Authen/SignUp`,
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
  GET_USER_BY_ID: (userId) => `${API_CONFIG.BASE_URL}/User/GetUserById?userId=${userId}`,
  GET_ALL_USERS: `${API_CONFIG.BASE_URL}/User/GetAllUsers`,
  UPDATE_USER_INFO: `${API_CONFIG.BASE_URL}/User/UpdateUserInfo`,
  PROFILE: `${API_CONFIG.BASE_URL}/user/profile`,
  UPDATE_PROFILE: `${API_CONFIG.BASE_URL}/user/profile`,
};

export const USER_API_CONFIG = {
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
};

// Park Lot endpoints
export const PARKLOT_ENDPOINTS = {
  GET_ALL: `${API_CONFIG.BASE_URL}/ParkLot`,
};

export const PARKLOT_API_CONFIG = {
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
};

// Car endpoints
export const CAR_ENDPOINTS = {
  REGISTER_CAR: `${API_CONFIG.BASE_URL}/Car/registerCar/carInfo`,
  GET_ALL_CARS: `${API_CONFIG.BASE_URL}/Car/AllCars`,
  GET_CAR_BY_ID: (carId) => `${API_CONFIG.BASE_URL}/Car/${carId}`,
};

export const CAR_API_CONFIG = {
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};

// Booking endpoints
export const BOOKING_ENDPOINTS = {
  CREATE_BOOKING: `${API_CONFIG.BASE_URL}/Booking/CreateBooking`,
  GET_ALL_BOOKINGS: `${API_CONFIG.BASE_URL}/Booking/GetAllBookings`,
  GET_CUSTOMER_BOOKINGS: (cusId) => `${API_CONFIG.BASE_URL}/Booking/GetBookingsFromCustomer/${cusId}`,
};

export const BOOKING_API_CONFIG = {
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
};