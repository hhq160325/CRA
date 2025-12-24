import { React,useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { sendPhoneVerificationOTP, verifyPhoneAndChange } from '../../../api';

const UpdatePhoneDialog = ({ isOpen, onClose, currentPhone, onUpdate }) => {
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState(currentPhone || '');
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Enter phone, 2: Enter OTP
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      toast.error(t('phoneNumberRequired') || 'Phone number is required');
      return;
    }

    // Basic phone number validation
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast.error(t('invalidPhoneNumber') || 'Please enter a valid phone number');
      return;
    }

    try {
      setLoading(true);
      await sendPhoneVerificationOTP(phoneNumber);
      setOtpSent(true);
      setStep(2);
      toast.success(t('otpSent') || 'OTP sent to your phone number');
    } catch (error) {
      console.error('Error sending OTP:', error);
      const errorMessage = error.response?.data?.message || t('otpSendError') || 'Failed to send OTP. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndUpdate = async (e) => {
    e.preventDefault();
    
    if (!otpCode.trim()) {
      toast.error(t('otpRequired') || 'OTP code is required');
      return;
    }

    try {
      setLoading(true);
      await verifyPhoneAndChange(phoneNumber, otpCode);
      onUpdate(phoneNumber);
      toast.success(t('phoneNumberUpdated') || 'Phone number updated successfully!');
      handleClose();
    } catch (error) {
      console.error('Error verifying OTP and updating phone:', error);
      const errorMessage = error.response?.data?.message || t('phoneUpdateError') || 'Failed to update phone number. Please check your OTP and try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setOtpSent(false);
    setOtpCode('');
    setPhoneNumber(currentPhone || '');
    onClose();
  };

  const handleBackToPhoneInput = () => {
    setStep(1);
    setOtpSent(false);
    setOtpCode('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {step === 1 
              ? (t('updatePhoneNumber') || 'Update Phone Number')
              : (t('verifyPhoneNumber') || 'Verify Phone Number')
            }
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {step === 1 ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('phoneNumber') || 'Phone Number'}
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder={t('newPhoneNumber') || 'New Phone Number'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('sendingOTP') || 'Sending OTP...'}
                </>
              ) : (
                t('sendOTP') || 'Send OTP'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndUpdate} className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              {t('otpSentTo') || 'OTP sent to'}: <span className="font-medium">{phoneNumber}</span>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('otpCode') || 'OTP Code'}
              </label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder={t('enterOTP') || 'Enter OTP Code'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
                required
                maxLength={6}
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={handleBackToPhoneInput}
                disabled={loading}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                {t('back') || 'Back'}
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t('verifying') || 'Verifying...'}
                  </>
                ) : (
                  t('verify') || 'Verify & Update'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default UpdatePhoneDialog;