import { useTranslation } from 'react-i18next';

const RentalHistoryHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('rentalHistory.alterTitle')}</h1>
        <p className="text-gray-600">{t('rentalHistory.subtitle')}</p>
      </div>
      <div className="flex space-x-3">
        <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
          {t('rentalHistory.exportReport')}
        </button>
      </div>
    </div>
  );
};

export default RentalHistoryHeader;