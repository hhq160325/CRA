import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError, selectIsLoading, selectError } from '../authSlice';
import Modal from '../../../shared/components/Modal';

const Login = ({ isOpen, onClose, onSwitchToRegister }) => {
  const dispatch = useDispatch();
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
    // Clear error when user starts typing
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(formData)).unwrap();
      onClose();
      // Reset form
      setFormData({ email: '', password: '' });
    } catch (error) {
      // Error is handled by Redux
    }
  };

  const handleClose = () => {
    dispatch(clearError());
    setFormData({ email: '', password: '' });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="p-8">
      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Log in</h2>
      
      {/* Subtitle */}
      <p className="text-gray-600 text-center mb-8">
        New to Design Space? <button onClick={onSwitchToRegister} className="text-blue-600 underline hover:text-blue-700">Sign up for free</button>
      </p>

      {/* Social login buttons - 4 buttons in a row like in the image */}
      <div className="grid grid-cols-4 gap-2 mb-8">
        {/* Facebook */}
        <button className="flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <span className="font-bold text-lg">f</span>
        </button>
        
        {/* GitHub/Apple */}
        <button className="flex items-center justify-center p-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </button>
        
        {/* Google */}
        <button className="flex items-center justify-center p-3 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors">
          <span className="font-bold text-lg">G</span>
        </button>
        
        {/* Twitter */}
        <button className="flex items-center justify-center p-3 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        </button>
      </div>

      {/* Login form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
            Email address
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

        {/* Password field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 flex items-center"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showPassword ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                )}
              </svg>
              <span className="text-xs">Hide</span>
            </button>
          </div>
        </div>

        {/* Forgot password link */}
        <div className="text-left">
          <button
            type="button"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Forget password?
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
          className="w-full bg-gray-300 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Logging in...' : 'Log in'}
        </button>

        {/* SSO button */}
        <button
          type="button"
          className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5 mr-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span className="text-gray-900 font-medium">Log in with SSO</span>
        </button>
      </form>
    </Modal>
  );
};

export default Login;