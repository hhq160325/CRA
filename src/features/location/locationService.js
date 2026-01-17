/**
 * Location Service
 * Handles geolocation operations including getting current position
 * and reverse geocoding coordinates to addresses
 */

import { TRACKASIA_ENDPOINTS, TRACKASIA_API_CONFIG } from '../../config/api';

/**
 * Get user's current precise location
 * Optimized for Vietnam with high accuracy GPS
 */
export const getCurrentLocation = (options = {}) => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    const defaultOptions = {
      enableHighAccuracy: true, 
      timeout: 30000,           // Wait max 30 seconds for GPS lock
      maximumAge: 0            
    };

    const finalOptions = { ...defaultOptions, ...options };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp
        };
        
        // console.log('Current Location:', {
        //   latitude: locationData.latitude,
        //   longitude: locationData.longitude,
        //   accuracy: `${locationData.accuracy}m`,
        //   timestamp: new Date(locationData.timestamp).toLocaleString()
        // });
        
        resolve(locationData);
      },
      (error) => {
        let errorMessage = 'Unable to retrieve location';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
          default:
            errorMessage = error.message;
        }
        
        reject(new Error(errorMessage));
      },
      finalOptions
    );
  });
};

/**
 * Watch user's location for continuous updates
 * onSuccess - Callback for successful location updates
 * onError - Callback for errors
 * options - Geolocation options
 */
export const watchLocation = (onSuccess, onError, options = {}) => {
  if (!navigator.geolocation) {
    onError(new Error('Geolocation is not supported by your browser'));
    return null;
  }

  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  };

  const finalOptions = { ...defaultOptions, ...options };

  return navigator.geolocation.watchPosition(
    (position) => {
      onSuccess({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      });
    },
    (error) => {
      onError(error);
    },
    finalOptions
  );
};

/**
 * Clear location watch
 * watchId - Watch ID returned from watchLocation
 */
export const clearLocationWatch = (watchId) => {
  if (watchId && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
};

/**
 * Reverse geocode coordinates to address using backend API
 * latitude - Latitude coordinate
 * longitude - Longitude coordinate
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(TRACKASIA_ENDPOINTS.REVERSE_GEOCODING, {
      method: 'POST',
      headers: TRACKASIA_API_CONFIG.headers,
      body: JSON.stringify({
        latitude: latitude.toString(),
        longitude: longitude.toString()
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch address: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.formattedAddress) {
      throw new Error('No address found for these coordinates');
    }
    
    return {
      formattedAddress: data.formattedAddress,
      oldFormattedAddress: data.oldFormattedAddress,
      coordinates: {
        latitude,
        longitude
      }
    };
  } catch (error) {
    throw new Error(`Reverse geocoding failed: ${error.message}`);
  }
};

/**
 * Get best possible location by trying multiple times
 * Similar to how mobile apps get precise location
 * maxAttempts - Maximum number of attempts
 * targetAccuracy - Target accuracy in meters
 * Best location found
 */
export const getBestLocation = async (maxAttempts = 3, targetAccuracy = 10) => {
  let bestLocation = null;
    
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const location = await getCurrentLocation({
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0
      });
      
      
      // Keep the best (most accurate) location
      if (!bestLocation || location.accuracy < bestLocation.accuracy) {
        bestLocation = location;
      }
      
      // If we hit target accuracy, stop trying
      if (location.accuracy <= targetAccuracy) {
        break;
      }
      
      // Wait longer between attempts (GPS needs time to lock satellites)
      if (i < maxAttempts - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000)); // Increased from 1s to 2s
      }
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error.message);
      if (i === maxAttempts - 1 && !bestLocation) {
        throw error;
      }
    }
  }
  
  return bestLocation;
};

/* Get current location with address */
export const getCurrentLocationWithAddress = async (useBestLocation = false) => {
  try {
    const location = useBestLocation 
      ? await getBestLocation()
      : await getCurrentLocation();
      
    const address = await reverseGeocode(location.latitude, location.longitude);
    
    return {
      ...location,
      ...address
    };
  } catch (error) {
    throw error;
  }
};

/**
 * Forward geocode address to coordinates using TrackAsia
 * Better accuracy for Vietnam addresses
 * @param {string} address - Address string to geocode
 * @returns {Promise<Object>} Location data with coordinates
 */
// export const geocodeAddress = async (address) => {
//   try {
//     const apiKey = process.env.REACT_APP_TRACKASIA_API_KEY || 'public_key';
    
//     const response = await fetch(
//       `https://maps.track-asia.com/api/v2/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
//     );

//     if (!response.ok) {
//       throw new Error('Failed to geocode address');
//     }

//     const data = await response.json();
    
//     if (data.status !== 'OK' || !data.results || data.results.length === 0) {
//       throw new Error('Address not found');
//     }

//     const result = data.results[0];
//     const location = result.geometry?.location || {};

//     return {
//       latitude: parseFloat(location.lat),
//       longitude: parseFloat(location.lng),
//       formattedAddress: result.formatted_address || result.name || address,
//       placeId: result.place_id || '',
//       plusCode: result.plus_code?.global_code || ''
//     };
//   } catch (error) {
//     throw new Error(`Geocoding failed: ${error.message}`);
//   }
// };

/**
 * Get place autocomplete suggestions using TrackAsia
 * Better accuracy for Vietnam addresses
 * @param {string} input - Search input text
 * @returns {Promise<Array>} Array of place predictions
 */
// export const getPlaceAutocomplete = async (input) => {
//   if (!input || input.length < 3) {
//     return [];
//   }

//   try {
//     const apiKey = process.env.REACT_APP_TRACKASIA_API_KEY || 'public_key';
    
//     const response = await fetch(
//       `https://maps.track-asia.com/api/v2/geocode/autocomplete?text=${encodeURIComponent(input)}&key=${apiKey}`
//     );

//     if (!response.ok) {
//       throw new Error('Failed to fetch autocomplete suggestions');
//     }

//     const data = await response.json();
    
//     if (data.status !== 'OK' || !data.predictions) {
//       return [];
//     }
    
//     return data.predictions.map(place => {
//       const mainText = place.structured_formatting?.main_text || place.description?.split(',')[0] || '';
//       const secondaryText = place.structured_formatting?.secondary_text || place.description?.split(',').slice(1).join(',').trim() || '';
      
//       return {
//         placeId: place.place_id || '',
//         description: place.description || mainText,
//         mainText: mainText,
//         secondaryText: secondaryText,
//         // Note: Autocomplete doesn't return coordinates, need to call geocode after selection
//         latitude: null,
//         longitude: null
//       };
//     });
//   } catch (error) {
//     console.error('Autocomplete error:', error);
//     return [];
//   }
// };

/**
 * Check if geolocation is supported
 * @returns {boolean} True if geolocation is supported
 */
export const isGeolocationSupported = () => {
  return 'geolocation' in navigator;
};
