import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CarPhotoUpload from './CarPhotoUpload';
import { registerCar, setCarRentalRate, createCarWallet } from '../carApi';

const RegisterCarStep3 = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [uploadedPhotos, setUploadedPhotos] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleReturn = () => {
        navigate('/owner/register_car/step2');
    };

    const handleNext = async () => {
        if (uploadedPhotos.length === 0) {
            setError(t('pleaseUploadAtLeastOnePhoto'));
            return;
        }

        setUploading(true);
        setError('');

        try {
            // Get data from previous steps
            const step1Data = JSON.parse(localStorage.getItem('carRegistrationStep1') || '{}');
            const step2Data = JSON.parse(localStorage.getItem('carRegistrationStep2') || '{}');

            // console.log('Step 1 Data:', step1Data);
            // console.log('Step 2 Data:', step2Data);
            // console.log('Uploaded Photos:', uploadedPhotos);

            // Validate required fields
            if (!step1Data.licensePlate) {
                setError('License plate is required');
                setUploading(false);
                return;
            }

            // Combine all data including carType from step1Data
            // carType should already be in step1Data if it was saved from RegisterCar component
            const carData = {
                ...step1Data,
                ...step2Data,
                photos: uploadedPhotos
            };

            // console.log('Combined car data:', carData);

            // Call the register car API
            const response = await registerCar(carData);

            // console.log('Full API response:', response);
            // console.log('Response type:', typeof response);
            // console.log('Response keys:', Object.keys(response || {}));

            // Store the car ID to localStorage after successful registration
            // Try different possible field names for the car ID
            const carId = response?.id || response?.carId || response?.CarId || response?.data?.id;

            if (carId) {
                localStorage.setItem('registeredCarId', carId);
                // console.log('Car ID stored in localStorage:', carId);

                // Set rental rate after car registration
                const dailyPrice = step2Data.dailyPrice;
                if (dailyPrice) {
                    try {
                        // Handle both string and number formats
                        const priceNumber = typeof dailyPrice === 'string'
                            ? parseFloat(dailyPrice.replace(/[.,]/g, ''))
                            : dailyPrice;
                        // console.log('Setting rental rate with dailyPrice:', priceNumber);

                        const rentalRateResponse = await setCarRentalRate(carId, priceNumber);
                        // console.log('Car rental price set successfully!');
                        // console.log('Rental rate response:', rentalRateResponse);
                    } catch (rentalRateError) {
                        console.error('Error setting rental rate:', rentalRateError);
                        // Don't fail the whole registration if rental rate fails
                        // Just log the error
                    }
                }

                // Create wallet for the car
                try {
                    const walletResponse = await createCarWallet(carId);
                    // console.log('Car wallet created successfully!');
                    // console.log('Wallet response:', walletResponse);
                } catch (walletError) {
                    console.error('Error creating car wallet:', walletError);
                    // Don't fail the whole registration if wallet creation fails
                    // Just log the error
                }
            } else {
                console.warn('No car ID found in response. Full response:', response);
            }

            setUploadSuccess(true);

            // Clear localStorage after successful registration
            localStorage.removeItem('carRegistrationStep1');
            localStorage.removeItem('carRegistrationStep2');
            localStorage.removeItem('registeredCarId');
            setTimeout(() => {
                // Navigate to success page or dashboard
                navigate('/owner');

            }, 1500);
        } catch (err) {
            console.error('Registration error:', err);
            console.error('Error details:', err.response?.data);

            // Show more detailed error message
            const errorMessage = t('failedToUploadPhotos');
            setError(errorMessage);
        } finally {
            setUploading(false);
        }
    };



    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-xl font-semibold text-gray-900">{t('registerCar')}</h1>
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
                            <div className="mt-4 mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
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
                            className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${uploadedPhotos.length === 0 || uploading
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