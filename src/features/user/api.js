// Import utilities
import { decodeJWT } from "../auth/utils";
import { axiosInstance } from "../../shared/utils/axiosInstance";

// Re-export user endpoints from central config
export { USER_ENDPOINTS, USER_API_CONFIG } from "../../config/api";

// Helper function to get userId from token
export const getUserIdFromToken = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) return null;

  const decoded = decodeJWT(token);
  if (!decoded) return null;

  // Check common JWT claims for user ID
  return decoded.sub || decoded.userId || decoded.id || decoded.nameid;
};

// Fetch user by ID
export const getUserById = async () => {
  try {
    const userId = getUserIdFromToken();
    if (!userId) {
      throw new Error("User ID not found in token");
    }

    const { USER_ENDPOINTS } = await import("../../config/api");
    const response = await axiosInstance.get(USER_ENDPOINTS.GET_USER_BY_ID(userId));
    return response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

// Update user information
export const updateUserInfo = async (userData) => {
  try {
    const userId = getUserIdFromToken();
    if (!userId) {
      throw new Error("User ID not found in token");
    }

    const { USER_ENDPOINTS } = await import("../../config/api");
    
    // Prepare the payload with user ID
    const payload = {
      id: userId,
      username: userData.username,
      password: userData.password,
      phoneNumber: userData.phoneNumber,
      fullname: userData.fullname,
      address: userData.address,
      imageAvatar: userData.imageAvatar,
      status: userData.status,
      gender: userData.gender
    };

    const response = await axiosInstance.patch(USER_ENDPOINTS.UPDATE_USER_INFO, payload);
    return response.data;
  } catch (error) {
    console.error("Error updating user data:", error);
    throw error;
  }
};

// Upload user avatar
export const uploadAvatar = async (imageFile) => {
  try {
    const userId = getUserIdFromToken();
    if (!userId) {
      throw new Error("User ID not found in token");
    }

    const { USER_ENDPOINTS } = await import("../../config/api");
    
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('userId', userId);

    const response = await axiosInstance.patch(
      USER_ENDPOINTS.UPLOAD_AVATAR(userId),
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw error;
  }
};