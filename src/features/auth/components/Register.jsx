import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser, clearError, clearSuccess, selectIsLoading, selectError, selectIsAuthenticated, selectSuccess } from '../authSlice';

const Register = ({ onSwitchToLogin }) => {
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

  // Redirect to homepage when authentication succeeds
  useEffect(() => {
    if (isAuthenticated) {
      setIsRedirecting(true);
      // Small delay to show the redirect message
      const timer = setTimeout(() => {
        navigate('/');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);


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

  // Show loading screen when redirecting
  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400"></div>
        <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            <h2 className="text-2xl font-bold text-gray-900">Success!</h2>
            <p className="text-gray-600">Redirecting to homepage...</p>
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
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Sign up</h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-center mb-6">
          Already have an account? <button onClick={onSwitchToLogin} className="text-blue-600 hover:text-blue-700 font-medium">Log in</button>
        </p>

      {/* Form instruction */}
      <p className="text-gray-600 text-sm text-center mb-6">
        Enter your details to create an account.
      </p>

      {/* Registration form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username field */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-900 mb-2">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your username"
            required
          />
        </div>

        {/* Password field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your password"
            required
          />
        </div>

        {/* Email field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Phone Number field */}
        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-900 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter your phone number"
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
          {isLoading ? 'Creating account...' : 'Create an account'}
        </button>
      </form>

      {/* Separator */}
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-gray-300"></div>
        <span className="px-4 text-gray-500 text-sm">Or</span>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Social login buttons */}
      <div className="space-y-3">
        {/* Google sign in button */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>

        {/* Facebook sign in button */}
        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          Sign in with Facebook
        </button>
      </div>
      </div>
    </div>
  );
};

export default Register;