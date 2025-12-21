import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { tokenUtils } from '../../auth/utils';
import { USER_ENDPOINTS } from '../../../config/api';
import { updateVerificationStatus } from '../../auth/authSlice';

const UploadDriver = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [frontFile, setFrontFile] = useState(null);
  const [frontPreviewUrl, setFrontPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');
  const [licenseStatus, setLicenseStatus] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [licenseImages, setLicenseImages] = useState({ front: null });
  const [licenseInfo, setLicenseInfo] = useState(null);
  const [loadingImages, setLoadingImages] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchDriverLicenseStatus();
  }, []);

  // Translate error when language changes
  useEffect(() => {
    if (error === "Please upload a photo of your valid driver's license." || error === "Vui lòng tải ảnh bằng lái hợp lệ") {
      setError(t('invalidImg'));
    }
  }, [i18n.language, t]);

  // Update verification status when license status changes
  useEffect(() => {
    if (licenseStatus === 'AutoApproved') {
      dispatch(updateVerificationStatus(true));
      fetchDriverLicenseImages();
    } else if (licenseStatus === 'Denied') {
      dispatch(updateVerificationStatus(false));
      fetchDriverLicenseImages();
    }
    // For 'Pending' status, the verification status is not change
  }, [licenseStatus, dispatch]);

  const fetchDriverLicenseStatus = async () => {
    try {
      const userId = tokenUtils.getUserId();
      const token = tokenUtils.getAccessToken();

      if (!userId) {
        setLoadingStatus(false);
        return;
      }

      const response = await axios.get(USER_ENDPOINTS.GET_ALL_DRIVER_LICENSE, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // The API returns { urls: [...], view: [...] }
      const licenses = response.data.view || [];

      // Find the current user's license status
      const userLicense = licenses.find(license => license.userId === userId);

      if (userLicense) {
        setLicenseStatus(userLicense.status);

        // Update isVerified in Redux state if license is AutoApproved
        if (userLicense.status === 'AutoApproved') {
          dispatch(updateVerificationStatus(true));
        }
      }
    } catch (err) {
      console.error('Error fetching driver license status:', err);
    } finally {
      setLoadingStatus(false);
    }
  };

  const fetchDriverLicenseImages = async () => {
    try {
      setLoadingImages(true);
      const userId = tokenUtils.getUserId();
      const token = tokenUtils.getAccessToken();
      const currentUser = tokenUtils.getCurrentUser();

      // Get user email from current user data
      const userEmail = currentUser?.email;

      if (!userId || !userEmail) {
        console.error('User ID or email not found');
        return;
      }

      const response = await axios.get(USER_ENDPOINTS.GET_DRIVER_LICENSE_BY_ID(userId, userEmail), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const licenseData = response.data.view?.[0]; // Get the first license data

      // Set license information
      if (licenseData) {
        setLicenseInfo({
          licenseNumber: licenseData.licenseNumber,
          licenseName: licenseData.licenseName,
          licenseDoB: licenseData.licenseDoB,
          licenseClass: licenseData.licenseClass,
          licenseIssue: licenseData.licenseIssue,
          licenseExpiry: licenseData.licenseExpiry
        });

        // Get the image URLs from the license data
        const urls = licenseData.urls || [];
        const frontImage = urls.find(url => url.includes('imageFront') || url.includes('front')) || urls[0];

        setLicenseImages({
          front: frontImage || null
        });
      }

    } catch (err) {
      console.error('Error fetching driver license images:', err);
    } finally {
      setLoadingImages(false);
    }
  };

  const getStatusBadge = () => {
    if (loadingStatus) {
      return (
        <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
          {t('loading')}...
        </span>
      );
    }

    if (!licenseStatus) {
      return (
        <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
          {t('noLicenseUploaded')}
        </span>
      );
    }

    const statusConfig = {
      'Pending': {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: t('uploadlicensepending')
      },
      'AutoApproved': {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: t('uploadlicenseapproved')
      },
      'Denied': {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: t('uploadlicensedenied')
      }
    };

    const config = statusConfig[licenseStatus] || statusConfig['Pending'];
    console.log("licenseStatus", licenseStatus);

    return (
      <span className={`ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setError(t('invalidDriverLicenseFileType'));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError(t('fileSizeTooLarge'));
      return;
    }

    setError('');
    setFrontFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFrontPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFrontPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!frontFile) {
      setError(t('pleaseSelectAtLeastOneFile'));
      return;
    }

    setUploading(true);
    setError('');

    try {
      const userId = tokenUtils.getUserId();
      const token = tokenUtils.getAccessToken();

      if (!userId) {
        throw new Error('User not authenticated');
      }

      const formData = new FormData();
      formData.append('frontDriverLicenseimg', frontFile);
      formData.append('userId', userId);

      // Log the data being sent to server
      console.log('Data being sent to server:', {
        userId: userId,
        frontFile: frontFile ? { name: frontFile.name, size: frontFile.size, type: frontFile.type } : null,
        endpoint: USER_ENDPOINTS.UPLOAD_DRIVER_LICENSE
      });

      await axios.post(USER_ENDPOINTS.UPLOAD_DRIVER_LICENSE, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);

      // Refresh the license status after successful upload
      fetchDriverLicenseStatus();
    } catch (err) {
      const statusCode = err.response?.status;
      if (statusCode === 400 || statusCode === 500) {
        setError(t('invalidImg'));
      } else {
        setError(err.response?.data?.message || err.message || t('failedToUploadDriverLicense'));
      }
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setFrontFile(null);
    setFrontPreviewUrl(null);
    setError('');
  };

  const handleEditModeToggle = () => {
    if (editMode) {
      // Cancel edit mode - clear any selected files
      setFrontFile(null);
      setFrontPreviewUrl(null);
      setError('');
    }
    setEditMode(!editMode);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2 flex items-center">
          {t('updateDriverLicense')}
          {getStatusBadge()}
          {(licenseStatus === 'AutoApproved' || licenseStatus === 'Denied') && (
            <button
              onClick={handleEditModeToggle}
              className="ml-3 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editMode ? t('cancelEdit') : t('editLicense')}
            </button>
          )}
        </h2>
        <p className="text-gray-600 mb-6">
          {t('uploadDriverLicenseDescription')}
        </p>
        {/* Upload Areas or Display Images */}
        {(licenseStatus === 'AutoApproved' || licenseStatus === 'Denied') && !editMode ? (
          /* Display uploaded images for approved/denied licenses */
          <div>
            {loadingImages ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-1 gap-6">
                {/* Front License Display */}
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">{t('frontDriverLicense')}</h4>
                  <div className="w-full h-64 border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                    {licenseImages.front ? (
                      <img
                        src={licenseImages.front}
                        alt="Front driver's license"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">{t('noFrontImageAvailable')}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* License Information Display */}
                {/* <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-3">{t('licenseInformation')}</h4>
                  <div className="w-full h-64 border-2 border-gray-200 rounded-lg bg-gray-50 p-4 overflow-y-auto">
                    {licenseInfo ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600">{t('licenseNumber')}</label>
                          <p className="text-sm text-gray-900">{licenseInfo.licenseNumber || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">{t('licenseName')}</label>
                          <p className="text-sm text-gray-900">{licenseInfo.licenseName || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">{t('dateOfBirth')}</label>
                          <p className="text-sm text-gray-900">{licenseInfo.licenseDoB ? new Date(licenseInfo.licenseDoB).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">{t('licenseClass')}</label>
                          <p className="text-sm text-gray-900">{licenseInfo.licenseClass || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">{t('issueDate')}</label>
                          <p className="text-sm text-gray-900">{licenseInfo.licenseIssue ? new Date(licenseInfo.licenseIssue).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">{t('expiryDate')}</label>
                          <p className="text-sm text-gray-900">{licenseInfo.licenseExpiry ? new Date(licenseInfo.licenseExpiry).toLocaleDateString() : t('noExpiry')}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="text-sm">{t('noLicenseInfoAvailable')}</p>
                      </div>
                    )}
                  </div>
                </div> */}
              </div>
            )}
          </div>
        ) : (
          /* Upload interface for pending or no license */
          <div className="mb-6">
            {/* Front License Upload */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">{t('frontDriverLicense')}</h3>
              <label
                htmlFor="front-file-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                {frontPreviewUrl ? (
                  <div className="relative w-full h-full p-4">
                    <img
                      src={frontPreviewUrl}
                      alt="Front driver's license preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemove();
                      }}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : frontFile ? (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-16 h-16 mb-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-700 font-medium">{frontFile.name}</p>
                    <p className="text-xs text-gray-500">{(frontFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-700">
                      <span className="font-semibold">{t('clickToUpload')}</span>
                    </p>
                    <p className="text-xs text-gray-500">{t('frontLicenseDescription')}</p>
                  </div>
                )}
                <input
                  id="front-file-upload"
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileSelect}
                />
              </label>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
            <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {uploadSuccess && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
            <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-green-800">{t('driverLicenseUploadedSuccessfully')}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleUpload}
            disabled={!frontFile || uploading || ((licenseStatus === 'AutoApproved' || licenseStatus === 'Denied') && !editMode)}
            className={`flex-1 px-6 py-2 rounded-lg font-medium transition-colors ${!frontFile || uploading || ((licenseStatus === 'AutoApproved' || licenseStatus === 'Denied') && !editMode)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
          >
            {uploading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('uploading')}
              </span>
            ) : (
              t('uploadDriverLicenseButton')
            )}
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">{t('importantInformation')}</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• {t('driverLicenseTip1')}</li>
            <li>• {t('driverLicenseTip2')}</li>
            <li>• {t('driverLicenseTip3')}</li>
            <li>• {t('driverLicenseTip4')}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UploadDriver;
