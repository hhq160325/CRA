import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getCarTravelLogs } from '../../../owner/api/ownerApi';
import { axiosInstance } from '../../../../../src/shared/utils/axiosInstance';
import { BOOKING_ENDPOINTS } from '../../../../config/api';

const TravelLogModal = ({ isOpen, onClose, selectedCar }) => {
  const { t } = useTranslation();
  const [travelLogs, setTravelLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bookingDetails, setBookingDetails] = useState({});

  useEffect(() => {
    if (isOpen && selectedCar) {
      fetchTravelLogs();
    }
  }, [isOpen, selectedCar]);

  const fetchTravelLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const logs = await getCarTravelLogs(selectedCar.carId);
      
      // Sort logs by travel date (most recent first)
      const sortedLogs = logs.sort((a, b) => {
        return new Date(b.travelDate) - new Date(a.travelDate);
      });
      
      setTravelLogs(sortedLogs);
      
      // Fetch booking details for each unique booking ID
      const uniqueBookingIds = [...new Set(sortedLogs.map(log => log.bookingId))];
      const bookingDetailsMap = {};
      
      await Promise.all(
        uniqueBookingIds.map(async (bookingId) => {
          try {
            const response = await axiosInstance.get(BOOKING_ENDPOINTS.GET_BOOKING_BY_ID(bookingId));
            bookingDetailsMap[bookingId] = response.data;
          } catch (err) {
            console.error(`Error fetching booking ${bookingId}:`, err);
            bookingDetailsMap[bookingId] = { bookingNumber: 'N/A' };
          }
        })
      );
      
      setBookingDetails(bookingDetailsMap);
    } catch (err) {
      console.error('Error fetching travel logs:', err);
      setError(t('travelLog.errorLoading') || 'Failed to load travel logs');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return amount?.toLocaleString('vi-VN') + ' VND';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {t('travelLog.title') || 'Travel Log'}
            </h2>
            {selectedCar && (
              <p className="text-sm text-gray-600 mt-1">
                {selectedCar.carName} • {selectedCar.licensePlate}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">{t('travelLog.loading') || 'Loading travel logs...'}</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-red-500">{error}</div>
            </div>
          ) : travelLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500">{t('travelLog.noLogs') || 'No travel logs found for this car'}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Summary Card */}
              {/* <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{t('travelLog.totalTrips') || 'Total Trips'}</p>
                    <p className="text-2xl font-bold text-gray-900">{travelLogs.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('travelLog.totalCharges') || 'Total Charges'}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(travelLogs.reduce((sum, log) => sum + (log.chargeAmount || 0), 0))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('travelLog.uniqueTollBooths') || 'Unique Toll Booths'}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {new Set(travelLogs.map(log => log.tollBoothId)).size}
                    </p>
                  </div>
                </div>
              </div> */}

              {/* Travel Logs Table */}
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">
                          {t('travelLog.travelDate') || 'Travel Date'}
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">
                          {t('travelLog.bookingNumber') || 'Booking Number'}
                        </th>
                        {/* <th className="text-left py-3 px-4 font-semibold text-gray-900 text-sm">
                          {t('travelLog.tollBoothId') || 'Toll Booth'}
                        </th> */}
                        <th className="text-right py-3 px-4 font-semibold text-gray-900 text-sm">
                          {t('travelLog.chargeAmount') || 'Charge Amount'}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {travelLogs.map((log, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="py-3 px-4 text-sm text-gray-900">
                            {formatDate(log.travelDate)}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-900 font-medium">
                            {bookingDetails[log.bookingId]?.bookingNumber || 'Loading...'}
                          </td>
                          {/* <td className="py-3 px-4 text-sm text-gray-900">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                              #{log.tollBoothId}
                            </span>
                          </td> */}
                          <td className="py-3 px-4 text-sm text-gray-900 text-right font-medium">
                            {formatCurrency(log.chargeAmount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {t('common.close') || 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TravelLogModal;
