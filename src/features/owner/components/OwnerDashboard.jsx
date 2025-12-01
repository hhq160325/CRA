<<<<<<< HEAD
const OwnerDashboard = () => {
  return (
    <div className="p-8 space-y-6 min-h-full bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-900">Car Owner Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Maintenance</h2>
          <p className="text-gray-600">Track upcoming maintenance and receive notifications.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Usage & Mileage</h2>
          <p className="text-gray-600">Monitor mileage and usage statistics by car.</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Rental Activity</h2>
          <p className="text-gray-600">View recent bookings and history.</p>
=======
import { useTranslation } from 'react-i18next';

const OwnerDashboard = () => {
  const { t } = useTranslation();
  
  return (
    <div className="p-8 space-y-6 min-h-full bg-gray-50">
      <h1 className="text-2xl font-bold text-gray-900">{t('ownerDashboardTitle')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">{t('maintenanceCard')}</h2>
          <p className="text-gray-600">{t('maintenanceDescription')}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">{t('usageAndMileageCard')}</h2>
          <p className="text-gray-600">{t('usageAndMileageDescription')}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-2">{t('rentalActivityCard')}</h2>
          <p className="text-gray-600">{t('rentalActivityDescription')}</p>
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;


