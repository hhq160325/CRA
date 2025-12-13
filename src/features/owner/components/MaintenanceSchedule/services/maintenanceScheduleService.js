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
        const startDate = new Date(schedule.startDate);
        const endDate = new Date(schedule.endDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Calculate days until maintenance
        const daysUntil = Math.ceil((startDate - today) / (1000 * 60 * 60 * 24));

        // Determine status based on dates
        let status = 'upcoming';
        let priority = 'low';

        if (today > endDate) {
          status = 'overdue';
          priority = 'high';
        } else if (today >= startDate && today <= endDate) {
          status = 'due';
          priority = 'high';
        } else if (daysUntil <= 7) {
          priority = 'high';
        } else if (daysUntil <= 14) {
          priority = 'medium';
        }

        formattedSchedules.push({
          id: idCounter++,
          carId: car.id,
          carName: `${car.manufacturer || ''} ${car.model || ''}`.trim() || t('maintenanceSchedule.unknownCarModel'),
          carModel: car.yearofManufacture?.toString() || 'N/A',
          licensePlate: car.licensePlate || 'N/A',
          startDateMaintenanceDate: schedule.startDate ? new Date(schedule.startDate).toISOString().split('T')[0] : 'N/A',
          endDateMaintenanceDate: schedule.endDate ? new Date(schedule.endDate).toISOString().split('T')[0] : 'N/A',
          pickupTime: schedule.startDate ? new Date(schedule.startDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : 'N/A',
          returnTime: schedule.endDate ? new Date(schedule.endDate).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : 'N/A',
          mileageAtLastService: car.mileage || 0,
          currentMileage: car.mileage || 0,
          maintenanceType: t('maintenanceSchedule.periodicMaintenance'),
          status: status,
          daysUntil: daysUntil,
          priority: priority,
          scheduleId: schedule.id
        });
      });
    } else {
      // Car is inactive but has no schedule data
      formattedSchedules.push({
        id: idCounter++,
        carId: car.id,
        carName: car.model || t('maintenanceSchedule.unknownCarModel'),
        carModel: car.year?.toString() || 'N/A',
        licensePlate: car.licensePlate || 'N/A',
        lastMaintenanceDate: 'N/A',
        nextMaintenanceDate: 'N/A',
        mileageAtLastService: car.mileage || 0,
        currentMileage: car.mileage || 0,
        maintenanceType: t('maintenanceSchedule.needsMaintenance'),
        status: 'due',
        daysUntil: 0,
        priority: 'high',
        scheduleId: null
      });
    }
  });

  return formattedSchedules;
};