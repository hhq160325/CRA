import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PaymentSummary = ({ stats, dailyData }) => {
  const { t } = useTranslation();

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Generate last 7 days data (Mon-Sun)
  const generateLast7DaysData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const chartData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1]; // Adjust for Monday start
      
      // Find matching daily data or default to 0
      const dayData = dailyData?.find(d => {
        const dataDate = new Date(d.date);
        return dataDate.toDateString() === date.toDateString();
      });

      chartData.push({
        name: dayName,
        amount: dayData?.amount || 0,
        fill: '#3b82f6'
      });
    }

    return chartData;
  };

  const chartData = generateLast7DaysData();

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-700 font-medium">{label}</p>
          <p className="text-blue-600 font-semibold">
            {formatVND(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-1">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('paymentSummary')}</h2>
      <p className="text-sm text-gray-600 mb-4">Last 7 days</p>
      
      {/* Total Received Card */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-green-800">{t('totalReceived')}</p>
            <p className="text-2xl font-bold text-green-900">{formatVND(stats.totalReceived)}</p>
          </div>
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
      </div>
      {/* Bar Chart */}
      <div className="mt-6">
        <h3 className="text-md font-medium text-gray-700 mb-4">Payment Overview (Last 7 Days)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="amount" 
                radius={[4, 4, 0, 0]}
                fill={(entry) => entry.fill}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;