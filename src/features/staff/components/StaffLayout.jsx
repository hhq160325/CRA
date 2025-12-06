import { Outlet, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LogoutButton from '../../../shared/components/LogoutButton';

const StaffLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm min-h-screen">
        <div className="px-6 pt-4">
          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">{t('staffMenu')}</h2>
            <nav className="space-y-2">
              <Link
                to="/staff"
                className={`flex items-center px-3 py-2 rounded-lg ${location.pathname === '/staff'
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
                to="/staff/car-owners"
                className={`flex items-center px-3 py-2 rounded-lg ${location.pathname === '/staff/car-owners'
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                {t('carOwnerAccounts')}
              </Link>
              <Link
                to="/staff/bookings"
                className={`flex items-center px-3 py-2 rounded-lg ${location.pathname === '/staff/bookings'
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {t('monitorBookings')}
              </Link>
              <Link
                to="/staff/rental-monitoring"
                className={`flex items-center px-3 py-2 rounded-lg ${location.pathname === '/staff/rental-monitoring'
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {t('rentalMonitoring')}
              </Link>
              <Link
                to="/staff/customers"
                className={`flex items-center px-3 py-2 rounded-lg ${location.pathname === '/staff/customers'
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
                {t('customerAccounts')}
              </Link>
              <Link
                to="/staff/notifications"
                className={`flex items-center px-3 py-2 rounded-lg ${location.pathname === '/staff/notifications'
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.828 7l2.828 2.828L5.828 12l-2.828-2.828L4.828 7zM9 11H1m22 6l-3-3m-3 3l3-3M8 21l4-7h7l-4 7H8z" />
                </svg>
                {t('sendNotifications')}
              </Link>
              <Link
                to="/staff/parklot-create"
                className={`flex items-center px-3 py-2 rounded-lg ${location.pathname === '/staff/parklot-create'
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {t('createParkingLot')}
              </Link>
              <Link
                to="/staff/reg-docs"
                className={`flex items-center px-3 py-2 rounded-lg ${location.pathname === '/staff/reg-docs'
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t('registrationDocuments')}
              </Link>
            </nav>
          </div>

          {/* <div className="mb-8">
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
          </div> */}

          <div className="pt-4 border-t">
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Page Content */}
        <main className="h-full overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;