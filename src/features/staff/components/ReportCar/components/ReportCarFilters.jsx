import { useTranslation } from 'react-i18next';
import DropdownTemplate from '../../../../../shared/components/DropdownTemplate';

const ReportCarFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  paymentStatusFilter,
  setPaymentStatusFilter,
  dateFilter,
  setDateFilter,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  filteredCount,
  totalCount
}) => {
  const { t } = useTranslation();

  // Status filter options
  const statusOptions = [
    { id: 'all', value: 'all', label: t('allStatus') },
    { id: 'confirmed', value: 'confirmed', label: t('confirmed') },
    { id: 'pending', value: 'pending', label: t('pending') },
    { id: 'completed', value: 'completed', label: t('completed') },
    { id: 'cancelled', value: 'cancelled', label: t('cancelled') },
    // { id: 'overdue', value: 'overdue', label: t('overdue') }
  ];

  // Payment status filter options
  const paymentStatusOptions = [
    { id: 'all', value: 'all', label: t('allPaymentStatus') },
    { id: 'success', value: 'success', label: t('success') },
    { id: 'pending', value: 'pending', label: t('pending') },
    { id: 'cancelled', value: 'cancelled', label: t('cancelled') }
  ];

  // Date filter options
  const dateFilterOptions = [
    { id: 'all', value: 'all', label: t('allDates') },
    { id: 'today', value: 'today', label: t('today') },
    { id: 'week', value: 'week', label: t('thisWeek') },
    { id: 'month', value: 'month', label: t('thisMonth') }
  ];

  // Sort by options
  // const sortByOptions = [
  //   { id: 'createDate', value: 'createDate', label: t('createDate') },
  //   { id: 'startDate', value: 'startDate', label: t('startDate') },
  //   { id: 'status', value: 'status', label: t('status') }
  // ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative">
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={t('searchBookings')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <DropdownTemplate
            value={statusFilter}
            onChange={(option) => setStatusFilter(option.value)}
            options={statusOptions}
            placeholder={t('allStatus')}
            className="min-w-[150px]"
          />
          
          <DropdownTemplate
            value={paymentStatusFilter}
            onChange={(option) => setPaymentStatusFilter(option.value)}
            options={paymentStatusOptions}
            placeholder={t('allPaymentStatus')}
            className="min-w-[150px]"
          />
          
          <DropdownTemplate
            value={dateFilter}
            onChange={(option) => setDateFilter(option.value)}
            options={dateFilterOptions}
            placeholder={t('allDates')}
            className="min-w-[120px]"
          />
        </div>
        
        {/* Sorting Controls */}
        <div className="flex items-center space-x-4">
          {/* <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">{t('sortBy')}:</label>
            <DropdownTemplate
              value={sortBy}
              onChange={(option) => setSortBy(option.value)}
              options={sortByOptions}
              placeholder={t('sortBy')}
              className="min-w-[120px]"
            />
            <button
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="p-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              title={sortOrder === 'desc' ? t('sortAscending') : t('sortDescending')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {sortOrder === 'desc' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                )}
              </svg>
            </button>
          </div> */}
          
          <div className="text-sm text-gray-600">
            {t('showing')} {filteredCount} {t('of')} {totalCount} {t('bookings')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportCarFilters;