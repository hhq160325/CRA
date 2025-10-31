import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { forgotPasswordUser, clearError, clearSuccess } from "../authSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

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

    // Clear email error when user starts typing
    if (emailError) {
      setEmailError("");
    }
  };

  const validateEmail = () => {
    if (!email.trim()) {
      setEmailError("Email is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    try {
      await dispatch(forgotPasswordUser(email.trim())).unwrap();
    } catch (error) {
      // Error is already handled by Redux slice
      console.error("Forgot password failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-orange-400"></div>
      <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">Forgot your password?</h1>
        <p className="text-gray-600 text-center mb-6">Enter your email address and we'll send you a link to reset it.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-700 text-sm">{success}</p>
              <p className="text-green-600 text-sm mt-1">Please check your email for further instructions.</p>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={`w-full px-4 py-3 border ${emailError ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-900 text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Sending reset email...' : 'Send reset email'}
          </button>

          <div className="text-center">
            <Link to="/auth" className="text-blue-600 hover:text-blue-700 text-sm font-medium">Back to login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;


