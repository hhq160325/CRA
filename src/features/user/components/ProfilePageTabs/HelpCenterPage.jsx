import { useTranslation } from 'react-i18next';

const HelpCenterPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('helpCenter')}</h2>
      <p className="text-gray-600 mb-6">{t('helpCenterDescription')}</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button type="button" className="text-left w-full border rounded-lg p-4 hover:shadow">
          <h3 className="font-medium text-gray-900">{t('accountAndProfile')}</h3>
          <p className="text-sm text-gray-600 mt-1">{t('accountAndProfileDescription')}</p>
        </button>
        <button type="button" className="text-left w-full border rounded-lg p-4 hover:shadow">
          <h3 className="font-medium text-gray-900">{t('bookingAndRentals')}</h3>
          <p className="text-sm text-gray-600 mt-1">{t('bookingAndRentalsDescription')}</p>
        </button>
        <button type="button" className="text-left w-full border rounded-lg p-4 hover:shadow">
          <h3 className="font-medium text-gray-900">{t('troubleshooting')}</h3>
          <p className="text-sm text-gray-600 mt-1">{t('troubleshootingDescription')}</p>
        </button>
      </div>

      <div className="mt-8">
        <h3 className="font-medium text-gray-900 mb-2">{t('stillNeedHelp')}</h3>
        <div className="flex items-center gap-3">
          <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{t('contactSupport')}</button>
          <button type="button" className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">{t('openTicket')}</button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;


