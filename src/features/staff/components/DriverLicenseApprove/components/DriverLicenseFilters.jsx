import { useTranslation } from 'react-i18next';

const DriverLicenseFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter, 
  filteredCount, 
  totalCount 
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
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
              placeholder={t('searchLicenses') || 'Search licenses...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">{t('allStatus') || 'All Status'}</option>
            <option value="pending">{t('pending') || 'Pending'}</option>
            <option value="approved">{t('approved') || 'Approved'}</option>
            <option value="rejected">{t('rejected') || 'Rejected'}</option>
          </select>
        </div>
        <div className="text-sm text-gray-600">
          {t('showing') || 'Showing'} {filteredCount} {t('of') || 'of'} {totalCount} {t('licenses') || 'licenses'}
        </div>
      </div>
    </div>
  );
};

export default DriverLicenseFilters;