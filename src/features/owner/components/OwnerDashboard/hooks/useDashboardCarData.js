import { useState, useEffect } from 'react';
import { axiosInstance } from '../../../../../shared/utils/axiosInstance';
import { CAR_ENDPOINTS } from '../../../../../config/api';
import { getUserIdFromToken } from '../../../../user/api';

export const useDashboardCarData = () => {
  const [carStats, setCarStats] = useState({
    rentedCars: 0,
    availableCars: 0,
    rentedGrowth: 0,
    availableGrowth: 0,
    carTypes: {},
    carStatusData: {},
    regDocStatusData: {},
    topManufacturers: {},
  });
  const [carLoading, setCarLoading] = useState(true);
  const [ownerCars, setOwnerCars] = useState([]);
  const [manufacturerMap, setManufacturerMap] = useState({});

  const fetchCarData = async () => {
    try {
      setCarLoading(true);
      const currentUserId = getUserIdFromToken();

      // Fetch cars data
      const carsResponse = await axiosInstance.get(CAR_ENDPOINTS.GET_ALL_CARS);
      const allCars = carsResponse.data || [];
      const ownerCarsData = allCars.filter(car => car.owner.id === currentUserId);

      // Fetch manufacturers data
      const manufacturersResponse = await axiosInstance.get(CAR_ENDPOINTS.GET_ALL_MANUFACTURER);
      const manufacturers = manufacturersResponse.data || [];
      
      // Create manufacturer lookup map
      const manufacturerLookup = manufacturers.reduce((acc, manufacturer) => {
        acc[manufacturer.id] = manufacturer.name;
        return acc;
      }, {});

      // Calculate car statistics
      const availableCars = ownerCarsData.filter(car => car.status?.toLowerCase() === 'active').length;
      const rentedCars = ownerCarsData.filter(car =>
        car.status?.toLowerCase() === 'reserved' || car.status?.toLowerCase() === 'pending'
      ).length;

      // Calculate car status distribution
      const carStatusData = ownerCarsData.reduce((acc, car) => {
        const status = car.status?.toLowerCase() || 'unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      // Calculate registration document status
      const regDocStatusData = ownerCarsData.reduce((acc, car) => {
        const regDocStatus = car.registrationPaper?.toLowerCase() || 'pending';
        acc[regDocStatus] = (acc[regDocStatus] || 0) + 1;
        return acc;
      }, {});

      // Calculate car types distribution
      const carTypes = ownerCarsData.reduce((acc, car) => {
        const type = car.type || 'Other';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});

      // Calculate growth percentages (mock data for now)
      const rentedGrowth = 21.2;
      const availableGrowth = 7.2;

      setCarStats({
        rentedCars,
        availableCars,
        rentedGrowth,
        availableGrowth,
        carTypes,
        carStatusData,
        regDocStatusData,
        topManufacturers: {}, // Will be calculated with booking data
      });

      setOwnerCars(ownerCarsData);
      setManufacturerMap(manufacturerLookup);
    } catch (error) {
      console.error('Error fetching car data:', error);
    } finally {
      setCarLoading(false);
    }
  };

  const updateTopManufacturers = (topManufacturers) => {
    setCarStats(prev => ({
      ...prev,
      topManufacturers
    }));
  };

  useEffect(() => {
    fetchCarData();
  }, []);

  return { 
    carStats, 
    carLoading, 
    ownerCars, 
    manufacturerMap, 
    refetchCarData: fetchCarData,
    updateTopManufacturers
  };
};