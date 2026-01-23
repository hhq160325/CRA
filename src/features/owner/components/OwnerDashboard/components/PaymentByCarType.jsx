import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { usePaymentByCarType } from '../hooks/usePaymentByCarType';

const PaymentByCarType = () => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  
  const { carTypePaymentData, totalRevenue, loading } = usePaymentByCarType(selectedPeriod);

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Color palette for different car types
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

  // Get period display text and Y-axis formatter
  const getPeriodConfig = () => {
    const formatYAxisValue = (value) => {
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}K`;
      } else {
        return value.toString();
      }
    };

    switch (selectedPeriod) {
      case '7days':
        return {
          title: 'Payment by Car Type (Last 7 Days)',
          yAxisFormatter: formatYAxisValue
        };
      case '7months':
        return {
          title: 'Payment by Car Type (Last 7 Months)',
          yAxisFormatter: formatYAxisValue
        };
      case '7years':
        return {
          title: 'Payment by Car Type (Last 7 Years)',
          yAxisFormatter: formatYAxisValue
        };
      default:
        return {
          title: 'Payment by Car Type',
          yAxisFormatter: formatYAxisValue
        };
    }
  };

  const periodConfig = getPeriodConfig();

  // Prepare chart data
  const chartData = carTypePaymentData.map(carType => ({
    name: carType.carType,
    revenue: carType.revenue,
    paymentCount: carType.paymentCount
  }));

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg max-w-xs">
          <p className="text-gray-700 font-medium mb-2">{data.name}</p>
          <p className="text-blue-600 font-semibold mb-2">
            Revenue: {formatVND(data.revenue)}
          </p>
          <p className="text-gray-500 text-xs border-t border-gray-200 pt-2">
            {data.paymentCount} {data.paymentCount === 1 ? 'payment' : 'payments'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-1">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">{t('Payment by Car Type')}</h2>
          <p className="text-sm text-gray-600">
            {selectedPeriod === '7days' && 'Last 7 days'}
            {selectedPeriod === '7months' && 'Last 7 months'}
            {selectedPeriod === '7years' && 'Last 7 years'}
          </p>
        </div>
        
        {/* Period Selection Dropdown */}
        <div className="relative z-50">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
          >
            <option value="7days">Last 7 Days</option>
            <option value="7months">Last 7 Months</option>
            <option value="7years">Last 7 Years</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Total Revenue Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-800">{t('totalRevenue')}</p>
            <p className="text-2xl font-bold text-blue-900">
              {loading ? 'Loading...' : formatVND(totalRevenue)}
            </p>
          </div>
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mt-6">
        <h3 className="text-md font-medium text-gray-700 mb-4">{periodConfig.title}</h3>
        <div className="w-full h-64 min-h-[256px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading chart data...</div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">No payment data available for this period</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={256}>
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
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={periodConfig.yAxisFormatter}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, (dataMax) => Math.max(dataMax * 1.3, 1000000)]}
                />
                <Tooltip content={<CustomTooltip />} cursor={false} wrapperStyle={{ zIndex: 10 }} />
                <Bar 
                  dataKey="revenue" 
                  radius={[4, 4, 0, 0]}
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentByCarType;
