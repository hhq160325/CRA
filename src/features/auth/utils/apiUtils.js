// API utilities for auth
import axios from "axios";

// Helper function to make auth API calls
export const authApiCall = async (endpoint, options = {}) => {
  try {
    const token = localStorage.getItem("jwtToken");

    const config = {
      method: options.method || "POST",
      url: endpoint,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      data: options.body,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    // Axios wraps errors differently
    if (error.response) {
      // Server responded with error status
      const customError = new Error(error.response.data?.message || "Something went wrong");
      console.log(error.response.data?.message);
      
      customError.statusCode = error.response.status;
      customError.response = error.response.data;
      throw customError;
    }
    throw error;
  }
};