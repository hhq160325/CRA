/**
 * Export utilities for MaintenanceSchedule component
 * Provides CSV export functionality for maintenance schedule data
 */

/**
 * Escapes CSV field values to handle special characters
 * @param {string} field - The field value to escape
 * @returns {string} - Escaped field value
 */
const escapeCSVField = (field) => {
  if (field === null || field === undefined) return '';
  
  const stringField = String(field);
  
  // If field contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (stringField.includes(',') || stringField.includes('"') || stringField.includes('\n')) {
    return `"${stringField.replace(/"/g, '""')}"`;
  }
  
  return stringField;
};

/**
 * Formats date for CSV export
 * @param {string} dateString - Date string to format
 * @returns {string} - Formatted date string
 */
const formatDateForCSV = (dateString) => {
  if (!dateString || dateString === 'N/A') return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US');
  } catch (error) {
    return dateString;
  }
};

/**
 * Formats status for CSV export
 * @param {string} status - Status to format
 * @param {function} t - Translation function
 * @returns {string} - Formatted status
 */
const formatStatusForCSV = (status, t) => {
  if (!status) return 'N/A';
  
  // Map API status to translated status
  const statusMap = {
    'Active': t('maintenanceSchedule.Active'),
    'Completed': t('maintenanceSchedule.Completed'),
    'overdue': t('maintenanceSchedule.overdue'),
    'due': t('maintenanceSchedule.due'),
    'upcoming': t('maintenanceSchedule.upcoming')
  };
  
  return statusMap[status] || status;
};

/**
 * Formats priority for CSV export
 * @param {string} priority - Priority to format
 * @param {function} t - Translation function
 * @returns {string} - Formatted priority
 */
const formatPriorityForCSV = (priority, t) => {
  if (!priority) return 'N/A';
  
  const priorityMap = {
    'high': t('maintenanceSchedule.high'),
    'medium': t('maintenanceSchedule.medium'),
    'low': t('maintenanceSchedule.low')
  };
  
  return priorityMap[priority.toLowerCase()] || priority;
};

/**
 * Converts maintenance schedule data to CSV format
 * @param {Array} schedules - Array of maintenance schedule objects
 * @param {function} t - Translation function for internationalization
 * @returns {string} - CSV formatted string
 */
export const convertSchedulesToCSV = (schedules, t) => {
  if (!schedules || schedules.length === 0) {
    return '';
  }

  // Define CSV headers with translations
  const headers = [
    t('maintenanceSchedule.carInfo'),
    t('maintenanceSchedule.licensePlate'),
    'Car ID',
    t('maintenanceSchedule.maintenanceType'),
    t('maintenanceSchedule.maintenanceDate'),
    t('maintenanceSchedule.maintenanceTime'),
    t('maintenanceSchedule.status'),
    t('maintenanceSchedule.priority')
  ];

  // Create CSV content
  const csvRows = [headers.join(',')];

  schedules.forEach(schedule => {
    const row = [
      escapeCSVField(schedule.carName || 'N/A'),
      escapeCSVField(schedule.licensePlate || 'N/A'),
      escapeCSVField(schedule.carId || 'N/A'),
      escapeCSVField(schedule.maintenanceType || t('maintenanceSchedule.periodicMaintenance')),
      escapeCSVField(formatDateForCSV(schedule.startDateMaintenanceDate)),
      escapeCSVField(schedule.startTimeMaintenanceDate && schedule.endTimeMaintenanceDate 
        ? `${schedule.startTimeMaintenanceDate} - ${schedule.endTimeMaintenanceDate}`
        : 'N/A'),
      escapeCSVField(formatStatusForCSV(schedule.status, t)),
      escapeCSVField(formatPriorityForCSV(schedule.priority, t))
    ];
    
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
};

/**
 * Downloads CSV content as a file
 * @param {string} csvContent - CSV formatted string
 * @param {string} filename - Name of the file to download
 */
export const downloadCSV = (csvContent, filename) => {
  // Add UTF-8 BOM for proper encoding in Excel
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
};

/**
 * Generates a timestamped filename
 * @param {string} prefix - Filename prefix
 * @param {string} extension - File extension
 * @returns {string} - Generated filename
 */
export const generateFilename = (prefix = 'export', extension = 'csv') => {
  const now = new Date();
  const timestamp = now.toISOString()
    .replace(/[:.]/g, '-')
    .replace('T', '-')
    .substring(0, 19);
  
  return `${prefix}-${timestamp}.${extension}`;
};

/**
 * Main export function that combines all steps
 * @param {Array} schedules - Array of maintenance schedule objects
 * @param {function} t - Translation function
 * @param {string} filename - Optional custom filename
 * @returns {boolean} - Success status
 */
export const exportSchedulesToCSV = (schedules, t, filename = null) => {
  try {
    if (!schedules || schedules.length === 0) {
      console.warn('No maintenance schedules to export');
      return false;
    }

    const csvContent = convertSchedulesToCSV(schedules, t);
    if (!csvContent) {
      console.warn('Failed to convert schedules to CSV');
      return false;
    }

    const exportFilename = filename || generateFilename('maintenance-schedule-export');
    downloadCSV(csvContent, exportFilename);
    
    // console.log(`Successfully exported ${schedules.length} maintenance schedule records`);
    return true;
  } catch (error) {
    console.error('Error exporting maintenance schedules to CSV:', error);
    return false;
  }
};

/**
 * Gets export statistics for the provided schedules
 * @param {Array} schedules - Array of maintenance schedule objects
 * @returns {Object} - Export statistics
 */
export const getExportStats = (schedules) => {
  if (!schedules || schedules.length === 0) {
    return {
      total: 0,
      byStatus: {},
      byPriority: {},
      dateRange: null
    };
  }

  const stats = {
    total: schedules.length,
    byStatus: {},
    byPriority: {},
    dateRange: null
  };

  // Count by status
  schedules.forEach(schedule => {
    const status = schedule.status || 'unknown';
    stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;
    
    const priority = schedule.priority || 'unknown';
    stats.byPriority[priority] = (stats.byPriority[priority] || 0) + 1;
  });

  // Calculate date range
  const dates = schedules
    .map(schedule => schedule.startDateMaintenanceDate)
    .filter(date => date && date !== 'N/A')
    .map(date => new Date(date))
    .sort((a, b) => a - b);

  if (dates.length > 0) {
    stats.dateRange = {
      start: dates[0].toLocaleDateString(),
      end: dates[dates.length - 1].toLocaleDateString()
    };
  }

  return stats;
};