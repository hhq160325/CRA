import { axiosInstance } from '../../../../../shared/utils/axiosInstance';
import { REPORT_CAR_ENDPOINTS } from '../../../../../config/api';
import { tokenUtils } from '../../../../auth/utils';

/* Get user reports by user ID */
export const getUserReports = async (userId) => {
  try {
    const token = tokenUtils.getAccessToken();
    
    if (!token) {
      throw new Error('Authentication required. Please log in.');
    }

    if (!userId) {
      throw new Error('User ID is required.');
    }

    const response = await axiosInstance.get(
      REPORT_CAR_ENDPOINTS.GET_USER_REPORT_BY_ID(userId),
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Failed to fetch user reports:', error);
    
    // Handle 404 error when user has no reports
    if (error.response && error.response.status === 404) {
      return []; // Return empty array for no reports
    }
    
    throw error;
  }
};