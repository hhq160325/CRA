import { useTranslation } from 'react-i18next';

const NoMaintenanceCars = () => {
  const { t } = useTranslation();

  return (
    <div className="p-8 min-h-full bg-gray-50">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
        <svg 
          className="w-16 h-16 text-blue-500 mx-auto mb-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <h3 className="text-xl font-semibold text-blue-900 mb-2">
          {t('maintenanceSchedule.noMaintenanceCars')}
        </h3>
        <p className="text-blue-700 max-w-md mx-auto">
          {t('maintenanceSchedule.noMaintenanceCarsMessage')}
        </p>
      </div>
    </div>
  );
};

export default NoMaintenanceCars;