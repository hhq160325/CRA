
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { axiosInstance } from '../../../../shared/utils/axiosInstance';
import { BOOKING_ENDPOINTS, USER_ENDPOINTS } from '../../../../config/api';
import { getAllRegDocs, getAllUsers, getAllCars } from '../../api/carRegDocsApi';

const RecentActivities = () => {
  const { t } = useTranslation();
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBookingAction = (status) => {
      switch (status?.toLowerCase()) {
        case 'confirmed':
        case 'pending':
          return t('newBookingCreated');
        case 'cancelled':
          return t('bookingCancelled');
        case 'completed':
          return t('bookingCompleted');
        default:
          return t('newBookingCreated');
      }
    };

    const mapBookingStatus = (status) => {
      const statusLower = status?.toLowerCase() || 'pending';
      const statusMap = {
        'confirmed': 'confirmed',
        'pending': 'confirmed',
        'cancelled': 'cancelled',
        'completed': 'completed',
        'approved': 'approved'
      };
      return statusMap[statusLower] || 'confirmed';
    };

    const mapRegDocStatus = (status) => {
      const statusLower = status?.toLowerCase() || 'pending';
      const statusMap = {
        'pending': 'pending',
        'approved': 'approved',
        'rejected': 'rejected'
      };
      return statusMap[statusLower] || 'pending';
    };

    const getRelativeTime = (dateString) => {
      if (!dateString) return t('justNow');
      
      const date = new Date(dateString);
      const now = new Date();
      const diffInMs = now - date;
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

      if (diffInMinutes < 1) return t('justNow');
      if (diffInMinutes < 60) return `${diffInMinutes} ${t('minutesAgo')}`;
      if (diffInHours < 24) return `${diffInHours} ${t('hoursAgo')}`;
      return `${diffInDays} ${t('daysAgo')}`;
    };

    const fetchRecentActivities = async () => {
      try {
        setLoading(true);
        
        // Fetch all data in parallel
        const [bookingsResponse, regDocsData, usersData, carsData] = await Promise.all([
          axiosInstance.get(BOOKING_ENDPOINTS.GET_ALL_BOOKINGS),
          getAllRegDocs(),
          getAllUsers(),
          getAllCars()
        ]);

        const bookings = bookingsResponse.data || [];
        
        // Handle reg docs response structure with view and urls
        const regDocsViewData = regDocsData?.view || [];
        
        // Create lookup maps for users and cars
        const usersMap = new Map();
        const carsMap = new Map();
        
        // Populate users map (id -> user object)
        if (Array.isArray(usersData)) {
          usersData.forEach(user => {
            if (user.id) {
              usersMap.set(user.id, user);
            }
          });
        }
        
        // Populate cars map (id -> car object)
        if (Array.isArray(carsData)) {
          carsData.forEach(car => {
            if (car.id) {
              carsMap.set(car.id, car);
            }
          });
        }

        // Helper function to get user display name
        const getUserDisplayName = (user) => {
          if (!user) return 'Unknown User';
          
          // Try fullName or fullname first
          if (user.fullName) return user.fullName;
          if (user.fullname) return user.fullname;
          
          // Try first and last name
          const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
          if (fullName) return fullName;
          
          // Fall back to username
          if (user.username) return user.username;
          
          // Fall back to email
          if (user.email) return user.email;
          
          return 'Unknown User';
        };

        // Sort bookings by date (newest first) and take the latest 3
        const sortedBookings = bookings
          .sort((a, b) => new Date(b.createdAt || b.bookingDate) - new Date(a.createdAt || a.bookingDate))
          .slice(0, 3);

        // Sort registration documents by date (newest first) and take the latest 2
        const sortedRegDocs = regDocsViewData
          .sort((a, b) => new Date(b.createDate) - new Date(a.createDate))
          .slice(0, 2);

        // Combine activities
        const activities = [];

        // Add booking activities
        sortedBookings.forEach((booking, index) => {
          activities.push({
            id: `booking-${booking.id || index}`,
            type: 'booking',
            user: booking.customerName || 'Unknown User',
            action: getBookingAction(booking.status),
            car: booking.carModel || booking.carManufacturer || 'Unknown Car',
            timestamp: getRelativeTime(booking.createdAt || booking.bookingDate),
            status: mapBookingStatus(booking.status)
          });
        });

        // Add registration document activities
        sortedRegDocs.forEach((regDoc, index) => {
          const user = usersMap.get(regDoc.userId);
          const car = carsMap.get(regDoc.carId);
          
          activities.push({
            id: `regdoc-${regDoc.carId || index}`,
            type: 'verification',
            user: getUserDisplayName(user),
            action: t('documentSubmitted'),
            car: car ? `${car.manufacturer || ''} ${car.model || ''}`.trim() : 'Unknown Car',
            timestamp: getRelativeTime(regDoc.createDate),
            status: mapRegDocStatus(regDoc.status)
          });
        });

        // Sort all activities by timestamp and take the latest 5
        const sortedActivities = activities
          .sort((a, b) => {
            const timeA = parseRelativeTime(a.timestamp);
            const timeB = parseRelativeTime(b.timestamp);
            return timeA - timeB;
          })
          .slice(0, 5);

        setRecentActivities(sortedActivities);
      } catch (error) {
        console.error('Error fetching recent activities:', error);
        setRecentActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentActivities();
  }, [t]);

  const parseRelativeTime = (timeString) => {
    // Simple parser to convert relative time back to minutes for sorting
    if (!timeString) return 0;
    const match = timeString.match(/(\d+)/);
    if (!match) return 0;
    const value = parseInt(match[1]);
    if (timeString.includes('day')) return value * 24 * 60;
    if (timeString.includes('hour')) return value * 60;
    return value;
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case 'booking':
        return (
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        );
      case 'verification':
        return (
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'customer':
        return (
          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'confirmed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'approved':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'completed':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'updated':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{t('recentActivities')}</h2>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          {t('viewAll')}
        </button>
      </div>

      <div className="space-y-4">
        {recentActivities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {t('noRecentActivities')}
          </div>
        ) : (
          recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-4">
                {getActivityIcon(activity.type)}
                
                <div>
                  <h3 className="font-medium text-gray-900 text-sm">{activity.action}</h3>
                  <p className="text-sm text-gray-600">{t('by')} {activity.user}</p>
                  {activity.car && (
                    <p className="text-xs text-gray-500">{activity.car}</p>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-500 mb-2">{activity.timestamp}</div>
                <span className={getStatusBadge(activity.status)}>
                  {t(activity.status)}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivities;