import { useState, useEffect } from 'react';
import { axiosInstance } from '../../../../../shared/utils/axiosInstance';
import { USER_ENDPOINTS, AUDIT_LOG_ENDPOINTS } from '../../../../../config/api';
import { ROLES } from '../../../../auth/utils';
import { sortByLatest } from '../../../../../shared/utils/SortByLatest';

export const useStaffLogs = () => {
  const [staffLogs, setStaffLogs] = useState([]);
  const [staffMap, setStaffMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStaffLogs = async () => {
      try {
        setLoading(true);

        // Fetch staff logs and all users in parallel
        const [logsResponse, usersResponse] = await Promise.all([
          axiosInstance.get(AUDIT_LOG_ENDPOINTS.GET_STAFF_LOGS),
          axiosInstance.get(USER_ENDPOINTS.GET_ALL_USERS)
        ]);

        // Create a map of staff users by ID
        const staffUsers = {};
        if (usersResponse.data && Array.isArray(usersResponse.data)) {
          usersResponse.data
            .filter(user => user.roleId === ROLES.STAFF)
            .forEach(user => {
              const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
              staffUsers[user.id] = {
                id: user.id,
                name: fullName || user.username || user.email || 'N/A',
                email: user.email || 'N/A',
                phone: user.phoneNumber || 'N/A',
              };
            });
        }

        setStaffMap(staffUsers);
        // Sort logs by timestamp (latest first)
        const sortedLogs = sortByLatest(logsResponse.data || [], 'timestamp');
        setStaffLogs(sortedLogs);
        setError(null);
      } catch (err) {
        console.error('Error fetching staff logs:', err);
        setError('Failed to load staff logs');
      } finally {
        setLoading(false);
      }
    };

    fetchStaffLogs();
  }, []);

  return {
    staffLogs,
    staffMap,
    loading,
    error
  };
};