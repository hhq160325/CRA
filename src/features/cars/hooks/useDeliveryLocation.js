import { useState, useEffect } from 'react';
import { getDistanceBetweenAddresses } from '../carApi';

export const useDeliveryLocation = (currentCar) => {
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [deliveryDistance, setDeliveryDistance] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(60000);
  const [loadingDistance, setLoadingDistance] = useState(false);

  // Load delivery location from localStorage on mount
  useEffect(() => {
    const savedDeliveryLocation = localStorage.getItem('deliveryLocation');
    if (savedDeliveryLocation) {
      setDeliveryLocation(savedDeliveryLocation);
    }
  }, []);

  // Calculate distance when delivery location changes
  useEffect(() => {
    const calculateDistance = async () => {
      if (!deliveryLocation || !currentCar?.preferredLot) {
        console.log('Distance calculation skipped:', {
          hasDeliveryLocation: !!deliveryLocation,
          hasPreferredLot: !!currentCar?.preferredLot
        });
        return;
      }

      setLoadingDistance(true);
      try {
        const sourceAddress = `${currentCar.preferredLot.address}, ${currentCar.preferredLot.city}`;
        console.log('Calculating distance from:', sourceAddress, 'to:', deliveryLocation);

        const distanceData = await getDistanceBetweenAddresses(sourceAddress, deliveryLocation);
        console.log('Distance API response:', distanceData);

        // API returns distance in meters, convert to kilometers
        const distanceInMeters = distanceData?.distanceInMeters;

        if (distanceInMeters) {
          const distanceInKm = distanceInMeters / 1000;
          setDeliveryDistance(distanceInKm);
          // Calculate delivery fee based on distance (20000 VND per km, minimum 60000 VND)
          const calculatedFee = Math.max(60000, Math.round(distanceInKm * 20000));
          setDeliveryFee(calculatedFee);
          console.log('Distance calculated:', distanceInKm, 'km, Fee:', calculatedFee, 'VND');
        } else {
          console.warn('No distance found in response:', distanceData);
          setDeliveryDistance(null);
          setDeliveryFee(60000);
        }
      } catch (error) {
        console.error('Failed to calculate distance:', error);
        // Keep default fee if calculation fails
        setDeliveryDistance(null);
        setDeliveryFee(60000);
      } finally {
        setLoadingDistance(false);
      }
    };

    calculateDistance();
  }, [deliveryLocation, currentCar]);

  return {
    deliveryLocation,
    setDeliveryLocation,
    deliveryDistance,
    setDeliveryDistance,
    deliveryFee,
    setDeliveryFee,
    loadingDistance
  };
};