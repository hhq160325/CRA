import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import LogoutButton from '../../../shared/components/LogoutButton';
import { selectUser } from '../../auth/authSlice';
import { ROLES } from '../../auth/utils';

// Combined ProfileSidebar component (previously separate)
const ProfileSidebar = () => {
  const { t } = useTranslation();
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();
  const user = useSelector(selectUser);
  const isStaff = user?.roleId === ROLES.STAFF;
  const isOwner = user?.roleId === 2;
  const isAdmin = user?.roleId === ROLES.ADMIN;

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/profile':
        return t('myProfile');
      case '/profile/rental_history':
        return t('rentalHistory');
      case '/profile/payment_history':
        return t('paymentHistory');
      case '/profile/favourite_car':
        return t('favouriteCars');
      case '/profile/inbox':
        return t('inbox');
      // case '/profile/calendar':
      //   return t('calendar');
      case '/profile/reimburse':
        return t('reimburse');
      case '/profile/security':
        return t('security');
      case '/profile/help_center':
        return t('helpCenter');
      default:
        return t('myProfile');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-full lg:w-64">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">{getPageTitle()}</h1>
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${showSidebar ? 'block' : 'hidden'} lg:block lg:sticky lg:top-6 pt-8`}>
        <div className="px-6 py-4 bg-white rounded-2 shadow p-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">{t('mainMenu')}</h2>
            <nav className="space-y-2">
              <Link
                to="/profile"
                className={`flex items-center px-3 py-2 rounded-lg ${isActive('/profile')
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {t('myProfile')}
              </Link>
              <Link
                to="/profile/rental_history"
                className={`flex items-center px-3 py-2 rounded-lg ${isActive('/profile/rental_history')
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                {t('Rental History')}
              </Link>
              <Link
                to="/profile/payment_history"
                className={`flex items-center px-3 py-2 rounded-lg ${isActive('/profile/payment_history')
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                {t('paymentHistory')}
              </Link>
              <Link
                to="/profile/favourite_car"
                className={`flex items-center px-3 py-2 rounded-lg ${isActive('/profile/favourite_car')
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {t('favouriteCar')}
              </Link>
              <Link to="/profile/reimburse" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/profile/reimburse')
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {t('reimburse')}
              </Link>
              <Link to="/profile/inbox" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/profile/inbox')
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                {t('inbox')}
              </Link>
              {/* <Link to="/profile/calendar" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/profile/calendar')
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {t('calendar')}
              </Link> */}
              {isOwner && (
                <Link to="/owner" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/owner')
                    ? 'text-white bg-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}>
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {t('ownerPage') || 'Owner Page'}
                </Link>
              )}
              {isStaff && (
                <Link to="/staff" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/staff')
                    ? 'text-white bg-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}>
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {t('staffPage') || 'Staff Page'}
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/admin')
                    ? 'text-white bg-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                    }`}>
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  {t('adminPage') || 'Admin Page'}
                </Link>
              )}
            </nav>
          </div>

          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">{t('preferences')}</h2>
            <nav className="space-y-2">
              <Link to="/profile/security" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/profile/security')
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t('security')}
              </Link>
              <Link to="/profile/help_center" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/profile/help_center')
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('helpCenter')}
              </Link>
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
    </div>
  );
};

const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto">
        <ProfileSidebar />

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;