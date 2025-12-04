/**
 * Utility functions for filtering data in owner components
 * Pure functions with no React dependencies for easy testing and reuse
 */

/**
 * Filter items by search term across multiple fields
 * @param {Object} item - The item to check
 * @param {string} searchTerm - The search term
 * @param {string[]} searchFields - Array of field names to search in
 * @returns {boolean}
 */
export const filterBySearch = (item, searchTerm, searchFields) => {
  if (!searchTerm) return true;
  
  const lowerSearchTerm = searchTerm.toLowerCase();
  return searchFields.some(field => {
    const value = item[field];
    if (value === null || value === undefined) return false;
    return value.toString().toLowerCase().includes(lowerSearchTerm);
  });
};

/**
 * Filter by a single field value
 * @param {Object} item - The item to check
 * @param {string} filterValue - The filter value ('all' means no filter)
 * @param {string} fieldName - The field name to check
 * @returns {boolean}
 */
export const filterByField = (item, filterValue, fieldName) => {
  if (filterValue === 'all') return true;
  return item[fieldName] === filterValue;
};

/**
 * Filter by date range - Option 3: Strict Range (Both Start AND End)
 * Shows only rentals where BOTH start AND end dates fall within the selected range
 * @param {Object} item - The item to check
 * @param {string|null} startDate - Filter start date
 * @param {string|null} endDate - Filter end date
 * @param {string} itemStartField - Field name for item's start date
 * @param {string} itemEndField - Field name for item's end date
 * @returns {boolean}
 */
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

/**
 * Combined filter for rental/booking data
 * @param {Object} item - The rental/booking item
 * @param {Object} filters - Filter configuration object
 * @returns {boolean}
 */
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

/**
 * Combined filter for car usage data
 * @param {Object} car - The car item
 * @param {Object} filters - Filter configuration object
 * @returns {boolean}
 */
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

/**
 * Simple booking filter (for BookingManagement)
 * @param {Object} booking - The booking item
 * @param {Object} filters - Filter configuration object
 * @returns {boolean}
 */
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

/**
 * Filter by date period (week, month, quarter)
 * @param {Object} item - The item to check
 * @param {string} dateFilter - The date filter ('all', 'week', 'month', 'quarter')
 * @param {string} dateField - The field name containing the date
 * @returns {boolean}
 */
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

/**
 * Combined filter for payment data
 * @param {Object} payment - The payment item
 * @param {Object} filters - Filter configuration object
 * @returns {boolean}
 */
export const filterPaymentData = (payment, filters) => {
  const {
    searchTerm = '',
    searchFields = ['transactionId', 'bookingId', 'description'],
    statusFilter = 'all',
    typeFilter = 'all',
    paymentMethodFilter = 'all',
    dateFilter = 'all',
  } = filters;

  const matchesSearch = filterBySearch(payment, searchTerm, searchFields);
  const matchesStatus = filterByField(payment, statusFilter, 'status');
  const matchesType = filterByField(payment, typeFilter, 'type');
  const matchesPaymentMethod = filterByField(payment, paymentMethodFilter, 'paymentMethod');
  const matchesDate = filterByDatePeriod(payment, dateFilter, 'date');

  return matchesSearch && matchesStatus && matchesType && matchesPaymentMethod && matchesDate;
};
