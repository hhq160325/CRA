import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { updateBooking } from '../api';

const PaymentCancel = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isUpdatingBooking, setIsUpdatingBooking] = useState(false);
  
  useEffect(() => {
    // Retrieve booking data from localStorage
    const pendingBookingStr = localStorage.getItem('pendingBooking');
    
    if (pendingBookingStr) {
      try {
        const bookingData = JSON.parse(pendingBookingStr);
        // console.log('PaymentCancel - Retrieved booking data:', bookingData);
        
        // Update booking status to "Cancelled" if bookingId exists
        if (bookingData.bookingId) {
          setIsUpdatingBooking(true);
          updateBooking(bookingData.bookingId, 'Cancelled')
            .then(() => {
              // console.log('PaymentCancel - Booking status updated to Cancelled');
              // Clear the pending booking from localStorage after cancellation
              localStorage.removeItem('pendingBooking');
              // console.log('PaymentCancel - Cleared pendingBooking from localStorage');
            })
            .catch((error) => {
              console.error('PaymentCancel - Failed to update booking status:', error);
              // Continue showing cancel page even if update fails
            })
            .finally(() => {
              setIsUpdatingBooking(false);
            });
        } else {
          console.warn('PaymentCancel - No bookingId found in booking data');
          // Clear localStorage anyway
          localStorage.removeItem('pendingBooking');
        }
      } catch (error) {
        console.error('PaymentCancel - Error parsing booking data:', error);
        // Clear localStorage if parsing fails
        localStorage.removeItem('pendingBooking');
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="flex justify-center mb-6">
          <svg className="h-20 w-20 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {t('paymentCancelled')}
        </h1>
        
        <p className="text-gray-600 mb-8">
          {t('paymentCancelledMessage')}
        </p>
        
        {isUpdatingBooking && (
          <div className="mb-6 flex items-center justify-center text-sm text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
            Updating booking status...
          </div>
        )}
        
        <div className="space-y-3">
          {/* <button
            onClick={() => navigate('/payment')}
            disabled={isUpdatingBooking}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {t('tryAgain')}
          </button> */}
          
          <button
            onClick={() => navigate('/')}
            disabled={isUpdatingBooking}
            className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {t('backToHome')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
