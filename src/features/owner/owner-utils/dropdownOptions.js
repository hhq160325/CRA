// Dropdown options for RentalHistory filters

export const getCarOptions = (uniqueCars) => [
  { id: 'all', value: 'all', label: 'All Cars' },
  ...uniqueCars.map(car => ({ id: car, value: car, label: car }))
];

export const statusOptions = [
  { id: 'all', value: 'all', label: 'All Status' },
  { id: 'confirmed', value: 'confirmed', label: 'Confirmed' },
  { id: 'completed', value: 'completed', label: 'Completed' },
  { id: 'cancelled', value: 'cancelled', label: 'Cancelled' }
];

export const bookingFeeStatusOptions = [
  { id: 'all', value: 'all', label: 'All Booking Fee Status' },
  { id: 'paid', value: 'paid', label: 'Paid' },
  { id: 'pending', value: 'pending', label: 'Pending' },
  { id: 'cancelled', value: 'cancelled', label: 'Cancelled' }
];

export const rentalFeeStatusOptions = [
  { id: 'all', value: 'all', label: 'All Rental Fee Status' },
  { id: 'paid', value: 'paid', label: 'Paid' },
  { id: 'pending', value: 'pending', label: 'Pending' },
  { id: 'cancelled', value: 'cancelled', label: 'Cancelled' }
];

// Dropdown options for Payments filters

export const paymentTypeOptions = [
  { id: 'all', value: 'all', label: 'All Types' },
  { id: 'booking_fee', value: 'booking_fee', label: 'Booking Fee' },
  { id: 'rental_fee', value: 'rental_fee', label: 'Rental Fee' }
];

export const getPaymentMethodOptions = (uniquePaymentMethods) => [
  { id: 'all', value: 'all', label: 'All Payment Methods' },
  ...uniquePaymentMethods.map(method => ({
    id: method,
    value: method,
    label: method
  }))
];

export const paymentStatusOptions = [
  { id: 'all', value: 'all', label: 'All Status' },
  { id: 'completed', value: 'completed', label: 'Completed' },
  { id: 'paid', value: 'paid', label: 'Paid' },
  { id: 'pending', value: 'pending', label: 'Pending' },
  { id: 'cancelled', value: 'cancelled', label: 'Cancelled' }
];

export const dateFilterOptions = [
  { id: 'all', value: 'all', label: 'All Dates' },
  { id: 'week', value: 'week', label: 'Last Week' },
  { id: 'month', value: 'month', label: 'Last Month' },
  { id: 'quarter', value: 'quarter', label: 'Last Quarter' }
];
