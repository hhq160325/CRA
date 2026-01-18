import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { PAYMENT_ENDPOINTS, API_CONFIG } from '../../../../../config/api';

const PaymentBarChart = ({ carId }) => {
  const { t } = useTranslation();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('7days'); // '7days', '7months', '7years'

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('jwtToken');
        const response = await axios.get(PAYMENT_ENDPOINTS.GET_PAYMENT_BY_CAR_ID(carId), {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        // Filter only successful payments
        const successfulPayments = response.data.filter(
          payment => payment.status === 'Success' || payment.status === 'Paid'
        );

        setPayments(successfulPayments);
        setError(null);
      } catch (err) {
        console.error('Error fetching payments:', err);
        // Check if it's a 404 or empty response (not an actual error)
        if (err.response && err.response.status === 404) {
          setPayments([]);
          setError(null);
        } else if (err.response && err.response.data && Array.isArray(err.response.data) && err.response.data.length === 0) {
          setPayments([]);
          setError(null);
        } else {
          setError(t('usageTracking.errorLoadingPayments') || 'Error loading payments');
        }
      } finally {
        setLoading(false);
      }
    };

    if (carId) {
      fetchPayments();
    }
  }, [carId, t]);

  const processPaymentData = () => {
    if (!payments.length) return [];

    const now = new Date();
    let data = [];

    if (timeRange === '7days') {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        const dayPayments = payments.filter(p => {
          const paymentDate = new Date(p.createDate).toISOString().split('T')[0];
          return paymentDate === dateStr;
        });

        const total = dayPayments.reduce((sum, p) => sum + p.paidAmount, 0);

        data.push({
          name: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          amount: total,
          count: dayPayments.length,
        });
      }
    } else if (timeRange === '7months') {
      // Last 7 months
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        const year = date.getFullYear();
        const month = date.getMonth();

        const monthPayments = payments.filter(p => {
          const paymentDate = new Date(p.createDate);
          return paymentDate.getFullYear() === year && paymentDate.getMonth() === month;
        });

        const total = monthPayments.reduce((sum, p) => sum + p.paidAmount, 0);

        data.push({
          name: date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          amount: total,
          count: monthPayments.length,
        });
      }
    } else if (timeRange === '7years') {
      // Last 7 years
      for (let i = 6; i >= 0; i--) {
        const year = now.getFullYear() - i;

        const yearPayments = payments.filter(p => {
          const paymentDate = new Date(p.createDate);
          return paymentDate.getFullYear() === year;
        });

        const total = yearPayments.reduce((sum, p) => sum + p.paidAmount, 0);

        data.push({
          name: year.toString(),
          amount: total,
          count: yearPayments.length,
        });
      }
    }

    return data;
  };

  const chartData = processPaymentData();

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{payload[0].payload.name}</p>
          <p className="text-blue-600 font-medium">
            {formatCurrency(payload[0].value)}
          </p>
          <p className="text-sm text-gray-600">
            {payload[0].payload.count} {t('usageTracking.payments') || 'payments'}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">{t('usageTracking.loadingPayments') || 'Loading payments...'}</div>
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

  if (!payments.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 font-medium">{t('usageTracking.noPaymentData') || 'No Payment Data'}</p>
          <p className="text-sm text-gray-400 mt-1">{t('usageTracking.noPaymentsYet') || 'No payments have been made for this car yet'}</p>
        </div>
      </div>
    );
  }

  const totalAmount = payments.reduce((sum, p) => sum + p.paidAmount, 0);

  return (
    <div className="space-y-4">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {/* {t('usageTracking.paymentHistory') || 'Payment History'} */}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange('7days')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              timeRange === '7days'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('usageTracking.last7Days') || '7 Days'}
          </button>
          <button
            onClick={() => setTimeRange('7months')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              timeRange === '7months'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('usageTracking.last7Months') || '7 Months'}
          </button>
          <button
            onClick={() => setTimeRange('7years')}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              timeRange === '7years'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t('usageTracking.last7Years') || '7 Years'}
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">{t('usageTracking.totalPayments') || 'Total Revenue'}</p>
          <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalAmount)}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">{t('usageTracking.totalRentalModal') || 'Total Payments'}</p>
          <p className="text-2xl font-bold text-green-600">{payments.length}</p>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-gray-50 rounded-lg p-4">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#d1d5db' }}
            />
            <YAxis 
              tick={{ fill: '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: '#d1d5db' }}
              tickFormatter={(value) => {
                if (value >= 1000000) {
                  return `${(value / 1000000).toFixed(1)}M`;
                } else if (value >= 1000) {
                  return `${(value / 1000).toFixed(0)}K`;
                }
                return value;
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={() => t('usageTracking.revenue') || 'Revenue (VND)'}
            />
            <Bar 
              dataKey="amount" 
              fill="#3b82f6" 
              radius={[8, 8, 0, 0]}
              name={t('usageTracking.revenue') || 'Revenue'}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PaymentBarChart;
