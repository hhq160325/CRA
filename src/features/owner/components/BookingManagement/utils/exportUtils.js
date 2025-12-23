/**
 * Export utilities for BookingManagement component
 */

/**
 * Convert booking data to CSV format
 * @param {Array} bookings - Array of booking objects
 * @param {Function} t - Translation function
 * @returns {string} CSV formatted string
 */
export const convertBookingsToCSV = (bookings, t) => {
  if (!bookings || bookings.length === 0) {
    return '';
  }

  // Define CSV headers with translations
  const headers = [
    t('bookingManagement.bookingId'),
    t('bookingManagement.bookingNumber'),
    t('bookingManagement.vehicleInfo'),
    t('bookingManagement.licensePlate'),
    t('bookingManagement.customer'),
    t('bookingManagement.customerEmail'),
    t('bookingManagement.customerPhone'),
    t('bookingManagement.createDate'),
    t('bookingManagement.startDate'),
    t('bookingManagement.endDate'),
    t('bookingManagement.pickupTime'),
    t('bookingManagement.returnTime'),
    t('bookingManagement.status')
  ];

  // Convert bookings to CSV rows
  const csvRows = bookings.map(booking => [
    booking.bookingId || '',
    booking.bookingNumber || '',
    booking.carName || '',
    booking.licensePlate || '',
    booking.customer || '',
    booking.customerEmail || '',
    booking.customerPhone || '',
    booking.createDateFormatted || '',
    booking.startDate || '',
    booking.endDate || '',
    booking.pickupTime || '',
    booking.returnTime || '',
    booking.status || ''
  ]);

  // Combine headers and rows
  const allRows = [headers, ...csvRows];

  // Convert to CSV string
  return allRows.map(row => 
    row.map(field => {
      // Escape quotes and wrap in quotes if contains comma, quote, or newline
      const stringField = String(field || '');
      if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
        return `"${stringField.replace(/"/g, '""')}"`;
      }
      return stringField;
    }).join(',')
  ).join('\n');
};

/**
 * Download CSV file
 * @param {string} csvContent - CSV formatted string
 * @param {string} filename - Name of the file to download
 */
export const downloadCSV = (csvContent, filename = 'bookings-export.csv') => {
  // Create blob with UTF-8 BOM for proper encoding
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  URL.revokeObjectURL(url);
};

/**
 * Generate filename with current date
 * @param {string} prefix - Filename prefix
 * @param {string} extension - File extension
 * @returns {string} Generated filename
 */
export const generateFilename = (prefix = 'bookings-export', extension = 'csv') => {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD format
  const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS format
  
  return `${prefix}-${dateStr}-${timeStr}.${extension}`;
};

/**
 * Export bookings to CSV file
 * @param {Array} bookings - Array of booking objects
 * @param {Function} t - Translation function
 * @param {string} filename - Optional custom filename
 */
export const exportBookingsToCSV = (bookings, t, filename = null) => {
  try {
    // Convert bookings to CSV
    const csvContent = convertBookingsToCSV(bookings, t);
    
    if (!csvContent) {
      console.warn('No booking data to export');
      return false;
    }
    
    // Generate filename if not provided
    const exportFilename = filename || generateFilename('bookings-export', 'csv');
    
    // Download the file
    downloadCSV(csvContent, exportFilename);
    
    return true;
  } catch (error) {
    console.error('Error exporting bookings to CSV:', error);
    return false;
  }
};

/**
 * Get export statistics
 * @param {Array} bookings - Array of booking objects
 * @returns {Object} Export statistics
 */
export const getExportStats = (bookings) => {
  if (!bookings || bookings.length === 0) {
    return {
      total: 0,
      byStatus: {},
      dateRange: null
    };
  }

  // Count by status
  const byStatus = bookings.reduce((acc, booking) => {
    const status = booking.status || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Get date range
  const dates = bookings
    .map(booking => booking.createDate)
    .filter(date => date)
    .sort((a, b) => new Date(a) - new Date(b));

  const dateRange = dates.length > 0 ? {
    from: dates[0],
    to: dates[dates.length - 1]
  } : null;

  return {
    total: bookings.length,
    byStatus,
    dateRange
  };
};