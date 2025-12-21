import { useTranslation } from 'react-i18next';
import Pagination from '../../../../../shared/components/Pagination';
import { getActionBadge, formatTimestamp } from '../utils/carHandoverUtils';

const CarHandoverTable = ({ 
  currentItems, 
  staffMap, 
  openModal, 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange 
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                {t('staff') || 'Staff'}
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                {t('type') || 'Type'}
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                {t('timestamp') || 'Timestamp'}
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                {t('scheduleId') || 'Schedule ID'}
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                {t('verificationMethod') || 'Verification Method'}
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                {t('actions') || 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentItems.map((log) => {
              const staff = staffMap[log.responsibleStaffId];
              return (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-medium text-gray-900 text-sm">
                        {staff ? staff.name : 'Unknown Staff'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {staff ? staff.email : log.responsibleStaffId}
                      </div>
                      {staff && staff.phone !== 'N/A' && (
                        <div className="text-xs text-gray-400">{staff.phone}</div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={getActionBadge(log.type)}>
                      {log.type || 'N/A'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-sm">
                    {formatTimestamp(log.timestamp)}
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-sm">
                    {log.scheduleId}
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-sm">
                    {log.verificationMethod}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openModal(log)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        {t('view') || 'View'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default CarHandoverTable;