import { useTranslation } from 'react-i18next';

const CarHandoverHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {t('CarHandoverLogs') || 'Car Handover Logs'}
        </h1>
        <p className="text-gray-600">
          {t('viewCarHandoverLogs') || 'View and monitor car handover activity logs'}
        </p>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
        {t('exportData') || 'Export Data'}
      </button>
    </div>
  );
};

export default CarHandoverHeader;