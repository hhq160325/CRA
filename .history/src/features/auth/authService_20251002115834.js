// Service functions for auth
import { AUTH_ENDPOINTS } from "./api";
import { authApiCall, tokenUtils } from "./utils";

// Login function
export const login = async (credentials) => {
  try {
    const data = await authApiCall(AUTH_ENDPOINTS.LOGIN, {
      body: credentials,
    });

    // Store tokens
    if (data.accessToken) {
      tokenUtils.storeTokens(data.accessToken, data.refreshToken, data.user);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Register function
export const register = async (userData) => {
  try {
    const data = await authApiCall(AUTH_ENDPOINTS.REGISTER, {
      body: userData,
    });

    // Optionally auto-login after registration
    if (data.autoLogin && data.accessToken) {
      tokenUtils.storeTokens(data.accessToken, data.refreshToken, data.user);
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Forgot password function
export const forgotPassword = async (email) => {
  try {
    const data = await apiCall(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      body: { email },
    });

    return data;
  } catch (error) {
    throw error;
  }
};

// Reset password function
export const resetPassword = async (token, newPassword) => {
  try {
    const data = await apiCall(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
      body: { token, newPassword },
    });

    return data;
  } catch (error) {
    throw error;
  }
};

// Verify token function
export const verifyToken = async (token) => {
  try {
    const data = await apiCall(API_ENDPOINTS.AUTH.VERIFY_TOKEN, {
      body: { token },
    });

    return data;
  } catch (error) {
    throw error;
  }
};

// Refresh token function
export const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const data = await apiCall(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      body: { refreshToken },
    });

    // Update stored tokens
    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
      if (data.refreshToken) {
        localStorage.setItem("refreshToken", data.refreshToken);
      }
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Logout function
export const logout = async () => {
  try {
    // Call logout endpoint to invalidate token on server
    await apiCall(API_ENDPOINTS.AUTH.LOGOUT);
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Clear local storage regardless of API call success
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  }
};

// Get current user from localStorage
export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem("accessToken");
  return !!token;
};

// Get access token
export const getAccessToken = () => {
  return localStorage.getItem("accessToken");
};
