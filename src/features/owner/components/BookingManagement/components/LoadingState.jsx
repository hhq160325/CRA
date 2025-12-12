import { useTranslation } from 'react-i18next';

const LoadingState = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">{t('bookingManagement.loadingBookings')}</p>
      </div>
    </div>
  );
};

export default LoadingState;