import React, { useState } from 'react';
import { useLocation } from '../useLocation';

/**
 * LocationPicker Component
 * Allows users to get their current location with a button click
 */
const LocationPicker = ({ onLocationSelect, showAddress = true }) => {
  const { location, address, loading, error, getLocation } = useLocation({ 
    fetchAddress: showAddress 
  });
  
  const [hasAttempted, setHasAttempted] = useState(false);

  const handleGetLocation = async () => {
    setHasAttempted(true);
    await getLocation();
  };

  // Call parent callback when location is obtained
  React.useEffect(() => {
    if (location && onLocationSelect) {
      console.log('=== LocationPicker - Sending data ===');
      console.log('Latitude:', location.latitude);
      console.log('Longitude:', location.longitude);
      console.log('Accuracy:', location.accuracy);
      console.log('address object:', address);
      console.log('address.formattedAddress:', address?.formattedAddress);
      console.log('====================================');
      
      onLocationSelect({
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
        address: address,
        // Use formattedAddress from locationService if available
        formattedAddress: address?.formattedAddress || 
          (address ? `${address.road || ''}, ${address.city || ''}`.replace(/^,\s*|,\s*$/g, '') : 
          `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`)
      });
    }
  }, [location, address, onLocationSelect]);

  return (
    <div className="space-y-3">
      <button
        onClick={handleGetLocation}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        <svg 
          className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {loading ? (
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          ) : (
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" 
            />
          )}
        </svg>
        {loading ? 'Getting location...' : 'Use My Current Location'}
      </button>

      {error && hasAttempted && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {location && !loading && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg space-y-2">
          <div className="flex items-start gap-2">
            <svg 
              className="w-5 h-5 text-green-600 mt-0.5" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                clipRule="evenodd" 
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">Location obtained</p>
              {showAddress && address ? (
                <p className="text-sm text-green-700 mt-1">
                  {address.road && `${address.road}, `}
                  {address.city && `${address.city}, `}
                  {address.state}
                </p>
              ) : (
                <p className="text-sm text-green-700 mt-1">
                  {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)}
                </p>
              )}
              <p className="text-xs text-green-600 mt-1">
                Accuracy: ±{Math.round(location.accuracy)}m
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
