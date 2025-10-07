const BookingViewModal = ({ 
  selectedBooking, 
  getStatusBadge, 
  getPaymentBadge, 
  onChangeModalType 
}) => {
  return (
    <>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Booking ID</label>
            <p className="text-gray-900">{selectedBooking.bookingId}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <span className={getStatusBadge(selectedBooking.status)}>
              {selectedBooking.status}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
            <p className="text-gray-900">{selectedBooking.customer}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Car Owner</label>
            <p className="text-gray-900">{selectedBooking.carOwner}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Car</label>
            <p className="text-gray-900">{selectedBooking.car}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Amount</label>
            <p className="text-gray-900">${selectedBooking.totalAmount}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <p className="text-gray-900">{selectedBooking.startDate}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <p className="text-gray-900">{selectedBooking.endDate}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
            <span className={getPaymentBadge(selectedBooking.paymentStatus)}>
              {selectedBooking.paymentStatus}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
            <p className="text-gray-900">{selectedBooking.createdAt}</p>
          </div>
        </div>
        {selectedBooking.notes && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedBooking.notes}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <button
          onClick={() => onChangeModalType('edit')}
          className="px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Edit
        </button>
        {selectedBooking.status === 'overdue' && (
          <button
            onClick={() => onChangeModalType('resolve')}
            className="px-4 py-2 text-green-600 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            Resolve
          </button>
        )}
        {(selectedBooking.status === 'pending' || selectedBooking.status === 'active') && (
          <button
            onClick={() => onChangeModalType('cancel')}
            className="px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </>
  );
};

export default BookingViewModal;