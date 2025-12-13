import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { getAllUsers } from '../../../admin/adminapi/adminAPI';

const CustomerAccountOverview = () => {
  const { t } = useTranslation();
  const [userStats, setUserStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    unverifiedUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setLoading(true);
        const users = await getAllUsers();
        
        // Calculate user statistics
        const totalUsers = users.length;
        const verifiedUsers = users.filter(user => user.isVerified === true).length;
        const unverifiedUsers = users.filter(user => user.isVerified === false).length;

        setUserStats({
          totalUsers,
          verifiedUsers,
          unverifiedUsers
        });
      } catch (error) {
        console.error('Failed to fetch user statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  // Data for pie chart
  const pieData = [
    {
      name: t('verifiedUsers') || 'Verified Users',
      value: userStats.verifiedUsers,
      color: '#10B981'
    },
    {
      name: t('unverifiedUsers') || 'Unverified Users',
      value: userStats.unverifiedUsers,
      color: '#F59E0B'
    }
  ];

  // Data for bar chart
  const barData = [
    {
      name: t('totalUsers') || 'Total Users',
      count: userStats.totalUsers,
      fill: '#3B82F6'
    },
    {
      name: t('verifiedUsers') || 'Verified',
      count: userStats.verifiedUsers,
      fill: '#10B981'
    },
    {
      name: t('unverifiedUsers') || 'Unverified',
      count: userStats.unverifiedUsers,
      fill: '#F59E0B'
    }
  ];

  const COLORS = ['#10B981', '#F59E0B'];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{`${payload[0].name}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          {t('customerAccountOverview') || 'Customer Account Overview'}
        </h2>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{userStats.totalUsers.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{t('totalUsers') || 'Total Users'}</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-green-600">{userStats.verifiedUsers.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{t('verifiedUsers') || 'Verified Users'}</p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-yellow-600">{userStats.unverifiedUsers.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{t('unverifiedUsers') || 'Unverified Users'}</p>
                </div>
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('userVerificationStatus') || 'User Verification Status'}
              </h3>
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                {/* Custom Legend */}
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4 mt-2">
                  {pieData.map((entry, index) => (
                    <div key={`legend-${index}`} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-xs sm:text-sm text-gray-600">
                        {entry.name}: {entry.value} ({userStats.totalUsers > 0 ? ((entry.value / userStats.totalUsers) * 100).toFixed(0) : 0}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bar Chart */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {t('userStatistics') || 'User Statistics'}
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={120}
                  />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Verification Rate */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-gray-900">
                {t('verificationRate') || 'Verification Rate'}
              </h3>
              <span className="text-sm text-gray-600">
                {userStats.totalUsers > 0 
                  ? `${((userStats.verifiedUsers / userStats.totalUsers) * 100).toFixed(1)}%`
                  : '0%'
                }
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-600 h-3 rounded-full transition-all duration-300"
                style={{ 
                  width: userStats.totalUsers > 0 
                    ? `${(userStats.verifiedUsers / userStats.totalUsers) * 100}%`
                    : '0%'
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {userStats.verifiedUsers} {t('of') || 'of'} {userStats.totalUsers} {t('usersVerified') || 'users verified'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerAccountOverview;