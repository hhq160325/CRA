import { useTranslation } from 'react-i18next';

const BookingHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('bookingMonitoring')}</h1>
        <p className="text-gray-600">{t('monitorAndManageBookings')}</p>
      </div>
      <div className="flex space-x-3">
        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          {t('exportReport')}
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          {t('createManualBooking')}
        </button>
      </div>
    </div>
  );
};

export default BookingHeader;