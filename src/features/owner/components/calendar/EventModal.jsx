import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { closeEventModal } from '../../calendarSlice';

const EventModal = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { selectedEvent, isEventModalOpen } = useSelector(state => state.calendar || {});

  // Format date and time for display
  const formatDateTime = (dateTime) => {
    if (!dateTime) return '';
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // const formatCurrency = (amount) => {
  //   return new Intl.NumberFormat('en-US', {
  //     style: 'currency',
  //     currency: 'USD',
  //   }).format(amount || 0);
  // };

  const getPaymentStatusColor = (status) => {
    const colors = {
      success: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getBookingStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  if (!isEventModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {t('bookingDetails') || 'Booking Details'}
            </h2>
            <button
              onClick={() => dispatch(closeEventModal())}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {selectedEvent && (
            <div className="space-y-4">
              {/* Booking ID and Status */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-500">{t('bookingId') || 'Booking ID'}</p>
                  <p className="text-lg font-semibold">{selectedEvent.bookingId}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBookingStatusColor(selectedEvent.bookingStatus)}`}>
                  {selectedEvent.bookingStatus?.toUpperCase()}
                </span>
              </div>

              {/* Car Information */}
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('car') || 'Car'}</p>
                <p className="text-base font-medium">{selectedEvent.carName || 'N/A'}</p>
              </div>

              {/* Pickup Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-2">{t('pickupDetails') || 'Pickup Details'}</p>
                <div className="space-y-1">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-600">{t('location') || 'Location'}</p>
                      <p className="text-base">{selectedEvent.pickupPlace || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-600">{t('time') || 'Time'}</p>
                      <p className="text-base">{formatDateTime(selectedEvent.pickupTime)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dropoff Information */}
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-green-900 mb-2">{t('dropoffDetails') || 'Dropoff Details'}</p>
                <div className="space-y-1">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-600">{t('location') || 'Location'}</p>
                      <p className="text-base">{selectedEvent.dropoffPlace || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-600">{t('time') || 'Time'}</p>
                      <p className="text-base">{formatDateTime(selectedEvent.dropoffTime)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing Information */}
              {/* <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm font-medium text-gray-900 mb-2">{t('pricingDetails') || 'Pricing Details'}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('carRentPrice') || 'Car Rent Price'}</span>
                  <span className="font-medium">{formatCurrency(selectedEvent.carRentPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t('bookingFee') || 'Booking Fee'}</span>
                  <span className="font-medium">{formatCurrency(selectedEvent.bookingFee)}</span>
                </div>
                <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-300">
                  <span>{t('totalAmount') || 'Total Amount'}</span>
                  <span className="text-blue-600">{formatCurrency(selectedEvent.totalAmount)}</span>
                </div>
              </div> */}

              {/* Payment Status */}
              {/* <div>
                <p className="text-sm text-gray-500 mb-1">{t('paymentStatus') || 'Payment Status'}</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(selectedEvent.paymentStatus)}`}>
                  {selectedEvent.paymentStatus?.toUpperCase()}
                </span>
              </div> */}

              {/* Notes */}
              {selectedEvent.notes && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t('notes') || 'Notes'}</p>
                  <p className="text-base text-gray-700">{selectedEvent.notes}</p>
                </div>
              )}

              {/* Close Button */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => dispatch(closeEventModal())}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {t('close') || 'Close'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;

