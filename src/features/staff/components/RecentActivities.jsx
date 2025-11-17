
import { useTranslation } from 'react-i18next';

const RecentActivities = () => {
  const { t } = useTranslation();
  // Mock data for recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'booking',
      user: 'Alice Cooper',
      action: t('newBookingCreated'),
      car: 'Tesla Model 3',
      timestamp: '5 minutes ago',
      status: 'confirmed'
    },
    {
      id: 2,
      type: 'verification',
      user: 'Bob Johnson',
      action: t('carOwnerVerificationCompleted'),
      car: 'BMW X5',
      timestamp: '15 minutes ago',
      status: 'approved'
    },
    {
      id: 3,
      type: 'booking',
      user: 'Carol Smith',
      action: t('bookingCancelled'),
      car: 'Audi A4',
      timestamp: '1 hour ago',
      status: 'cancelled'
    },
    {
      id: 4,
      type: 'customer',
      user: 'David Wilson',
      action: t('customerAccountUpdated'),
      car: null,
      timestamp: '2 hours ago',
      status: 'updated'
    },
    {
      id: 5,
      type: 'booking',
      user: 'Emma Davis',
      action: t('bookingCompleted'),
      car: 'Mercedes C-Class',
      timestamp: '3 hours ago',
      status: 'completed'
    }
  ];

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
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{t('recentActivities')}</h2>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          {t('viewAll')}
        </button>
      </div>

      <div className="space-y-4">
        {recentActivities.map((activity) => (
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
        ))}
      </div>
    </div>
  );
};

export default RecentActivities;