import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { AUTH_ENDPOINTS, AUTH_API_CONFIG } from '../../../config/api';

const CreateStaffAcc = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    fullname: '',
    address: '',
    gender: 0
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = t('createStaffUsernameRequired');
    }

    if (!formData.password.trim()) {
      newErrors.password = t('createStaffPasswordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('createStaffPasswordMinLength');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('createStaffEmailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('createStaffEmailInvalid');
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = t('createStaffPhoneRequired');
    } else if (!/^0\d{9}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = t('createStaffPhoneInvalid');
    }

    if (!formData.fullname.trim()) {
      newErrors.fullname = t('createStaffFullnameRequired');
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = t('createStaffDateOfBirthRequired');
    }

    if (!formData.address.trim()) {
      newErrors.address = t('createStaffAddressRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // console.log('Create Staff Account button clicked');
    // console.log('Form data before validation:', formData);

    if (!validateForm()) {
      // console.log('Form validation failed');
      // console.log('Validation errors:', errors);
      return;
    }

    // console.log('Form validation passed');
    setLoading(true);

    try {
      // Format date to match the required format
      const formattedData = {
        ...formData,
        dateOfBirth: new Date(formData.dateOfBirth).toISOString()
      };

      // console.log('Formatted data for API:', formattedData);
      // console.log('Starting staff account creation...');

      // Get fresh token for the request
      const token = localStorage.getItem('jwtToken');

      const response = await fetch(AUTH_ENDPOINTS.CREATE_STAFF, {
        method: 'POST',
        headers: {
          ...AUTH_API_CONFIG.headers,
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formattedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // console.log('API Response:', result);

      // Reset form on success
      setFormData({
        username: '',
        password: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        fullname: '',
        address: '',
        gender: 0
      });

      // console.log('Staff account created successfully');
      // console.log('Form reset to initial state');

      // Show success message
      toast.success(t('createStaffSuccessMessage'));

    } catch (error) {
      // console.error('Error creating staff account:', error);
      // console.log('Error details:',
      //   {
      //     message: error.message,
      //     response: error.response?.data,
      //     status: error.response?.status
      //   });
      toast.error(t('createStaffErrorMessage'));
    } finally {
      setLoading(false);
      // console.log('Loading state set to false');
    }
  };

  return (
    <div className="flex items-center justify-left bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {t('createStaffTitle')}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              {t('createStaffUsername')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder={t('createStaffUsernamePlaceholder')}
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              {t('createStaffPassword')} <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder={t('createStaffPasswordPlaceholder')}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Full Name */}
          <div>
            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-1">
              {t('createStaffFullname')} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={formData.fullname}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.fullname ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder={t('createStaffFullnamePlaceholder')}
            />
            {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              {t('createStaffEmail')} <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder={t('createStaffEmailPlaceholder')}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
              {t('createStaffPhoneNumber')} <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              maxLength="10"
              pattern="^0\d{9}$"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder={t('createStaffPhoneNumberPlaceholder')}
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
              {t('createStaffDateOfBirth')} <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                }`}
            />
            {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              {t('createStaffAddress')} <span className="text-red-500">*</span>
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
              placeholder={t('createStaffAddressPlaceholder')}
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              {t('createStaffGender')}
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>{t('createStaffGenderMale')}</option>
              <option value={1}>{t('createStaffGenderFemale')}</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                }`}
            >
              {loading ? t('createStaffCreating') : t('createStaffCreateButton')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateStaffAcc;