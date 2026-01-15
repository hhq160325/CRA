import { axiosInstance } from '../../../../../shared/utils/axiosInstance';
import { REPORT_CAR_ENDPOINTS, REPORT_CAR_API_CONFIG } from '../../../../../config/api';
import { tokenUtils } from '../../../../auth/utils';

/* Create a report for a user */
export const createUserReport = async (reportData) => {
  try {
    const reporterId = tokenUtils.getUserId();
    
    if (!reporterId) {
      throw new Error('Reporter ID not found. Please log in again.');
    }

    if (!reportData.reportedUserId) {
      throw new Error('Reported user ID is required.');
    }

    if (!reportData.title || !reportData.title.trim()) {
      throw new Error('Title is required.');
    }

    if (!reportData.content || !reportData.content.trim()) {
      throw new Error('Content is required.');
    }

    // Create FormData for multipart/form-data request
    const formData = new FormData();
    formData.append('Title', reportData.title.trim());
    formData.append('Content', reportData.content.trim());
    formData.append('deductedPoints', reportData.deductedPoints || 0);
    formData.append('ReporterId', reporterId);
    formData.append('ReportedUserId', reportData.reportedUserId);

    // console.log('Creating user report with FormData:', {
    //   Title: reportData.title.trim(),
    //   Content: reportData.content.trim(),
    //   deductedPoints: reportData.deductedPoints || 0,
    //   ReporterId: reporterId,
    //   ReportedUserId: reportData.reportedUserId
    // });

    const response = await axiosInstance.post(
      REPORT_CAR_ENDPOINTS.CREATE_REPORT_USER,
      formData,
      REPORT_CAR_API_CONFIG
    );

    return response.data;
  } catch (error) {
    console.error('Failed to create user report:', error);
    throw error;
  }
};