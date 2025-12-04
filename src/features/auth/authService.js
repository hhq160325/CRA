// Service functions for auth
import { AUTH_ENDPOINTS } from "./api";
import { authApiCall, tokenUtils, decodeJWT } from "./utils";
import { logout } from "../../shared/authGlobal";

// Google Login function
export const loginWithGoogle = async (localURL) => {
  try {
    // Do a full-page navigation to avoid CORS issues
    // The backend will redirect to Google OAuth
    const url = `${AUTH_ENDPOINTS.LOGIN_GOOGLE}?localURL=${encodeURIComponent(localURL)}`;
    
    // Direct browser navigation (no CORS)
    window.location.href = url;
    
    return {
      success: true,
      message: "Redirecting to Google login..."
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
      tokenUtils.storeTokens(data.token, data.token, user);

      // Fetch full user data to get avatar and username
      if (userId) {
        try {
          const { getUserById } = await import('../user/api');
          const userData = await getUserById();
          
          // Update localStorage with avatar and username
          tokenUtils.updateUserData({
            username: userData.username,
            imageAvatar: userData.imageAvatar
          });
          
          // Update return value with full user data
          user.username = userData.username;
          user.imageAvatar = userData.imageAvatar;
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
      const decoded = decodeJWT(data.token);
      const userId = decoded ? (decoded.sub || decoded.userId || decoded.id || decoded.nameid) : null;
      
      const user = {
        email: userData.email,
        username: userData.username,
        phoneNumber: userData.phoneNumber
      };
      
      tokenUtils.storeTokens(data.token, data.token, user);
      
      // Fetch full user data to get avatar
      if (userId) {
        try {
          const { getUserById } = await import('../user/api');
          const fullUserData = await getUserById();
          
          // Update localStorage with avatar and username
          tokenUtils.updateUserData({
            username: fullUserData.username,
            imageAvatar: fullUserData.imageAvatar
          });
          
          user.username = fullUserData.username;
          user.imageAvatar = fullUserData.imageAvatar;
        } catch (userError) {
          console.error('Failed to fetch user data:', userError);
        }
      }
      
      // Return response with autoLogin flag
      return {
        ...data,
        autoLogin: true,
        message: 'Registration successful!',
        user
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
