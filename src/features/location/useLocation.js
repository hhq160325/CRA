import { useState, useEffect, useCallback } from 'react';
import { 
  getCurrentLocation,
  getBestLocation,
  getCurrentLocationWithAddress,
  watchLocation,
  clearLocationWatch,
  isGeolocationSupported
} from './locationService';

/**
 * Custom hook for managing user location
 * @param {Object} options - Configuration options
 * @param {boolean} options.watch - Whether to continuously watch location
 * @param {boolean} options.fetchAddress - Whether to fetch address from coordinates
 * @param {boolean} options.useBestAccuracy - Try multiple times for best accuracy (like Mioto)
 * @returns {Object} Location state and methods
 */
export const useLocation = (options = {}) => {
  const { watch = false, fetchAddress = false, useBestAccuracy = true } = options;
  
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [watchId, setWatchId] = useState(null);

  const getLocation = useCallback(async () => {
    if (!isGeolocationSupported()) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (fetchAddress) {
        const data = await getCurrentLocationWithAddress(useBestAccuracy);
        setLocation({
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: data.accuracy
        });
        setAddress(data.address);
      } else {
        // Use best location method if enabled (tries multiple times for better accuracy)
        const data = useBestAccuracy 
          ? await getBestLocation(3, 10) // 3 attempts, target 10m accuracy
          : await getCurrentLocation();
        setLocation(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchAddress, useBestAccuracy]);

  const startWatching = useCallback(() => {
    if (!isGeolocationSupported()) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    const id = watchLocation(
      (position) => {
        setLocation(position);
        setError(null);
      },
      (err) => {
        setError(err.message);
      }
    );

    setWatchId(id);
  }, []);

  const stopWatching = useCallback(() => {
    if (watchId) {
      clearLocationWatch(watchId);
      setWatchId(null);
    }
  }, [watchId]);

  useEffect(() => {
    if (watch) {
      startWatching();
    }

    return () => {
      if (watchId) {
        clearLocationWatch(watchId);
      }
    };
  }, [watch, startWatching, watchId]);

  return {
    location,
    address,
    loading,
    error,
    getLocation,
    startWatching,
    stopWatching,
    isSupported: isGeolocationSupported()
  };
};
