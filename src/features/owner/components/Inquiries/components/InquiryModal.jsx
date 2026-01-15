import { useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { tokenUtils } from '../../../../auth/utils';
import { InquiryService } from '../services';
import { getStatusBadge, getStatusText, getPriorityBadge, getPriorityText } from '../utils';

const InquiryModal = ({ inquiry, isOpen, onClose, onUpdate }) => {
  const { t } = useTranslation();
  const [responseText, setResponseText] = useState(inquiry?.response || '');
  const [loading, setLoading] = useState(false);

  const currentUserId = tokenUtils.getUserId();

  const handleSendResponse = async () => {
    if (!inquiry || !responseText.trim()) {
      return;
    }

    try {
      setLoading(true);
      
      const responseData = {
        title: inquiry.subject,
        content: responseText,
        senderId: currentUserId,
        receiverId: inquiry.senderId,
        parentInquiryId: inquiry.id
      };

      await InquiryService.sendResponse(responseData);

      const updatedInquiry = {
        ...inquiry,
        status: 'responded',
        response: responseText,
        responseDate: new Date().toLocaleString()
      };

      onUpdate(updatedInquiry);
      onClose();
      toast.success(t('inquiries.responseSuccessMessage'));
    } catch (err) {
      console.error(t('inquiries.responseError'), err);
      toast.error(err.message || t('inquiries.responseErrorMessage'));
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsClosed = (inquiryId) => {
    // console.log(t('inquiries.markClosedMessage'), inquiryId);
    toast.info(t('inquiries.markClosedFeature'));
  };

  if (!isOpen || !inquiry) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              {t('inquiries.inquiryDetails')} - {inquiry.inquiryId}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Customer Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">{t('inquiries.customerInformation')}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">{t('inquiries.name')}</p>
                <p className="font-medium text-gray-900">{inquiry.customer}</p>
              </div>
              <div>
                <p className="text-gray-600">{t('inquiries.email')}</p>
                <p className="font-medium text-gray-900">{inquiry.customerEmail}</p>
              </div>
              <div>
                <p className="text-gray-600">{t('inquiries.phone')}</p>
                <p className="font-medium text-gray-900">{inquiry.customerPhone}</p>
              </div>
              <div>
                <p className="text-gray-600">{t('inquiries.date')}</p>
                <p className="font-medium text-gray-900">{inquiry.date}</p>
              </div>
            </div>
          </div>

          {/* Inquiry Details */}
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900">{t('inquiries.subject')}</h3>
              <div className="flex items-center space-x-2">
                <span className={getPriorityBadge(inquiry.priority)}>
                  {getPriorityText(inquiry.priority, t)}
                </span>
                <span className={getStatusBadge(inquiry.status)}>
                  {getStatusText(inquiry.status, t)}
                </span>
              </div>
            </div>
            <p className="text-gray-700 mb-3 break-words">{inquiry.subject}</p>
            <div className="bg-white rounded p-3">
              <p className="text-sm text-gray-700 whitespace-pre-wrap break-words">{inquiry.message}</p>
            </div>
            {/* <div className="mt-3 text-sm text-gray-600 break-words">
              <span className="font-medium">{t('inquiries.car')}:</span> {inquiry.carName} ({inquiry.carId})
            </div> */}
          </div>

          {/* Previous Response */}
          {inquiry.response && (
            <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{t('inquiries.previousResponse')}</h3>
                <span className="text-xs text-gray-500">{inquiry.responseDate}</span>
              </div>
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{inquiry.response}</p>
            </div>
          )}

          {/* Response Form */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {inquiry.response ? t('inquiries.updateResponse') : t('inquiries.yourResponse')}
            </label>
            <textarea
              rows="6"
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('inquiries.responsePlaceholder')}
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('inquiries.cancel')}
            </button>
            <button
              onClick={handleSendResponse}
              disabled={!responseText.trim() || loading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('inquiries.sending')}
                </>
              ) : (
                inquiry.response ? t('inquiries.updateResponse') : t('inquiries.sendResponse')
              )}
            </button>
            {inquiry.status === 'responded' && (
              <button
                onClick={() => handleMarkAsClosed(inquiry.id)}
                disabled={loading}
                className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('inquiries.markAsClosed')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryModal;