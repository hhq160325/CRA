// Global logout function
import { AUTH_ENDPOINTS } from "../../features/auth/api";
import { authApiCall, tokenUtils } from "../../features/auth/utils";

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

export default logout;