import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { axiosInstance } from '../../../../shared/utils/axiosInstance';
import { INQUIRY_ENDPOINTS } from '../../../../config/api';

const SendInquiry = ({ isOpen, onClose, carOwnerId, currentUserId }) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        medias: []
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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
        
        if (!formData.title.trim() || !formData.content.trim()) {
            setError(t('pleaseFillAllRequiredFields') || 'Please fill all required fields');
            return;
        }

        if (!currentUserId || !carOwnerId) {
            setError(t('missingUserInformation') || 'Missing user information');
            return;
        }

        setIsSubmitting(true);
        setError('');
        setSuccess(false);

        try {
            // Create FormData for multipart/form-data
            const formDataToSend = new FormData();
            formDataToSend.append('SenderId', currentUserId);
            formDataToSend.append('ReceiverId', carOwnerId);
            formDataToSend.append('Title', formData.title);
            formDataToSend.append('Content', formData.content);
            
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
            setSuccess(true);
            
            // Reset form and close modal after a short delay
            setTimeout(() => {
                setFormData({ title: '', content: '', medias: [] });
                setSuccess(false);
                onClose();
            }, 1500);
        } catch (err) {
            console.error('Error sending inquiry:', err);
            setError(
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
                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                                <svg className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
                                <svg className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm text-green-800">{t('inquirySentSuccessfully') || 'Inquiry sent successfully!'}</p>
                            </div>
                        )}

                        {/* Title Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('title') || 'Title'} <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder={t('enterTitle') || 'Enter title'}
                                required
                            />
                        </div>

                        {/* Content Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                {t('content') || 'Content'} <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleInputChange}
                                rows={6}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                placeholder={t('enterContent') || 'Enter your message'}
                                required
                            />
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
                                disabled={isSubmitting}
                                className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                                    isSubmitting
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
