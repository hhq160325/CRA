import React, { useState } from 'react';
import { LocationPicker } from '../index';

/**
 * LocationInput Component
 * Combined input with GPS location and manual editing
 * Perfect for Vietnam where GPS coordinates are accurate but addresses may need correction
 */
const LocationInput = ({ 
  value = '',
  onChange,
  placeholder = "Enter your address...",
  label = "Location"
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [coords, setCoords] = useState(null);

  const handleGPSLocation = (data) => {
    // Log the data received from GPS
    // console.log('=== LocationInput - GPS Data Received ===');
    // console.log('Full data object:', data);
    // console.log('formattedAddress:', data.formattedAddress);
    // console.log('address object:', data.address);
    // console.log('=========================================');
    
    // Set the address from GPS
    onChange(data.formattedAddress, {
      lat: data.latitude,
      lng: data.longitude,
      accuracy: data.accuracy
    });
    setCoords({
      lat: data.latitude,
      lng: data.longitude,
      accuracy: data.accuracy
    });
    setShowDropdown(false);
  };

  const handleInputChange = (e) => {
    onChange(e.target.value, coords);
  };

  return (
    <div className="w-full relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      
      {/* Input Field with Location Icon */}
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-10 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={value}
          onChange={handleInputChange}
        />
        
        {/* Location Icon Button */}
        <button
          type="button"
          onClick={() => setShowDropdown(!showDropdown)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
          title="Use current location"
        >
          <svg 
            className={`w-5 h-5 transition-transform ${showDropdown ? 'text-blue-600' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          </svg>
        </button>
      </div>

      {/* Dropdown with GPS Location Picker */}
      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute z-20 mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            <LocationPicker 
              onLocationSelect={handleGPSLocation}
              showAddress={true}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default LocationInput;
