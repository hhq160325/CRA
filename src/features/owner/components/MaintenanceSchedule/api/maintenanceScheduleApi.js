import { axiosInstance } from '../../../../../shared/utils/axiosInstance';
import { CAR_ENDPOINTS, SCHEDULE_ENDPOINTS } from '../../../../../config/api';
import { getUserIdFromToken } from '../../../../user/api';

/* Fetch all cars owned by the current user */
export const fetchUserCars = async () => {
  const currentUserId = getUserIdFromToken();
  const response = await axiosInstance.get(CAR_ENDPOINTS.GET_ALL_CARS);
  const allCars = response.data || [];
  
  // Filter cars owned by current user and with Inactive status (in maintenance)
  return allCars.filter(car =>
    car.owner.id === currentUserId && car.status?.toLowerCase() === 'inactive'
  );
};

/* Fetch schedules for a specific car */
export const fetchCarSchedules = async (carId) => {
  try {
    const response = await axiosInstance.get(SCHEDULE_ENDPOINTS.GET_CAR_SCHEDULES(carId));
    return response.data || [];
  } catch (err) {
    console.error(`Error fetching schedule for car ${carId}:`, err);
    return [];
  }
};

/* Fetch schedules for multiple cars */
export const fetchMultipleCarSchedules = async (cars) => {
  const schedulePromises = cars.map(async (car) => {
    const schedules = await fetchCarSchedules(car.id);
    return { car, schedules };
  });

  return Promise.all(schedulePromises);
};

/* Main function to fetch all maintenance schedules for the current user */
export const maintenanceScheduleApi = async () => {
  const inactiveCars = await fetchUserCars();
  const carSchedulesData = await fetchMultipleCarSchedules(inactiveCars);
  return carSchedulesData;
};