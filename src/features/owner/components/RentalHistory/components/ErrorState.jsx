import { useTranslation } from 'react-i18next';

const ErrorState = ({ error, onRetry }) => {
  const { t } = useTranslation();

  return (
    <div className="p-8 min-h-full bg-gray-50">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-red-800 font-medium">{error}</p>
        <button
          onClick={onRetry}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          {t('rentalHistory.tryAgain')}
        </button>
      </div>
    </div>
  );
};

export default ErrorState;