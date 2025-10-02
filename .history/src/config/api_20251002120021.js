// Legacy API configuration - DEPRECATED
// This file is kept for backward compatibility
// New features should use feature-specific API configurations

// Re-export from shared constants for backward compatibility
export { API_CONFIG } from "../shared/constants";

// Legacy endpoints - consider migrating to feature-specific APIs
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const API_ENDPOINTS = {
  // These are deprecated - use AUTH_ENDPOINTS from features/auth/api.js instead
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
    FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
    VERIFY_TOKEN: `${API_BASE_URL}/auth/verify-token`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
  },
  // These are deprecated - use USER_ENDPOINTS from features/user/api.js instead
  USER: {
    PROFILE: `${API_BASE_URL}/user/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/user/profile`,
  },
};
