// Auth-specific API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  VERIFY_TOKEN: `${API_BASE_URL}/auth/verify-token`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
};

export const AUTH_API_CONFIG = {
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
};