// Auth-specific utility functions

// Helper function to make auth API calls
export const authApiCall = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem("accessToken");

    const config = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    if (options.body) {
      config.body = JSON.stringify(options.body);
    }

    const response = await fetch(endpoint, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    throw error;
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

  // Clear all auth data from localStorage
  clearTokens: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
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
    return localStorage.getItem("accessToken");
  },

  // Get refresh token
  getRefreshToken: () => {
    return localStorage.getItem("refreshToken");
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