import { Outlet, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LogoutButton from '../../../shared/components/LogoutButton';

const AdminLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm min-h-screen">
        <div className="px-6 pt-4">
          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">{t('mainMenu')}</h2>
            <nav className="space-y-2">
              <Link
                to="/admin"
                className={`flex items-center px-3 py-2 rounded-lg ${location.pathname === '/admin'
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {t('dashboard')}
              </Link>
              <Link
                to="/admin/operations"
                className={`flex items-center px-3 py-2 rounded-lg ${location.pathname === '/admin/operations'
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t('operationsDashboard')}
              </Link>
              <Link
                to="/admin/transactions"
                className={`flex items-center px-3 py-2 rounded-lg ${location.pathname === '/admin/transactions'
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                {t('transactionMonitoring')}
              </Link>
              <Link
                to="/admin/cars"
                className={`flex items-center px-3 py-2 rounded-lg ${location.pathname === '/admin/cars'
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                {t('carRent')}
              </Link>
              <Link
                to="/admin/insights"
                className={`flex items-center px-3 py-2 rounded-lg ${location.pathname === '/admin/insights'
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {t('insight')}
              </Link>
              <Link
                to="/admin/reimburse"
                className={`flex items-center px-3 py-2 rounded-lg ${location.pathname === '/admin/reimburse'
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {t('reimburse')}
              </Link>
              <Link
                to="/admin/inbox"
                className={`flex items-center px-3 py-2 rounded-lg ${location.pathname === '/admin/inbox'
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                {t('inbox')}
              </Link>
              <Link
                to="/admin/calendar"
                className={`flex items-center px-3 py-2 rounded-lg ${location.pathname === '/admin/calendar'
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {t('calendar')}
              </Link>
            </nav>
          </div>

          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">{t('preferences')}</h2>
            <nav className="space-y-2">
              <button
                type="button"
                className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t('settings')}
              </button>
              <button
                type="button"
                className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg w-full text-left"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('helpCenter')}
              </button>
              <div className="flex items-center px-3 py-2 text-gray-600">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span className="flex-1">{t('darkMode')}</span>
                <div className="relative">
                  <input type="checkbox" className="sr-only" />
                  <div className="w-10 h-6 bg-blue-600 rounded-full shadow-inner">
                    <div className="w-4 h-4 bg-white rounded-full shadow transform translate-x-5 translate-y-1"></div>
                  </div>
                </div>
              </div>
            </nav>
          </div>

          <div className="pt-4 border-t">
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Page Content */}
        <main className="h-full overflow-auto bg-gray-50 scrollbar-hide">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;