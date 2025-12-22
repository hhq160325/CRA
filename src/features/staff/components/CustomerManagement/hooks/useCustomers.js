import { useState, useEffect } from 'react';
import axios from 'axios';
import { USER_ENDPOINTS, USER_API_CONFIG, BOOKING_ENDPOINTS, BOOKING_API_CONFIG } from '../../../../../config/api';
import { tokenUtils } from '../../../../auth/utils';

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const token = tokenUtils.getAccessToken();
      
      if (!token) {
        setError('Authentication required. Please log in.');
        setLoading(false);
        return;
      }

      // Fetch users, driver licenses, and bookings in parallel
      const [usersResponse, driverLicensesResponse, bookingsResponse] = await Promise.all([
        axios.get(USER_ENDPOINTS.GET_ALL_USERS, {
          headers: {
            ...USER_API_CONFIG.headers,
            'Authorization': `Bearer ${token}`,
          },
        }),
        axios.get(USER_ENDPOINTS.GET_ALL_DRIVER_LICENSE, {
          headers: {
            ...USER_API_CONFIG.headers,
            'Authorization': `Bearer ${token}`,
          },
        }).catch(err => {
          console.warn('Failed to fetch driver licenses:', err);
          return { data: [] };
        }),
        axios.get(BOOKING_ENDPOINTS.GET_ALL_BOOKINGS, {
          headers: {
            ...BOOKING_API_CONFIG.headers,
            'Authorization': `Bearer ${token}`,
          },
        }).catch(err => {
          console.warn('Failed to fetch bookings:', err);
          return { data: [] };
        })
      ]);

      // Create a map of userId to driver license verification status
      const driverLicenseMap = new Map();
      if (driverLicensesResponse.data && driverLicensesResponse.data.view && Array.isArray(driverLicensesResponse.data.view)) {
        driverLicensesResponse.data.view.forEach(license => {
          let verificationStatus = 'Pending';
          if (license.status) {
            const status = license.status.toLowerCase();
            if (status === 'autoapproved' || status === 'approved') {
              verificationStatus = 'AutoApproved';
            } else if (status === 'pending') {
              verificationStatus = 'Pending';
            } else if (status === 'manualapproved') {
              verificationStatus = 'ManualApproved';
            } else if (status === 'needmanualcheck') {
              verificationStatus = 'NeedManualCheck';
            } else if (status === 'rejected' || status === 'denied') {
              verificationStatus = 'Rejected';
            } else {
              verificationStatus = 'Pending';
            }
          }
          driverLicenseMap.set(license.userId, verificationStatus);
        });
      }

      // Create a map of userId to booking count and calculate total spent and last booking
      const bookingStatsMap = new Map();
      if (bookingsResponse.data && Array.isArray(bookingsResponse.data)) {
        bookingsResponse.data.forEach(booking => {
          const userId = booking.customerId || booking.userId;
          if (userId) {
            const currentStats = bookingStatsMap.get(userId) || {
              totalBookings: 0,
              totalSpent: 0,
              lastBooking: null
            };

            currentStats.totalBookings += 1;
            
            // Add to total spent if booking has a total amount
            if (booking.totalAmount || booking.totalPrice || booking.amount) {
              const amount = booking.totalAmount || booking.totalPrice || booking.amount;
              currentStats.totalSpent += parseFloat(amount) || 0;
            }

            // Update last booking date
            const bookingDate = booking.createdAt || booking.bookingDate || booking.startDate;
            if (bookingDate) {
              const currentBookingDate = new Date(bookingDate);
              if (!currentStats.lastBooking || currentBookingDate > new Date(currentStats.lastBooking)) {
                currentStats.lastBooking = bookingDate;
              }
            }

            bookingStatsMap.set(userId, currentStats);
          }
        });
      }
      console.log("bookingStatsMap",bookingStatsMap);
      
      // Filter users to only customers (roleId = 1) first
      const customerUsers = usersResponse.data.filter(user => user.roleId === 1);

      // Transform API data to match component structure
      const transformedCustomers = customerUsers.map(user => {
        const licenseVerification = driverLicenseMap.get(user.id);
        const verificationStatus = licenseVerification || (user.isVerified ? 'AutoApproved' : 'Pending');
        const bookingStats = bookingStatsMap.get(user.id) || {
          totalBookings: 0,
          totalSpent: 0,
          lastBooking: null
        };
        // console.log("transformedCustomers",customerUsers);
        
        return {
          id: user.id,
          name: user.fullname || user.username || 'N/A',
          email: user.email || 'N/A',
          phone: user.phoneNumber || 'N/A',
          status: user.status,
          registrationDate: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A',
          totalBookings: bookingStats.totalBookings,
          totalSpent: bookingStats.totalSpent,
          lastBooking: bookingStats.lastBooking ? new Date(bookingStats.lastBooking).toLocaleDateString() : null,
          verificationStatus: verificationStatus,
          complianceIssues: 0,
          role: user.role || 'Customer',
          address: user.address || 'N/A',
          avatarUrl: user.avatarUrl || null,
          behaviourScore: user.behaviourScore || 0,
        };
      });

      setCustomers(transformedCustomers);
      setError(null);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError('Failed to load customers. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return {
    customers,
    loading,
    error,
    refetch: fetchCustomers
  };
};