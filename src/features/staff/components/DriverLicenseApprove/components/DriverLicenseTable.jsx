import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Pagination from '../../../../../shared/components/Pagination';
import { getStatusBadge, getStatusText } from '../utils/driverLicenseUtils';

const DriverLicenseTable = ({ 
  currentItems, 
  openModal, 
  handleApprove, 
  handleReject, 
  currentPage, 
  totalItems, 
  itemsPerPage, 
  onPageChange,
  driverLicenses 
}) => {
  const { t } = useTranslation();
  const loading = useSelector((state) => state.staff.loading.driverLicenses);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (currentItems.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium">{t('noLicensesFound') || 'No licenses found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                {t('user') || 'User'}
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                {t('licenseImage') || 'License Image'}
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                {t('submittedDate') || 'Submitted Date'}
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                {t('status') || 'Status'}
              </th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">
                {t('actions') || 'Actions'}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentItems.map((license) => (
              <tr key={license.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900 text-sm">{license.customerName}</div>
                  <div className="text-xs text-gray-500">{license.licenseNumber}</div>
                </td>
                <td className="py-4 px-6">
                  {license.url ? (
                    <div className="flex items-center space-x-2">
                      <img
                        src={license.url}
                        alt="License thumbnail"
                        className="w-20 h-14 object-cover rounded border border-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => openModal(license)}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="56"%3E%3Crect fill="%23f3f4f6" width="80" height="56"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="10" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ENo image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      {license.urls && license.urls.length > 1 && (
                        <span className="text-xs text-gray-500">+{license.urls.length - 1}</span>
                      )}
                    </div>
                  ) : (
                    <div className="w-20 h-14 bg-gray-100 rounded border border-gray-300 flex items-center justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-gray-600">{license.submittedDate}</div>
                </td>
                <td className="py-4 px-6">
                  <span className={getStatusBadge(license.status)}>
                    {getStatusText(license.status, t)}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openModal(license)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      {t('viewDetails') || 'View Details'}
                    </button>
                    {(license.status === 'active' || license.status === 'needmanualcheck') && (
                      <>
                        <button
                          onClick={() => {
                            handleApprove(license.id, driverLicenses, t);
                            toast.success(t('licenseApprovedSuccessfully') || 'License approved successfully');
                          }}
                          className="text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          {t('approve') || 'Approve'}
                        </button>
                        <button
                          onClick={() => {
                            handleReject(license.id, 'Rejected by staff', driverLicenses, t);
                            toast.success(t('licenseRejectedSuccessfully') || 'License rejected successfully');
                          }}
                          className="text-red-600 hover:text-red-700 text-sm font-medium"
                        >
                          {t('reject') || 'Reject'}
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
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

export default DriverLicenseTable;