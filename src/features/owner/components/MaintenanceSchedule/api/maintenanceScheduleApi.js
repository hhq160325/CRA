import { axiosInstance } from '../../../../../shared/utils/axiosInstance';
import { CAR_ENDPOINTS, SCHEDULE_ENDPOINTS } from '../../../../../config/api';
import { getUserIdFromToken } from '../../../../user/api';

/* Fetch all cars owned by the current user */
export const fetchUserCars = async () => {
  const currentUserId = getUserIdFromToken();
  const response = await axiosInstance.get(CAR_ENDPOINTS.GET_ALL_CARS);
  const allCars = response.data || [];

  // Return all cars owned by current user (not just inactive ones)
  // We'll filter for maintenance schedules at the schedule level
  return allCars.filter(car => car.owner.id === currentUserId);
};

/* Fetch schedules for a specific car */
export const fetchCarSchedules = async (carId) => {
  try {
    const response = await axiosInstance.get(SCHEDULE_ENDPOINTS.GET_CAR_SCHEDULES(carId));
    console.log("fetchCarSchedules", response.data);
    const allSchedules = response.data || [];
    
    // Filter to show only maintenance schedules
    return allSchedules.filter(schedule => 
      schedule.scheduleType === "Maintenance"
    );

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

/* Mark a maintenance schedule as completed */
export const markScheduleAsCompleted = async (scheduleId) => {
  try {
    console.log('=== MARK AS COMPLETED API CALL ===');
    console.log('Schedule ID:', scheduleId);
    console.log('Schedule ID type:', typeof scheduleId);
    
    const endpoint = SCHEDULE_ENDPOINTS.PATCH_CAR_SCHEDULES(scheduleId);
    console.log('API Endpoint:', endpoint);
    
    console.log('Making PATCH request to mark schedule as completed...');
    const response = await axiosInstance.patch(endpoint);
    
    console.log('API Response Status:', response.status);
    console.log('API Response Data:', response.data);
    console.log('=== MARK AS COMPLETED SUCCESS ===');
    
    return response.data;
  } catch (err) {
    console.error('=== MARK AS COMPLETED ERROR ===');
    console.error(`Error marking schedule ${scheduleId} as completed:`, err);
    console.error('Error response:', err.response?.data);
    console.error('Error status:', err.response?.status);
    console.error('Error message:', err.message);
    console.error('=== END ERROR ===');
    throw err;
  }
};

/* Main function to fetch all maintenance schedules for the current user */
export const maintenanceScheduleApi = async () => {
  const inactiveCars = await fetchUserCars();
  const carSchedulesData = await fetchMultipleCarSchedules(inactiveCars);
  return carSchedulesData;
};