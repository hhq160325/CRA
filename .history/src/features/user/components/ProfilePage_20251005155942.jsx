import { useState } from 'react';
import UpdateProfileDialog from './UpdateProfileDialog';
import UpdatePhoneDialog from './UpdatePhoneDialog';
import UpdateEmailDialog from './UpdateEmailDialog';

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    joinDate: 'Join 12/9/2025',
    dateOfBirth: '30/9/2001',
    gender: 'Male',
    phoneNumber: '',
    email: 'example@gmail.com',
    facebook: '',
    google: 'JohnDoeGmail'
  });

  const [dialogs, setDialogs] = useState({
    profile: false,
    phone: false,
    email: false
  });

  const openDialog = (type) => {
    setDialogs(prev => ({
      ...prev,
      [type]: true
    }));
  };

  const closeDialog = (type) => {
    setDialogs(prev => ({
      ...prev,
      [type]: false
    }));
  };

  const handleProfileUpdate = (profileData) => {
    setUserInfo(prev => ({
      ...prev,
      ...profileData
    }));
  };

  const handlePhoneUpdate = (phoneNumber) => {
    setUserInfo(prev => ({
      ...prev,
      phoneNumber
    }));
  };

  const handleEmailUpdate = (email) => {
    setUserInfo(prev => ({
      ...prev,
      email
    }));
  };

  const handleEdit = (field) => {
    switch (field) {
      case 'profile':
        openDialog('profile');
        break;
      case 'phoneNumber':
        openDialog('phone');
        break;
      case 'email':
        openDialog('email');
        break;
      default:
        console.log(`Edit ${field}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen">
          <div className="px-6 pt-4">
            <div className="mb-8">
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">MAIN MENU</h2>
              <nav className="space-y-2">
                <a href="#" className="flex items-center px-3 py-2 text-white bg-blue-600 rounded-lg">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  My Profile
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Rental History
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Favourite Car
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Reimburse
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  Inbox
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Calendar
                </a>
              </nav>
            </div>

            <div className="mb-8">
              <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">PREFERENCES</h2>
              <nav className="space-y-2">
                <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </a>
                <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Help & Center
                </a>
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
              <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Log Out
              </a>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-2xl font-semibold text-gray-900">Account Information</h1>
              <button 
                onClick={() => handleEdit('profile')}
                className="text-blue-600 hover:text-blue-700"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>

            <div className="flex items-start space-x-8">
              {/* Profile Image and Info */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900">{userInfo.name}</h2>
                  <p className="text-sm text-gray-500">{userInfo.joinDate}</p>
                </div>
              </div>

              {/* Profile Information */}
              <div className="flex-1 grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                  <div className="text-gray-900">{userInfo.dateOfBirth}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <div className="text-gray-900">{userInfo.gender}</div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="flex items-center justify-between">
                    {userInfo.phoneNumber ? (
                      <span className="text-gray-900">{userInfo.phoneNumber}</span>
                    ) : (
                      <span className="text-red-500 text-sm">Add Phone Number</span>
                    )}
                    <button
                      onClick={() => handleEdit('phoneNumber')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-900">{userInfo.email}</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Verified</span>
                    </div>
                    <button
                      onClick={() => handleEdit('email')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                  <div className="flex items-center justify-between">
                    {userInfo.facebook ? (
                      <span className="text-gray-900">{userInfo.facebook}</span>
                    ) : (
                      <span className="text-blue-600 text-sm cursor-pointer">Add link</span>
                    )}
                    <button
                      onClick={() => handleEdit('facebook')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Google</label>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900">{userInfo.google}</span>
                    <button
                      onClick={() => handleEdit('google')}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;