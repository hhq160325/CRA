import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogoutButton from '../../../shared/components/LogoutButton';
import MyProfile from './ProfilePageTabs/MyProfile';
import FavouriteCarPage from './ProfilePageTabs/FavouriteCarPage';
import RentalHistoryPage from './ProfilePageTabs/RentalHistoryPage';
import InboxPage from './ProfilePageTabs/InboxPage';
import CalendarPage from './ProfilePageTabs/CalendarPage';
import ReimbursePage from './ProfilePageTabs/ReimbursePage';
import SettingsPage from './ProfilePageTabs/SettingsPage';
import HelpCenterPage from './ProfilePageTabs/HelpCenterPage';

// Combined ProfileSidebar component (previously separate)
const ProfileSidebar = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/profile':
        return 'My Profile';
      case '/profile/rental-history':
        return 'Rental History';
      case '/profile/favourite-car':
        return 'Favourite Cars';
      case '/profile/inbox':
        return 'Inbox';
      case '/profile/calendar':
        return 'Calendar';
      case '/profile/reimburse':
        return 'Reimburse';
      case '/profile/settings':
        return 'Settings';
      case '/profile/help-center':
        return 'Help & Center';
      default:
        return 'My Profile';
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
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
      <div className={`${showSidebar ? 'block' : 'hidden'} lg:block w-full lg:w-64 bg-white shadow-sm min-h-screen lg:min-h-screen`}>
        <div className="px-6 pt-4">
          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">MAIN MENU</h2>
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
                My Profile
              </Link>
              <Link
                to="/profile/rental-history"
                className={`flex items-center px-3 py-2 rounded-lg ${isActive('/profile/rental-history')
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Rental History
              </Link>
              <Link
                to="/profile/favourite-car"
                className={`flex items-center px-3 py-2 rounded-lg ${isActive('/profile/favourite-car')
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Favourite Car
              </Link>
              <Link to="/profile/reimburse" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/profile/reimburse')
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Reimburse
              </Link>
              <Link to="/profile/inbox" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/profile/inbox')
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                Inbox
              </Link>
              <Link to="/profile/calendar" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/profile/calendar')
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Calendar
              </Link>
            </nav>
          </div>

          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">PREFERENCES</h2>
            <nav className="space-y-2">
              <Link to="/profile/settings" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/profile/settings')
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </Link>
              <Link to="/profile/help-center" className={`flex items-center px-3 py-2 rounded-lg ${isActive('/profile/help-center')
                  ? 'text-white bg-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Help & Center
              </Link>
              <div className="flex items-center px-3 py-2 text-gray-600">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <span className="flex-1">Dark Mode</span>
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
    </>
  );
};

const ProfilePage = () => {
  const location = useLocation();

  const renderContent = () => {
    switch (location.pathname) {
      case '/profile/rental-history':
        return <RentalHistoryPage />;
      case '/profile/favourite-car':
        return <FavouriteCarPage />;
      case '/profile/inbox':
        return <InboxPage />;
      case '/profile/calendar':
        return <CalendarPage />;
      case '/profile/reimburse':
        return <ReimbursePage />;
      case '/profile/settings':
        return <SettingsPage />;
      case '/profile/help-center':
        return <HelpCenterPage />;
      case '/profile':
      default:
        return <MyProfile />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        <ProfileSidebar />

        {/* Main Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;