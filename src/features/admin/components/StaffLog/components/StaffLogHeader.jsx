import { useTranslation } from 'react-i18next';

const StaffLogHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('StaffLogs') || 'Staff Activity Logs'}
        </h1>
        <p className="text-gray-600">
          {t('viewStaffActivityLogs') || 'View and monitor staff activity logs'}
        </p>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        {t('exportData') || 'Export Data'}
      </button>
    </div>
  );
};

export default StaffLogHeader;