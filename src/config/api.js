// Central API configuration
const token = localStorage.getItem('jwtToken');
//https://localhost:7269/api
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "https://localhost:7184/api",
  ALTER_URL: process.env.REACT_APP_API_ALTER_URL || "https://localhost:7184", //For PayOSAllPayments
  TIMEOUT: 10000,
  HEADERS: {
    'Authorization': `Bearer ${token}`,
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
  CREATE_STAFF: `${API_CONFIG.BASE_URL}/Authen/CreateStaff`,
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
  UPLOAD_DRIVER_LICENSE: `${API_CONFIG.BASE_URL}/User/driverLicense/upload`,
  PROFILE: `${API_CONFIG.BASE_URL}/user/profile`,
  UPDATE_PROFILE: `${API_CONFIG.BASE_URL}/user/profile`,
  GET_ALL_DRIVER_LICENSE: `${API_CONFIG.BASE_URL}/User/driverLicense/all`,
  GET_DRIVER_LICENSE_BY_ID: (userId, email) => `${API_CONFIG.BASE_URL}/User/driverLicense?UserId=${userId}&Email=${email}`,
  //For reset password
  RESET_PASSWORD_VERIFY: `${API_CONFIG.BASE_URL}/User/reset-password/verify`,
  RESET_PASSWORD: `${API_CONFIG.BASE_URL}/User/reset-password`,
  //
  RESET_RESET_PHONE_VERIFY: `${API_CONFIG.BASE_URL}/User/change-phoneNo/verify`,
  RESET_RESET_PHONE: `${API_CONFIG.BASE_URL}/User/change-phoneNo`,

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
  GET_PAYMENT_BY_PARKING_ID: (parkingId) => `${API_CONFIG.ALTER_URL}/Parking/${parkingId}/Payments`,
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
  PATCH_CAR_ACTIVE_STATUS: `${API_CONFIG.BASE_URL}/Car/activeStatus/change`,
  GET_ALL_CAR_WALLET: `${API_CONFIG.BASE_URL}/CarWallet/All`,
  GET_CAR_WALLET_BY_CAR_ID: (carId) => `${API_CONFIG.ALTER_URL}/Car/${carId}`,
  ADD_FUND_TO_WALLET: `${API_CONFIG.ALTER_URL}/PayOS/Add`,
  CREATE_CAR_WALLET: (carId) => `${API_CONFIG.BASE_URL}/CarWallet?carId=${carId}`,
};

export const CAR_API_CONFIG = {
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Authorization': `Bearer ${token}`,
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
  GET_BOOKING_BY_INVOICE_ID: (invoiceId) => `${API_CONFIG.BASE_URL}/Booking/GetBookingsByInvoice/${invoiceId}`,
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
  CREATE_CAR_SCHEDULES: `${API_CONFIG.BASE_URL}/Schedule/maintenance`,
  PATCH_CAR_SCHEDULES: (scheduleId) => `${API_CONFIG.BASE_URL}/Schedule/statusChange/${scheduleId}?isCompleted=true`,
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
  GET_INVOICE_BY_VENDOR_ID: (vendorId) => `${API_CONFIG.BASE_URL}/Invoice/AllInvoicesToVendor/${vendorId}`
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
  CREATE_ADDITIONAL_PAYMENT: `${API_CONFIG.ALTER_URL}/CreateAdditionalPayment`,
  PATCH_BOOKING_PAYMENT_STATUS: `${API_CONFIG.ALTER_URL}/UpdatePayment/Booking/WithoutBookingConfirmed`,
  GET_PAYMENT_BY_VENDOR_ID: (vendorId) => `${API_CONFIG.ALTER_URL}/Vendor/${vendorId}`,
  GET_PAYMENT_BY_CAR_ID: (carId) => `${API_CONFIG.ALTER_URL}/Car/${carId}/Payments`,
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
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
  },


};
// Inquiry endpoints
export const INQUIRY_ENDPOINTS = {
  CREATE_INQUIRY: `${API_CONFIG.BASE_URL}/Inquiry/initial`,
  GET_INQUIRY: (userId) => `${API_CONFIG.BASE_URL}/Inquiry/${userId}`,
  ANSWER_INQUIRY: `${API_CONFIG.BASE_URL}/Inquiry/answer`,
  CHAT_LOG_HISTORY: (senderId, receiverId) => `${API_CONFIG.BASE_URL}/Inquiry/chatLog?senderId=${senderId}&receiverId=${receiverId}`,
  DELETE_INQUIRY: (id) => `${API_CONFIG.ALTER_URL}/api/Inquiry/${id}`,
};

export const INQUIRY_API_CONFIG = {
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
  },
};

// Reporr
export const REPORT_CAR_ENDPOINTS = {
  CREATE_REPORT_CAR: `${API_CONFIG.BASE_URL}/Report/reportedCar`,
  GET_REPORT_CAR: `${API_CONFIG.BASE_URL}/Report`,
  CREATE_REPORT_USER: `${API_CONFIG.BASE_URL}/Report/reportedUser`,
  GET_USER_REPORT_BY_ID: (userId) => `${API_CONFIG.BASE_URL}/Report/reportedUser/${userId}`
};

export const REPORT_CAR_API_CONFIG = {
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'multipart/form-data',
  },
};

// Audit Log
export const AUDIT_LOG_ENDPOINTS = {
  GET_STAFF_LOGS: `${API_CONFIG.BASE_URL}/Audit/staffLogs`,
  GET_STAFF_LOGS_BY_STAFF_ID: (staffId) => `${API_CONFIG.BASE_URL}/Audit/staffLogs/${staffId}`,
  GET_CAR_HANDOVER_LOGS: `${API_CONFIG.BASE_URL}/Audit/carHandover`,
  GET_CAR_HANDOVER_LOGS_BY_SCHEDULE_ID: (scheduleId) => `${API_CONFIG.BASE_URL}/Audit/carHandover/${scheduleId}`,
};

export const AUDIT_LOG_API_CONFIG = {
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
};

// Notification
export const NOTIFICATION_ENDPOINTS = {
  GET_NOTIFICATION: `${API_CONFIG.ALTER_URL}/AllNotif`,
  PATCH_NOTIFICATION_MARK_AS_READ: (id) => `${API_CONFIG.ALTER_URL}/MarkAsRead/${id}`,
  GET_NOTIFICATION_BY_USER_ID: (userId) => `${API_CONFIG.ALTER_URL}/UserNotif/${userId}`,
  DELETE_NOTIFICATION: (id) => `${API_CONFIG.ALTER_URL}/DeleteNotif/${id}`,
};

export const NOTIFICATION_API_CONFIG = {
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
};
// CarTravelLog
export const CARTRAVELLOG_ENDPOINTS = {
  GET_CARTRAVELLOG_BY_CAR_ID: (carId) => `${API_CONFIG.BASE_URL}/CarTravelLog/ByCar/${carId}`,
  GET_CARTRAVELLOG_BY_CAR_ID_AND_BOOKING_ID: (carId, bookingId) => `${API_CONFIG.BASE_URL}/CarTravelLog/ByCarAndBooking?carId=${carId}&bookingId=${bookingId}`,
};

export const CARTRAVELLOG_API_CONFIG = {
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
};