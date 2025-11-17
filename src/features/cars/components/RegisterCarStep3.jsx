import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CarPhotoUpload from './CarPhotoUpload';

const RegisterCarStep3 = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [uploadedPhotos, setUploadedPhotos] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleReturn = () => {
        navigate('/register-car/step-2');
    };

    const handleNext = async () => {
        if (uploadedPhotos.length === 0) {
            setError(t('pleaseUploadAtLeastOnePhoto'));
            return;
        }

        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            uploadedPhotos.forEach((photo, index) => {
                formData.append(`carPhotos`, photo);
            });

            // Replace with your actual API endpoint
            const response = await fetch('/api/cars/photos', {
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
            setTimeout(() => {
                // Navigate to success page or dashboard
                navigate('/owner/dashboard');
            }, 1500);
        } catch (err) {
            setError(t('failedToUploadPhotos'));
        } finally {
            setUploading(false);
        }
    };



    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="relative flex items-center mb-8">
                    <button
                        onClick={handleReturn}
                        className="flex items-center text-gray-600 hover:text-gray-800"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        {t('return')}
                    </button>
                    <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-gray-900">{t('registerCar')}</h1>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-12">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-medium">
                            1
                        </div>
                        <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
                        <div className="w-10 h-10 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-medium">
                            2
                        </div>
                        <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-medium">
                            3
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-sm p-8">
                    {/* Photos Section */}
                    <div className="mb-8">
                        <CarPhotoUpload
                            uploadedPhotos={uploadedPhotos}
                            onPhotosChange={setUploadedPhotos}
                            error={error}
                            onErrorChange={setError}
                        />

                        {/* Success Message */}
                        {uploadSuccess && (
                            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                                <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-green-800">{t('photosUploadedSuccessfully')}</p>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleReturn}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                            disabled={uploading}
                        >
                            {t('return')}
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={uploadedPhotos.length === 0 || uploading}
                            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                                uploadedPhotos.length === 0 || uploading
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
                                t('completeRegistration')
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterCarStep3;