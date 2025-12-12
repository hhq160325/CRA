export const filterBookingData = (booking, { searchTerm, statusFilter }) => {
  const matchesSearch = !searchTerm || 
    booking.bookingId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.carName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.licensePlate?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.customerEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.customerPhone?.toLowerCase().includes(searchTerm.toLowerCase());

  // Handle status filtering for specific status values
  const matchesStatus = statusFilter === 'all' || 
    booking.status?.toLowerCase() === statusFilter?.toLowerCase();
  return matchesSearch && matchesStatus;
};

// Export available status options for filtering
export const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All Bookings' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];