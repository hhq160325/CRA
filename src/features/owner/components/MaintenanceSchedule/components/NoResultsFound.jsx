import { useTranslation } from 'react-i18next';

const NoResultsFound = ({ onClearFilters }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
      <div className="text-center">
        <svg 
          className="w-12 h-12 text-gray-400 mx-auto mb-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {t('maintenanceSchedule.noResultsFound')}
        </h3>
        <p className="text-gray-500 mb-4">
          {t('maintenanceSchedule.noResultsFoundMessage')}
        </p>
        <button
          onClick={onClearFilters}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('maintenanceSchedule.clearFilters')}
        </button>
      </div>
    </div>
  );
};

export default NoResultsFound;