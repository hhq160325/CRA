/**
 * Utility functions for sorting data by createDate
 */

/**
 * Sort array by createDate in descending order (latest first)
 * @param {Array} data - Array of objects with createDate property
 * @param {string} dateField - Field name containing the date (default: 'createDate')
 * @returns {Array} Sorted array with latest items first
 */
export const sortByLatest = (data, dateField = 'createDate') => {
  if (!Array.isArray(data)) {
    console.warn('sortByLatest: Expected array, received:', typeof data);
    return [];
  }

  return [...data].sort((a, b) => {
    const dateA = new Date(a[dateField]);
    const dateB = new Date(b[dateField]);
    
    // Handle invalid dates
    if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
    if (isNaN(dateA.getTime())) return 1;
    if (isNaN(dateB.getTime())) return -1;
    
    return dateB - dateA; // Latest first (descending order)
  });
};

/**
 * Sort array by createDate in ascending order (oldest first)
 * @param {Array} data - Array of objects with createDate property
 * @param {string} dateField - Field name containing the date (default: 'createDate')
 * @returns {Array} Sorted array with oldest items first
 */
export const sortByOldest = (data, dateField = 'createDate') => {
  if (!Array.isArray(data)) {
    console.warn('sortByOldest: Expected array, received:', typeof data);
    return [];
  }

  return [...data].sort((a, b) => {
    const dateA = new Date(a[dateField]);
    const dateB = new Date(b[dateField]);
    
    // Handle invalid dates
    if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
    if (isNaN(dateA.getTime())) return 1;
    if (isNaN(dateB.getTime())) return -1;
    
    return dateA - dateB; // Oldest first (ascending order)
  });
};

/**
 * Sort array by multiple date fields with priority
 * @param {Array} data - Array of objects
 * @param {Array} dateFields - Array of field names in priority order
 * @param {boolean} descending - Sort in descending order (default: true)
 * @returns {Array} Sorted array
 */
export const sortByMultipleDates = (data, dateFields = ['createDate'], descending = true) => {
  if (!Array.isArray(data)) {
    console.warn('sortByMultipleDates: Expected array, received:', typeof data);
    return [];
  }

  return [...data].sort((a, b) => {
    for (const field of dateFields) {
      const dateA = new Date(a[field]);
      const dateB = new Date(b[field]);
      
      // Skip invalid dates for this field
      if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
        continue;
      }
      
      const comparison = descending ? dateB - dateA : dateA - dateB;
      if (comparison !== 0) {
        return comparison;
      }
    }
    return 0;
  });
};

/**
 * Get the latest item from an array based on createDate
 * @param {Array} data - Array of objects with createDate property
 * @param {string} dateField - Field name containing the date (default: 'createDate')
 * @returns {Object|null} Latest item or null if array is empty
 */
export const getLatestItem = (data, dateField = 'createDate') => {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  return data.reduce((latest, current) => {
    const latestDate = new Date(latest[dateField]);
    const currentDate = new Date(current[dateField]);
    
    // Handle invalid dates
    if (isNaN(currentDate.getTime())) return latest;
    if (isNaN(latestDate.getTime())) return current;
    
    return currentDate > latestDate ? current : latest;
  });
};

/**
 * Get the oldest item from an array based on createDate
 * @param {Array} data - Array of objects with createDate property
 * @param {string} dateField - Field name containing the date (default: 'createDate')
 * @returns {Object|null} Oldest item or null if array is empty
 */
export const getOldestItem = (data, dateField = 'createDate') => {
  if (!Array.isArray(data) || data.length === 0) {
    return null;
  }

  return data.reduce((oldest, current) => {
    const oldestDate = new Date(oldest[dateField]);
    const currentDate = new Date(current[dateField]);
    
    // Handle invalid dates
    if (isNaN(currentDate.getTime())) return oldest;
    if (isNaN(oldestDate.getTime())) return current;
    
    return currentDate < oldestDate ? current : oldest;
  });
};

/**
 * Filter items created within a specific time range
 * @param {Array} data - Array of objects with createDate property
 * @param {number} days - Number of days to look back from now
 * @param {string} dateField - Field name containing the date (default: 'createDate')
 * @returns {Array} Filtered array of items within the time range
 */
export const getItemsWithinDays = (data, days, dateField = 'createDate') => {
  if (!Array.isArray(data)) {
    console.warn('getItemsWithinDays: Expected array, received:', typeof data);
    return [];
  }

  const now = new Date();
  const cutoffDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));

  return data.filter(item => {
    const itemDate = new Date(item[dateField]);
    return !isNaN(itemDate.getTime()) && itemDate >= cutoffDate;
  });
};

/**
 * Group items by date (year-month-day)
 * @param {Array} data - Array of objects with createDate property
 * @param {string} dateField - Field name containing the date (default: 'createDate')
 * @returns {Object} Object with date strings as keys and arrays of items as values
 */
export const groupByDate = (data, dateField = 'createDate') => {
  if (!Array.isArray(data)) {
    console.warn('groupByDate: Expected array, received:', typeof data);
    return {};
  }

  return data.reduce((groups, item) => {
    const date = new Date(item[dateField]);
    if (isNaN(date.getTime())) {
      return groups;
    }
    
    const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    
    groups[dateKey].push(item);
    return groups;
  }, {});
};

// Default export
const sortUtils = {
  sortByLatest,
  sortByOldest,
  sortByMultipleDates,
  getLatestItem,
  getOldestItem,
  getItemsWithinDays,
  groupByDate
};

export default sortUtils;