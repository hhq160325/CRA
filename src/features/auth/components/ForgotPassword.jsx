import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { resetPasswordUser, verifyResetPasswordOTP, clearError, clearSuccess } from "../authSlice";
import { passwordValidation, emailValidation } from "../utils/validationUtils";

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Form states
  const [step, setStep] = useState(1); // 1: password reset form, 2: OTP verification
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  
  // Error states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [otpError, setOtpError] = useState("");
  
  // Password visibility states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();

  const { isLoading, error, success } = useSelector((state) => state.auth);

  // Clear messages on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (emailError) setEmailError("");
    
    // Real-time email validation feedback (only show error if user has stopped typing)
    if (value && value.length > 3 && !emailValidation.isValidEmail(value)) {
      setTimeout(() => {
        if (email === value && !emailValidation.isValidEmail(value)) {
          setEmailError(t('invalidEmailFormat'));
        }
      }, 500);
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    if (passwordError) setPasswordError("");
    
    // Real-time validation feedback (only show error after user has typed a reasonable amount)
    if (value && value.length > 3 && !passwordValidation.isValidPassword(value)) {
      setTimeout(() => {
        if (password === value && !passwordValidation.isValidPassword(value)) {
          setPasswordError(t('passwordRequirements'));
        }
      }, 500);
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (confirmPasswordError) setConfirmPasswordError("");
    
    // Real-time password matching validation
    if (value && password && value !== password) {
      setConfirmPasswordError(t('passwordsDoNotMatch'));
    } else if (value && password && value === password) {
      setConfirmPasswordError("");
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (otpError) setOtpError("");

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace to focus previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const validateStep1 = () => {
    let isValid = true;

    // Validate email using validation utility
    if (!email.trim()) {
      setEmailError(t('emailRequired'));
      isValid = false;
    } else if (!emailValidation.isValidEmail(email.trim())) {
      setEmailError(t('invalidEmailFormat'));
      isValid = false;
    }

    // Validate password using validation utility
    if (!password.trim()) {
      setPasswordError(t('passwordRequired'));
      isValid = false;
    } else if (!passwordValidation.isValidPassword(password)) {
      setPasswordError(t('passwordRequirements'));
      isValid = false;
    }

    // Validate confirm password
    if (!confirmPassword.trim()) {
      setConfirmPasswordError(t('confirmPasswordRequired'));
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError(t('passwordsDoNotMatch'));
      isValid = false;
    }

    return isValid;
  };

  const validateStep2 = () => {
    const otpCode = otp.join('');
    if (!otpCode.trim()) {
      setOtpError(t('otpRequired'));
      return false;
    } else if (otpCode.length !== 6) {
      setOtpError(t('otpInvalidLength'));
      return false;
    }
    return true;
  };

  const handleStep1Submit = async (e) => {
    e.preventDefault();

    if (!validateStep1()) {
      return;
    }

    try {
      await dispatch(resetPasswordUser({
        email: email.trim(),
        password: password,
        confirmPassword: confirmPassword
      })).unwrap();
      
      // Move to OTP verification step
      setStep(2);
    } catch (error) {
      console.error("Password reset failed:", error);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();

    if (!validateStep2()) {
      return;
    }

    try {
      const otpCode = otp.join('');
      await dispatch(verifyResetPasswordOTP({
        email: email.trim(),
        otp: otpCode.trim()
      })).unwrap();
      
      // Navigate to login page on success
      setTimeout(() => {
        navigate('/auth');
      }, 2000);
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setOtp(['', '', '', '', '', '']);
    setOtpError("");
    dispatch(clearError());
    dispatch(clearSuccess());
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400"></div>
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        {step === 1 ? (
          <>
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">{t('resetPassword')}</h1>
            <p className="text-gray-600 text-center mb-6">{t('enterNewPasswordDetails')}</p>

            <form onSubmit={handleStep1Submit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">{t('emailAddress')}</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`w-full px-4 py-3 border ${
                    emailError 
                      ? 'border-red-300' 
                      : email && emailValidation.isValidEmail(email)
                        ? 'border-green-300'
                        : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                  placeholder={t('enterEmail')}
                  value={email}
                  onChange={handleEmailChange}
                />
                {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    {t('newPassword')}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-gray-700 text-sm flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="12" cy="12" r="3" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                          <path d="M2 2L22 22" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </svg>
                  </button>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className={`w-full px-4 py-3 border ${
                    passwordError 
                      ? 'border-red-300' 
                      : password && passwordValidation.isValidPassword(password)
                        ? 'border-green-300'
                        : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                  placeholder={t('enterNewPassword')}
                  value={password}
                  onChange={handlePasswordChange}
                />
                {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
                {password && passwordValidation.isValidPassword(password) && !passwordError && (
                  <p className="mt-1 text-sm text-green-600">✓ {t('passwordMeetsRequirements')}</p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    {t('confirmPassword')}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-500 hover:text-gray-700 text-sm flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showConfirmPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M1 12C1 12 5 20 12 20C19 20 23 12 23 12" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="12" cy="12" r="3" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                          <path d="M2 2L22 22" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M6.71277 6.7226C3.66479 8.79527 2 12 2 12C2 12 5.63636 19 12 19C14.0503 19 15.8174 18.2734 17.2711 17.2884M11 5.05822C11.3254 5.02013 11.6588 5 12 5C18.3636 5 22 12 22 12C22 12 21.3082 13.3317 20 14.8335" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M14 14.2362C13.4692 14.7112 12.7684 15.0001 12 15.0001C10.3431 15.0001 9 13.657 9 12.0001C9 11.1764 9.33193 10.4303 9.86932 9.88818" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </svg>
                  </button>
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  className={`w-full px-4 py-3 border ${
                    confirmPasswordError 
                      ? 'border-red-300' 
                      : confirmPassword && password && confirmPassword === password
                        ? 'border-green-300'
                        : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                  placeholder={t('confirmNewPassword')}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
                {confirmPasswordError && <p className="mt-1 text-sm text-red-600">{confirmPasswordError}</p>}
                {confirmPassword && password && confirmPassword === password && !confirmPasswordError && (
                  <p className="mt-1 text-sm text-green-600">✓ {t('passwordsMatch')}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? t('sendingOTP') : t('sendOTP')}
              </button>

              <div className="text-center">
                <Link to="/auth" className="text-blue-600 hover:text-blue-700 text-sm font-medium">{t('backToLogin')}</Link>
              </div>
            </form>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">{t('verifyOTP')}</h1>
            <p className="text-gray-600 text-center mb-6">
              {t('enterOTPSentToEmail')} {' '}
              <span className="font-medium text-blue-600">{email}</span>
            </p>

            <form onSubmit={handleStep2Submit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-700 text-sm">{success}</p>
                  <p className="text-green-600 text-sm mt-1">{t('redirectingToLogin')}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  {t('otpCode')}
                </label>
                <div className="flex justify-center space-x-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={isLoading}
                    />
                  ))}
                </div>
                {otpError && <p className="mt-2 text-sm text-red-600 text-center">{otpError}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.join('').length !== 6}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? t('verifyingOTP') : t('verifyOTP')}
              </button>

              <div className="text-center space-y-2">
                <button
                  type="button"
                  onClick={handleBackToStep1}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium block w-full"
                >
                  {t('backToPasswordReset')}
                </button>
                <Link to="/auth" className="text-gray-600 hover:text-gray-700 text-sm">{t('backToLogin')}</Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;


