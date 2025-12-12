export const transformBookingData = (allBookings, t) => {
  // Transform and enrich booking data
  return allBookings.map(booking => {
    return {
      id: booking.id,
      bookingId: booking.bookingNumber || 'N/A',
      carId: booking.car?.id || booking.carId || 'N/A',
      carName: booking.car?.manufacturer && booking.car?.model ? `${booking.car.manufacturer} ${booking.car.model}` : t('bookingManagement.unknownCar'),
      licensePlate: booking.car?.licensePlate || t('bookingManagement.notAvailable'),
      customer: booking.user?.fullname || booking.user?.username || t('bookingManagement.unknownCustomer'),
      customerEmail: booking.user?.email || t('bookingManagement.notAvailable'),
      customerPhone: booking.user?.phoneNumber || t('bookingManagement.notAvailable'),
      startDate: booking.pickupTime ? new Date(booking.pickupTime).toISOString().split('T')[0] : t('bookingManagement.notAvailable'),
      endDate: booking.dropoffTime ? new Date(booking.dropoffTime).toISOString().split('T')[0] : t('bookingManagement.notAvailable'),
      pickupTime: booking.pickupTime ? new Date(booking.pickupTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : t('bookingManagement.notAvailable'),
      returnTime: booking.dropoffTime ? new Date(booking.dropoffTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : t('bookingManagement.notAvailable'),
      status: booking.status || t('bookingManagement.notAvailable'),
      // Keep original booking data for modal operations
      originalBooking: booking
    };
  });
};