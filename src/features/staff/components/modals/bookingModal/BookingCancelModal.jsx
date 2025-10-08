const BookingCancelModal = ({ selectedBooking, onCancel, onClose }) => {
  const handleCancel = () => {
    const reason = document.getElementById('cancellationReason').value;
    onCancel(reason);
  };

  return (
    <div className="space-y-4">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex">
          <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Cancel Booking
            </h3>
            <p className="mt-2 text-sm text-red-700">
              Are you sure you want to cancel booking <strong>{selectedBooking.bookingId}</strong>?
              This action cannot be undone.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Booking Details:</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p><span className="font-medium">Customer:</span> {selectedBooking.customer}</p>
          <p><span className="font-medium">Car:</span> {selectedBooking.car}</p>
          <p><span className="font-medium">Duration:</span> {selectedBooking.startDate} to {selectedBooking.endDate}</p>
          <p><span className="font-medium">Amount:</span> ${selectedBooking.totalAmount}</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Cancellation Reason</label>
        <textarea
          id="cancellationReason"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Please provide a reason for cancellation..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Keep Booking
        </button>
        <button
          onClick={handleCancel}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Cancel Booking
        </button>
      </div>
    </div>
  );
};

export default BookingCancelModal;