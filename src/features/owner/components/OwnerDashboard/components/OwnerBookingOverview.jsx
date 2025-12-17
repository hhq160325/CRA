import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useDashboardBookingData } from '../hooks/useDashboardBookingData';

const OwnerBookingOverview = ({ ownerCars = [] }) => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  
  // Use the separate booking data hook
  const { bookingData, bookingLoading } = useDashboardBookingData(ownerCars, selectedPeriod);

  // Custom tooltip to show day information
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Get the date from the payload data
      const dayData = payload[0].payload;
      const dayLabel = dayData.date || label; // Use date if available, otherwise use label
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-700 font-medium mb-2">{dayLabel}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Get period display text
  const getPeriodConfig = () => {
    switch (selectedPeriod) {
      case '7days':
        return {
          title: 'Booking Overview (Last 7 Days)',
          label: 'Last 7 Days'
        };
      case '7weeks':
        return {
          title: 'Booking Overview (Last 7 Weeks)',
          label: 'Last 7 Weeks'
        };
      case '7months':
        return {
          title: 'Booking Overview (Last 7 Months)',
          label: 'Last 7 Months'
        };
      default:
        return {
          title: 'Booking Overview',
          label: 'Last 7 Days'
        };
    }
  };

  const periodConfig = getPeriodConfig();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{t('bookingOverview')}</h2>
          <p className="text-sm text-gray-600 mt-1">{periodConfig.label}</p>
        </div>
        
        {/* Period Selection Dropdown */}
        <div className="relative">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="7weeks">Last 7 Weeks</option>
            <option value="7months">Last 7 Months</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>
      </div>
      {bookingLoading ? (
        <div className="flex items-center justify-center h-60">
          <div className="text-gray-500">Loading chart data...</div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={bookingData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            allowDecimals={false}
            domain={[0, 'dataMax + 10']}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px' }}
            iconType="circle"
          />
          <Bar dataKey="pending" stackId="a" fill="#f59e0b" name={t('pendingBookings')} radius={[0, 0, 0, 0]} />
          <Bar dataKey="confirmed" stackId="a" fill="#3b82f6" name={t('confirmedBookings')} radius={[0, 0, 0, 0]} />
          <Bar dataKey="completed" stackId="a" fill="#10b981" name={t('completedBookings')} radius={[0, 0, 0, 0]} />
          <Bar dataKey="cancelled" stackId="a" fill="#ef4444" name={t('cancelledBookings')} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      )}
    </div>
  );
};

export default OwnerBookingOverview;
