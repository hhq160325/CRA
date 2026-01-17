import { convertToVietnamTime } from '../../../../../shared/utils/CheckUTC';
import { sortByOldest } from '../../../../../shared/utils/SortByLatest';

/**
 * Process and format maintenance schedule data
 */
export const maintenanceScheduleService = (carSchedulesData, t) => {
  const formattedSchedules = [];
  let idCounter = 1;

  carSchedulesData.forEach(({ car, schedules }) => {
    if (schedules.length > 0) {
      // Process each schedule for the car
      schedules.forEach(schedule => {
        const startDate = convertToVietnamTime(schedule.startDate);
        const endDate = convertToVietnamTime(schedule.endDate);
        
        // Get today's date in Vietnam time for proper comparison
        const today = new Date();
        const vietnamToday = new Date(today.getTime() + (7 * 60 * 60 * 1000));
        vietnamToday.setHours(0, 0, 0, 0);
        
        // Also normalize startDate and endDate for comparison
        const startDateOnly = new Date(startDate);
        startDateOnly.setHours(0, 0, 0, 0);
        const endDateOnly = new Date(endDate);
        endDateOnly.setHours(0, 0, 0, 0);

        // Calculate days until maintenance
        const daysUntil = Math.ceil((startDateOnly - vietnamToday) / (1000 * 60 * 60 * 24));

        // Use the actual status from the API
        // API statuses: "Active" (in maintenance), "Completed" (completed maintenance)
        let status = schedule.status || 'upcoming';
        let priority = 'low';

        // Map API status to display status if needed, or use API status directly
        if (schedule.status === 'Active') {
          status = 'Active'; // In maintenance
          priority = 'high';
        } else if (schedule.status === 'Completed') {
          status = 'Completed'; // Completed maintenance
          priority = 'low';
        } else {
          // For schedules without API status, calculate based on dates
          if (vietnamToday > endDateOnly) {
            status = 'overdue';
            priority = 'high';
          } else if (vietnamToday >= startDateOnly && vietnamToday <= endDateOnly) {
            status = 'due';
            priority = 'high';
          } else if (daysUntil <= 7) {
            status = 'upcoming';
            priority = 'high';
          } else if (daysUntil <= 14) {
            status = 'upcoming';
            priority = 'medium';
          } else {
            status = 'upcoming';
            priority = 'low';
          }
        }
        // console.log("carSchedulesData",carSchedulesData);
        
        formattedSchedules.push({
          id: idCounter++,
          carId: car.id,
          carName: `${car.manufacturer || ''} ${car.model || ''}`.trim() || t('maintenanceSchedule.unknownCarModel'),
          carModel: car.yearofManufacture?.toString() || 'N/A',
          licensePlate: car.licensePlate || 'N/A',
          startDateMaintenanceDate: schedule.startDate ? convertToVietnamTime(schedule.startDate).toISOString().split('T')[0] : 'N/A',
          endDateMaintenanceDate: schedule.endDate ? convertToVietnamTime(schedule.endDate).toISOString().split('T')[0] : 'N/A',
          pickupTime: schedule.startDate ? convertToVietnamTime(schedule.startDate).toISOString().split('T')[1].substring(0, 5) : 'N/A',
          returnTime: schedule.endDate ? convertToVietnamTime(schedule.endDate).toISOString().split('T')[1].substring(0, 5) : 'N/A',
          mileageAtLastService: car.mileage || 0,
          currentMileage: car.mileage || 0,
          maintenanceType: schedule.scheduleType,
          scheduleTitle: schedule.title,
          status: status,
          daysUntil: daysUntil,
          priority: priority,
          scheduleId: schedule.id,
          startDate: schedule.startDate // Keep original startDate for sorting
        });
      });
    } else {
    }
  });

  // Sort schedules by startDate (earliest first - most urgent maintenance first) using the utility function
  const sortedSchedules = sortByOldest(formattedSchedules, 'startDate');

  return sortedSchedules;
};