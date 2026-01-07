// Service functions for auth
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from "../api/authApi";
import { authApiCall, tokenUtils, decodeJWT } from "../utils";
import { logout } from "../../../shared/authGlobal";

// Google Login function
export const loginWithGoogle = async (localURL) => {
  try {
    // Return the URL for popup handling instead of doing full-page redirect
    const url = `${AUTH_ENDPOINTS.LOGIN_GOOGLE}?localURL=${encodeURIComponent(localURL)}`;
    
    return {
      success: true,
      url: url,
      message: "Opening Google login popup..."
    };
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};

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
      // Decode token to extract role and user information
      const decoded = decodeJWT(data.token);
      const roleId = decoded ? decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] : null;
      const userId = decoded ? (decoded.sub || decoded.userId || decoded.id || decoded.nameid) : null;
      
      const user = {
        email: credentials.email,
        roleId: roleId ? parseInt(roleId, 10) : null
      };
      
      // Store tokens (without isVerified)
      tokenUtils.storeTokens(data.token, data.token, user);

      // Fetch full user data to get avatar, username, and isVerified
      if (userId) {
        try {
          const { getUserById } = await import('../../user/api');
          const userData = await getUserById();
          
          // Update localStorage with avatar and username only (excluding isVerified)
          tokenUtils.updateUserData({
            username: userData.username,
            imageAvatar: userData.imageAvatar
          });
          
          // Update return value with full user data including isVerified for Redux
          user.username = userData.username;
          user.imageAvatar = userData.imageAvatar;
          user.isVerified = userData.isVerified; // Only stored in Redux, not localStorage
        } catch (userError) {
          console.error('Failed to fetch user data:', userError);
          // Continue with login even if user data fetch fails
        }
      }

      return {
        success: true,
        message: "Login successful",
        accessToken: data.token,
        refreshToken: data.token,
        expiration: data.expiration,
        user
      };
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
      const decoded = decodeJWT(data.token);
      const roleId = decoded ? decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] : null;
      const userId = decoded ? (decoded.sub || decoded.userId || decoded.id || decoded.nameid) : null;
      
      const user = {
        email: userData.email,
        username: userData.username,
        phoneNumber: userData.phoneNumber,
        roleId: roleId ? parseInt(roleId, 10) : null
      };
      
      // Store tokens (without isVerified)
      tokenUtils.storeTokens(data.token, data.token, user);
      
      // Fetch full user data to get avatar and isVerified
      if (userId) {
        try {
          const { getUserById } = await import('../../user/api');
          const fullUserData = await getUserById();
          
          // Update localStorage with avatar and username only (excluding isVerified)
          tokenUtils.updateUserData({
            username: fullUserData.username,
            imageAvatar: fullUserData.imageAvatar
          });
          
          // Update user object with full data including isVerified for Redux
          user.username = fullUserData.username;
          user.imageAvatar = fullUserData.imageAvatar;
          user.isVerified = fullUserData.isVerified; // Only stored in Redux, not localStorage
        } catch (userError) {
          console.error('Failed to fetch user data:', userError);
        }
      }
      
      // Return response with autoLogin disabled for OTP verification flow
      return {
        ...data,
        autoLogin: false,
        message: 'Registration successful! Please verify your email.',
        user
      };
    }

    // Fallback: Auto-login after successful registration if no token in response
    // Check for success or if registration completed
    if (data.success || data.message || !data.error) {
      try {
        // Automatically log in with the same credentials
        const loginResponse = await login({
          email: userData.email,
          password: userData.password
        });
        
        console.log('Auto-login response:', loginResponse);
        
        // Return combined response with autoLogin disabled for OTP verification flow
        return {
          ...data,
          autoLogin: false,
          message: 'Registration successful! Please verify your email.'
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

// Reset password function (step 1: send email, password, confirmPassword)
export const resetPassword = async (resetData) => {
  try {
    const requestBody = {
      email: resetData.email,
      password: resetData.password,
      confirmPassword: resetData.confirmPassword
    };

    const data = await authApiCall(USER_ENDPOINTS.RESET_PASSWORD, {
      body: requestBody,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

// Verify reset password OTP function (step 2: verify OTP)
export const verifyResetPasswordOTP = async (verifyData) => {
  try {
    // Build URL with query parameters
    const queryParams = new URLSearchParams({
      email: verifyData.email,
      OTPCode: verifyData.otp
    });
    
    const urlWithParams = `${USER_ENDPOINTS.RESET_PASSWORD_VERIFY}?${queryParams.toString()}`;

    // console.log('RESET_PASSWORD_VERIFY - Input data:', verifyData);
    // console.log('RESET_PASSWORD_VERIFY - Query params:', queryParams.toString());
    // console.log('RESET_PASSWORD_VERIFY - Full URL:', urlWithParams);

    const data = await authApiCall(urlWithParams, {
      method: 'POST', // Ensure POST method as shown in curl
    });

    // console.log('RESET_PASSWORD_VERIFY - Response data:', data);
    return data;
  } catch (error) {
    console.error('RESET_PASSWORD_VERIFY - Error:', error);
    throw error;
  }
};

// Legacy forgot password function (kept for backward compatibility)
export const forgotPassword = async (email) => {
  try {
    const data = await authApiCall(USER_ENDPOINTS.RESET_PASSWORD, {
      body: { email },
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

    // Update stored tokens (excluding isVerified from localStorage)
    if (data.accessToken) {
      const currentUser = tokenUtils.getCurrentUser();
      tokenUtils.storeTokens(
        data.accessToken, 
        data.refreshToken || refreshToken, 
        currentUser
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