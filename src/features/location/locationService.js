/**
 * Location Service
 * Handles geolocation operations including getting current position
 * and reverse geocoding coordinates to addresses
 */

/**
 * Get user's current precise location
 * Optimized for Vietnam with high accuracy GPS
 * @param {Object} options - Geolocation options
 * @returns {Promise<Object>} Location data with coordinates and accuracy
 */
export const getCurrentLocation = (options = {}) => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    const defaultOptions = {
      enableHighAccuracy: true, // Use GPS satellites for best accuracy (5-10m)
      timeout: 30000,           // Wait max 30 seconds for GPS lock (longer = more accurate)
      maximumAge: 0             // Don't use cached position, always get fresh data
    };

    const finalOptions = { ...defaultOptions, ...options };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy, // in meters
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp
        });
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
 * @param {Function} onSuccess - Callback for successful location updates
 * @param {Function} onError - Callback for errors
 * @param {Object} options - Geolocation options
 * @returns {number} Watch ID to clear the watch later
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
 * @param {number} watchId - Watch ID returned from watchLocation
 */
export const clearLocationWatch = (watchId) => {
  if (watchId && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
};

/**
 * Reverse geocode coordinates to address using Geoapify API
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Promise<Object>} Address information
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const apiKey = process.env.REACT_APP_GEOAPIFY_API_KEY || '8cd8a0368a9b4aa9948526ec9b8b8a86';
    
    if (!apiKey) {
      throw new Error('Geoapify API key is not configured');
    }
    
    // Geoapify reverse geocoding endpoint
    const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`;
    
    console.log('=== Geoapify API Request ===');
    console.log('URL:', url);
    console.log('============================');
    
    const response = await fetch(url);

    if (!response.ok) {
      console.error('Geoapify API Error - Status:', response.status);
      throw new Error(`Failed to fetch address from Geoapify: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('=== Geoapify API Response ===');
    console.log('Full response data:', data);
    console.log('Features count:', data.features?.length || 0);
    console.log('=============================');
    
    // Geoapify response structure
    // Format: { features: [{ properties: { ... } }] }
    if (!data.features || data.features.length === 0) {
      throw new Error('No address found for these coordinates');
    }
    
    const result = data.features[0];
    const props = result.properties || {};
    
    // Extract address components from Geoapify
    const houseNumber = props.housenumber || '';
    const roadName = props.street || props.road || '';
    const ward = props.suburb || props.neighbourhood || '';
    const district = props.district || props.county || '';
    const city = props.city || props.state || '';
    const country = props.country || '';
    const postcode = props.postcode || '';
    
    // Get formatted address from Geoapify
    const displayName = props.formatted || '';
    
    // Build formatted address
    // Format: [House Number] [Street], [Ward], [District], [City]
    let formattedParts = [];
    
    if (houseNumber && roadName) {
      formattedParts.push(`${houseNumber} ${roadName}`);
    } else if (roadName) {
      formattedParts.push(roadName);
    }
    
    if (ward) formattedParts.push(ward);
    
    if (district && district.trim()) {
      formattedParts.push(district);
    }
    
    if (city && city.trim()) {
      formattedParts.push(city);
    }
    
    const formattedAddress = formattedParts.length > 0 
      ? formattedParts.join(', ')
      : displayName;
    
    // Log formatted address components
    console.log('=== Address Format Debug ===');
    console.log('Latitude:', latitude);
    console.log('Longitude:', longitude);
    console.log('House Number:', houseNumber || 'N/A');
    console.log('Road Name:', roadName || 'N/A');
    console.log('Ward:', ward || 'N/A');
    console.log('District:', district || 'N/A');
    console.log('City:', city || 'N/A');
    console.log('Formatted Parts:', formattedParts);
    console.log('Final Formatted Address:', formattedAddress);
    console.log('============================');
    
    return {
      formattedAddress: formattedAddress,
      fullAddress: displayName, // Keep original full address
      address: {
        houseNumber: houseNumber,
        road: roadName,
        ward: ward,
        district: district,
        city: city,
        country: country,
        postcode: postcode
      },
      coordinates: {
        latitude,
        longitude
      },
      rawData: data // Include raw data for debugging
    };
  } catch (error) {
    throw new Error(`Reverse geocoding failed: ${error.message}`);
  }
};

/**
 * Get best possible location by trying multiple times
 * Similar to how mobile apps get precise location
 * @param {number} maxAttempts - Maximum number of attempts
 * @param {number} targetAccuracy - Target accuracy in meters
 * @returns {Promise<Object>} Best location found
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
        await new Promise(resolve => setTimeout(resolve, 3000)); // Increased from 2s to 3s
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

/**
 * Get current location with address
 * @param {boolean} useBestLocation - Try multiple times for best accuracy
 * @returns {Promise<Object>} Location with coordinates and address
 */
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
 * Forward geocode address to coordinates using OpenMap Vietnam
 * Better accuracy for Vietnam addresses
 * @param {string} address - Address string to geocode
 * @returns {Promise<Object>} Location data with coordinates
 */
export const geocodeAddress = async (address) => {
  try {
    const apiKey = process.env.REACT_APP_OPENMAP_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenMap API key is not configured');
    }
    
    const response = await fetch(
      `https://mapapis.openmap.vn/v1/geocode/search?address=${encodeURIComponent(address)}&apikey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to geocode address');
    }

    const data = await response.json();
    
    if (!data || !data.results || data.results.length === 0) {
      throw new Error('Address not found');
    }

    const result = data.results[0];
    const location = result.geometry?.location || result.location || {};

    return {
      latitude: parseFloat(location.lat || result.lat),
      longitude: parseFloat(location.lng || result.lng || result.lon),
      formattedAddress: result.formatted_address || result.address || address,
      placeId: result.place_id || result.id
    };
  } catch (error) {
    throw new Error(`Geocoding failed: ${error.message}`);
  }
};

/**
 * Get place autocomplete suggestions using OpenMap Vietnam
 * Better accuracy for Vietnam addresses
 * @param {string} input - Search input text
 * @returns {Promise<Array>} Array of place predictions
 */
export const getPlaceAutocomplete = async (input) => {
  if (!input || input.length < 3) {
    return [];
  }

  try {
    const apiKey = process.env.REACT_APP_OPENMAP_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenMap API key is not configured');
    }
    
    const response = await fetch(
      `https://mapapis.openmap.vn/v1/geocode/autocomplete?text=${encodeURIComponent(input)}&apikey=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch autocomplete suggestions');
    }

    const data = await response.json();
    
    if (!data || !data.predictions) {
      return [];
    }
    
    return data.predictions.map(place => {
      const mainText = place.structured_formatting?.main_text || place.description?.split(',')[0] || '';
      const secondaryText = place.structured_formatting?.secondary_text || place.description?.split(',').slice(1).join(',').trim() || '';
      
      return {
        placeId: place.place_id || place.id,
        description: place.description || mainText,
        mainText: mainText,
        secondaryText: secondaryText,
        // Note: Autocomplete doesn't return coordinates, need to call geocode after selection
        latitude: null,
        longitude: null
      };
    });
  } catch (error) {
    console.error('Autocomplete error:', error);
    return [];
  }
};

/**
 * Check if geolocation is supported
 * @returns {boolean} True if geolocation is supported
 */
export const isGeolocationSupported = () => {
  return 'geolocation' in navigator;
};
