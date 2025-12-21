import { axiosInstance } from '../../../../../shared/utils/axiosInstance';
import { USER_ENDPOINTS } from '../../../../../config/api';

export const staffService = {
  // Update staff status
  updateStaffStatus: async (staffId, status) => {
    try {
      const response = await axiosInstance.patch(`${USER_ENDPOINTS.UPDATE_USER_INFO}`, {
        userId: staffId,
        status: status
      });
      return response.data;
    } catch (error) {
      console.error('Error updating staff status:', error);
      throw error;
    }
  },

  // Get staff by ID
  getStaffById: async (staffId) => {
    try {
      const response = await axiosInstance.get(USER_ENDPOINTS.GET_USER_BY_ID(staffId));
      return response.data;
    } catch (error) {
      console.error('Error fetching staff by ID:', error);
      throw error;
    }
  },

  // Update staff information
  updateStaffInfo: async (staffId, updateData) => {
    try {
      const response = await axiosInstance.patch(USER_ENDPOINTS.UPDATE_USER_INFO, {
        userId: staffId,
        ...updateData
      });
      return response.data;
    } catch (error) {
      console.error('Error updating staff info:', error);
      throw error;
    }
  }
};