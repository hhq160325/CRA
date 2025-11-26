import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import UpdateProfileDialog from './MyProfileDialog/UpdateProfileDialog';
import UpdatePhoneDialog from './MyProfileDialog/UpdatePhoneDialog';
import UpdateEmailDialog from './MyProfileDialog/UpdateEmailDialog';
import UploadDriver from '../UploadDriver';
import { getUserById, updateUserInfo } from '../../../user/api';
import { updateUserData } from '../../../auth/authSlice';
import { tokenUtils } from '../../../auth/utils';
import { useLocation } from '../../../location/useLocation';

const MyProfile = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { location, address, loading: locationLoading, error: locationError, getLocation } = useLocation({ fetchAddress: true });
  const [userInfo, setUserInfo] = useState({
    name: '',
    username: '',
    fullname: '',
    joinDate: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    email: '',
    facebook: '',
    google: '',
    imageAvatar: null,
    isGoogle: false,
    address: '',
    status: '',
    password: null
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  
  const [dialogs, setDialogs] = useState({
    profile: false,
    phone: false,
    email: false
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const data = await getUserById();
        
        // Map API response to component state
        setUserInfo({
          name: data.username || 'N/A',
          username: data.username || '',
          fullname: data.fullname || '',
          joinDate: 'Join 12/9/2025', // You can format this from data if available
          dateOfBirth: '30/9/2001', // Add this field to API if needed
          gender: data.gender === 1 ? 'Male' : data.gender === 2 ? 'Female' : 'Other',
          phoneNumber: data.phoneNumber || '',
          email: data.email || '',
          facebook: '', // Add this field to API if needed
          google: data.isGoogle ? data.email : '',
          imageAvatar: data.imageAvatar,
          isGoogle: data.isGoogle,
          address: data.address || '',
          status: data.status || '',
          password: data.password || ''
        });
        setError(null);
      } catch (err) {
        console.error('Failed to fetch user data:', err);
        setError('Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      
      // Convert gender back to number for API
      const genderValue = userInfo.gender === 'Male' ? 1 : userInfo.gender === 'Female' ? 2 : 3;
      
      // Prepare data for API
      const updateData = {
        username: userInfo.username,
        password: userInfo.password || undefined,
        phoneNumber: userInfo.phoneNumber,
        fullname: userInfo.fullname,
        address: userInfo.address,
        imageAvatar: userInfo.imageAvatar,
        status: userInfo.status,
        gender: genderValue
      };

      await updateUserInfo(updateData);
      setIsEditing(false);
      setError(null);
      
      // Optionally refetch user data to ensure sync
      const updatedData = await getUserById();
      setUserInfo({
        name: updatedData.username || 'N/A',
        username: updatedData.username || '',
        fullname: updatedData.fullname || '',
        joinDate: 'Join 12/9/2025',
        dateOfBirth: '30/9/2001',
        gender: updatedData.gender === 1 ? 'Male' : updatedData.gender === 2 ? 'Female' : 'Other',
        phoneNumber: updatedData.phoneNumber || '',
        email: updatedData.email || '',
        facebook: '',
        google: updatedData.isGoogle ? updatedData.email : '',
        imageAvatar: updatedData.imageAvatar,
        isGoogle: updatedData.isGoogle,
        address: updatedData.address || '',
        status: updatedData.status || '',
        
      });

      // Update localStorage and Redux store with new avatar and username
      tokenUtils.updateUserData({
        username: updatedData.username,
        imageAvatar: updatedData.imageAvatar
      });
      
      dispatch(updateUserData({
        username: updatedData.username,
        imageAvatar: updatedData.imageAvatar
      }));
    } catch (err) {
      console.error('Failed to save profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      setIsEditing(false);
      // Refetch user data to reset changes
      const data = await getUserById();
      setUserInfo({
        name: data.username || 'N/A',
        username: data.username || '',
        fullname: data.fullname || '',
        joinDate: 'Join 12/9/2025',
        dateOfBirth: '30/9/2001',
        gender: data.gender === 1 ? 'Male' : data.gender === 2 ? 'Female' : 'Other',
        phoneNumber: data.phoneNumber || '',
        email: data.email || '',
        facebook: '',
        google: data.isGoogle ? data.email : '',
        imageAvatar: data.imageAvatar,
        isGoogle: data.isGoogle,
        address: data.address || '',
        status: data.status || '',
        
      });
    } catch (err) {
      console.error('Failed to refetch user data:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setUserInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserInfo(prev => ({
          ...prev,
          imageAvatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = async () => {
    await getLocation();
  };

  // Update address when location is obtained
  useEffect(() => {
    if (location && address) {
      // Format: "30/5C Phan Huy Ích, An Hội Tây, thành phố Hồ Chí Minh, Hồ Chí Minh"
      // Structure: [houseNumber + road], [ward], [district], [city]
      const addressParts = [];
      
      // Combine house number and road
      if (address.houseNumber && address.road) {
        addressParts.push(`${address.houseNumber} ${address.road}`);
      } else if (address.road) {
        addressParts.push(address.road);
      }
      
      // Add ward (phường/xã)
      if (address.ward) {
        addressParts.push(address.ward);
      }
      
      // Add district (quận/huyện)
      if (address.district) {
        addressParts.push(address.district);
      }
      
      // Add city (thành phố/tỉnh)
      if (address.city) {
        addressParts.push(address.city);
      }
      
      const formattedAddress = addressParts.filter(Boolean).join(', ');
      
      setUserInfo(prev => ({
        ...prev,
        address: formattedAddress
      }));
    }
  }, [location, address]);

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

  // Show loading state
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 max-w-4xl">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 max-w-4xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:p-8 max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 lg:mb-8">
          <h1 className="hidden lg:block text-2xl font-semibold text-gray-900">{t('accountInformation')}</h1>
          <h1 className="lg:hidden text-xl font-semibold text-gray-900 mb-4 sm:mb-0">{t('accountInformation')}</h1>
          
          {!isEditing ? (
            <button
              onClick={toggleEditMode}
              className="text-blue-600 hover:text-blue-700 self-start sm:self-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
          ) : (
            <div className="flex space-x-2 self-start sm:self-auto">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium"
              >
                {t('save')}
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
          {/* Profile Image and Info */}
          {/* <div className="flex-shrink-0 flex flex-col items-center lg:items-start"> */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-200 mb-4">
              <img
                src={userInfo.imageAvatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
              {isEditing && (
                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer hover:bg-opacity-60 transition-opacity">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <div className="text-center">
              {isEditing ? (
                <input
                  type="text"
                  value={userInfo.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="text-lg sm:text-xl font-semibold text-gray-900 text-center border border-gray-300 rounded-lg px-3 py-1 focus:ring-0 "
                  placeholder="Enter username"
                />
              ) : (
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{userInfo.name}</h2>
              )}
              <p className="text-sm text-gray-500 mt-1">{userInfo.joinDate}</p>
            </div>
          </div>

          {/* Profile Information */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('dateOfBirth')}</label>
              {isEditing ? (
                <input
                  type="text"
                  value={userInfo.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-0 "
                  placeholder="DD/MM/YYYY"
                />
              ) : (
                <div className="text-gray-900">{userInfo.dateOfBirth}</div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('gender')}</label>
              {isEditing ? (
                <select
                  value={userInfo.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-0 "
                >
                  <option value="Male">{t('male')}</option>
                  <option value="Female">{t('female')}</option>
                  <option value="Other">{t('other')}</option>
                </select>
              ) : (
                <div className="text-gray-900">{userInfo.gender}</div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('fullName')}</label>
              {isEditing ? (
                <input
                  type="text"
                  value={userInfo.fullname}
                  onChange={(e) => handleInputChange('fullname', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-0 "
                  placeholder={t('enterFullName')}
                />
              ) : (
                <div className="text-gray-900">{userInfo.fullname || 'N/A'}</div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('phoneNumber')}</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={userInfo.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-0 "
                  placeholder={t('enterPhoneNumber')}
                />
              ) : (
                <div className="flex items-center justify-between">
                  {userInfo.phoneNumber ? (
                    <span className="text-gray-900 break-all">{userInfo.phoneNumber}</span>
                  ) : (
                    <span className="text-red-500 text-sm">{t('addPhoneNumber')}</span>
                  )}
                  {!isEditing && (
                    <button
                      onClick={() => handleEdit('phoneNumber')}
                      className="text-blue-600 hover:text-blue-700 ml-2 flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('address')}</label>
              {isEditing ? (
                <div className="relative">
                  <input
                    type="text"
                    value={userInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-0 "
                    placeholder={t('enterAddress')}
                  />
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={locationLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                    title={t('useCurrentLocation') || 'Use current location'}
                  >
                    <svg 
                      className={`w-5 h-5 ${locationLoading ? 'animate-spin' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      {locationLoading ? (
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                        />
                      ) : (
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
                        />
                      )}
                    </svg>
                  </button>
                  {locationError && (
                    <p className="text-xs text-red-600 mt-1">{locationError}</p>
                  )}
                </div>
              ) : (
                <div className="text-gray-900">{userInfo.address || 'N/A'}</div>
              )}
            </div>

            {/* {isEditing && (
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                  <span className="text-xs text-gray-500 ml-2">(Leave blank to keep current password)</span>
                </label>
                <input
                  type="password"
                  value={userInfo.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-0 "
                  placeholder="Enter new password"
                />
              </div>
            )} */}

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('email')}</label>
              <div className="flex items-center justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2 min-w-0 flex-1">
                  <span className="text-gray-900 break-all">{userInfo.email}</span>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded self-start">{t('verified')}</span>
                </div>
                {!isEditing && (
                  <button
                    onClick={() => handleEdit('email')}
                    className="text-blue-600 hover:text-blue-700 ml-2 flex-shrink-0"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('facebook')}</label>
              <div className="flex items-center justify-between">
                {userInfo.facebook ? (
                  <span className="text-gray-900 break-all">{userInfo.facebook}</span>
                ) : (
                  <span className="text-blue-600 text-sm cursor-pointer">{t('addLink')}</span>
                )}
                {/* <button
                  onClick={() => handleEdit('facebook')}
                  className="text-blue-600 hover:text-blue-700 ml-2 flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button> */}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('google')}</label>
              <div className="flex items-center justify-between">
                {userInfo.google ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-900 break-all">{userInfo.google}</span>
                    {userInfo.isGoogle && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">{t('connected')}</span>
                    )}
                  </div>
                ) : (
                  <span className="text-blue-600 text-sm cursor-pointer">{t('addLink')}</span>
                )}
                {/* <button
                  onClick={() => handleEdit('google')}
                  className="text-blue-600 hover:text-blue-700 ml-2 flex-shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Driver's License Upload Section */}
      <div className="mt-6">
        <UploadDriver />
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