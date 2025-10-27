// Service functions for auth
import { AUTH_ENDPOINTS } from "./api";
import { authApiCall, tokenUtils } from "./utils";

// Mock user data for testing
const MOCK_USER = {
  email: "khangTEST02@gmail.com",
  password: "123456"
};

// Login function
export const login = async (credentials) => {
  try {
    // Check for mock credentials first
    if (credentials.email === MOCK_USER.email && credentials.password === MOCK_USER.password) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const mockResponse = {
        success: true,
        message: "Login successful",
        accessToken: "mock_access_token_" + Date.now(),
        refreshToken: "mock_refresh_token_" + Date.now(),
        user: {
          id: 1,
          email: MOCK_USER.email,
          name: "Khang Test User",
          role: "user",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
        }
      };

      // Store tokens
      tokenUtils.storeTokens(mockResponse.accessToken, mockResponse.refreshToken, mockResponse.user);
      
      return mockResponse;
    }

    // For non-mock credentials, proceed with actual API call
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
    const data = await authApiCall(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
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
    const data = await authApiCall(AUTH_ENDPOINTS.RESET_PASSWORD, {
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
    const data = await authApiCall(AUTH_ENDPOINTS.VERIFY_TOKEN, {
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
    const refreshToken = tokenUtils.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const data = await authApiCall(AUTH_ENDPOINTS.REFRESH_TOKEN, {
      body: { refreshToken },
    });

    // Update stored tokens
    if (data.accessToken) {
      tokenUtils.storeTokens(
        data.accessToken, 
        data.refreshToken || refreshToken, 
        tokenUtils.getCurrentUser()
      );
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
    await authApiCall(AUTH_ENDPOINTS.LOGOUT);
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Clear local storage regardless of API call success
    tokenUtils.clearTokens();
  }
};

// Export token utilities for convenience
export const getCurrentUser = tokenUtils.getCurrentUser;
export const isAuthenticated = tokenUtils.isAuthenticated;
export const getAccessToken = tokenUtils.getAccessToken;
