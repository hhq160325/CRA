import { useTranslation } from 'react-i18next';

const SettingsPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('security')}</h2>
      <p className="text-gray-600 mb-6">{t('securityDescription')}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">{t('password')}</h3>
          <div className="space-y-3">
            <label className="block">
              <span className="text-sm text-gray-700">{t('newPassword')}</span>
              <input type="password" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="••••••" />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">{t('confirmPassword')}</span>
              <input type="password" className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" placeholder="••••••" />
            </label>
            <button type="button" className="mt-2 inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800">{t('updatePassword')}</button>
          </div>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">{t('emailVerificationStatus')}</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-700">{t('email')}</div>
                <div className="text-gray-900 font-medium">user@example.com</div>
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">{t('unverified')}</span>
            </div>
            <p className="text-sm text-gray-600">{t('verifyEmailDescription')}</p>
            <button type="button" className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{t('sendVerificationEmail')}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;


