import axios from "axios";

// Auth-specific utility functions

// Helper function to make auth API calls
export const authApiCall = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem("accessToken");

    const config = {
      method: options.method || "POST",
      url: endpoint,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      data: options.body,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    // Axios wraps errors differently
    if (error.response) {
      // Server responded with error status
      const customError = new Error(error.response.data?.message || "Something went wrong");
      customError.statusCode = error.response.status;
      customError.response = error.response.data;
      throw customError;
    }
    throw error;
  }
};

// Decode JWT token without verification (client-side only)
export const decodeJWT = (token) => {
  try {
    if (!token) return null;
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

// Extract role from JWT token
export const getRoleFromToken = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded) return null;
  
  // Check for role claim in the token
  const roleClaim = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
  return roleClaim ? parseInt(roleClaim, 10) : null;
};

// Role constants
export const ROLES = {
  CUSTOMER: 1,
  ADMIN: 1001,
  STAFF: 1002
};

// Get redirect path based on role
export const getRedirectPathByRole = (roleId) => {
  switch (roleId) {
    case ROLES.CUSTOMER:
      return '/';
    case ROLES.ADMIN:
      return '/admin';
    case ROLES.STAFF:
      return '/staff';
    default:
      return '/';
  }
};

// Token management utilities
export const tokenUtils = {
  // Store tokens in localStorage
  storeTokens: (accessToken, refreshToken, user) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
  },

  // Update user data in localStorage (for avatar and username updates)
  updateUserData: (userData) => {
    if (typeof window === 'undefined') return;
    const currentUser = tokenUtils.getCurrentUser();
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
  },

  // Clear all auth data from localStorage
  clearTokens: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userAvatar");
    localStorage.removeItem("userName");
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    try {
      if (typeof window === 'undefined') return null;
      const user = localStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    try {
      if (typeof window === 'undefined') return false;
      const token = localStorage.getItem("accessToken");
      return !!token;
    } catch (error) {
      return false;
    }
  },

  // Get access token
  getAccessToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem("accessToken");
  },

  // Get refresh token
  getRefreshToken: () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem("refreshToken");
  },

  // Get user role from token
  getUserRole: () => {
    const token = tokenUtils.getAccessToken();
    return getRoleFromToken(token);
  }
};

// Password validation utilities
export const passwordValidation = {
  // Check if password meets minimum requirements
  isValidPassword: (password) => {
    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers;
  },

  // Get password strength score (0-4)
  getPasswordStrength: (password) => {
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return Math.min(score, 4);
  },

  // Get password strength text
  getPasswordStrengthText: (password) => {
    const strength = passwordValidation.getPasswordStrength(password);
    const strengthTexts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return strengthTexts[strength] || 'Very Weak';
  }
};

// Email validation utilities
export const emailValidation = {
  // Check if email format is valid
  isValidEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
};