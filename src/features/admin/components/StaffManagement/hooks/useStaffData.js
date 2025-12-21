import { useState, useEffect } from 'react';
import { axiosInstance } from '../../../../../shared/utils/axiosInstance';
import { USER_ENDPOINTS } from '../../../../../config/api';

export const useStaffData = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetchData = async () => {
    try {
      setLoading(true);
      
      const usersResponse = await axiosInstance.get(USER_ENDPOINTS.GET_ALL_USERS);  
      
      const includedRoles = [1002, 2];
      const staff = usersResponse.data
        .filter(user => includedRoles.includes(user.roleId))
        .map(user => {
          return {
            id: user.id,
            name: user.fullname || 'N/A',
            userName: user.username || 'N/A',
            email: user.email || 'N/A',
            phone: user.phoneNumber || 'N/A',
            status: user.status || 'active',
            roleId: user.roleId,
            roleName: user.roleId === 1002 ? 'Staff' : 'Car Owner',
            registrationDate: user.createdAt || user.registrationDate || 'N/A',
          };
        });
      
      setStaffMembers(staff);
      setError(null);
    } catch (err) {
      console.error('Error fetching staff data:', err);
      setError('Failed to load staff data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetchData();
  }, []);

  return {
    staffMembers,
    loading,
    error,
    refetchData
  };
};