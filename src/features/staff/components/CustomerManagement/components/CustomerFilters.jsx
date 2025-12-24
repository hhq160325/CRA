import { useTranslation } from 'react-i18next';
import DropdownTemplate from '../../../../../shared/components/DropdownTemplate';

const CustomerFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  sortByScore,
  setSortByScore,
  filteredCount,
  totalCount
}) => {
  const { t } = useTranslation();

  // Status filter options
  const statusOptions = [
    { id: 'all', value: 'all', label: t('allStatus') || 'All Status' },
    { id: 'active', value: 'Active', label: t('active') || 'Active' },
    { id: 'pending', value: 'Pending', label: t('pending') || 'Pending' },
    { id: 'closed', value: 'Closed', label: t('suspended') || 'Suspended' }
  ];

  // Sort by score options
  const sortOptions = [
    { id: 'default', value: 'default', label: t('sortByBehaviourScore') || 'Sort by Behaviour Score' },
    { id: 'highest', value: 'highest', label: t('highestToLowest') || 'Highest to Lowest' },
    { id: 'lowest', value: 'lowest', label: t('lowestToHighest') || 'Lowest to Highest' }
  ];

  const handleStatusChange = (option) => {
    setStatusFilter(option.value);
  };

  const handleSortChange = (option) => {
    setSortByScore(option.value);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative">
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={t('searchCustomers')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <DropdownTemplate
            value={statusFilter}
            onChange={handleStatusChange}
            options={statusOptions}
            placeholder={t('selectStatus') || 'Select Status'}
            className="min-w-[150px]"
          />
          <DropdownTemplate
            value={sortByScore}
            onChange={handleSortChange}
            options={sortOptions}
            placeholder={t('sortByScore') || 'Sort by Score'}
            className="min-w-[200px]"
          />
        </div>
        <div className="text-sm text-gray-600">
          {t('showing')} {filteredCount} {t('of')} {totalCount} {t('customers')}
        </div>
      </div>
    </div>
  );
};

export default CustomerFilters;