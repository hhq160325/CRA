import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

const OwnerBookingOverview = ({ weeklyBookingData }) => {
  const { t } = useTranslation();
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{t('bookingOverview')}</h2>
        <span className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded-lg">{t('last7Days')}</span>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={weeklyBookingData}>
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
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '12px'
            }}
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
    </div>
  );
};

export default OwnerBookingOverview;
