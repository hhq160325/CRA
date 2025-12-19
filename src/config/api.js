// Central API configuration
//https://localhost:7269/api
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "https://localhost:7184/api",
  ALTER_URL: process.env.REACT_APP_API_ALTER_URL || "https://localhost:7184", //For PayOSAllPayments
  TIMEOUT: 10000,
  HEADERS: {
    "Content-Type": "application/json",
  },
};

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_CONFIG.BASE_URL}/Authen/authenticate`,
  REGISTER: `${API_CONFIG.BASE_URL}/Authen/SignUp`,
  LOGIN_GOOGLE: `${API_CONFIG.BASE_URL}/Authen/login/google`,
  GOOGLE_CALLBACK: `${API_CONFIG.BASE_URL}/Authen/google-callback`,
  OTP_VERIFY: `${API_CONFIG.BASE_URL}/Authen/SignUp/verify`,
  OTP_RESEND: `${API_CONFIG.BASE_URL}/Authen/otp/resend`,
  // FORGOT_PASSWORD: `${API_CONFIG.BASE_URL}/auth/forgot-password`,
  // RESET_PASSWORD: `${API_CONFIG.BASE_URL}/auth/reset-password`,
  // VERIFY_TOKEN: `${API_CONFIG.BASE_URL}/auth/verify-token`,
  // REFRESH_TOKEN: `${API_CONFIG.BASE_URL}/auth/refresh-token`,
  // LOGOUT: `${API_CONFIG.BASE_URL}/auth/logout`,
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
  UPLOAD_DRIVER_LICENSE: (userId) => `${API_CONFIG.BASE_URL}/User/driverLicense/${userId}`,
  PROFILE: `${API_CONFIG.BASE_URL}/user/profile`,
  UPDATE_PROFILE: `${API_CONFIG.BASE_URL}/user/profile`,
  GET_ALL_DRIVER_LICENSE: `${API_CONFIG.BASE_URL}/User/driverLicense/all`,
  GET_DRIVER_LICENSE_BY_ID: (userId, email) => `${API_CONFIG.BASE_URL}/User/driverLicense?UserId=${userId}&Email=${email}`,
  //For reset password
  RESET_PASSWORD_VERIFY: `${API_CONFIG.BASE_URL}/User/reset-password/verify`,
  RESET_PASSWORD: `${API_CONFIG.BASE_URL}/User/reset-password`,
};

export const USER_API_CONFIG = {
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
};

// Staff endpoints
export const STAFF_ENDPOINTS = {
  GET_ALL_DRIVER_LICENSE: `${API_CONFIG.BASE_URL}/User/driverLicense/all`,
  PATCH_DRIVER_LICENSE: `${API_CONFIG.BASE_URL}/User/driverLicense/approve`,
};

export const STAFF_API_CONFIG = {
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
  GET_ALL_REG_DOCS: `${API_CONFIG.BASE_URL}/Car/regDoc/all`,
  APPROVE_REG_DOC: `${API_CONFIG.BASE_URL}/Car/regDoc/approve`,
  GET_ALL_MANUFACTURER: `${API_CONFIG.BASE_URL}/Car/lookup/Manufacturer`,
  GET_MODEL_BY_MANUFACTURERID: (manufacturerId) => `${API_CONFIG.BASE_URL}/Car/lookup/Model?manufacturerId=${manufacturerId}`,
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
  EXTEND_BOOKING: `${API_CONFIG.BASE_URL}/Booking/Booking/ExtendBooking`
};

export const BOOKING_API_CONFIG = {
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
};

// Schedule endpoints
export const SCHEDULE_ENDPOINTS = {
  GET_USER_SCHEDULES: (userId) => `${API_CONFIG.BASE_URL}/Schedule/user/${userId}`,
  GET_CAR_SCHEDULES: (carId) => `${API_CONFIG.BASE_URL}/Schedule/car/${carId}`,
  CREATE_CAR_SCHEDULES: `${API_CONFIG.BASE_URL}/Schedule/maintenance`
};

export const SCHEDULE_API_CONFIG = {
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
};

// Invoice endpoints
export const INVOICE_ENDPOINTS = {
  GET_ALL_INVOICES: `${API_CONFIG.BASE_URL}/Invoice/AllInvoices`,
  GET_ALL: `${API_CONFIG.ALTER_URL}/Invoice/All`,
  GET_INVOICE_BY_ID: (invoiceId) => `${API_CONFIG.ALTER_URL}/${invoiceId}`,
};

export const INVOICE_API_CONFIG = {
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
};

// Payment endpoints
export const PAYMENT_ENDPOINTS = {
  // GET_ALL_PAYMENTS: `${API_CONFIG.ALTER_URL}/PayOS/AllPayments`,
  GET_ALL_PAYMENTS: `${API_CONFIG.ALTER_URL}/Invoice/All`,
  GET_PAYMENT_BY_ID: (paymentId) => `${API_CONFIG.ALTER_URL}/Payment/GetPaymentById/${paymentId}`,
  CREATE_PAYMENT: `${API_CONFIG.ALTER_URL}/Payment/CreatePayment`,
  CREATE_ADDITIONAL_PAYMENT: `${API_CONFIG.ALTER_URL}/CreateAdditionalPayment`
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
// Inquiry endpoints
export const INQUIRY_ENDPOINTS = {
  CREATE_INQUIRY: `${API_CONFIG.BASE_URL}/Inquiry/initial`,
  GET_INQUIRY: (userId) => `${API_CONFIG.BASE_URL}/Inquiry/${userId}`,
  ANSWER_INQUIRY: `${API_CONFIG.BASE_URL}/Inquiry/answer`,
  CHAT_LOG_HISTORY: (senderId, receiverId) => `${API_CONFIG.BASE_URL}/Inquiry/chatLog?senderId=${senderId}&receiverId=${receiverId}`
};

export const INQUIRY_API_CONFIG = {
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
};