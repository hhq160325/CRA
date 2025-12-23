/**
 * Export utilities for RentalHistory component
 */

/**
 * Convert rental data to CSV format
 * @param {Array} rentals - Array of rental objects
 * @param {Function} t - Translation function
 * @returns {string} CSV formatted string
 */
export const convertRentalsToCSV = (rentals, t) => {
  if (!rentals || rentals.length === 0) {
    return '';
  }

  // Define CSV headers with translations
  const headers = [
    t('rentalHistory.bookingId') || 'Booking ID',
    t('rentalHistory.carInfo'),
    'License Plate',
    t('rentalHistory.customer'),
    'Customer Email',
    'Customer Phone',
    t('rentalHistory.rentalTime'),
    t('rentalHistory.duration'),
    t('rentalHistory.amount'),
    t('rentalHistory.bookingFeeStatus'),
    t('rentalHistory.rentalFeeStatus'),
    t('rentalHistory.additionalFeeStatus'),
    t('rentalHistory.extendBookingFeeStatus'),
    t('rentalHistory.bookingStatus'),
    'Booking Fee Amount',
    'Rental Fee Amount',
    'Additional Fee Amount',
    'Extend Booking Fee Amount',
    'Total Amount'
  ];

  // Convert rentals to CSV rows
  const csvRows = rentals.map(rental => [
    rental.bookingId || '',
    rental.carName || '',
    rental.licensePlate || '',
    rental.customer || '',
    rental.customerEmail || '',
    rental.customerPhone || '',
    `${rental.startDate} - ${rental.endDate}` || '',
    `${rental.duration} ${t('rentalHistory.days')}` || '',
    rental.totalAmount || '',
    rental.bookingFeeStatus || '',
    rental.rentalFeeStatus || '',
    rental.additionalFeeStatus || '',
    rental.extendBookingFeeStatus || '',
    rental.status || '',
    rental.bookingFeePaid || '',
    rental.rentalFeePaid || '',
    rental.additionalFeePaid || '',
    rental.extendBookingFeePaid || '',
    rental.totalAmount || ''
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
export const downloadCSV = (csvContent, filename = 'rental-history-export.csv') => {
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
export const generateFilename = (prefix = 'rental-history-export', extension = 'csv') => {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD format
  const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS format
  
  return `${prefix}-${dateStr}-${timeStr}.${extension}`;
};

/**
 * Export rentals to CSV file
 * @param {Array} rentals - Array of rental objects
 * @param {Function} t - Translation function
 * @param {string} filename - Optional custom filename
 */
export const exportRentalsToCSV = (rentals, t, filename = null) => {
  try {
    // Convert rentals to CSV
    const csvContent = convertRentalsToCSV(rentals, t);
    
    if (!csvContent) {
      console.warn('No rental data to export');
      return false;
    }
    
    // Generate filename if not provided
    const exportFilename = filename || generateFilename('rental-history-export', 'csv');
    
    // Download the file
    downloadCSV(csvContent, exportFilename);
    
    return true;
  } catch (error) {
    console.error('Error exporting rentals to CSV:', error);
    return false;
  }
};

/**
 * Get export statistics
 * @param {Array} rentals - Array of rental objects
 * @returns {Object} Export statistics
 */
export const getExportStats = (rentals) => {
  if (!rentals || rentals.length === 0) {
    return {
      total: 0,
      byStatus: {},
      byBookingFeeStatus: {},
      byRentalFeeStatus: {},
      dateRange: null
    };
  }

  // Count by booking status
  const byStatus = rentals.reduce((acc, rental) => {
    const status = rental.status || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Count by booking fee status
  const byBookingFeeStatus = rentals.reduce((acc, rental) => {
    const status = rental.bookingFeeStatus || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Count by rental fee status
  const byRentalFeeStatus = rentals.reduce((acc, rental) => {
    const status = rental.rentalFeeStatus || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Get date range
  const dates = rentals
    .map(rental => rental.createDate)
    .filter(date => date)
    .sort((a, b) => new Date(a) - new Date(b));

  const dateRange = dates.length > 0 ? {
    from: dates[0],
    to: dates[dates.length - 1]
  } : null;

  return {
    total: rentals.length,
    byStatus,
    byBookingFeeStatus,
    byRentalFeeStatus,
    dateRange
  };
};