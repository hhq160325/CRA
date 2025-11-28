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
      timeout: 60000,           // Wait max 30 seconds for GPS lock (longer = more accurate)
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
 * Reverse geocode coordinates to address using TrackAsia API
 * Better accuracy for Vietnam addresses
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Promise<Object>} Address information
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const apiKey = process.env.REACT_APP_TRACKASIA_API_KEY || 'public_key';
    
    // TrackAsia API endpoint with new_admin for better administrative boundaries
    const url = `https://maps.track-asia.com/api/v2/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&new_admin=true`;
    
    console.log('=== TrackAsia API Request ===');
    console.log('URL:', url);
    console.log('=============================');
    
    const response = await fetch(url);

    if (!response.ok) {
      console.error('TrackAsia API Error - Status:', response.status);
      throw new Error(`Failed to fetch address from TrackAsia: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('=== TrackAsia API Response ===');
    console.log('Full response data:', data);
    console.log('Status:', data.status);
    console.log('Results count:', data.results?.length || 0);
    console.log('==============================');
    
    // TrackAsia response structure
    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      throw new Error('No address found for these coordinates');
    }
    
    const result = data.results[0];
    const displayName = result.formatted_address || result.name || '';
    const components = result.address_components || [];
    

    // Parse address components - TrackAsia format
    const getComponent = (types) => {
      const typeArray = Array.isArray(types) ? types : [types];
      const component = components.find(c => {
        if (!c.types) return false;
        return typeArray.some(type => c.types.includes(type));
      });
      return component ? (component.long_name || component.short_name) : '';
    };
    
    
    // Extract address components for Vietnam
    let houseNumber = getComponent(['street_number', 'premise']);
    let roadName = getComponent(['route', 'street']);
    
    // TrackAsia uses administrative_area_level_2 for ward/commune and level_1 for city/province
    // Check if level_2 contains ward/commune (phường/xã) or district (quận/huyện)
    const level2 = getComponent(['administrative_area_level_2', 'locality']);
    const level1 = getComponent(['administrative_area_level_1', 'administrative_area']);
    
    let ward = '';
    let district = '';
    let city = level1;
    
    // Determine if level_2 is a ward or district based on Vietnamese prefixes
    if (level2) {
      if (level2.match(/^(Phường|phường|Xã|xã|Thị trấn|thị trấn)/)) {
        ward = level2;
      } else if (level2.match(/^(Quận|quận|Huyện|huyện|Thị xã|thị xã|Đặc Khu|đặc khu)/)) {
        district = level2;
      } else {
        // If no prefix, assume it's a ward
        ward = level2;
      }
    }
    
    const country = getComponent(['country']);
    
    
    // If we have a name field (like "49 Đường Nguyễn Huệ"), parse it
    if (result.name && !houseNumber && !roadName) {
      const nameParts = result.name.split(' ');
      if (nameParts.length >= 2) {
        // Check if first part is a number (house number)
        if (!isNaN(nameParts[0])) {
          houseNumber = nameParts[0];
          roadName = nameParts.slice(1).join(' ');
        } else {
          roadName = result.name;
        }
      }
    }
    
    // If components are empty, try parsing from formatted_address
    if (!roadName && !ward && !district && displayName) {
      const parts = displayName.split(',').map(p => p.trim());
      
      if (parts.length >= 2) {
        // First part might be street or area
        if (!roadName) roadName = parts[0];
        if (!ward && parts.length >= 2) {
          // Check if it's a ward or district
          if (parts[1].match(/^(Phường|phường|Xã|xã)/)) {
            ward = parts[1];
          } else if (parts[1].match(/^(Quận|quận|Huyện|huyện)/)) {
            district = parts[1];
          }
        }
        if (!city && parts.length >= 3) city = parts[2];
      }
    }
    
    // Clean up Vietnamese administrative prefixes - keep them for formatted address
    const cleanWard = ward?.replace(/^(phường|Phường|xã|Xã|Thị trấn|thị trấn)\s+/, '') || '';
    const cleanDistrict = district?.replace(/^(quận|Quận|huyện|Huyện|thị xã|Thị xã|Đặc Khu|đặc khu)\s+/, '') || '';
    const cleanCity = city?.replace(/^(thành phố|Thành phố|tỉnh|Tỉnh)\s+/, '') || '';
    
    // Build formatted address in Vietnamese style matching TrackAsia format
    // Format: [House Number] [Street], [Ward with prefix], [City with prefix]
    let formattedParts = [];
    
    // Part 1: Street address (house number + road name)
    if (houseNumber && roadName) {
      formattedParts.push(`${houseNumber} ${roadName}`);
    } else if (roadName) {
      formattedParts.push(roadName);
    }
    
    // Part 2: Ward (keep Vietnamese prefix like "Phường")
    if (ward) {
      formattedParts.push(ward);
    }
    
    // Part 3: District (keep Vietnamese prefix like "Quận") - only if exists
    if (district && district.trim()) {
      formattedParts.push(district);
    }
    
    // Part 4: City (keep Vietnamese prefix like "Thành phố")
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
    console.log('Ward (with prefix):', ward || 'N/A');
    console.log('District (with prefix):', district || 'N/A');
    console.log('City (with prefix):', city || 'N/A');
    console.log('Formatted Parts:', formattedParts);
    console.log('Final Formatted Address:', formattedAddress);
    console.log('Expected format: "30/5C Phan Huy Ích, Phường An Hội Tây, Thành phố Hồ Chí Minh"');
    console.log('============================');
    
    return {
      formattedAddress: formattedAddress,
      fullAddress: displayName, // Keep original full address
      address: {
        houseNumber: houseNumber || '',
        road: roadName || '',
        ward: cleanWard || '',
        district: cleanDistrict || '',
        city: cleanCity || '',
        country: country || 'Việt Nam',
        postcode: getComponent('postal_code') || ''
      },
      coordinates: {
        latitude,
        longitude
      },
      plusCode: data.plus_code?.global_code || '',
      placeId: result.place_id || '',
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
 * Forward geocode address to coordinates using TrackAsia
 * Better accuracy for Vietnam addresses
 * @param {string} address - Address string to geocode
 * @returns {Promise<Object>} Location data with coordinates
 */
export const geocodeAddress = async (address) => {
  try {
    const apiKey = process.env.REACT_APP_TRACKASIA_API_KEY || 'public_key';
    
    const response = await fetch(
      `https://maps.track-asia.com/api/v2/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to geocode address');
    }

    const data = await response.json();
    
    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      throw new Error('Address not found');
    }

    const result = data.results[0];
    const location = result.geometry?.location || {};

    return {
      latitude: parseFloat(location.lat),
      longitude: parseFloat(location.lng),
      formattedAddress: result.formatted_address || result.name || address,
      placeId: result.place_id || '',
      plusCode: result.plus_code?.global_code || ''
    };
  } catch (error) {
    throw new Error(`Geocoding failed: ${error.message}`);
  }
};

/**
 * Get place autocomplete suggestions using TrackAsia
 * Better accuracy for Vietnam addresses
 * @param {string} input - Search input text
 * @returns {Promise<Array>} Array of place predictions
 */
export const getPlaceAutocomplete = async (input) => {
  if (!input || input.length < 3) {
    return [];
  }

  try {
    const apiKey = process.env.REACT_APP_TRACKASIA_API_KEY || 'public_key';
    
    const response = await fetch(
      `https://maps.track-asia.com/api/v2/geocode/autocomplete?text=${encodeURIComponent(input)}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch autocomplete suggestions');
    }

    const data = await response.json();
    
    if (data.status !== 'OK' || !data.predictions) {
      return [];
    }
    
    return data.predictions.map(place => {
      const mainText = place.structured_formatting?.main_text || place.description?.split(',')[0] || '';
      const secondaryText = place.structured_formatting?.secondary_text || place.description?.split(',').slice(1).join(',').trim() || '';
      
      return {
        placeId: place.place_id || '',
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
