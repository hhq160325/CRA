import { useTranslation } from 'react-i18next';
import { formatPriceWithCurrency } from '../../../../../shared/utils/priceFormatter';

const BookingViewModal = ({ 
  selectedBooking, 
  getStatusBadge, 
  getPaymentBadge, 
  onChangeModalType 
}) => {
  const { t } = useTranslation();
  
  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('bookingId')}</label>
            <p className="text-gray-900">{selectedBooking.bookingNumber}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('status')}</label>
            <span className={getStatusBadge(selectedBooking.status)}>
              {t(selectedBooking.status)}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('customer')}</label>
            <p className="text-gray-900">{selectedBooking.customer}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('carOwner')}</label>
            <p className="text-gray-900">{selectedBooking.carOwner}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('car')}</label>
            <p className="text-gray-900">{selectedBooking.car}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('totalAmount')}</label>
            <p className="text-gray-900">{formatPriceWithCurrency(selectedBooking.paidAmount)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('startDate')}</label>
            <p className="text-gray-900">{selectedBooking.startDate}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('endDate')}</label>
            <p className="text-gray-900">{selectedBooking.endDate}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('paymentStatus')}</label>
            <span className={getPaymentBadge(selectedBooking.paymentStatus)}>
              {t(selectedBooking.paymentStatus)}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('createdAt')}</label>
            <p className="text-gray-900">{selectedBooking.createDate}</p>
          </div>
        </div>
        {selectedBooking.notes && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('notes')}</label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedBooking.notes}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          onClick={() => onChangeModalType('edit')}
          className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          {t('edit')}
        </button>
        {selectedBooking.status === 'overdue' && (
          <button
            onClick={() => onChangeModalType('resolve')}
            className="px-4 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            {t('resolve')}
          </button>
        )}
        {(selectedBooking.status === 'pending' || selectedBooking.status === 'active') && (
          <button
            onClick={() => onChangeModalType('cancel')}
            className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            {t('cancel')}
          </button>
        )}
      </div>
    </>
  );
};

export default BookingViewModal;