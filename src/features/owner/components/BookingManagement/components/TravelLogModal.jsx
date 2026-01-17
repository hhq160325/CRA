import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { CARTRAVELLOG_ENDPOINTS, CARTRAVELLOG_API_CONFIG } from '../../../../../config/api';
import { formatPriceWithCurrency } from '../../../../../shared/utils/priceFormatter';

const TravelLogModal = ({ isOpen, booking, onClose }) => {
  const { t } = useTranslation();
  const [travelLog, setTravelLog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && booking) {
      fetchTravelLog();
    }
  }, [isOpen, booking]);

  const fetchTravelLog = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        CARTRAVELLOG_ENDPOINTS.GET_CARTRAVELLOG_BY_CAR_ID_AND_BOOKING_ID(
          booking.carId,
          booking.bookingId
        ),
        CARTRAVELLOG_API_CONFIG
      );
      setTravelLog(response.data);
    } catch (err) {
      // Show simple "No car travel logs found" message
      setError(t('bookingManagement.noTravelLog'));
    } finally {
      setLoading(false);
    }
  };

  // Helper function to format values based on key name
  const formatValue = (key, value) => {
    if (value === null || value === undefined) return 'N/A';
    
    // Check if the key contains price/cost/fee/amount related terms
    const priceKeys = ['price', 'cost', 'fee', 'amount', 'total', 'charge', 'payment'];
    const isPriceField = priceKeys.some(priceKey => 
      key.toLowerCase().includes(priceKey)
    );
    
    if (isPriceField && !isNaN(value)) {
      return formatPriceWithCurrency(value);
    }
    
    return String(value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {t('bookingManagement.travelLogTitle')}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {t('bookingManagement.bookingNumber')}: {booking?.bookingNumber}
            </p>
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
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
              <p className="text-red-800">{error}</p>
              <button
                onClick={fetchTravelLog}
                className="mt-3 text-red-600 hover:text-red-700 font-medium"
              >
                {t('bookingManagement.retry')}
              </button>
            </div>
          )}

          {!loading && !error && travelLog && (
            <div className="space-y-6">
              {/* Vehicle Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {t('bookingManagement.vehicleInfo')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{t('bookingManagement.carName')}</p>
                    <p className="font-medium text-gray-900">{booking?.carName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('bookingManagement.licensePlate')}</p>
                    <p className="font-medium text-gray-900">{booking?.licensePlate}</p>
                  </div>
                </div>
              </div>

              {/* Travel Log Data */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {t('bookingManagement.travelDetails')}
                </h3>
                
                {Array.isArray(travelLog) && travelLog.length > 0 ? (
                  <div className="space-y-4">
                    {travelLog.map((log, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                          {Object.entries(log).map(([key, value]) => (
                            <div key={key}>
                              <p className="text-sm text-gray-600 capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                              </p>
                              <p className="font-medium text-gray-900">
                                {formatValue(key, value)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-gray-500">{t('bookingManagement.noTravelLog')}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {t('bookingManagement.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TravelLogModal;
