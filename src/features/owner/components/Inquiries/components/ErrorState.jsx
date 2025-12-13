import { useTranslation } from 'react-i18next';

const ErrorState = ({ error }) => {
  const { t } = useTranslation();

  return (
    <div className="p-8 space-y-6 min-h-full bg-gray-50">
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg className="w-12 h-12 text-red-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-lg font-semibold text-red-900 mb-2">{t('inquiries.errorLoadingInquiries')}</h3>
        <p className="text-red-700">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          {t('inquiries.tryAgain')}
        </button>
      </div>
    </div>
  );
};

export default ErrorState;