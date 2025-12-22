import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { axiosInstance } from '../../../../shared/utils/axiosInstance';
import { INQUIRY_ENDPOINTS } from '../../../../config/api';

const SendInquiry = ({ isOpen, onClose, carOwnerId, currentUserId, bookingInfo }) => {
    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        title: 'Extend Booking Request',
        content: '',
        medias: []
    });
    const [extendDays, setExtendDays] = useState('');
    const [daysError, setDaysError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Generate final content with booking information and days
    const generateFinalContent = () => {
        if (!bookingInfo) return extendDays ? `Extend Booking Days Prefer: ${extendDays} days` : '';
        
        return `Booking Number: ${bookingInfo.bookingNumber || 'N/A'}
Car License: ${bookingInfo.plateNo || 'N/A'}
Car: ${bookingInfo.carName || 'N/A'} (${bookingInfo.brand || 'N/A'})

Extend Booking Days Prefer: ${extendDays || '[Not specified]'} days`;
    };

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setExtendDays('');
            setDaysError('');
        }
    }, [isOpen]);

    const handleExtendDaysChange = (e) => {
        const value = e.target.value;
        
        // Clear previous days error
        setDaysError('');
        
        // Only allow positive numbers
        if (value === '' || (Number(value) > 0 && Number.isInteger(Number(value)))) {
            // Check if value is more than 5
            if (Number(value) > 5) {
                setDaysError(t('maxExtendDaysExceeded') || 'Maximum extend days is 5. Please enter 5 or fewer days.');
                setExtendDays(value); // Still set the value to show user input
            } else {
                setExtendDays(value);
            }
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            medias: [...prev.medias, ...files]
        }));
    };

    const removeMedia = (index) => {
        setFormData(prev => ({
            ...prev,
            medias: prev.medias.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!extendDays || !extendDays.trim()) {
            toast.error(t('pleaseSpecifyExtendDays') || 'Please specify the number of days to extend');
            return;
        }

        // Check if days exceed maximum limit
        if (Number(extendDays) > 5) {
            toast.error(t('maxExtendDaysExceeded') || 'Maximum extend days is 5. Please enter 5 or fewer days.');
            return;
        }

        if (!currentUserId || !carOwnerId) {
            toast.error(t('missingUserInformation') || 'Missing user information');
            return;
        }

        setIsSubmitting(true);

        try {
            // Generate final content before sending
            const finalContent = generateFinalContent();
            
            // Create FormData for multipart/form-data
            const formDataToSend = new FormData();
            formDataToSend.append('SenderId', currentUserId);
            formDataToSend.append('ReceiverId', carOwnerId);
            formDataToSend.append('Title', formData.title);
            formDataToSend.append('Content', finalContent);

            // Append media files
            formData.medias.forEach((file) => {
                formDataToSend.append('Medias', file);
            });

            const response = await axiosInstance.post(
                INQUIRY_ENDPOINTS.CREATE_INQUIRY,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            console.log('Inquiry sent successfully:', response.data);
            
            // Show success toast
            toast.success(t('inquirySentSuccessfully') || 'Inquiry sent successfully!');

            // Reset form and close modal after a short delay
            setTimeout(() => {
                setExtendDays('');
                setFormData({
                    title: 'Extend Booking Request',
                    content: '',
                    medias: []
                });
                onClose();
            }, 1500);
        } catch (err) {
            console.error('Error sending inquiry:', err);
            toast.error(
                err.response?.data?.message ||
                err.message ||
                t('failedToSendInquiry') ||
                'Failed to send inquiry'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {t('sendInquiry') || 'Send Inquiry'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Title Field - Display Only */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('title') || 'Title'}
                            </label>
                            <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700">
                                {formData.title}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {t('titleIsFixed') || 'Title is automatically set for extend booking requests'}
                            </p>
                        </div>

                        {/* Booking Information - Read Only */}
                        {bookingInfo && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('bookingInformation') || 'Booking Information'}
                                </label>
                                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-700 space-y-1">
                                    <div className="flex justify-between">
                                        <span className="font-medium">{t('bookingNumber') || 'Booking Number'}:</span>
                                        <span>{bookingInfo.bookingNumber || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">{t('carLicense') || 'Car License'}:</span>
                                        <span>{bookingInfo.plateNo || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">{t('car') || 'Car'}:</span>
                                        <span>{bookingInfo.carName || 'N/A'} ({bookingInfo.brand || 'N/A'})</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Extend Days Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('extendBookingDays') || 'Extend Booking Days'} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                step="1"
                                value={extendDays}
                                onChange={handleExtendDaysChange}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                    daysError ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                                placeholder={t('enterNumberOfDays') || 'Enter number of days (e.g., 3)'}
                                required
                            />
                            {daysError && (
                                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg flex items-start">
                                    <svg className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-sm text-red-800">{daysError}</p>
                                </div>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                                {t('extendDaysDescription') || 'Specify how many days you would like to extend your booking (maximum 5 days)'}
                            </p>
                        </div>

                        {/* Medias Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('attachments') || 'Attachments'} <span className="text-gray-500 text-xs">(Optional)</span>
                            </label>

                            {/* File Upload Button */}
                            <div className="mb-3">
                                <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span className="text-sm text-gray-700">{t('addFiles') || 'Add files'}</span>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            {/* Media Preview */}
                            {formData.medias.length > 0 && (
                                <div className="grid grid-cols-3 gap-3">
                                    {formData.medias.map((file, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={URL.createObjectURL(file)}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeMedia(index)}
                                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                                disabled={isSubmitting}
                            >
                                {t('cancel') || 'Cancel'}
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || daysError}
                                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${isSubmitting || daysError
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {t('sending') || 'Sending...'}
                                    </span>
                                ) : (
                                    t('send') || 'Send'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default SendInquiry;
