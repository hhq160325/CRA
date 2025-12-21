import { useTranslation } from 'react-i18next';

const StaffHeader = ({ onExportData }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('StaffManagement')}</h1>
        <p className="text-gray-600">{t('viewAndManageStaffAndCarOwners')}</p>
      </div>
      <button 
        onClick={onExportData}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        {t('exportData')}
      </button>
    </div>
  );
};

export default StaffHeader;