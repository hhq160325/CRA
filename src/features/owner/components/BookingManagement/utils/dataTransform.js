import { convertToVietnamTime } from '../../../../../shared/utils/CheckUTC';

export const transformBookingData = (allBookings, t) => {
  // Transform and enrich booking data
  return allBookings.map(booking => {
    // Convert dates to Vietnam time (UTC+7) - TEMPORARILY DISABLED
    // const pickupTimeVN = booking.pickupTime ? convertToVietnamTime(booking.pickupTime) : null;
    // const dropoffTimeVN = booking.dropoffTime ? convertToVietnamTime(booking.dropoffTime) : null;
    // const createDateVN = booking.createDate || booking.createdAt || booking.bookingDate 
    //   ? convertToVietnamTime(booking.createDate || booking.createdAt || booking.bookingDate)
    //   : new Date();
    
    // Use dates as-is without UTC conversion
    const pickupTimeVN = booking.pickupTime ? new Date(booking.pickupTime) : null;
    const dropoffTimeVN = booking.dropoffTime ? new Date(booking.dropoffTime) : null;
    const createDateVN = booking.createDate || booking.createdAt || booking.bookingDate 
      ? new Date(booking.createDate || booking.createdAt || booking.bookingDate)
      : new Date();

    return {
      id: booking.id,
      bookingId: booking.id || 'N/A',
      bookingNumber: booking.bookingNumber || 'N/A',
      carId: booking.car?.id || booking.carId || 'N/A',
      carName: booking.car?.manufacturer && booking.car?.model ? `${booking.car.manufacturer} ${booking.car.model}` : t('bookingManagement.unknownCar'),
      licensePlate: booking.car?.licensePlate || t('bookingManagement.notAvailable'),
      customer: booking.user?.fullname || booking.user?.username || t('bookingManagement.unknownCustomer'),
      customerEmail: booking.user?.email || t('bookingManagement.notAvailable'),
      customerPhone: booking.user?.phoneNumber || t('bookingManagement.notAvailable'),
      startDate: pickupTimeVN ? pickupTimeVN.toISOString().split('T')[0] : t('bookingManagement.notAvailable'),
      endDate: dropoffTimeVN ? dropoffTimeVN.toISOString().split('T')[0] : t('bookingManagement.notAvailable'),
      pickupTime: pickupTimeVN ? pickupTimeVN.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : t('bookingManagement.notAvailable'),
      returnTime: dropoffTimeVN ? dropoffTimeVN.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : t('bookingManagement.notAvailable'),
      status: booking.status || t('bookingManagement.notAvailable'),
      // Include createDate for sorting (Date object)
      createDate: createDateVN,
      // Include formatted createDate for display (string)
      //createDateFormatted: createDateVN.toLocaleString('vi-VN', {
      createDateFormatted: createDateVN.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      // Keep original booking data for modal operations
      originalBooking: booking
    };
  });
};