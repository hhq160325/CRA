import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading, setError } from '../../../staffSlice';
import axios from 'axios';
import { USER_ENDPOINTS, USER_API_CONFIG } from '../../../../../config/api';
import { sortByLatest } from '../../../../../shared/utils/SortByLatest';

export const useDriverLicenseData = () => {
  const dispatch = useDispatch();
  const [driverLicenses, setDriverLicenses] = useState([]);

  useEffect(() => {
    const fetchDriverLicensesAndUsers = async () => {
      dispatch(setLoading({ section: 'driverLicenses', loading: true }));
      try {
        const token = localStorage.getItem('jwtToken');

        // Fetch both driver licenses and users in parallel
        const [licensesResponse, usersResponse] = await Promise.all([
          axios.get(USER_ENDPOINTS.GET_ALL_DRIVER_LICENSE, {
            headers: {
              ...USER_API_CONFIG.headers,
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(USER_ENDPOINTS.GET_ALL_USERS, {
            headers: {
              ...USER_API_CONFIG.headers,
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          })
        ]);

        // Handle the new response structure
        const viewData = licensesResponse.data?.view || [];
        const usersData = usersResponse.data || [];

        // Create a map of userId to user data for quick lookup
        const userMap = {};
        usersData.forEach(user => {
          if (user.id) {
            userMap[user.id] = {
              fullname: user.fullname || user.username || `User ${user.id}`,
              email: user.email || ''
            };
          }
        });

        // Transform API data to match component structure
        const transformedData = viewData.map((license, index) => {
          // Get user data from user map
          const userData = userMap[license.userId] || { 
            fullname: `User ${license.userId}`, 
            email: '' 
          };

          // Normalize status to lowercase for consistency
          const normalizedStatus = (license.status || 'pending').toLowerCase();

          return {
            id: license.userId || index + 1,
            userId: license.userId,
            email: userData.email,
            customerName: userData.fullname,
            submittedDate: license.createDate ? new Date(license.createDate).toLocaleString() : 'N/A',
            status: normalizedStatus,
            urls: license.urls || [], // URLs are now directly in the license object
            url: license.urls?.[0] || null, // Primary image URL
            createDate: license.createDate,
            licenseNumber: license.licenseNumber,
            licenseName: license.licenseName,
            licenseDoB: license.licenseDoB,
            licenseClass: license.licenseClass,
            licenseIssue: license.licenseIssue,
            licenseExpiry: license.licenseExpiry,
            side: license.side
          };
        });

        // Sort by createDate (latest first) using shared utility
        const sortedData = sortByLatest(transformedData, 'createDate');

        setDriverLicenses(sortedData);
      } catch (error) {
        dispatch(setError({ section: 'driverLicenses', error: error.message }));
        setDriverLicenses([]);
        console.error('Failed to fetch driver licenses or users:', error);
      } finally {
        dispatch(setLoading({ section: 'driverLicenses', loading: false }));
      }
    };

    fetchDriverLicensesAndUsers();
  }, [dispatch]);

  return {
    driverLicenses,
    setDriverLicenses
  };
};