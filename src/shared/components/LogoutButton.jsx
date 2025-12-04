import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { logoutUser } from '../../features/auth/authSlice';

const LogoutButton = ({
  className = "w-full flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors",
  showIcon = true,
  children,
  onLogoutSuccess,
  onLogoutError
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogoutClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmLogout = async () => {
    setShowConfirm(false);
    setIsLoading(true);

    try {
      await dispatch(logoutUser()).unwrap();

      if (onLogoutSuccess) {
        onLogoutSuccess();
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Logout failed:', error);

      if (onLogoutError) {
        onLogoutError(error);
      } else {
        navigate('/');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelLogout = () => {
    setShowConfirm(false);
  };

  return (
    <>
      <button
        onClick={handleLogoutClick}
        className={className}
        disabled={isLoading}
      >
        {showIcon && (
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        )}
        {children || t('logOut')}
      </button>

      {/* Confirmation Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {t('doYouWantToLogout')}
            </h3>
            <div className="flex space-x-3">
              <button
                onClick={handleConfirmLogout}
                className="flex-1 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
              >
                {t('yes')}
              </button>
              <button
                onClick={handleCancelLogout}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 transition-colors"
              >
                {t('no')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-700">{t('redirectingToHomepage')}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutButton;