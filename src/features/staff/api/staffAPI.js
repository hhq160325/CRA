import axios from 'axios';
import { 
  STAFF_ENDPOINTS, 
  STAFF_API_CONFIG,
  PARKLOT_ENDPOINTS,
  PARKLOT_API_CONFIG 
} from '../../../config/api';

// Staff API functions
export const staffAPI = {
  // Get all driver licenses
  getAllDriverLicenses: async () => {
    try {
      const response = await axios.get(STAFF_ENDPOINTS.GET_ALL_DRIVER_LICENSE, STAFF_API_CONFIG);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Approve driver license
  approveDriverLicense: async (licenseData) => {
    try {
      const response = await axios.patch(STAFF_ENDPOINTS.PATCH_DRIVER_LICENSE, licenseData, STAFF_API_CONFIG);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all park lots
  getAllParkLots: async () => {
    try {
      const response = await axios.get(PARKLOT_ENDPOINTS.GET_ALL, PARKLOT_API_CONFIG);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default staffAPI;