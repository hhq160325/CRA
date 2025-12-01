import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { loginUser, clearError, selectIsLoading, selectError } from '../authSlice';
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
  

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Gradient background matching the design */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400"></div>

      {/* Login card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">{t('logIn')}</h1>

<<<<<<< HEAD
        {/* Subtitle */}
        <p className="text-gray-600 text-center mb-4">
          {t('newToDesignSpace')} <button onClick={onSwitchToRegister} className="text-blue-600 hover:text-blue-700 font-medium">{t('signUpForFree')}</button>
        </p>

=======
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
        {/* Mock credentials helper */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
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
        </div>

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

<<<<<<< HEAD
          {/* Social login buttons */}
          <div className="grid grid-cols-4 gap-3">
=======
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
          <div className="grid grid-cols-2 gap-3">
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
            {/* Facebook */}
            <button
              type="button"
              className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>

<<<<<<< HEAD
            {/* GitHub */}
            <button
              type="button"
              className="flex items-center justify-center p-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </button>

=======
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
            {/* Google */}
            <button
              type="button"
              className="flex items-center justify-center p-3 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Google"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </button>
<<<<<<< HEAD

            {/* Twitter */}
            <button
              type="button"
              className="flex items-center justify-center p-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
              aria-label="Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </button>
          </div>

=======
          </div>

          {/* Sign up link */}
          <p className="text-gray-600 text-center">
            {t('newToDesignSpace')} <button onClick={onSwitchToRegister} className="text-blue-600 hover:text-blue-700 font-medium">{t('signUpForFree')}</button>
          </p>

>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
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