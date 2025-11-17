import { useTranslation } from 'react-i18next';

const BookingResolveModal = ({ selectedBooking, onResolve, onClose }) => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <svg className="w-5 h-5 text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              {t('resolveOverdueBooking')}
            </h3>
            <p className="mt-2 text-sm text-yellow-700">
              {t('resolveOverdueWarning')} <strong>{selectedBooking.bookingId}</strong> {t('asCompleted')}
              {' '}{t('resolveOverdueDescription')}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">{t('bookingDetailsLabel')}</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p><span className="font-medium">{t('customer')}:</span> {selectedBooking.customer}</p>
          <p><span className="font-medium">{t('car')}:</span> {selectedBooking.car}</p>
          <p><span className="font-medium">{t('expectedEnd')}:</span> {selectedBooking.endDate}</p>
          <p><span className="font-medium">{t('amount')}:</span> ${selectedBooking.totalAmount}</p>
          <p><span className="font-medium">{t('currentNotes')}:</span> {selectedBooking.notes || t('noNotes')}</p>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          {t('cancel')}
        </button>
        <button
          onClick={onResolve}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {t('markAsCompleted')}
        </button>
      </div>
    </div>
  );
};

export default BookingResolveModal;