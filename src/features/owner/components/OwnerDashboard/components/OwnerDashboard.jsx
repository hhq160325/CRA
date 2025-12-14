import { useTranslation } from 'react-i18next';
import { useDashboardData } from '../hooks/useDashboardData';
import StatsCards from './StatsCards';
import PaymentSummary from './PaymentSummary';
import RecentBookings from './RecentBookings';
import CarStatusSummary from './CarStatusSummary';
import RegDocStatusSummary from './RegDocStatusSummary';
import TopManufacturers from './TopManufacturers';
import OwnerBookingOverview from './OwnerBookingOverview';
import OwnerBookingStatus from './OwnerBookingStatus';
import LoadingSpinner from './LoadingSpinner';

const OwnerDashboard = () => {
  const { t } = useTranslation();
  const { stats, loading } = useDashboardData();

  if (loading) {
    return <LoadingSpinner />;
  }

  // Prepare booking status data for pie chart
  const bookingStatusChartData = [
    { name: 'Pending', value: stats.bookingStatusData.pending || 0, color: '#f59e0b' },
    { name: 'Confirmed', value: stats.bookingStatusData.confirmed || 0, color: '#3b82f6' },
    { name: 'Completed', value: stats.bookingStatusData.completed || 0, color: '#10b981' },
    { name: 'Cancelled', value: stats.bookingStatusData.cancelled || 0, color: '#ef4444' },
  ].filter(item => item.value > 0); // Only show statuses with bookings

  return (
    <div className="p-8 space-y-6 min-h-full bg-gray-50">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('ownerDashboardTitle')}</h1>
        <p className="text-gray-600">{t('ownerDashboardOverview')}</p>
      </div>
      {/* Top Stats Cards */}
      <StatsCards stats={stats} />

      {/* Second Row - Payment Summary and Recent Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaymentSummary stats={stats} />
        <RecentBookings bookings={stats.recentBookings} />
      </div>

      {/* Third Row - Car Status, RegDoc Status, and Booking Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CarStatusSummary carStatusData={stats.carStatusData} />
        <RegDocStatusSummary regDocStatusData={stats.regDocStatusData} />
        <OwnerBookingStatus bookingStatusChartData={bookingStatusChartData} />
      </div>

      {/* Fourth Row - Booking Overview and Top Manufacturers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OwnerBookingOverview weeklyBookingData={stats.weeklyBookingData} />
        <TopManufacturers topManufacturers={stats.topManufacturers} />
      </div>
    </div>
  );
};

export default OwnerDashboard;
