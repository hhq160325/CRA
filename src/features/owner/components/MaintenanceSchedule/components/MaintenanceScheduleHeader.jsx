import { useTranslation } from 'react-i18next';
import { exportSchedulesToCSV } from '../utils/exportUtils';

const MaintenanceScheduleHeader = ({ filteredSchedules = [], totalSchedules = 0 }) => {
  const { t } = useTranslation();

  const handleExport = () => {
    if (!filteredSchedules || filteredSchedules.length === 0) {
      console.warn('No maintenance schedules to export');
      return;
    }

    try {
      const success = exportSchedulesToCSV(filteredSchedules, t);
      if (success) {
        // console.log(`Successfully exported ${filteredSchedules.length} maintenance schedule records`);
      }
    } catch (error) {
      console.error('Error exporting maintenance schedules:', error);
    }
  };

  const hasDataToExport = filteredSchedules && filteredSchedules.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('maintenanceSchedule.title')}</h1>
        <p className="text-gray-600">{t('maintenanceSchedule.subtitle')}</p>
        {totalSchedules > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            {t('maintenanceSchedule.showingResults', { 
              filtered: filteredSchedules.length, 
              total: totalSchedules 
            })}
          </p>
        )}
      </div>
      <div className="flex space-x-3">
        <button 
          onClick={handleExport}
          disabled={!hasDataToExport}
          title={hasDataToExport ? t('maintenanceSchedule.exportTooltip') : t('maintenanceSchedule.noDataToExport')}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
            ${hasDataToExport 
              ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-blue-400' 
              : 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
            />
          </svg>
          <span>{t('maintenanceSchedule.exportReport')}</span>
        </button>
        {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          {t('maintenanceSchedule.addMaintenanceRecord')}
        </button> */}
      </div>
    </div>
  );
};

export default MaintenanceScheduleHeader;