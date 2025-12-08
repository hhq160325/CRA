import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { registerUser, loginUser, googleLoginUser, clearError, clearSuccess, selectIsLoading, selectError, selectIsAuthenticated, selectSuccess } from '../authSlice';
import { getRoleFromToken, getRedirectPathByRole } from '../utils';

const Register = ({ onSwitchToLogin }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const success = useSelector(selectSuccess);
  
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phoneNumber: '',
    gender: 2, // Always set to "Other"
  });
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Listen for Google auth data from popup/tab
  useEffect(() => {
    const handleMessage = async (event) => {
      const data = event.data;
      
      // Ignore webpack and other dev messages
      if (!data || typeof data !== 'object' || data.type === 'webpackWarnings' || data.type === 'webpackOk' || data.source === 'react-devtools-bridge' || data.source === 'react-devtools-content-script') {
        return;
      }
      
      console.log('Register: Received postMessage:', {
        origin: event.origin,
        data: data,
        hasToken: !!(data.token || data.JwtToken),
        dataKeys: Object.keys(data)
      });
      
      // Check if this is Google auth data
      const token = data.token || data.JwtToken;
      const isGoogleAuth = data.IsGoogle === "True" || data.IsGoogle === true;
      
      if (isGoogleAuth) {
        try {
          const email = data.email || data.Email;
          const username = data.username || data.Username;
          
          // If no token, this is a registration response - need to call google-callback to get token
          if (!token) {
            console.log('Register: No token received, calling google-callback to get JWT...');
            
            try {
              // Import API config
              const { AUTH_ENDPOINTS } = await import('../../../config/api');
              
              // Call the google-callback endpoint to get the JWT token
              const response = await fetch(AUTH_ENDPOINTS.GOOGLE_CALLBACK, {
                method: 'GET',
                credentials: 'include'
              });
              
              if (!response.ok) {
                throw new Error('Failed to get JWT token from google-callback');
              }
              
              // Extract JWT from HTML response
              const html = await response.text();
              console.log('google-callback response body:', html);
              
              // Extract JSON data from the postMessage script
              const jsonMatch = html.match(/window\.opener\.postMessage\((.*?),\s*'\*'\)/s);
              if (jsonMatch) {
                const jsonData = JSON.parse(jsonMatch[1]);
                console.log('Extracted token data:', jsonData);
                
                // Trigger the message handler with the extracted data
                window.postMessage(jsonData, window.location.origin);
                return;
              } else {
                console.error('Could not extract token from HTML response');
                return;
              }
            } catch (callbackError) {
              console.error('Error calling google-callback:', callbackError);
              return;
            }
          }
          
          // If we have a token, process it
          const refreshToken = data.refreshToken || data.RefreshToken;
          
          // Decode token to get role and user ID
          const { decodeJWT, tokenUtils } = await import('../utils');
          const decoded = decodeJWT(token);
          const roleId = getRoleFromToken(token);
          const userId = decoded ? (decoded.sub || decoded.userId || decoded.id || decoded.nameid) : null;

          // Prepare user object
          const user = {
            email: email || decoded?.email,
            username: username || decoded?.name,
            roleId: roleId
          };

          // Store tokens and user data
          tokenUtils.storeTokens(token, refreshToken || token, user);

          // Update Redux state immediately with basic user data
          dispatch(loginUser.fulfilled({
            user: user,
            accessToken: token
          }));

          // Fetch full user data if we have userId
          if (userId) {
            try {
              const { getUserById } = await import('../../user/api');
              const userData = await getUserById();
              
              // Update localStorage with full user data
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
              console.error('Failed to fetch user data:', userError);
            }
          }

          // Redirect to appropriate page based on role
          const redirectPath = getRedirectPathByRole(roleId);
          navigate(redirectPath);
        } catch (error) {
          console.error('Error processing Google auth:', error);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [navigate, dispatch]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error and success when user starts typing
    if (error) {
      dispatch(clearError());
    }
    if (success) {
      dispatch(clearSuccess());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = {
        username: formData.username,
        password: formData.password,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        gender: 2 // Always send "Other"
      };
      
      await dispatch(registerUser(userData)).unwrap();
      
      // Reset form after successful registration
      setFormData({
        username: '',
        password: '',
        email: '',
        phoneNumber: '',
        gender: 2,
      });
      
      // Redirect will happen via useEffect when isAuthenticated changes
    } catch (error) {
      // Error is handled by Redux, form stays filled for retry
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Import API config
      const { AUTH_ENDPOINTS } = await import('../../../config/api');
      
      // Open Google OAuth in a new tab
      const googleAuthUrl = `${AUTH_ENDPOINTS.LOGIN_GOOGLE}?localURL=${encodeURIComponent(AUTH_ENDPOINTS.GOOGLE_CALLBACK)}`;
      
      // Open in new tab
      window.open(googleAuthUrl, '_blank');
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  // Show loading screen when redirecting
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400"></div>
        <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            <h2 className="text-2xl font-bold text-gray-900">{t('success')}</h2>
            <p className="text-gray-600">{t('redirectingToHomepage')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Gradient background matching the design */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400"></div>

      {/* Register card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">{t('signUp')}</h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-center mb-6">
          {t('alreadyHaveAccount')} <button onClick={onSwitchToLogin} className="text-blue-600 hover:text-blue-700 font-medium">{t('logIn')}</button>
        </p>

      {/* Form instruction */}
      {/* <p className="text-gray-600 text-sm text-center mb-6">
        {t('enterDetailsToCreate')}
      </p> */}

      {/* Registration form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username field */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-900 mb-2">
            {t('username')}
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t('enterUsername')}
            required
          />
        </div>

        {/* Password field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
            {t('password')}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t('enterPassword')}
            required
          />
        </div>

        {/* Email field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
            {t('email')}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t('enterEmail')}
            required
          />
        </div>

        {/* Phone Number field */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-900 mb-2">
            {t('phoneNumber')}
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t('enterPhoneNumber')}
            required
          />
        </div>

        {/* Success message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-green-600 text-sm">{success}</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Create account button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? t('creatingAccount') : t('createAccount')}
        </button>
      </form>

      {/* Separator */}
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-gray-500 text-sm">{t('or')}</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Social login buttons */}
      <div className="space-y-3">
        {/* Google sign in button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {t('signInWithGoogle')}
        </button>
      </div>
      </div>
    </div>
  );
};

export default Register;