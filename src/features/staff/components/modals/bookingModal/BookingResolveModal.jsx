const BookingResolveModal = ({ selectedBooking, onResolve, onClose }) => {
  return (
    <div className="space-y-4">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <svg className="w-5 h-5 text-yellow-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Resolve Overdue Booking
            </h3>
            <p className="mt-2 text-sm text-yellow-700">
              Mark booking <strong>{selectedBooking.bookingId}</strong> as completed.
              This will resolve the overdue status.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Booking Details:</h4>
        <div className="text-sm text-gray-600 space-y-1">
          <p><span className="font-medium">Customer:</span> {selectedBooking.customer}</p>
          <p><span className="font-medium">Car:</span> {selectedBooking.car}</p>
          <p><span className="font-medium">Expected End:</span> {selectedBooking.endDate}</p>
          <p><span className="font-medium">Amount:</span> ${selectedBooking.totalAmount}</p>
          <p><span className="font-medium">Current Notes:</span> {selectedBooking.notes || 'No notes'}</p>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onResolve}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Mark as Completed
        </button>
      </div>
    </div>
  );
};

export default BookingResolveModal;