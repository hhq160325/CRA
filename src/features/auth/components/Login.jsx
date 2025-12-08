import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { loginUser, googleLoginUser, clearError, selectIsLoading, selectError } from '../authSlice';
import { getRoleFromToken, getRedirectPathByRole } from '../utils';

const Login = ({ onSwitchToRegister }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);

  // Listen for Google auth data from popup/tab
  useEffect(() => {
    const handleMessage = async (event) => {
      const data = event.data;
      
      // Ignore webpack and other dev messages
      if (!data || typeof data !== 'object' || data.type === 'webpackWarnings' || data.type === 'webpackOk' || data.source === 'react-devtools-bridge' || data.source === 'react-devtools-content-script') {
        return;
      }
      
      console.log('Login: Received postMessage:', {
        origin: event.origin,
        data: data,
        hasToken: !!(data.token || data.JwtToken),
        dataKeys: Object.keys(data)
      });
      
      // Check if this is Google auth data (has token - check both lowercase and capitalized)
      const token = data.token || data.JwtToken;
      if (token) {
        try {
          const email = data.email || data.Email;
          const username = data.username || data.Username;
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
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser(formData)).unwrap();
      setFormData({ email: '', password: '' });
      
      // Get role from token and redirect accordingly
      const token = result.accessToken;
      const roleId = getRoleFromToken(token);
      const redirectPath = getRedirectPathByRole(roleId);
      
      navigate(redirectPath);
    } catch (error) {
      // Error is handled by Redux
    }
  };

  const handleGoogleLogin = () => {
    try {
      // Open Google OAuth in a new tab
      const localURL = 'https://localhost:7184/api/Authen/google-callback';
      const googleAuthUrl = `https://localhost:7184/api/Authen/login/google?localURL=${encodeURIComponent(localURL)}`;
      
      // Open in new tab
      window.open(googleAuthUrl, '_blank');
    } catch (error) {
      console.error('Google login error:', error);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Gradient background matching the design */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400"></div>

      {/* Login card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">{t('logIn')}</h1>

        {/* Mock credentials helper */}
        {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-800 text-sm font-medium mb-1">{t('demoCredentials')}</p>
              <p className="text-blue-700 text-xs">Email: khangTEST02@gmail.com</p>
              <p className="text-blue-700 text-xs">{t('password')}: 123456</p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ email: 'khangTEST02@gmail.com', password: '123456' })}
              className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
            >
              {t('useDemo')}
            </button>
          </div>
        </div> */}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-6" aria-label="login form">
          {/* Email field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              {t('emailAddress')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>

          {/* Password field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                {t('password')}
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-gray-700 text-sm flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {showPassword ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  )}
                </svg>
                {showPassword ? t('hide') : t('show')}
              </button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>

          {/* Forgot password link */}
          <div className="text-left">
            <button
              type="button"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              onClick={() => navigate('/auth/forgot-password')}
            >
              {t('forgotPassword')}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Login button */}
          <button
            type="submit"
            disabled={isLoading || !formData.email || !formData.password}
            className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? t('loggingIn') : t('logIn')}
          </button>

          {/* Separator */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">{t('OrSignupwith')}</span>
            </div>
          </div>

          {/* Social login buttons */}
          <div className="grid grid-cols-1 gap-3">
            {/* Google */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="flex items-center justify-center p-3 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Google"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </button>
          </div>

          {/* Sign up link */}
          <p className="text-gray-600 text-center">
            {t('newToDesignSpace')} <button onClick={onSwitchToRegister} className="text-blue-600 hover:text-blue-700 font-medium">{t('signUpForFree')}</button>
          </p>

          {/* SSO button */}
          {/* <button
            type="button"
            className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-gray-900 font-medium">Log in with SSO</span>
          </button> */}
        </form>
      </div>
    </div>
  );
};

export default Login;