import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get payment details from location state or use default values
  const paymentDetails = location.state || {
    transactionId: 'TXN' + Date.now(),
    amount: '80.00',
    paymentMethod: 'Credit Card',
    paymentDate: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    carName: 'Nissan GT - R',
    carImage: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=120&h=80&fit=crop',
    billingInfo: {
      name: 'John Doe',
      email: '[email]',
      phone: '[phone_number]',
      address: '[address]'
    },
    rentalInfo: {
      pickUpLocation: 'New York',
      pickUpDate: new Date().toLocaleDateString(),
      pickUpTime: '10:00 AM',
      dropOffLocation: 'New York',
      dropOffDate: new Date(Date.now() + 86400000).toLocaleDateString(),
      dropOffTime: '10:00 AM'
    }
  };

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
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 mb-4">
            Your payment has been processed successfully. You will receive a confirmation email shortly.
          </p>
          
          <div className="inline-block bg-green-50 border border-green-200 rounded-lg px-6 py-3">
            <p className="text-sm text-gray-600">Transaction ID</p>
            <p className="text-lg font-bold text-gray-900">{paymentDetails.transactionId}</p>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Amount Paid</p>
              <p className="text-2xl font-bold text-gray-900">${paymentDetails.amount}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Payment Method</p>
              <p className="text-lg font-semibold text-gray-900">{paymentDetails.paymentMethod}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Payment Date</p>
              <p className="text-lg font-semibold text-gray-900">{paymentDetails.paymentDate}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                Completed
              </span>
            </div>
          </div>

          <hr className="my-6" />

          {/* Car Details */}
          <h3 className="text-xl font-bold text-gray-900 mb-4">Rental Details</h3>
          <div className="flex items-center mb-6 p-4 bg-gray-50 rounded-lg">
            <img
              src={paymentDetails.carImage}
              alt={paymentDetails.carName}
              className="w-24 h-20 object-cover rounded-lg mr-4"
            />
            <div>
              <h4 className="font-bold text-gray-900 text-lg">{paymentDetails.carName}</h4>
              <p className="text-sm text-gray-500">Sport Car</p>
            </div>
          </div>

          {/* Rental Schedule */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <h4 className="font-bold text-gray-900">Pick-Up</h4>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-semibold text-gray-900">{paymentDetails.rentalInfo.pickUpLocation}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date & Time</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {paymentDetails.rentalInfo.pickUpDate} at {paymentDetails.rentalInfo.pickUpTime}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <h4 className="font-bold text-gray-900">Drop-Off</h4>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-semibold text-gray-900">{paymentDetails.rentalInfo.dropOffLocation}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date & Time</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {paymentDetails.rentalInfo.dropOffDate} at {paymentDetails.rentalInfo.dropOffTime}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-6" />

          {/* Billing Information */}
          <h3 className="text-xl font-bold text-gray-900 mb-4">Billing Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Name</p>
              <p className="text-base font-semibold text-gray-900">{paymentDetails.billingInfo.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Email</p>
              <p className="text-base font-semibold text-gray-900">{paymentDetails.billingInfo.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Phone</p>
              <p className="text-base font-semibold text-gray-900">{paymentDetails.billingInfo.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Address</p>
              <p className="text-base font-semibold text-gray-900">{paymentDetails.billingInfo.address}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => window.print()}
              className="flex items-center justify-center bg-gray-100 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Receipt
            </button>
            
            <button
              onClick={() => navigate('/profile/rental-history')}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View Rental History
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Back to Home
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? Contact our support team at <a href="mailto:support@example.com" className="text-blue-600 hover:underline">support@example.com</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
