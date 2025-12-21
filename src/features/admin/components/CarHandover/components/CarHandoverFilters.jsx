import { useTranslation } from 'react-i18next';

const CarHandoverFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  actionFilter, 
  setActionFilter, 
  filteredCount, 
  totalCount 
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative">
            <svg 
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
            <input
              type="text"
              placeholder={t('searchCarHandoverLogs') || 'Search car handover logs...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">{t('allActions') || 'All Actions'}</option>
            <option value="pickup">{t('pickup') || 'Pickup'}</option>
            <option value="return">{t('return') || 'Return'}</option>
          </select>
        </div>
        <div className="text-sm text-gray-600">
          {t('showing') || 'Showing'} {filteredCount} {t('of') || 'of'} {totalCount} {t('logs') || 'logs'}
        </div>
      </div>
    </div>
  );
};

export default CarHandoverFilters;