import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "./authService";

// Async thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const forgotPasswordUser = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(email);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const resetPasswordUser = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(token, newPassword);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const refreshTokenUser = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.refreshToken();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,
  success: null,
  forgotPasswordEmail: null,
  resetPasswordToken: null,
};

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setForgotPasswordEmail: (state, action) => {
      state.forgotPasswordEmail = action.payload;
    },
    setResetPasswordToken: (state, action) => {
      state.resetPasswordToken = action.payload;
    },
    clearAuthData: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.success = "Login successful!";
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
        state.user = null;
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message || "Registration successful!";
        state.error = null;

        // Auto-login if enabled
        if (action.payload.autoLogin && action.payload.user) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Registration failed";
      });

    // Forgot Password
    builder
      .addCase(forgotPasswordUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(forgotPasswordUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message || "Password reset email sent!";
        state.error = null;
        state.forgotPasswordEmail = action.payload.email;
      })
      .addCase(forgotPasswordUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to send reset email";
      });

    // Reset Password
    builder
      .addCase(resetPasswordUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPasswordUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = action.payload.message || "Password reset successful!";
        state.error = null;
        state.resetPasswordToken = null;
      })
      .addCase(resetPasswordUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Password reset failed";
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.success = "Logout successful!";
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Logout failed";
      });

    // Refresh Token
    builder
      .addCase(refreshTokenUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshTokenUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(refreshTokenUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Token refresh failed";
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

// Export actions
export const {
  clearError,
  clearSuccess,
  setForgotPasswordEmail,
  setResetPasswordToken,
  clearAuthData,
} = authSlice.actions;

// Export selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.error;
export const selectSuccess = (state) => state.auth.success;

// Export reducer
export default authSlice.reducer;
