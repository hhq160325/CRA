import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { resetPasswordUser, clearError, clearSuccess } from "../authSlice";

const ResetPassword = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error, success } = useSelector((state) => state.auth);

  // Redirect if no token
  useEffect(() => {
    if (!token) {
      navigate("/auth/forgot-password");
    }
  }, [token, navigate]);

  // Clear messages on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  // Redirect to login after successful password reset
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate("/auth");
      }, 3000);
    }
  }, [success, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = t('passwordRequired');
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = t('passwordTooShort');
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = t('passwordRequirements');
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('confirmPasswordRequired');
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = t('passwordsDoNotMatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await dispatch(
        resetPasswordUser({
          token,
          newPassword: formData.newPassword,
        })
      ).unwrap();
    } catch (error) {
      // Error is already handled by Redux slice
      console.error("Password reset failed:", error);
    }
  };

  if (!token) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Gradient background matching the design */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400"></div>
      
      {/* Reset password card */}
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">{t('resetYourPassword')}</h1>
        <p className="text-gray-600 text-center mb-6">{t('enterNewPasswordBelow')}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-700 text-sm">{success}</p>
              <p className="text-green-600 text-sm mt-1">Redirecting to login page...</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                {t('newPassword')}
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                required
                className={`w-full px-4 py-3 border ${
                  errors.newPassword ? "border-red-300" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                placeholder={t('enterNewPassword')}
                value={formData.newPassword}
                onChange={handleChange}
              />
              {errors.newPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                {t('confirmNewPassword')}
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className={`w-full px-4 py-3 border ${
                  errors.confirmPassword ? "border-red-300" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
                placeholder={t('confirmNewPasswordPlaceholder')}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-400 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? t('resettingPassword') : t('resetPassword')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;


