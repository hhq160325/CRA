import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { createUserReport } from '../services/userReportService';

const ReportUserModal = ({ isOpen, onClose, customer, onReportSuccess }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    deductedPoints: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'deductedPoints' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      setError(t('titleAndContentRequired') || 'Title and content are required');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await createUserReport({
        title: formData.title.trim(),
        content: formData.content.trim(),
        deductedPoints: formData.deductedPoints,
        reportedUserId: customer.id
      });

      // Reset form
      setFormData({
        title: '',
        content: '',
        deductedPoints: 0
      });

      // Call success callback
      if (onReportSuccess) {
        onReportSuccess();
      }

      // Show success toast
      toast.success(t('userReportedSuccessfully') || 'User reported successfully!');

      // Close modal
      onClose();
    } catch (err) {
      console.error('Failed to create user report:', err);
      const errorMessage = err.message || t('failedToCreateReport') || 'Failed to create report';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      content: '',
      deductedPoints: 0
    });
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('reportUser') || 'Report User'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {customer && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                {t('reportingUser') || 'Reporting user'}: <span className="font-medium text-gray-900">{customer.name}</span>
              </p>
              <p className="text-xs text-gray-500">{customer.email}</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                {t('title') || 'Title'} *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('enterReportTitle') || 'Enter report title'}
                required
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                {t('content') || 'Content'} *
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('enterReportContent') || 'Enter report content'}
                required
              />
            </div>

            <div>
              <label htmlFor="deductedPoints" className="block text-sm font-medium text-gray-700 mb-1">
                {t('deductedPoints') || 'Deducted Points'}
              </label>
              <input
                type="number"
                id="deductedPoints"
                name="deductedPoints"
                value={formData.deductedPoints}
                onChange={handleInputChange}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                {t('pointsToDeductFromUser') || 'Points to deduct from user behavior score'}
              </p>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              disabled={loading}
            >
              {t('cancel') || 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (t('submitting') || 'Submitting...') : (t('submitReport') || 'Submit Report')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportUserModal;