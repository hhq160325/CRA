import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { selectUser } from '../../auth/authSlice';
import { getCurrentLocationWithAddress } from '../../location/locationService';
import { API_CONFIG, TRACKASIA_ENDPOINTS, TRACKASIA_API_CONFIG, USER_ENDPOINTS } from '../../../config/api';
import { tokenUtils } from '../../auth/utils';
import DropdownTemplate from '../../../shared/components/DropdownTemplate';

const ParklotCreate = () => {
  const { t } = useTranslation();
  const user = useSelector(selectUser);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    latitude: 0,
    longitude: 0,
    capacity: '',
    contactNum: '',
    notes: '',
    carOwnerId: '',
    carOwnersName: ''
  });

  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isLoadingCoordinates, setIsLoadingCoordinates] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [addressDebounceTimer, setAddressDebounceTimer] = useState(null);
  const [carOwners, setCarOwners] = useState([]);
  const [isLoadingCarOwners, setIsLoadingCarOwners] = useState(false);

  // Fetch car owners from API
  const fetchCarOwners = useCallback(async () => {
    setIsLoadingCarOwners(true);
    try {
      const token = tokenUtils.getAccessToken();
      const response = await axios.get(USER_ENDPOINTS.GET_ALL_USERS, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      // Filter users with roleId = 2 (car owners)
      const allUsers = response.data || [];
      const carOwnerUsers = allUsers.filter(user => user.roleId === 2);
      setCarOwners(carOwnerUsers);
    } catch (err) {
      console.error('Error fetching car owners:', err);
      // Don't show error to user, just log it
    } finally {
      setIsLoadingCarOwners(false);
    }
  }, []);

  // Fetch coordinates from address
  const fetchCoordinatesFromAddress = useCallback(async (address) => {
    if (!address || address.trim().length < 5) {
      return;
    }

    setIsLoadingCoordinates(true);

    try {
      const response = await fetch(TRACKASIA_ENDPOINTS.GET_COORDINATE_FROM_ADDRESS, {
        method: 'POST',
        headers: TRACKASIA_API_CONFIG.headers,
        body: JSON.stringify(address)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch coordinates');
      }

      const data = await response.json();

      if (data.latitude && data.longitude) {
        setFormData(prev => ({
          ...prev,
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude)
        }));
      }
    } catch (err) {
      console.error('Error fetching coordinates:', err);
      // Don't show error to user, just log it
    } finally {
      setIsLoadingCoordinates(false);
    }
  }, []);

  // Transform car owners data for dropdown
  const carOwnerOptions = carOwners.map(owner => ({
    id: owner.id || owner.userId,
    value: owner.id || owner.userId,
    label: `${owner.fullName || owner.username || owner.email}${owner.email && owner.fullName ? ` (${owner.email})` : ''}`,
    data: owner
  }));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);

    // If car owner is selected, also set the car owner's name
    if (name === 'carOwnerId' && value) {
      const selectedOwner = carOwners.find(owner => (owner.id || owner.userId) === value);
      if (selectedOwner) {
        setFormData(prev => ({
          ...prev,
          [name]: value,
          carOwnersName: selectedOwner.fullName || selectedOwner.username || selectedOwner.email || ''
        }));
      }
    }

    // If address field changed, debounce the coordinate fetch
    if (name === 'address') {
      // Clear existing timer
      if (addressDebounceTimer) {
        clearTimeout(addressDebounceTimer);
      }

      // Set new timer to fetch coordinates after 1 second of no typing
      const timer = setTimeout(() => {
        fetchCoordinatesFromAddress(value);
      }, 1000);

      setAddressDebounceTimer(timer);
    }
  };

  // Handle car owner dropdown selection
  const handleCarOwnerChange = (selectedOption) => {
    const ownerId = selectedOption?.value || '';
    const ownerName = selectedOption?.data ? 
      (selectedOption.data.fullName || selectedOption.data.username || selectedOption.data.email || '') : '';
    
    setFormData(prev => ({
      ...prev,
      carOwnerId: ownerId,
      carOwnersName: ownerName
    }));
    setError(null);
  };

  // Fetch car owners on component mount
  useEffect(() => {
    fetchCarOwners();
  }, [fetchCarOwners]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (addressDebounceTimer) {
        clearTimeout(addressDebounceTimer);
      }
    };
  }, [addressDebounceTimer]);

  const handleGetCurrentLocation = async () => {
    setIsLoadingLocation(true);
    setError(null);

    try {
      const locationData = await getCurrentLocationWithAddress(true);

      setFormData(prev => ({
        ...prev,
        address: locationData.formattedAddress || '',
        latitude: locationData.latitude || 0,
        longitude: locationData.longitude || 0
      }));
    } catch (err) {
      setError(err.message || t('failedToGetCurrentLocation'));
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validation
    if (!formData.name.trim()) {
      setError(t('parkingLotNameRequired'));
      return;
    }
    if (!formData.address.trim()) {
      setError(t('addressRequired'));
      return;
    }
    if (!formData.city.trim()) {
      setError(t('cityRequired'));
      return;
    }
    if (!formData.capacity || formData.capacity <= 0) {
      setError(t('validCapacityRequired'));
      return;
    }
    if (!formData.contactNum.trim()) {
      setError(t('contactNumberRequired'));
      return;
    }
    if (!formData.carOwnerId) {
      setError(t('carOwnerRequired'));
      return;
    }
    if (!formData.carOwnersName) {
      setError(t('carOwnersNameRequired'));
      return;
    }
    setIsSubmitting(true);

    try {
      const token = tokenUtils.getAccessToken();

      const requestBody = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        latitude: formData.latitude || 0,
        longtitude: formData.longitude || 0,
        capacity: parseInt(formData.capacity),
        contactNum: formData.contactNum.trim(),
        notes: formData.notes.trim() || '',
        managerId: formData.carOwnerId || user?.userId || user?.id || '',
        managerName: formData.carOwnersName || user?.fullName || user?.username || '',
        carOwnerId: formData.carOwnerId
      };

      console.log('Creating parking lot with data:', requestBody);

      const response = await fetch(`${API_CONFIG.BASE_URL}/ParkLot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create parking lot: ${response.status}`);
      }

      await response.json();

      setSuccess(true);
      // Reset form
      setFormData({
        name: '',
        address: '',
        city: '',
        latitude: 0,
        longitude: 0,
        capacity: '',
        contactNum: '',
        notes: '',
        carOwnerId: '',
        carOwnersName: ''
      });

      // Show success message for 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

    } catch (err) {
      setError(err.message || t('failedToCreateParkingLot'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('createParkingLot')}</h1>
        <p className="text-gray-600 mt-1">{t('addNewParkingLot')}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-800">{t('parkingLotCreatedSuccessfully')}</span>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            {t('parkingLotName')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t('enterParkingLotName')}
            required
          />
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            {t('address')} <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={t('enterAddress')}
                required
              />
              {isLoadingCoordinates && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={isLoadingLocation}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoadingLocation ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>{t('getting')}</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{t('useCurrent')}</span>
                </>
              )}
            </button>
          </div>
          {formData.latitude !== 0 && formData.longitude !== 0 && (
            <p className="mt-1 text-xs text-gray-500">
              {t('coordinates')}: {Number(formData.latitude).toFixed(6)}, {Number(formData.longitude).toFixed(6)}
            </p>
          )}
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
            {t('city')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t('enterCity')}
            required
          />
        </div>

        {/* Capacity */}
        <div>
          <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-2">
            {t('capacity')} <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="capacity"
            name="capacity"
            value={formData.capacity}
            onChange={handleInputChange}
            min="1"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t('enterParkingCapacity')}
            required
          />
        </div>

        {/* Contact Number */}
        <div>
          <label htmlFor="contactNum" className="block text-sm font-medium text-gray-700 mb-2">
            {t('contactNumber')} <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="contactNum"
            name="contactNum"
            value={formData.contactNum}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t('enterContactNumber')}
            required
          />
        </div>

        {/* Car Owner */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('carOwner')} <span className="text-red-500">*</span>
          </label>
          <DropdownTemplate
            value={formData.carOwnerId}
            onChange={handleCarOwnerChange}
            options={carOwnerOptions}
            placeholder={isLoadingCarOwners ? t('loading') : t('selectCarOwner')}
            searchable={true}
            searchPlaceholder={t('searchCarOwners')}
            loading={isLoadingCarOwners}
            disabled={isLoadingCarOwners}
            className="w-full"
          />
          {carOwners.length === 0 && !isLoadingCarOwners && (
            <p className="mt-1 text-sm text-gray-500">{t('noCarOwnersFound')}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            {t('notes')}
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={t('enterAdditionalNotes')}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            {t('cancel')}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>{t('creating')}</span>
              </>
            ) : (
              <span>{t('createParkingLotButton')}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ParklotCreate;
