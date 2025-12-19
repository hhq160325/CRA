import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { updateBooking } from '../api';

const PaymentSuccess = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null);
  
  useEffect(() => {
    const getDefaultPaymentDetails = () => {
      const currentLocale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
      return {
        transactionId: 'TXN' + Date.now(),
        amount: '80.00',
        paymentMethod: 'QR Payment',
        paymentDate: new Date().toLocaleDateString(currentLocale, { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        carName: 'Nissan GT - R',
        carImage: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=120&h=80&fit=crop',
        billingInfo: {
          name: 'Customer',
          email: '[email]',
          phone: '[phone_number]',
          address: '[address]'
        },
        rentalInfo: {
          pickUpLocation: 'Location',
          pickUpDate: new Date().toLocaleDateString(),
          pickUpTime: '10:00 AM',
          dropOffLocation: 'Location',
          dropOffDate: new Date(Date.now() + 86400000).toLocaleDateString(),
          dropOffTime: '10:00 AM'
        }
      };
    };

    // Retrieve booking data from localStorage
    const pendingBookingStr = localStorage.getItem('pendingBooking');
    
    if (pendingBookingStr) {
      try {
        const bookingData = JSON.parse(pendingBookingStr);
        console.log('PaymentSuccess - Retrieved booking data:', bookingData);
        
        // Update booking status to "Confirmed" if bookingId exists
        if (bookingData.bookingId) {
          updateBooking(bookingData.bookingId, 'Confirmed')
            .then(() => {
              console.log('PaymentSuccess - Booking status updated to Completed');
            })
            .catch((error) => {
              console.error('PaymentSuccess - Failed to update booking status:', error);
              // Continue showing success page even if update fails
            });
        } else {
          console.warn('PaymentSuccess - No bookingId found in booking data');
        }
        
        // Get current locale from i18n
        const currentLocale = i18n.language === 'vi' ? 'vi-VN' : 'en-US';
        
        // Format the payment details from booking data
        const subtotal = bookingData.carRentPrice * bookingData.rentime;
        const bookingFeeAmount = subtotal * (bookingData.bookingFee / 100);
        const totalRentalPrice = subtotal + bookingFeeAmount;
        
        const details = {
          transactionId: 'TXN' + Date.now(),
          amount: bookingFeeAmount,
          totalRentalPrice: totalRentalPrice, // Total rental price for reference
          paymentMethod: 'QR Payment',
          paymentDate: new Date().toLocaleDateString(currentLocale, { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          carName: bookingData.carName || 'Nissan GT - R',
          carImage: bookingData.carImage || 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=120&h=80&fit=crop',
          carRating: bookingData.carRating,
          carReviewCount: bookingData.carReviewCount,
          billingInfo: {
            name: bookingData.billingInfo?.name || 'Customer',
            email: bookingData.billingInfo?.email || '[email]',
            phone: bookingData.billingInfo?.phoneNumber || '[phone_number]',
            address: bookingData.billingInfo?.address || '[address]',
            townCity: bookingData.billingInfo?.townCity || ''
          },
          rentalInfo: {
            pickUpLocation: bookingData.pickupPlace,
            pickUpDate: new Date(bookingData.pickupTime).toLocaleDateString(currentLocale, { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric'
            }),
            pickUpTime: new Date(bookingData.pickupTime).toLocaleTimeString(currentLocale, { 
              hour: '2-digit', 
              minute: '2-digit'
            }),
            dropOffLocation: bookingData.dropoffPlace,
            dropOffDate: new Date(bookingData.dropoffTime).toLocaleDateString(currentLocale, { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric'
            }),
            dropOffTime: new Date(bookingData.dropoffTime).toLocaleTimeString(currentLocale, { 
              hour: '2-digit', 
              minute: '2-digit'
            })
          },
          rentalDays: bookingData.rentime,
          carRentPrice: bookingData.carRentPrice,
          bookingFee: bookingData.bookingFee,
          bookingFeeAmount: bookingFeeAmount,
          subtotal: subtotal
        };
        
        setPaymentDetails(details);
        
      } catch (error) {
        console.error('PaymentSuccess - Error parsing booking data:', error);
        // Set default values if parsing fails
        setPaymentDetails(getDefaultPaymentDetails());
      }
    } else {
      console.warn('PaymentSuccess - No pending booking found in localStorage');
      // Set default values if no booking data found
      setPaymentDetails(getDefaultPaymentDetails());
    }
  }, [i18n.language]);

  // Function to clear localStorage and navigate
  const handleNavigation = (path) => {
    localStorage.removeItem('pendingBooking');
    console.log('PaymentSuccess - Cleared pendingBooking from localStorage');
    navigate(path);
  };
  
  // Show loading state while fetching data
  if (!paymentDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center mb-6">
          <div className="flex justify-center mb-6">
            <svg className="h-20 w-20 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('paymentSuccessful')}
          </h1>
          
          <p className="text-gray-600 mb-4">
            {t('paymentSuccessMessage')}
          </p>
          
          {/* <div className="inline-block bg-green-50 border border-green-200 rounded-lg px-6 py-3">
            <p className="text-sm text-gray-600">{t('transactionId')}</p>
            <p className="text-lg font-bold text-gray-900">{paymentDetails.transactionId}</p>
          </div> */}
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('paymentDetails')}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('amountPaidBookingFee')}</p>
              <p className="text-2xl font-bold text-gray-900">{paymentDetails.amount.toLocaleString('vi-VN')} đ</p>
              {/* {paymentDetails.rentalDays && paymentDetails.carRentPrice && (
                <p className="text-xs text-gray-500 mt-1">
                  {paymentDetails.bookingFee}% {t('of')} {paymentDetails.subtotal.toLocaleString('vi-VN')} đ ({paymentDetails.carRentPrice.toLocaleString('vi-VN')} đ/{t('day')} × {paymentDetails.rentalDays} {t('day')}{paymentDetails.rentalDays > 1 ? 's' : ''})
                </p>
              )} */}
              {/* <p className="text-xs text-gray-600 mt-2 font-medium">
                {t('remaining')}: {(paymentDetails.subtotal).toLocaleString('vi-VN')} đ ({t('payAtDropoff')})
              </p> */}
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('paymentMethod')}</p>
              <p className="text-lg font-semibold text-gray-900">{paymentDetails.paymentMethod}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('paymentDate')}</p>
              <p className="text-lg font-semibold text-gray-900">{paymentDetails.paymentDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('status')}</p>
              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {t('confirmed')}
              </span>
            </div>
          </div>

          <hr className="my-6" />

          {/* Car Details */}
          <h3 className="text-xl font-bold text-gray-900 mb-4">{t('rentalDetails')}</h3>
          <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
            <img
              src={paymentDetails.carImage}
              alt={paymentDetails.carName}
              className="w-24 h-20 object-cover rounded-lg mr-4"
            />
            <div>
              <h4 className="font-bold text-gray-900 text-lg">{paymentDetails.carName}</h4>
              {paymentDetails.carRating && paymentDetails.carReviewCount ? (
                <div className="flex items-center text-sm text-gray-500">
                  <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>{paymentDetails.carRating} ({paymentDetails.carReviewCount}+ {t('reviews')})</span>
                </div>
              ) : (
                <p className="text-sm text-gray-500">{t('sportCar')}</p>
              )}
            </div>
          </div>

          {/* Rental Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <h4 className="font-bold text-gray-900">{t('pickUp')}</h4>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">{t('location')}</p>
                  <p className="text-sm font-semibold text-gray-900">{paymentDetails.rentalInfo.pickUpLocation}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('dateAndTime')}</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {paymentDetails.rentalInfo.pickUpDate} {t('at')} {paymentDetails.rentalInfo.pickUpTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <h4 className="font-bold text-gray-900">{t('dropOff')}</h4>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">{t('location')}</p>
                  <p className="text-sm font-semibold text-gray-900">{paymentDetails.rentalInfo.dropOffLocation}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">{t('dateAndTime')}</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {paymentDetails.rentalInfo.dropOffDate} {t('at')} {paymentDetails.rentalInfo.dropOffTime}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-6" />

          {/* Billing Information */}
          <h3 className="text-xl font-bold text-gray-900 mb-4">{t('billingInformation')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('name')}</p>
              <p className="text-base font-semibold text-gray-900">{paymentDetails.billingInfo.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('email')}</p>
              <p className="text-base font-semibold text-gray-900">{paymentDetails.billingInfo.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('phone')}</p>
              <p className="text-base font-semibold text-gray-900">{paymentDetails.billingInfo.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">{t('address')}</p>
              <p className="text-base font-semibold text-gray-900">{paymentDetails.billingInfo.address}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols- gap-4">
            {/* <button
              onClick={() => window.print()}
              className="flex items-center justify-center bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              {t('printReceipt')}
            </button> */}
            
            <button
              onClick={() => handleNavigation('/profile/rental-history')}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {t('viewRentalHistory')}
            </button>
            
            <button
              onClick={() => handleNavigation('/')}
              className="bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              {t('backToHome')}
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            {t('needHelp')} <a href="mailto:support@example.com" className="text-blue-600 hover:underline">support@morrent.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
