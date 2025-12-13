import { useState, useEffect } from 'react';

export const useRentalDates = () => {
  // Initialize rental dates with current date as default
  const getCurrentDateDefaults = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    return {
      pickupDate: `${day}/${month}`,
      dropoffDate: `${day}/${month}`,
      pickupTime: '',
      dropoffTime: '',
      duration: 0
    };
  };

  const [rentalDates, setRentalDates] = useState(getCurrentDateDefaults());

  // Load rental dates from localStorage on mount
  useEffect(() => {
    const savedRentalDates = localStorage.getItem('rentalDates');
    if (savedRentalDates) {
      try {
        const parsed = JSON.parse(savedRentalDates);
        if (parsed.pickupDate && parsed.dropoffDate && parsed.pickupTime && parsed.dropoffTime) {
          setRentalDates({
            pickupDate: parsed.pickupDate,
            dropoffDate: parsed.dropoffDate,
            pickupTime: parsed.pickupTime,
            dropoffTime: parsed.dropoffTime,
            duration: parsed.duration || 0
          });
        }
      } catch (error) {
        console.error('Failed to load rental dates from localStorage:', error);
      }
    } else {
      // If no saved data, initialize with current date in localStorage
      const today = new Date();
      const defaultPickupDate = {
        day: today.getDate(),
        month: today.getMonth(),
        year: today.getFullYear()
      };
      const defaultData = {
        selectedPickupDate: defaultPickupDate,
        selectedDropoffDate: null,
        pickupTime: '06:00',
        dropoffTime: '23:00'
      };
      localStorage.setItem('rentalDates', JSON.stringify(defaultData));
    }
  }, []);

  return {
    rentalDates,
    setRentalDates
  };
};