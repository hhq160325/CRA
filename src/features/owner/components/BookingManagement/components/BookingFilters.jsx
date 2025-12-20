import { useTranslation } from 'react-i18next';
import { STATUS_FILTER_OPTIONS } from '../utils/filterUtils';
import DropdownTemplate from '../../../../../shared/components/DropdownTemplate';

const BookingFilters = ({ 
  searchTerm, 
  setSearchTerm, 
  statusFilter, 
  setStatusFilter, 
  filteredCount, 
  totalCount 
}) => {
  const { t } = useTranslation();

  // Transform STATUS_FILTER_OPTIONS for DropdownTemplate
  const statusOptions = STATUS_FILTER_OPTIONS.map(option => ({
    id: option.value,
    value: option.value,
    label: option.value === 'all' 
      ? t('bookingManagement.allStatuses') 
      : t(`bookingManagement.${option.value}Status`) || option.label
  }));

  // Handle status filter change
  const handleStatusChange = (selectedOption) => {
    setStatusFilter(selectedOption.value);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={t('bookingManagement.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
          
          {/* Replace select with DropdownTemplate */}
          <div className="min-w-[200px]">
            <DropdownTemplate
              value={statusFilter}
              onChange={handleStatusChange}
              options={statusOptions}
              placeholder={t('bookingManagement.selectStatus')}
              searchable={false}
              searchPlaceholder={t('bookingManagement.searchStatus')}
              className="w-full"
            />
          </div>
        </div>
        <div className="text-sm text-gray-600">
          {t('bookingManagement.showingResults', { filtered: filteredCount, total: totalCount })}
        </div>
      </div>
    </div>
  );
};

export default BookingFilters;