import { useTranslation } from 'react-i18next';

const LoadingState = () => {
  const { t } = useTranslation();

  return (
    <div className="p-8 flex items-center justify-center min-h-full bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{t('rentalHistory.loadingRentalHistory')}</p>
      </div>
    </div>
  );
};

export default LoadingState;