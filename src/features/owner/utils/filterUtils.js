/**
 * Utility functions for filtering data in owner components
 */

/* Filter items by search term across multiple fields */
export const filterBySearch = (item, searchTerm, searchFields) => {
  if (!searchTerm) return true;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  return searchFields.some(field => {
    const value = item[field];
    if (value === null || value === undefined) return false;
    return value.toString().toLowerCase().includes(lowerSearchTerm);
  });
};

/* Filter by a single field value */
export const filterByField = (item, filterValue, fieldName) => {
  if (filterValue === 'all') return true;
  return item[fieldName] === filterValue;
};

/**
 * Filter by date range - Option 3: Strict Range (Both Start AND End)
 * Shows only rentals where BOTH start AND end dates fall within the selected range
 **/
export const filterByDateRange = (item, startDate, endDate, itemStartField, itemEndField) => {
  // If no date filters, include all
  if (!startDate && !endDate) return true;
  
  const itemStartDate = new Date(item[itemStartField]);
  const itemEndDate = new Date(item[itemEndField]);
  
  // Both start and end dates provided - rental must BOTH start AND end within range
  if (startDate && endDate) {
    const filterStart = new Date(startDate);
    const filterEnd = new Date(endDate);
    return itemStartDate >= filterStart && 
           itemStartDate <= filterEnd && 
           itemEndDate >= filterStart && 
           itemEndDate <= filterEnd;
  }
  
  // Only start date provided - rental must start on or after this date AND end on or after this date
  if (startDate) {
    const filterStart = new Date(startDate);
    return itemStartDate >= filterStart && itemEndDate >= filterStart;
  }
  
  // Only end date provided - rental must start on or before this date AND end on or before this date
  if (endDate) {
    const filterEnd = new Date(endDate);
    return itemStartDate <= filterEnd && itemEndDate <= filterEnd;
  }
  
  return true;
};

/* Combined filter for rental/booking data */
export const filterRentalData = (item, filters) => {
  const {
    searchTerm = '',
    searchFields = ['bookingId', 'customer', 'carName', 'licensePlate'],
    statusFilter = 'all',
    carFilter = 'all',
    bookingFeeStatusFilter = 'all',
    rentalFeeStatusFilter = 'all',
    startDate = null,
    endDate = null,
  } = filters;

  const matchesSearch = filterBySearch(item, searchTerm, searchFields);
  const matchesStatus = filterByField(item, statusFilter, 'status');
  const matchesCar = filterByField(item, carFilter, 'carName');
  const matchesBookingFeeStatus = filterByField(item, bookingFeeStatusFilter, 'bookingFeeStatus');
  const matchesRentalFeeStatus = filterByField(item, rentalFeeStatusFilter, 'rentalFeeStatus');
  const matchesDateRange = filterByDateRange(item, startDate, endDate, 'startDate', 'endDate');

  return matchesSearch && 
         matchesStatus && 
         matchesCar && 
         matchesBookingFeeStatus && 
         matchesRentalFeeStatus && 
         matchesDateRange;
};

/* Combined filter for car usage data */
export const filterCarUsageData = (car, filters) => {
  const {
    searchTerm = '',
    searchFields = ['carName', 'licensePlate', 'carId'],
    brandFilter = 'all',
    modelFilter = 'all',
    statusFilter = 'all',
  } = filters;

  const matchesSearch = filterBySearch(car, searchTerm, searchFields);
  const matchesBrand = filterByField(car, brandFilter, 'brand');
  const matchesModel = filterByField(car, modelFilter, 'model');
  const matchesStatus = filterByField(car, statusFilter, 'currentStatus');

  return matchesSearch && matchesBrand && matchesModel && matchesStatus;
};

/* Simple booking filter (for BookingManagement) */
export const filterBookingData = (booking, filters) => {
  const {
    searchTerm = '',
    searchFields = ['bookingId', 'customer', 'carName', 'licensePlate'],
    statusFilter = 'all',
  } = filters;

  const matchesSearch = filterBySearch(booking, searchTerm, searchFields);
  const matchesStatus = filterByField(booking, statusFilter, 'status');

  return matchesSearch && matchesStatus;
};

/* Filter by date period (week, month, quarter) */
export const filterByDatePeriod = (item, dateFilter, dateField) => {
  if (dateFilter === 'all') return true;
  
  const itemDate = new Date(item[dateField]);
  const now = new Date();
  
  switch (dateFilter) {
    case 'week':
      return itemDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case 'month':
      return itemDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case 'quarter':
      return itemDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    default:
      return true;
  }
};

/* Filter by specific date */
export const filterBySpecificDate = (item, dateFilter, dateField) => {
  if (!dateFilter) return true;
  
  const itemDate = item[dateField];
  if (!itemDate) return false;
  
  // Extract date part only (YYYY-MM-DD) from the item date
  const itemDateOnly = itemDate.split('T')[0]; // Handle ISO format
  return itemDateOnly === dateFilter;
};

/* Combined filter for payment data */
export const filterPaymentData = (payment, filters) => {
  const {
    searchTerm = '',
    searchFields = ['transactionId', 'bookingId', 'description'],
    statusFilter = 'all',
    typeFilter = 'all',
    paymentMethodFilter = 'all',
    createDateFilter = '',
    updateDateFilter = '',
  } = filters;

  const matchesSearch = filterBySearch(payment, searchTerm, searchFields);
  const matchesStatus = filterByField(payment, statusFilter, 'status');
  const matchesType = filterByField(payment, typeFilter, 'type');
  const matchesPaymentMethod = filterByField(payment, paymentMethodFilter, 'paymentMethod');
  const matchesCreateDate = filterBySpecificDate(payment, createDateFilter, 'dateCreate');
  const matchesUpdateDate = filterBySpecificDate(payment, updateDateFilter, 'dateUpdate');

  return matchesSearch && matchesStatus && matchesType && matchesPaymentMethod && matchesCreateDate && matchesUpdateDate;
};
