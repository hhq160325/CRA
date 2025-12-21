import { useTranslation } from 'react-i18next';
import DropdownTemplate from '../../../../../shared/components/DropdownTemplate';

const StaffFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  roleFilter,
  setRoleFilter,
  filteredCount,
  totalCount
}) => {
  const { t } = useTranslation();

  // COMMENTED OUT: Status options for dropdown
  // const statusOptions = [
  //   { id: 'all', value: 'all', label: t('allStatus') },
  //   { id: 'active', value: 'active', label: t('active') },
  //   { id: 'pending', value: 'pending', label: t('pending') },
  //   { id: 'suspended', value: 'suspended', label: t('suspended') }
  // ];

  // Role options for dropdown
  const roleOptions = [
    { id: 'all', value: 'all', label: t('allRoles') },
    { id: 'staff', value: 'staff', label: t('staff') },
    { id: 'carOwner', value: 'car owner', label: t('carOwner') }
  ];

  // COMMENTED OUT: Status change handler
  // const handleStatusChange = (option) => {
  //   setStatusFilter(option.value);
  // };

  const handleRoleChange = (option) => {
    setRoleFilter(option.value);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          {/* Search Input */}
          <div className="relative">
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={t('searchStaff')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* COMMENTED OUT: Status Filter */}
          {/* <DropdownTemplate
            value={statusFilter}
            onChange={handleStatusChange}
            options={statusOptions}
            placeholder={t('allStatus')}
            className="min-w-[140px]"
          /> */}

          {/* Role Filter */}
          <DropdownTemplate
            value={roleFilter}
            onChange={handleRoleChange}
            options={roleOptions}
            placeholder={t('allRoles')}
            className="min-w-[140px]"
          />
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600">
          {t('showing')} {filteredCount} {t('of')} {totalCount} {t('members')}
        </div>
      </div>
    </div>
  );
};

export default StaffFilters;