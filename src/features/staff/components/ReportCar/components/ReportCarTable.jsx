import { useTranslation } from 'react-i18next';
import Pagination from '../../../../../shared/components/Pagination';
import { getStatusBadge, getStatusText, getPaymentBadge, getPaymentStatusText, formatCurrency } from '../utils/reportCarUtils';
import { convertToVietnamTime } from '../../../../../shared/utils/CheckUTC';

const ReportCarTable = ({
  bookings,
  loading,
  currentPage,
  itemsPerPage,
  onPageChange,
  onOpenModal
}) => {
  const { t } = useTranslation();

  // Helper function to format dates with Vietnam time conversion
  const formatDateWithVietnamTime = (dateString) => {
    if (!dateString) return '';
    try {
      const vietnamDate = convertToVietnamTime(dateString);
      return vietnamDate.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString; // Fallback to original string
    }
  };

  // Pagination calculations
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = bookings.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg font-medium">{t('noReportFound')}</p>
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
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('reportNo')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('customer')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('car')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('carOwner')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('bookingManagement.createDate')}</th>
              {/* <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('duration')}</th> */}
              {/* <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('amount')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('status')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('paymentStatus')}</th> */}
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentItems.map((reportCar) => (
              <tr key={reportCar.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900 text-sm">{reportCar.reportNo}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900 text-sm">{reportCar.reporterName}</div>
                  <div className="text-xs text-gray-500">{reportCar.reporterEmail}</div>
                  <div className="text-xs text-gray-400">{reportCar.reporterPhone}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900 text-sm">{reportCar.carName}</div>
                  <div className="text-xs text-gray-500">{reportCar.carLicensePlate}</div>
                  <div className="text-xs text-gray-400">{reportCar.carId}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900 text-sm">{reportCar.carOwner}</div>
                  <div className="text-xs text-gray-500">{reportCar.carEmail}</div>
                  <div className="text-xs text-gray-400">{reportCar.carPhoneNumber}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900 text-sm">
                    {formatDateWithVietnamTime(reportCar.createDate) || reportCar.createDateFormatted}
                  </div>
                </td>
                {/* <td className="py-4 px-6">
                  <div className="text-sm text-gray-600">
                    {formatDateWithVietnamTime(reportCar.startDate) || reportCar.startDate}
                  </div>
                </td> */}
                {/* <td className="py-4 px-6">
                  <div className="font-medium text-gray-900 text-sm">
                    {formatCurrency(reportCar.paidAmount || reportCar.totalAmount)}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={getStatusBadge(reportCar.status)}>
                    {getStatusText(reportCar.status, t)}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={getPaymentBadge(reportCar.paymentStatus)}>
                    {getPaymentStatusText(reportCar.paymentStatus, t)}
                  </span>
                </td> */}
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onOpenModal(reportCar, 'view')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      {t('view')}
                    </button>
                    {/* <button
                      onClick={() => onOpenModal(reportCar, 'edit')}
                      className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                    >
                      {t('edit')}
                    </button> */}
                    {/* {reportCar.status === 'overdue' && (
                      <button
                        onClick={() => onOpenModal(reportCar, 'resolve')}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        {t('resolve')}
                      </button>
                    )}
                    {(reportCar.status === 'pending' || reportCar.status === 'active') && (
                      <button
                        onClick={() => onOpenModal(reportCar, 'cancel')}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        {t('cancel')}
                      </button>
                    )} */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {bookings.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={bookings.length}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default ReportCarTable;