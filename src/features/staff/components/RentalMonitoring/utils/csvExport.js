import { formatVND } from './rentalUtils';

/**
 * Convert rental data to CSV format and trigger download
 * @param {Array} data - Array of rental objects
 * @param {Function} t - Translation function
 * @param {Function} translateStatus - Status translation function
 */
export const exportToCSV = (data, t, translateStatus) => {
  if (!data || data.length === 0) {
    alert(t('rentalHistory.noDataToExport'));
    return;
  }

  // Define CSV headers
  const headers = [
    t('rentalHistory.invoiceCode'),
    t('rentalHistory.carInfo'),
    t('rentalHistory.licensePlate'),
    t('rentalHistory.customer'),
    t('rentalHistory.customerEmail'),
    t('rentalHistory.customerPhone'),
    t('rentalHistory.startDate'),
    t('rentalHistory.endDate'),
    t('rentalHistory.pickupDate'),
    t('rentalHistory.duration'),
    t('rentalHistory.totalAmount'),
    t('rentalHistory.bookingFee'),
    t('rentalHistory.rentalFee'),
    t('rentalHistory.additionalFee'),
    t('rentalHistory.extendBookingFee'),
    t('rentalHistory.bookingFeeStatus'),
    t('rentalHistory.rentalFeeStatus'),
    t('rentalHistory.additionalFeeStatus'),
    t('rentalHistory.extendBookingFeeStatus'),
    t('rentalHistory.bookingStatus')
  ];

  // Convert data to CSV rows
  const csvRows = data.map(rental => [
    rental.bookingId || '',
    rental.carName || '',
    rental.licensePlate || '',
    rental.customer || '',
    rental.customerEmail || '',
    rental.customerPhone || '',
    rental.startDate || '',
    rental.endDate || '',
    rental.pickupDate || '',
    `${rental.duration || 0} ${t('rentalHistory.days')}`,
    formatVND(rental.totalPaidAmountShow || 0),
    formatVND(rental.bookingFeePaid || 0),
    formatVND(rental.rentalFeePaid || 0),
    rental.hasAdditionalFee ? formatVND(rental.additionalFeePaid || 0) : 'N/A',
    rental.hasExtendBookingFee ? formatVND(rental.extendBookingFeePaid || 0) : 'N/A',
    translateStatus(rental.bookingFeeStatus || ''),
    translateStatus(rental.rentalFeeStatus || ''),
    rental.hasAdditionalFee ? translateStatus(rental.additionalFeeStatus || '') : 'N/A',
    rental.hasExtendBookingFee ? translateStatus(rental.extendBookingFeeStatus || '') : 'N/A',
    translateStatus(rental.status || '')
  ]);

  // Combine headers and data
  const csvContent = [headers, ...csvRows]
    .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  // Add BOM for proper UTF-8 encoding in Excel
  const BOM = '\uFEFF';
  const csvWithBOM = BOM + csvContent;

  // Create and trigger download
  const blob = new Blob([csvWithBOM], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rental-history-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

/**
 * Export filtered rental data to CSV
 * @param {Array} filteredData - Filtered rental data
 * @param {Function} t - Translation function
 * @param {Function} translateStatus - Status translation function
 */
export const exportFilteredToCSV = (filteredData, t, translateStatus) => {
  exportToCSV(filteredData, t, translateStatus);
};