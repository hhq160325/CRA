import { useState } from 'react';
import UpdateProfileDialog from './MyProfileDialog/UpdateProfileDialog';
import UpdatePhoneDialog from './MyProfileDialog/UpdatePhoneDialog';
import UpdateEmailDialog from './MyProfileDialog/UpdateEmailDialog';

const MyProfile = () => {
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
    <>
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8">
          <h1 className="hidden lg:block text-2xl font-semibold text-gray-900">Account Information</h1>
          <h1 className="lg:hidden text-xl font-semibold text-gray-900 mb-4 sm:mb-0">Account Information</h1>
          <button
            onClick={() => handleEdit('profile')}
            className="text-blue-600 hover:text-blue-700 self-start sm:self-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
          {/* Profile Image and Info */}
          <div className="flex-shrink-0 flex flex-col items-center lg:items-start">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center lg:text-left">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{userInfo.name}</h2>
              <p className="text-sm text-gray-500">{userInfo.joinDate}</p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <div className="text-gray-900">{userInfo.dateOfBirth}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <div className="text-gray-900">{userInfo.gender}</div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <div className="flex items-center justify-between">
                {userInfo.phoneNumber ? (
                  <span className="text-gray-900 break-all">{userInfo.phoneNumber}</span>
                ) : (
                  <span className="text-red-500 text-sm">Add Phone Number</span>
                )}
                <button
                  onClick={() => handleEdit('phoneNumber')}
                  className="text-blue-600 hover:text-blue-700 ml-2 flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="flex items-center justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 min-w-0 flex-1">
                  <span className="text-gray-900 break-all">{userInfo.email}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded self-start">Verified</span>
                </div>
                <button
                  onClick={() => handleEdit('email')}
                  className="text-blue-600 hover:text-blue-700 ml-2 flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
              <div className="flex items-center justify-between">
                {userInfo.facebook ? (
                  <span className="text-gray-900 break-all">{userInfo.facebook}</span>
                ) : (
                  <span className="text-blue-600 text-sm cursor-pointer">Add link</span>
                )}
                <button
                  onClick={() => handleEdit('facebook')}
                  className="text-blue-600 hover:text-blue-700 ml-2 flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Google</label>
              <div className="flex items-center justify-between">
                <span className="text-gray-900 break-all">{userInfo.google}</span>
                <button
                  onClick={() => handleEdit('google')}
                  className="text-blue-600 hover:text-blue-700 ml-2 flex-shrink-0"
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

      {/* Dialogs */}
      <UpdateProfileDialog
        isOpen={dialogs.profile}
        onClose={() => closeDialog('profile')}
        userInfo={userInfo}
        onUpdate={handleProfileUpdate}
      />

      <UpdatePhoneDialog
        isOpen={dialogs.phone}
        onClose={() => closeDialog('phone')}
        currentPhone={userInfo.phoneNumber}
        onUpdate={handlePhoneUpdate}
      />

      <UpdateEmailDialog
        isOpen={dialogs.email}
        onClose={() => closeDialog('email')}
        currentEmail={userInfo.email}
        onUpdate={handleEmailUpdate}
      />
    </>
  );
};

export default MyProfile;