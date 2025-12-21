import { useTranslation } from 'react-i18next';
import { getStatusBadge, getRoleBadge, formatDate } from '../utils/staffUtils';
// COMMENTED OUT: Car owner related imports
// import { formatPriceWithCurrency } from '../../../../../shared/utils/priceFormatter';
import Pagination from '../../../../../shared/components/Pagination';

const StaffTable = ({
  staffMembers,
  currentPage,
  itemsPerPage,
  onPageChange,
  onOpenModal
}) => {
  const { t } = useTranslation();

  // Pagination calculations
  const totalPages = Math.ceil(staffMembers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = staffMembers.slice(startIndex, endIndex);

  if (staffMembers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noStaffFound')}</h3>
        <p className="text-gray-600">{t('noStaffMatchingFilters')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('member')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('phone')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('email')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('role')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('status')}</th>
              {/* <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('joinDate')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('actions')}</th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentItems.map((staff) => (
              <tr key={staff.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{staff.name}</div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{staff.phone}</div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{staff.email}</div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={getRoleBadge(staff.roleName)}>
                    {staff.roleName}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={getStatusBadge(staff.status)}>
                    {staff.status}
                  </span>
                </td>
                {/* <td className="py-4 px-6 text-gray-600 text-sm">
                  {formatDate(staff.registrationDate)}
                </td> */}
                {/* <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onOpenModal(staff, 'view')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      {t('view')}
                    </button>
                    {staff.status === 'active' && (
                      <button
                        onClick={() => onOpenModal(staff, 'suspend')}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        {t('suspend')}
                      </button>
                    )}
                  </div>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {staffMembers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={staffMembers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default StaffTable;