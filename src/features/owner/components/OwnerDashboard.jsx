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
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;


