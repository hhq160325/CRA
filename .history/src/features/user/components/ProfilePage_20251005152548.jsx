import React, { useState } from 'react';

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState({
    name: 'John Doe',
    joinDate: 'Join 10/9/2025',
    dateOfBirth: '30/9/2001',
    gender: 'Male',
    phoneNumber: '',
    email: 'example@gmail.com',
    facebook: '',
    google: 'JohnDoeGmail'
  });

  const [isEditing, setIsEditing] = useState({
    phoneNumber: false,
    email: false,
    facebook: false,
    google: false
  });

  const handleEdit = (field) => {
    setIsEditing(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleInputChange = (field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm p-6">
        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">MAIN MENU</h2>
          <nav className="space-y-2">
            <a href="#" className="flex items-center px-3 py-2 text-white bg-blue-600 rounded-lg">
              <span className="mr-3">🏠</span>
              My Profile
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <span className="mr-3">📋</span>
              Rental History
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <span className="mr-3">❤️</span>
              Favourite Car
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <span className="mr-3">💰</span>
              Reimburse
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <span className="mr-3">💬</span>
              Inbox
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <span className="mr-3">📅</span>
              Calendar
            </a>
          </nav>
        </div>

        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide mb-4">PREFERENCES</h2>
          <nav className="space-y-2">
            <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <span className="mr-3">⚙️</span>
              Settings
            </a>
            <a href="#" className="flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
              <span className="mr-3">❓</span>
              Help & Center
            </a>
            <div className="flex items-center px-3 py-2 text-gray-600">
              <span className="mr-3">🌙</span>
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
            <span className="mr-3">🚪</span>
            Log Out
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Account Information</h1>
              <button className="text-blue-600 hover:text-blue-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>

            <div className="flex items-start space-x-8">
              {/* Profile Image */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200">
                  <img 
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-4 text-center">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="flex items-center space-x-2">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-900">{userInfo.email}</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Verified</span>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                  <div className="flex items-center space-x-2">
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Google</label>
                  <div className="flex items-center space-x-2">
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