import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const OtpVerify = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
  const [canResend, setCanResend] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { isLoading: authLoading, error } = useSelector((state) => state.auth);
  
  // Get phone number from navigation state or redirect if not available
  const phoneNumber = location.state?.phoneNumber;

  useEffect(() => {
    if (!phoneNumber) {
      toast.error('Phone number not found. Please try again.');
      navigate(-1); // Go back to previous page (could be register or forgot-password)
      return;
    }
  }, [phoneNumber, navigate]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to focus previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      toast.error('Please enter complete OTP code');
      return;
    }



    setIsLoading(true);
    try {
      // Import API configuration
      const { AUTH_ENDPOINTS, AUTH_API_CONFIG } = await import('../../../config/api');
      
      // Make API call to verify OTP using query parameters
      const verifyUrl = `${AUTH_ENDPOINTS.OTP_VERIFY}?phone=${encodeURIComponent(phoneNumber)}&OTPCode=${encodeURIComponent(otpCode)}`;
      
      const response = await fetch(verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('OTP verified successfully!');
        
        // Check if response contains token (successful verification with auto-login)
        if (data.token && data.expiration) {
          
          // Import auth utilities
          const { decodeJWT, tokenUtils } = await import('../utils');
          const { getRoleFromToken, getRedirectPathByRole } = await import('../utils');
          
          // Decode token to get user information
          const decoded = decodeJWT(data.token);
          const roleId = getRoleFromToken(data.token);
          const userId = decoded ? (decoded.sub || decoded.userId || decoded.id || decoded.nameid) : null;
          
          // Prepare user object
          const user = {
            phoneNumber: phoneNumber,
            username: decoded?.name || decoded?.username,
            roleId: roleId
          };
          
          // Store tokens and user data
          tokenUtils.storeTokens(data.token, data.token, user);
          
          // Update Redux state with login
          const { loginUser } = await import('../authSlice');
          dispatch(loginUser.fulfilled({
            user: user,
            accessToken: data.token,
            expiration: data.expiration
          }));
          
          // Fetch full user data if we have userId
          if (userId) {
            try {
              const { getUserById } = await import('../../user/api');
              const userData = await getUserById();
              
              // Update stored user data with avatar and username
              tokenUtils.updateUserData({
                username: userData.username,
                imageAvatar: userData.imageAvatar
              });
              
              // Update Redux state with full user data
              const { updateUserData } = await import('../authSlice');
              dispatch(updateUserData({
                username: userData.username,
                imageAvatar: userData.imageAvatar
              }));
            } catch (userError) {
              // Failed to fetch user data, continue with basic user info
            }
          }
          
          // Redirect based on role
          const redirectPath = getRedirectPathByRole(roleId);
          navigate(redirectPath);
        } else {
          // No token in response, handle based on flow
          const fromRegistration = location.state?.fromRegistration;
          if (fromRegistration) {
            // Registration flow - redirect to login
            navigate('/login');
          } else {
            // Forgot password flow - redirect to reset password
            navigate('/reset-password', { state: { phoneNumber, otpVerified: true } });
          }
        }
      } else {
        throw new Error(data.message || 'OTP verification failed');
      }
    } catch (error) {
      toast.error(error.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    
    setIsLoading(true);
    try {
      // Import API configuration
      const { AUTH_ENDPOINTS, AUTH_API_CONFIG } = await import('../../../config/api');
      
      // Make API call to resend OTP using query parameters
      const resendUrl = `${AUTH_ENDPOINTS.OTP_RESEND}?phone=${encodeURIComponent(phoneNumber)}`;
      
      const response = await fetch(resendUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('OTP sent successfully!');
        setTimeLeft(300); // Reset timer
        setCanResend(false);
        setOtp(['', '', '', '', '', '']); // Clear current OTP
      } else {
        throw new Error(data.message || 'Failed to resend OTP');
      }
    } catch (error) {
      toast.error(error.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!phoneNumber) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Gradient background matching the Register design */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400"></div>

      {/* OTP Verify card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">
            Verify OTP
          </h2>
          <p className="text-gray-600 text-center mb-6">
            We've sent a 6-digit code to{' '}
            <span className="font-medium text-blue-600">{phoneNumber}</span>
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Enter OTP Code
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
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading || authLoading}
                />
              ))}
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Time remaining: {' '}
              <span className="font-medium text-blue-600">
                {formatTime(timeLeft)}
              </span>
            </p>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || authLoading || otp.join('').length !== 6}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading || authLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={!canResend || isLoading || authLoading}
              className="text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {canResend ? 'Resend OTP' : `Resend in ${formatTime(timeLeft)}`}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-sm text-gray-600 hover:text-gray-500"
            >
              Back to Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OtpVerify;