import { exportReceiptToPDF, printReceipt } from '../../owner-utils/ExportReceiptToPDF';

const RentalDetailsModal = ({ isOpen, rental, onClose, getStatusBadge, getPaymentBadge }) => {
  if (!isOpen || !rental) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Rental Details - {rental.bookingId}</h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => printReceipt(rental)}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                title="Print Receipt"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Print</span>
              </button>
              <button
                onClick={() => exportReceiptToPDF(rental)}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                title="Export to PDF"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>PDF</span>
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6">
          {/* Car & Customer Info */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Car Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">Car Name</p>
                  <p className="font-medium text-gray-900">{rental.carName}</p>
                </div>
                <div>
                  <p className="text-gray-600">License Plate</p>
                  <p className="font-medium text-gray-900">{rental.licensePlate}</p>
                </div>
                <div>
                  <p className="text-gray-600">Car ID</p>
                  <p className="font-medium text-gray-900">{rental.carId}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">{rental.customer}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{rental.customerEmail}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-medium text-gray-900">{rental.customerPhone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Rental Period */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Rental Period</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Start Date</p>
                <p className="font-medium text-gray-900">{rental.startDate}</p>
                <p className="text-xs text-gray-500">Pickup: {rental.pickupDate}</p>
              </div>
              <div>
                <p className="text-gray-600">End Date</p>
                <p className="font-medium text-gray-900">{rental.endDate}</p>
                <p className="text-xs text-gray-500">Return: {rental.returnDate}</p>
              </div>
              <div>
                <p className="text-gray-600">Duration</p>
                <p className="font-medium text-gray-900">{rental.duration} days</p>
              </div>
            </div>
          </div>

          {/* Financial Info */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Financial Information</h3>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="space-y-3">
                <div>
                  <p className="text-gray-900">Paid Amount: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.paidAmount)}</p>
                  {/* <p className="text-lg font-semibold text-green-600">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.paidAmount)}
                  </p> */}
                </div>
                <div>
                  <p className="text-gray-900">Invoice Total: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.totalAmount)}</p>
                  {/* <p className="text-xl font-bold text-gray-900">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.totalAmount)}
                  </p> */}
                </div>
                <div>
                  <p className="text-gray-900">Remaining Payment: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.remainingPayment)}</p>
                  {/* <p className="text-xl font-bold text-gray-900">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.totalAmount)}
                  </p> */}
                </div>
                {rental.dailyRate > 0 && (
                  <div>
                    <p className="text-gray-900">Daily Rate:  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.dailyRate)}/day</p>
                    {/* <p className="font-medium text-gray-900">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(rental.dailyRate)}/day
                    </p> */}
                  </div>
                )}
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-900">Payment Status: {rental.paymentStatus}</p>
                </div>
                <div>
                  <p className="text-gray-900">Payment Method: {rental.paymentMethod}</p>
                </div>
                <div>
                  <p className="text-gray-900">Payment Item: {rental.paymentItem}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Status */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Booking Status</h3>
            <div className="flex items-center space-x-4">
              <div>
                <p className="text-gray-600 text-sm">Status: {rental.status?.toUpperCase() || 'N/A'}</p>
                {/* <p className="font-medium text-gray-900 text-lg">
                  Status: {rental.status?.toUpperCase() || 'N/A'}
                </p> */}
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Additional Information</h3>
            <div className="text-sm text-gray-600">
              <p>Booking created: {new Date(rental.pickupDate).toLocaleDateString()}</p>
              <p className="mt-2 text-gray-500 italic">Note: Mileage, condition, and rating data will be available after the rental is completed.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentalDetailsModal;
