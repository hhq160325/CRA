// Service functions for auth
import { AUTH_ENDPOINTS } from "./api";
import { authApiCall, tokenUtils } from "./utils";
import { logout } from "../../shared/authGlobal";

// Login function
export const login = async (credentials) => {
  try {
    // Format the request body according to API specification
    const requestBody = {
      email: credentials.email,
      password: credentials.password
    };

    const data = await authApiCall(AUTH_ENDPOINTS.LOGIN, {
      body: requestBody,
    });

    // Store tokens - API returns { token, expiration }
    if (data.token) {
      const user = {
        email: credentials.email
      };
      tokenUtils.storeTokens(data.token, data.token, user);
    }

    return {
      success: true,
      message: "Login successful",
      accessToken: data.token,
      refreshToken: data.token,
      expiration: data.expiration,
      user: {
        email: credentials.email
      }
    };
  } catch (error) {
    // Handle 401 Unauthorized error specifically
    if (error.statusCode === 401) {
      const customError = new Error("Invalid email or password");
      customError.statusCode = 401;
      throw customError;
    }
    throw error;
  }
};

// Register function
export const register = async (userData) => {
  try {
    // Format the request body according to API specification
    const requestBody = {
      username: userData.username,
      password: userData.password,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      fullname: userData.fullname,
      address: userData.address,
      gender: userData.gender || 0
    };

    const data = await authApiCall(AUTH_ENDPOINTS.REGISTER, {
      body: requestBody,
    });

    console.log('Registration response:', data);

    // Check if registration returned token and expiration (successful sign up)
    if (data.token && data.expiration) {
      // Store the token from registration response
      const user = {
        email: userData.email,
        username: userData.username,
        phoneNumber: userData.phoneNumber
      };
      
      tokenUtils.storeTokens(data.token, data.token, user);
      
      // Return response with autoLogin flag
      return {
        ...data,
        autoLogin: true,
        message: 'Registration successful!'
      };
    }

    // Fallback: Auto-login after successful registration if no token in response
    // Check for success or if registration completed (some APIs don't return success flag)
    if (data.success || data.message || !data.error) {
      try {
        // Automatically log in with the same credentials
        const loginResponse = await login({
          email: userData.email,
          password: userData.password
        });
        
        console.log('Auto-login response:', loginResponse);
        
        // Return combined response with autoLogin flag
        return {
          ...data,
          autoLogin: true
        };
      } catch (loginError) {
        console.error('Auto-login failed:', loginError);
        // Return registration data even if auto-login fails
        return {
          ...data,
          autoLogin: false,
          message: data.message || 'Registration successful! Please log in.'
        };
      }
    }

    return data;
  } catch (error) {
    console.error('Registration error:', error);
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

// Export logout function from shared location
export { logout };

// Export token utilities for convenience
export const getCurrentUser = tokenUtils.getCurrentUser;
export const isAuthenticated = tokenUtils.isAuthenticated;
export const getAccessToken = tokenUtils.getAccessToken;
