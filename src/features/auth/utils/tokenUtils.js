// Token management utilities
import { decodeJWT, getRoleFromToken, getUserIdFromToken } from './jwtUtils';

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
  },

  // Get user ID from token
  getUserId: () => {
    const token = tokenUtils.getAccessToken();
    return getUserIdFromToken(token);
  }
};