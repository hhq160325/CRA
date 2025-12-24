import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { tokenUtils } from '../../auth/utils';
import { REPORT_CAR_ENDPOINTS } from '../../../config/api';

const ReportCarModal = ({ isOpen, onClose, carId, carName }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    reporterId: '',
    reportedCarId: carId || ''
  });
  const [loading, setLoading] = useState(false);

  // Get reporter ID from token when modal opens
  React.useEffect(() => {
    if (isOpen) {
      const userId = tokenUtils.getUserId();
      setFormData(prev => ({
        ...prev,
        reporterId: userId,
        reportedCarId: carId || ''
      }));
    }
  }, [isOpen, carId]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error(t('pleaseCompleteAllFields') || 'Please complete all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem("jwtToken");
      
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('reporterId', formData.reporterId);
      formDataToSend.append('reportedCarId', formData.reportedCarId);
      
      const response = await fetch(REPORT_CAR_ENDPOINTS.CREATE_REPORT_CAR, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend
      });

      if (response.ok) {
        toast.success(t('reportSubmittedSuccessfully') || 'Report submitted successfully');
        handleClose();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || t('failedToSubmitReport') || 'Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error(t('errorSubmittingReport') || 'Error submitting report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      content: '',
      reporterId: '',
      reportedCarId: carId || ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('reportCar') || 'Report Car'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Car Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">{t('reportingCar') || 'Reporting car'}:</div>
            <div className="font-medium text-gray-900">{carName}</div>
          </div>

          {/* Title Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('reportTitle') || 'Report Title'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder={t('enterReportTitle') || 'Enter report title'}
              required
            />
          </div>

          {/* Content Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('reportContent') || 'Report Content'} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder={t('describeIssue') || 'Please describe the issue with this car...'}
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              disabled={loading}
            >
              {t('cancel') || 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.content.trim()}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('submitting') || 'Submitting...'}
                </>
              ) : (
                t('submitReport') || 'Submit Report'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportCarModal;