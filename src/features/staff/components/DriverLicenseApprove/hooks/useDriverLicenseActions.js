import axios from 'axios';
import { STAFF_ENDPOINTS, STAFF_API_CONFIG } from '../../../../../config/api';

export const useDriverLicenseActions = (setDriverLicenses) => {
  const handleApprove = async (licenseId, driverLicenses, t) => {
    try {
      const license = driverLicenses.find(l => l.id === licenseId);
      if (!license) {
        console.error('License not found');
        return;
      }

      const token = localStorage.getItem('jwtToken');
      const requestBody = {
        userId: license.userId,
        email: license.email
      };
      
      await axios.patch(`${STAFF_ENDPOINTS.PATCH_DRIVER_LICENSE}?isApproved=true`, requestBody, {
        headers: {
          ...STAFF_API_CONFIG.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the approved license from the list
      setDriverLicenses(prev => prev.filter(l => l.id !== licenseId));
      // alert(t('licenseApprovedSuccessfully') || 'License approved successfully');
    } catch (error) {
      console.error('Failed to approve license:', error);
      // alert(t('failedToApproveLicense') || 'Failed to approve license. Please try again.');
    }
  };

  const handleReject = async (licenseId, reason, driverLicenses, t) => {
    try {
      const license = driverLicenses.find(l => l.id === licenseId);
      if (!license) {
        console.error('License not found');
        return;
      }

      const token = localStorage.getItem('jwtToken');
      const requestBody = {
        userId: license.userId,
        email: license.email
      };

      await axios.patch(`${STAFF_ENDPOINTS.PATCH_DRIVER_LICENSE}?isApproved=false`, requestBody, {
        headers: {
          ...STAFF_API_CONFIG.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the rejected license from the list
      setDriverLicenses(prev => prev.filter(l => l.id !== licenseId));
      // alert(t('licenseRejectedSuccessfully') || 'License rejected successfully');
    } catch (error) {
      console.error('Failed to reject license:', error);
      // alert(t('failedToRejectLicense') || 'Failed to reject license. Please try again.');
    }
  };

  return {
    handleApprove,
    handleReject
  };
};