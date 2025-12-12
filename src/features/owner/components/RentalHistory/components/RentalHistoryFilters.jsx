import { useTranslation } from 'react-i18next';
import DropdownTemplate from '../../../../../shared/components/DropdownTemplate';

const RentalHistoryFilters = ({
  searchTerm,
  setSearchTerm,
  carFilter,
  setCarFilter,
  statusFilter,
  setStatusFilter,
  bookingFeeStatusFilter,
  setBookingFeeStatusFilter,
  rentalFeeStatusFilter,
  setRentalFeeStatusFilter,
  additionalFeeStatusFilter,
  setAdditionalFeeStatusFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  carOptions,
  statusOptions,
  bookingFeeStatusOptions,
  rentalFeeStatusOptions,
  additionalFeeStatusOptions,
  clearDateFilters
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder={t('rentalHistory.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>

            <div className="w-full sm:w-auto sm:min-w-[180px]">
              <DropdownTemplate
                value={carFilter}
                onChange={(option) => setCarFilter(option.value)}
                options={carOptions}
                placeholder={t('rentalHistory.allCars')}
                searchable={true}
                searchPlaceholder={t('search')}
              />
            </div>

            <div className="w-full sm:w-auto sm:min-w-[140px]">
              <DropdownTemplate
                value={statusFilter}
                onChange={(option) => setStatusFilter(option.value)}
                options={statusOptions}
                placeholder={t('rentalHistory.allStatuses')}
                searchable={false}
              />
            </div>

            <div className="w-full sm:w-auto sm:min-w-[180px]">
              <DropdownTemplate
                value={bookingFeeStatusFilter}
                onChange={(option) => setBookingFeeStatusFilter(option.value)}
                options={bookingFeeStatusOptions}
                placeholder={t('rentalHistory.allBookingFeeStatuses')}
                searchable={false}
              />
            </div>

            <div className="w-full sm:w-auto sm:min-w-[180px]">
              <DropdownTemplate
                value={rentalFeeStatusFilter}
                onChange={(option) => setRentalFeeStatusFilter(option.value)}
                options={rentalFeeStatusOptions}
                placeholder={t('rentalHistory.allRentalFeeStatuses')}
                searchable={false}
              />
            </div>

            <div className="w-full sm:w-auto sm:min-w-[180px]">
              <DropdownTemplate
                value={additionalFeeStatusFilter}
                onChange={(option) => setAdditionalFeeStatusFilter(option.value)}
                options={additionalFeeStatusOptions}
                placeholder={t('rentalHistory.allAdditionalFeeStatuses')}
                searchable={false}
              />
            </div>
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-2 border-t border-gray-100">
          <label className="text-sm font-medium text-gray-700 whitespace-nowrap">{t('rentalHistory.customDateRange')}</label>
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 whitespace-nowrap">{t('rentalHistory.from')}</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600 whitespace-nowrap">{t('rentalHistory.to')}</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            {(startDate || endDate) && (
              <button
                onClick={clearDateFilters}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
              >
                {t('rentalHistory.clearDates')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalHistoryFilters;