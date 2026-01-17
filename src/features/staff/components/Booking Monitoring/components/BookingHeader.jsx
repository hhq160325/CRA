import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { exportBookingsToCSV } from '../utils/exportUtils';

const BookingHeader = ({ filteredBookings = [] }) => {
  const { t } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);
  
  // Get all bookings from Redux store if filteredBookings is not provided
  const allBookings = useSelector((state) => state.staff.bookingActivities);
  const bookingsToExport = filteredBookings.length > 0 ? filteredBookings : allBookings;

  const handleExport = async () => {
    if (!bookingsToExport || bookingsToExport.length === 0) {
      toast.warning(t('noDataToExport') || 'No booking data available to export');
      return;
    }

    try {
      setIsExporting(true);
      
      const success = exportBookingsToCSV(bookingsToExport, t);
      
      if (success) {
        toast.success(
          t('exportSuccessful') || 
          `Successfully exported ${bookingsToExport.length} booking records`
        );
        // console.log(`Successfully exported ${bookingsToExport.length} booking records`);
      } else {
        toast.error(t('exportFailed') || 'Failed to export booking data');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error(t('exportError') || 'An error occurred while exporting data');
    } finally {
      setIsExporting(false);
    }
  };

  const isExportDisabled = !bookingsToExport || bookingsToExport.length === 0 || isExporting;

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('bookingMonitoring')}</h1>
        <p className="text-gray-600">{t('monitorAndManageBookings')}</p>
      </div>
      <div className="flex space-x-3">
        <button 
          onClick={handleExport}
          disabled={isExportDisabled}
          className={`
            px-4 py-2 rounded-lg transition-colors flex items-center space-x-2
            ${isExportDisabled 
              ? 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed' 
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }
          `}
          title={isExportDisabled ? (t('noDataToExport') || 'No data available to export') : (t('exportTooltip') || 'Export booking data to CSV')}
        >
          {isExporting ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>{t('exporting') || 'Exporting...'}</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{t('exportReport')}</span>
            </>
          )}
        </button>
        {/* <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          {t('createManualBooking')}
        </button> */}
      </div>
    </div>
  );
};

export default BookingHeader;