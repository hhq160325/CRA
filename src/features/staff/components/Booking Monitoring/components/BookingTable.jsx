import { useTranslation } from 'react-i18next';
import Pagination from '../../../../../shared/components/Pagination';
import { getStatusBadge, getStatusText, getPaymentBadge, getPaymentStatusText, formatCurrency } from '../utils/bookingUtils';

const BookingTable = ({ 
  bookings, 
  loading, 
  currentPage, 
  itemsPerPage, 
  onPageChange, 
  onOpenModal 
}) => {
  const { t } = useTranslation();

  // Pagination calculations
  const totalPages = Math.ceil(bookings.length / itemsPerPage);
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
          <p className="text-lg font-medium">{t('noBookingsFound')}</p>
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
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('bookingId')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('customer')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('car')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('duration')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('amount')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('status')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('paymentStatus')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentItems.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900 text-sm">{booking.bookingNumber}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900 text-sm">{booking.customer}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900 text-sm">{booking.car}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-gray-600">{booking.startDate}</div>
                  <div className="text-sm text-gray-600">{t('to')} {booking.endDate}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="font-medium text-gray-900 text-sm">
                    {formatCurrency(booking.paidAmount || booking.totalAmount)}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={getStatusBadge(booking.status)}>
                    {getStatusText(booking.status, t)}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={getPaymentBadge(booking.paymentStatus)}>
                    {getPaymentStatusText(booking.paymentStatus, t)}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onOpenModal(booking, 'view')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      {t('view')}
                    </button>
                    <button
                      onClick={() => onOpenModal(booking, 'edit')}
                      className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                    >
                      {t('edit')}
                    </button>
                    {booking.status === 'overdue' && (
                      <button
                        onClick={() => onOpenModal(booking, 'resolve')}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        {t('resolve')}
                      </button>
                    )}
                    {(booking.status === 'pending' || booking.status === 'active') && (
                      <button
                        onClick={() => onOpenModal(booking, 'cancel')}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        {t('cancel')}
                      </button>
                    )}
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

export default BookingTable;