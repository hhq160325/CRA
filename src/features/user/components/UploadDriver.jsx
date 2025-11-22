import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const UploadDriver = () => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
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
    setSelectedFile(file);
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError(t('pleaseSelectFileFirst'));
      return;
    }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('driverLicense', selectedFile);

      // Replace with your actual API endpoint
      const response = await fetch('/api/user/driver-license', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      setError(t('failedToUploadDriverLicense'));
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError('');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          {t('updateDriverLicense')}
        </h2>
        <p className="text-gray-600 mb-6">
          {t('uploadDriverLicenseDescription')}
        </p>

        {/* Upload Area */}
        <div className="mb-6">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            {previewUrl ? (
              <div className="relative w-full h-full p-4">
                <img
                  src={previewUrl}
                  alt="Driver's license preview"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : selectedFile ? (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-16 h-16 mb-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="mb-2 text-sm text-gray-700 font-medium">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="mb-2 text-sm text-gray-700">
                  <span className="font-semibold">{t('clickToUpload')}</span> {t('orDragAndDrop')}
                </p>
                <p className="text-xs text-gray-500">{t('driverLicenseFormatsAccepted')}</p>
              </div>
            )}
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept="image/jpeg,image/jpg,image/png,application/pdf"
              onChange={handleFileSelect}
            />
          </label>
        </div>

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
          {selectedFile && (
            <button
              onClick={handleRemove}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={uploading}
            >
              {t('remove')}
            </button>
          )}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className={`flex-1 px-6 py-2 rounded-lg font-medium transition-colors ${
              !selectedFile || uploading
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
