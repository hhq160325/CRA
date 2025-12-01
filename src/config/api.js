// Central API configuration
//https://localhost:7269/api
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "https://localhost:7184/api",
  ALTER_URL:process.env.REACT_APP_API_ALTER_URL || "https://localhost:7184", //For PayOSAllPayments
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
  UPLOAD_AVATAR: (userId) => `${API_CONFIG.BASE_URL}/User/upload-avatar/${userId}`,
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
  SET_RENTAL_RATE: `${API_CONFIG.BASE_URL}/Car/rentalRate`,
  GET_RENTAL_RATE: (carId) => `${API_CONFIG.BASE_URL}/Car/rentalRate/${carId}`,
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
  UPDATE_BOOKING: `${API_CONFIG.BASE_URL}/Booking/UpdateBooking`,
  GET_ALL_BOOKINGS: `${API_CONFIG.BASE_URL}/Booking/GetAllBookings`,
  GET_CUSTOMER_BOOKINGS: (cusId) => `${API_CONFIG.BASE_URL}/Booking/GetBookingsFromCustomer/${cusId}`,
  GET_CAR_BOOKINGS: (carId) => `${API_CONFIG.BASE_URL}/Booking/GetBookingsForCar/${carId}`,
  GET_BOOKING_BY_ID: (bookingId) => `${API_CONFIG.BASE_URL}/Booking/GetBookingById/${bookingId}`,
};

export const BOOKING_API_CONFIG = {
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
};

// Schedule endpoints
export const SCHEDULE_ENDPOINTS = {
  GET_USER_SCHEDULES: (userId) => `${API_CONFIG.BASE_URL}/Schedule/user/${userId}`,
};

export const SCHEDULE_API_CONFIG = {
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
};

// Invoice endpoints
export const INVOICE_ENDPOINTS = {
  GET_ALL_INVOICES: `${API_CONFIG.BASE_URL}/Invoice/AllInvoices`,
  GET_INVOICE_BY_ID: (invoiceId) => `${API_CONFIG.ALTER_URL}/${invoiceId}`,
};

export const INVOICE_API_CONFIG = {
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
};

// Payment endpoints
export const PAYMENT_ENDPOINTS = {
  GET_ALL_PAYMENTS: `${API_CONFIG.ALTER_URL}/PayOS/AllPayments`,
  GET_PAYMENT_BY_ID: (paymentId) => `${API_CONFIG.ALTER_URL}/Payment/GetPaymentById/${paymentId}`,
  CREATE_PAYMENT: `${API_CONFIG.ALTER_URL}/Payment/CreatePayment`,
};

export const PAYMENT_API_CONFIG = {
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
};

// TrackAsia endpoints
export const TRACKASIA_ENDPOINTS = {
  REVERSE_GEOCODING: `${API_CONFIG.BASE_URL}/TrackAsia/GetReverseGeocoding`,
  GET_COORDINATE_FROM_ADDRESS: `${API_CONFIG.BASE_URL}/TrackAsia/GetCoordinateFromAddress`,
  GET_DISTANCE_BETWEEN_ADDRESSES: `${API_CONFIG.BASE_URL}/TrackAsia/GetDistanceBetweenAddresses`,
};

export const TRACKASIA_API_CONFIG = {
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
};

// Feedback endpoints
export const FEEDBACK_ENDPOINTS = {
  CREATE_FEEDBACK: `${API_CONFIG.BASE_URL}/Feedback`,
  GET_FEEDBACK_BY_CAR: (carId) => `${API_CONFIG.BASE_URL}/Feedback/${carId}`,
};

export const FEEDBACK_API_CONFIG = {
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};