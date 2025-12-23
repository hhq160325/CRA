import { useTranslation } from 'react-i18next';
import { exportRentalsToCSV } from '../utils/exportUtils';

const RentalHistoryHeader = ({ filteredRentals = [], totalRentals = 0 }) => {
  const { t } = useTranslation();

  const handleExport = () => {
    if (filteredRentals.length === 0) {
      console.warn('No rental data to export');
      return;
    }

    const success = exportRentalsToCSV(filteredRentals, t);
    if (success) {
      console.log(`Successfully exported ${filteredRentals.length} rental records`);
    }
  };

  const isExportDisabled = filteredRentals.length === 0;

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('rentalHistory.title')}</h1>
        <p className="text-gray-600">{t('rentalHistory.subtitle')}</p>
        {totalRentals > 0 && (
          <p className="text-sm text-gray-500 mt-1">
            {t('rentalHistory.showingResults', { 
              filtered: filteredRentals.length, 
              total: totalRentals 
            })}
          </p>
        )}
      </div>
      <div className="flex space-x-3">
        <button 
          onClick={handleExport}
          disabled={isExportDisabled}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
            ${isExportDisabled 
              ? 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }
          `}
          title={isExportDisabled ? t('rentalHistory.noDataToExport') : t('rentalHistory.exportTooltip')}
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
          <span>{t('rentalHistory.exportReport')}</span>
        </button>
      </div>
    </div>
  );
};

export default RentalHistoryHeader;