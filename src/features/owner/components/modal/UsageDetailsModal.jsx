const UsageDetailsModal = ({ isOpen, onClose, selectedCar, onScheduleMaintenance }) => {
  if (!isOpen || !selectedCar) return null;

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    const normalizedStatus = status?.toLowerCase();

    switch (normalizedStatus) {
      case 'active':
        return { className: `${baseClasses} bg-green-100 text-green-800`, label: 'Available' };
      case 'reserved':
        return { className: `${baseClasses} bg-gray-100 text-gray-800`, label: 'Reserved' };
      case 'pending':
        return { className: `${baseClasses} bg-blue-100 text-blue-800`, label: 'Active' };
      case 'inactive':
        return { className: `${baseClasses} bg-yellow-100 text-yellow-800`, label: 'Maintenance' };
      case 'unavailable':
        return { className: `${baseClasses} bg-red-100 text-red-800`, label: 'Unavailable' };
      default:
        return { className: `${baseClasses} bg-gray-100 text-gray-800`, label: 'unknown' };
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Usage & Mileage Details</h2>
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
        <div className="p-6 space-y-6">
          {/* Car Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Car Name</p>
              <p className="font-medium text-gray-900 text-lg">{selectedCar.carName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">License Plate</p>
              <p className="font-medium text-gray-900 text-lg">{selectedCar.licensePlate}</p>
            </div>
          </div>

          {/* Rental Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Rentals</p>
              <p className="text-2xl font-bold text-blue-600">{selectedCar.totalRentals}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total Days Rented</p>
              <p className="text-2xl font-bold text-green-600">{selectedCar.totalDaysRented}</p>
            </div>
          </div>

          {/* Utilization Stats */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Availability Rate</p>
              <div className="flex items-center space-x-4">
                <div className="flex-1 bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full"
                    style={{ width: `${selectedCar.availabilityRate}%` }}
                  ></div>
                </div>
                <span className="text-lg font-bold text-gray-900">{selectedCar.availabilityRate}%</span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Current Status</p>
                {(() => {
                  const badge = getStatusBadge(selectedCar.currentStatus);
                  return <span className={badge.className}>{badge.label}</span>;
                })()}
              </div>
            </div>
          </div>

          {/* Schedule Maintenance Button */}
          {(selectedCar.currentStatus === 'pending' || selectedCar.currentStatus === 'active') && (
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  onClose();
                  onScheduleMaintenance(selectedCar);
                }}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                Schedule Maintenance
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsageDetailsModal;
