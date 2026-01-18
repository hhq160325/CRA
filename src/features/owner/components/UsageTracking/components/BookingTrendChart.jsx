import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import axios from 'axios';
import { BOOKING_ENDPOINTS, API_CONFIG } from '../../../../../config/api';

const BookingTrendChart = ({ carId }) => {
  const { t } = useTranslation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('7days'); // '7days', '7months', '7years'

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(BOOKING_ENDPOINTS.GET_CAR_BOOKINGS(carId), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // Keep all bookings (including cancelled for complete data)
        setBookings(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        // Check if it's a 404 or empty response (not an actual error)
        if (err.response && err.response.status === 404) {
          setBookings([]);
          setError(null);
        } else if (err.response && err.response.data && Array.isArray(err.response.data) && err.response.data.length === 0) {
          setBookings([]);
          setError(null);
        } else {
          setError(t('usageTracking.errorLoadingBookings') || 'Error loading bookings');
        }
      } finally {
        setLoading(false);
      }
    };

    if (carId) {
      fetchBookings();
    }
  }, [carId, t]);

  const processBookingData = () => {
    if (!bookings.length) return [];

    const now = new Date();
    let data = [];

    if (timeRange === '7days') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];

        const dayBookings = bookings.filter(b => {
          if (!b.pickupTime) return false;
          const bookingDate = new Date(b.pickupTime).toISOString().split('T')[0];
          return bookingDate === dateStr;
        });

        // Count by status
        const pending = dayBookings.filter(b => b.status?.toLowerCase() === 'pending').length;
        const confirmed = dayBookings.filter(b => b.status?.toLowerCase() === 'confirmed').length;
        const completed = dayBookings.filter(b => b.status?.toLowerCase() === 'completed').length;
        const cancelled = dayBookings.filter(b =>
          b.status?.toLowerCase() === 'cancelled' || b.status?.toLowerCase() === 'canceled'
        ).length;

        data.push({
          name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          total: dayBookings.length,
          activeTotal: confirmed + completed, // Only Confirmed + Completed
          pending,
          confirmed,
          completed,
          cancelled,
        });
      }
    } else if (timeRange === '7months') {
      // Last 7 months
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        const year = date.getFullYear();
        const month = date.getMonth();

        const monthBookings = bookings.filter(b => {
          if (!b.pickupTime) return false;
          const bookingDate = new Date(b.pickupTime);
          return bookingDate.getFullYear() === year && bookingDate.getMonth() === month;
        });

        // Count by status
        const pending = monthBookings.filter(b => b.status?.toLowerCase() === 'pending').length;
        const confirmed = monthBookings.filter(b => b.status?.toLowerCase() === 'confirmed').length;
        const completed = monthBookings.filter(b => b.status?.toLowerCase() === 'completed').length;
        const cancelled = monthBookings.filter(b =>
          b.status?.toLowerCase() === 'cancelled' || b.status?.toLowerCase() === 'canceled'
        ).length;

        data.push({
          name: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          total: monthBookings.length,
          activeTotal: confirmed + completed, // Only Confirmed + Completed
          pending,
          confirmed,
          completed,
          cancelled,
        });
      }
    } else if (timeRange === '7years') {
      // Last 7 years
      for (let i = 6; i >= 0; i--) {
        const year = now.getFullYear() - i;

        const yearBookings = bookings.filter(b => {
          if (!b.pickupTime) return false;
          const bookingDate = new Date(b.pickupTime);
          return bookingDate.getFullYear() === year;
        });

        // Count by status
        const pending = yearBookings.filter(b => b.status?.toLowerCase() === 'pending').length;
        const confirmed = yearBookings.filter(b => b.status?.toLowerCase() === 'confirmed').length;
        const completed = yearBookings.filter(b => b.status?.toLowerCase() === 'completed').length;
        const cancelled = yearBookings.filter(b =>
          b.status?.toLowerCase() === 'cancelled' || b.status?.toLowerCase() === 'canceled'
        ).length;

        data.push({
          name: year.toString(),
          total: yearBookings.length,
          activeTotal: confirmed + completed, // Only Confirmed + Completed
          pending,
          confirmed,
          completed,
          cancelled,
        });
      }
    }

    return data;
  };

  const chartData = processBookingData();

  // Tooltip for Area Chart (Trend) - without cancelled
  const TrendTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-grey-600 font-medium">
              <span className="font-medium">{t('usageTracking.totalBookingsModal') || 'Total Bookings Modal'}:</span> {payload[0].payload.activeTotal}
            </p>
            <p className="text-sm text-blue-600 font-medium">
              <span className="font-medium">{t('usageTracking.confirmed') || 'Confirmed'}:</span> {payload[0].payload.confirmed}
            </p>
            <p className="text-sm text-green-600 font-medium">
              <span className="font-medium">{t('usageTracking.completed') || 'Completed'}:</span> {payload[0].payload.completed}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  // Tooltip for Line Chart (Status Breakdown) - with all statuses including cancelled
  const StatusTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-gray-900">
              <span className="font-medium">{t('usageTracking.totalBookingsModal') || 'Total'}:</span> {payload[0].payload.total}
            </p>
            {payload[0].payload.pending > 0 && (
              <p className="text-sm text-yellow-600">
                <span className="font-medium">{t('usageTracking.pending') || 'Pending'}:</span> {payload[0].payload.pending}
              </p>
            )}
            {payload[0].payload.confirmed > 0 && (
              <p className="text-sm text-blue-600">
                <span className="font-medium">{t('usageTracking.confirmed') || 'Confirmed'}:</span> {payload[0].payload.confirmed}
              </p>
            )}
            {payload[0].payload.completed > 0 && (
              <p className="text-sm text-green-600">
                <span className="font-medium">{t('usageTracking.completed') || 'Completed'}:</span> {payload[0].payload.completed}
              </p>
            )}
            {payload[0].payload.cancelled > 0 && (
              <p className="text-sm text-red-600">
                <span className="font-medium">{t('usageTracking.cancelled') || 'Cancelled'}:</span> {payload[0].payload.cancelled}
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{t('usageTracking.loadingBookings') || 'Loading bookings...'}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 font-medium">{t('usageTracking.noBookingData') || 'No Booking Data'}</p>
          <p className="text-sm text-gray-400 mt-1">{t('usageTracking.noBookingsYet') || 'No bookings have been made for this car yet'}</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalBookings = bookings.length;
  const pendingCount = bookings.filter(b => b.status?.toLowerCase() === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status?.toLowerCase() === 'confirmed').length;
  const completedCount = bookings.filter(b => b.status?.toLowerCase() === 'completed').length;
  const cancelledCount = bookings.filter(b =>
    b.status?.toLowerCase() === 'cancelled' || b.status?.toLowerCase() === 'canceled'
  ).length;

  // Calculate trend (comparing first half vs second half of data)
  // Only count Confirmed and Completed bookings for trend
  const midPoint = Math.floor(chartData.length / 2);
  const firstHalfTotal = chartData.slice(0, midPoint).reduce((sum, d) => sum + d.confirmed + d.completed, 0);
  const secondHalfTotal = chartData.slice(midPoint).reduce((sum, d) => sum + d.confirmed + d.completed, 0);
  const trendPercentage = firstHalfTotal > 0
    ? ((secondHalfTotal - firstHalfTotal) / firstHalfTotal * 100).toFixed(1)
    : 0;
  const isPositiveTrend = trendPercentage >= 0;

  return (
    <div className="space-y-4">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {/* {t('usageTracking.bookingTrend') || 'Booking Trend'} */}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('7days')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${timeRange === '7days'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {t('usageTracking.last7Days') || '7 Days'}
          </button>
          <button
            onClick={() => setTimeRange('7months')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${timeRange === '7months'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {t('usageTracking.last7Months') || '7 Months'}
          </button>
          <button
            onClick={() => setTimeRange('7years')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${timeRange === '7years'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {t('usageTracking.last7Years') || '7 Years'}
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">{t('usageTracking.totalBookings') || 'Total Bookings'}</p>
          <p className="text-2xl font-bold text-purple-600">{totalBookings}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">{t('usageTracking.pending') || 'Pending'}</p>
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">{t('usageTracking.confirmed') || 'Confirmed'}</p>
          <p className="text-2xl font-bold text-blue-600">{confirmedCount}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">{t('usageTracking.completed') || 'Completed'}</p>
          <p className="text-2xl font-bold text-green-600">{completedCount}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">{t('usageTracking.cancelled') || 'Cancelled'}</p>
          <p className="text-2xl font-bold text-red-600">{cancelledCount}</p>
        </div>
      </div>

      {/* Trend Indicator */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-4">
              {t('usageTracking.trend') || 'Trend'}
              {/* <span className="text-xs text-gray-500 ml-1">
                ({t('usageTracking.confirmedAndCompleted') || 'Confirmed & Completed'})
              </span> */}
            </p>
            {/* <p className="text-lg font-semibold text-gray-900">
              {isPositiveTrend ? (
                <span className="text-green-600 flex items-center gap-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  {t('usageTracking.increasing') || 'Increasing'}
                </span>
              ) : (
                <span className="text-red-600 flex items-center gap-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                  {t('usageTracking.decreasing') || 'Decreasing'}
                </span>
              )}
            </p> */}
          </div>
          {/* <div className="text-right">
            <p className="text-sm text-gray-600">{t('usageTracking.change') || 'Change'}</p>
            <p className={`text-2xl font-bold ${isPositiveTrend ? 'text-green-600' : 'text-red-600'}`}>
              {isPositiveTrend ? '+' : ''}{trendPercentage}%
            </p>
          </div> */}
        </div>
      </div>

      {/* Area Chart */}
      <div className="bg-gray-50 rounded-lg p-4">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#9333ea" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#9333ea" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#d1d5db' }}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#d1d5db' }}
              allowDecimals={false}
            />
            <Tooltip content={<TrendTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={() => t('usageTracking.bookings') || 'Bookings'}
            />
            <Area
              type="monotone"
              dataKey="activeTotal"
              stroke="#9333ea"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTotal)"
              name={t('usageTracking.confirmedAndCompleted') || 'Confirmed & Completed'}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Status Breakdown Line Chart */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">
          {t('usageTracking.statusBreakdown') || 'Status Breakdown'}
        </h4>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#d1d5db' }}
            />
            <YAxis
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#d1d5db' }}
              allowDecimals={false}
            />
            <Tooltip content={<StatusTooltip />} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line
              type="monotone"
              dataKey="pending"
              stroke="#eab308"
              strokeWidth={2}
              dot={{ r: 4 }}
              name={t('usageTracking.pending') || 'Pending'}
            />
            <Line
              type="monotone"
              dataKey="confirmed"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
              name={t('usageTracking.confirmed') || 'Confirmed'}
            />
            <Line
              type="monotone"
              dataKey="completed"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ r: 4 }}
              name={t('usageTracking.completed') || 'Completed'}
            />
            <Line
              type="monotone"
              dataKey="cancelled"
              stroke="#ef4444"
              strokeWidth={2}
              dot={{ r: 4 }}
              name={t('usageTracking.cancelled') || 'Cancelled'}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BookingTrendChart;
