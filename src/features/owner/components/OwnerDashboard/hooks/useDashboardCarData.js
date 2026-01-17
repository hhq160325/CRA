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

      // Fetch both cars and registration documents in parallel
      const [carsResponse, regDocsResponse, manufacturersResponse] = await Promise.all([
        axiosInstance.get(CAR_ENDPOINTS.GET_ALL_CARS),
        axiosInstance.get(CAR_ENDPOINTS.GET_ALL_REG_DOCS),
        axiosInstance.get(CAR_ENDPOINTS.GET_ALL_MANUFACTURER)
      ]);

      const allCars = carsResponse.data || [];
      const allRegDocs = regDocsResponse?.data?.view || [];
      const manufacturers = manufacturersResponse.data || [];
      
      // Filter cars by current user
      const ownerCarsData = allCars.filter(car => car.owner.id === currentUserId);

      // Create manufacturer lookup map
      const manufacturerLookup = manufacturers.reduce((acc, manufacturer) => {
        acc[manufacturer.id] = manufacturer.name;
        return acc;
      }, {});

      // Create registration documents map by carId
      const regDocsMap = new Map();
      if (Array.isArray(allRegDocs)) {
        allRegDocs.forEach(regDoc => {
          regDocsMap.set(regDoc.carId, regDoc);
        });
      }

      // Merge car data with registration document status
      const carsWithRegStatus = ownerCarsData.map(car => {
        const regDoc = regDocsMap.get(car.id);
        
        if (regDoc) {
          return {
            ...car,
            regDocStatus: regDoc.status, // Approved, Denied, Pending
            regDocCreateDate: regDoc.createDate,
            regDocUrls: regDoc.urls
          };
        } else {
          return {
            ...car,
            regDocStatus: 'No Upload', // Car has no registration documents
            regDocCreateDate: null,
            regDocUrls: null
          };
        }
      });

      // Calculate car statistics
      const availableCars = carsWithRegStatus.filter(car => car.status?.toLowerCase() === 'active').length;
      const rentedCars = carsWithRegStatus.filter(car =>
        car.status?.toLowerCase() === 'reserved'
      ).length;

      // Calculate car status distribution
      // Map the four car statuses: Active, Pending, Inactive, Reserved
      const carStatusData = carsWithRegStatus.reduce((acc, car) => {
        const status = car.status?.toLowerCase() || 'unknown';
        
        switch (status) {
          case 'active':
            acc.active = (acc.active || 0) + 1;
            break;
          case 'pending':
            acc.pending = (acc.pending || 0) + 1;
            break;
          case 'inactive':
          case 'denied':
            acc.inactive = (acc.inactive || 0) + 1;
            break;
          case 'reserved':
            acc.reserved = (acc.reserved || 0) + 1;
            break;
          default:
            acc.unknown = (acc.unknown || 0) + 1;
        }
        
        return acc;
      }, {
        active: 0,
        pending: 0,
        inactive: 0,
        reserved: 0
      });
      // console.log("carStatusData", carStatusData);
      
      // Calculate registration document status using the merged data
      const regDocStatusData = carsWithRegStatus.reduce((acc, car) => {
        const regDocStatus = car.regDocStatus || 'No Upload';
        acc[regDocStatus] = (acc[regDocStatus] || 0) + 1;
        return acc;
      }, {});

      // Calculate car types distribution
      const carTypes = carsWithRegStatus.reduce((acc, car) => {
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

      setOwnerCars(carsWithRegStatus);
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