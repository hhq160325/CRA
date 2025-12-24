import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { USER_ENDPOINTS, USER_API_CONFIG } from '../../../../config/api';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../auth/authSlice';

const SettingsPage = () => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);
  
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: '',
    otpCode: ''
  });
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Enter OTP and new password
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (user?.email) {
      setUserEmail(user.email);
    }
  }, [user]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear message when user starts typing
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!passwordData.newPassword || !passwordData.confirmPassword) {
      setMessage({ type: 'error', text: t('pleaseEnterBothPasswords') });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: t('passwordsDoNotMatch') });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: t('passwordTooShort') });
      return;
    }

    if (!userEmail) {
      setMessage({ type: 'error', text: t('emailRequired') });
      return;
    }

    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('jwtToken');
      const response = await fetch(USER_ENDPOINTS.RESET_PASSWORD, {
        method: 'POST',
        headers: {
          ...USER_API_CONFIG.headers,
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: userEmail,
          password: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword
        })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: t('otpSentSuccessfully') });
        setStep(2);
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.message || t('otpSendFailed') });
      }
    } catch (error) {
      console.error('OTP request error:', error);
      setMessage({ type: 'error', text: t('networkError') });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (!passwordData.otpCode) {
      setMessage({ type: 'error', text: t('otpRequired') });
      return;
    }

    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('jwtToken');
      
      // Build URL with query parameters like in the auth service
      const queryParams = new URLSearchParams({
        email: userEmail,
        OTPCode: passwordData.otpCode
      });
      
      const urlWithParams = `${USER_ENDPOINTS.RESET_PASSWORD_VERIFY}?${queryParams.toString()}`;

      const response = await fetch(urlWithParams, {
        method: 'POST',
        headers: {
          ...USER_API_CONFIG.headers,
          'Authorization': `Bearer ${token}`,
        }
      });

      if (response.ok) {
        setMessage({ type: 'success', text: t('passwordUpdatedSuccessfully') });
        setPasswordData({ newPassword: '', confirmPassword: '', otpCode: '' });
        setStep(1);
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.message || t('passwordUpdateFailed') });
      }
    } catch (error) {
      console.error('Password update error:', error);
      setMessage({ type: 'error', text: t('networkError') });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setPasswordData({ newPassword: '', confirmPassword: '', otpCode: '' });
    setMessage({ type: '', text: '' });
  };
  
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('security')}</h2>
      <p className="text-gray-600 mb-6">{t('securityDescription')}</p>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">{t('password')}</h3>
          
          {/* Message display */}
          {message.text && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              message.type === 'success' 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}

          {step === 1 ? (
            // Step 1: Enter email and new password, then request OTP
            <form onSubmit={handleRequestOTP} className="space-y-3">
              <label className="block">
                <span className="text-sm text-gray-700">{t('email')}</span>
                <input 
                  type="email" 
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                  placeholder={t('enterEmail')}
                  disabled={isLoading}
                  required
                />
              </label>
              
              <label className="block">
                <span className="text-sm text-gray-700">{t('newPassword')}</span>
                <div className="relative">
                  <input 
                    type={showPassword.newPassword ? "text" : "password"}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                    placeholder="••••••"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('newPassword')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    disabled={isLoading}
                  >
                    {showPassword.newPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </label>
              
              <label className="block">
                <span className="text-sm text-gray-700">{t('confirmPassword')}</span>
                <div className="relative">
                  <input 
                    type={showPassword.confirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                    placeholder="••••••"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirmPassword')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                    disabled={isLoading}
                  >
                    {showPassword.confirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </label>
              
              <p className="text-sm text-gray-600">{t('otpWillBeSent')}</p>
              <button 
                type="submit" 
                disabled={isLoading}
                className="mt-2 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('sending') : t('sendOTP')}
              </button>
            </form>
          ) : (
            // Step 2: Enter OTP to verify and complete password change
            <form onSubmit={handlePasswordUpdate} className="space-y-3">
              <p className="text-sm text-gray-600 mb-4">
                {t('enterOTPSentToEmail')} <span className="font-medium text-blue-600">{userEmail}</span>
              </p>
              
              <label className="block">
                <span className="text-sm text-gray-700">{t('otpCode')}</span>
                <input 
                  type="text" 
                  name="otpCode"
                  value={passwordData.otpCode}
                  onChange={handlePasswordChange}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" 
                  placeholder={t('enterOTP')}
                  disabled={isLoading}
                  required
                />
              </label>
              
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={handleBackToStep1}
                  disabled={isLoading}
                  className="inline-flex items-center justify-center px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('back')}
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="inline-flex items-center justify-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? t('updating') : t('updatePassword')}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* <div className="border rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">{t('emailVerificationStatus')}</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-700">{t('email')}</div>
                <div className="text-gray-900 font-medium">user@example.com</div>
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">{t('unverified')}</span>
            </div>
            <p className="text-sm text-gray-600">{t('verifyEmailDescription')}</p>
            <button type="button" className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{t('sendVerificationEmail')}</button>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default SettingsPage;