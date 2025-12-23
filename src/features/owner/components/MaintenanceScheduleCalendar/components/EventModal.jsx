import React from 'react';
import { useTranslation } from 'react-i18next';

const EventModal = ({ selectedEvent, isEventModalOpen, onClose }) => {
  const { t } = useTranslation();

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

  console.log("selectedEvent",selectedEvent);
  
  // const formatCurrency = (amount) => {
  //   return new Intl.NumberFormat('en-US', {
  //     style: 'currency',
  //     currency: 'USD',
  //   }).format(amount || 0);
  // };

  const getStatusColor = (status) => {
    const colors = {
      upcoming: 'bg-blue-100 text-blue-800',
      due: 'bg-yellow-100 text-yellow-800',
      'in maintenance': 'bg-purple-100 text-purple-800',
      inMaintenance: 'bg-purple-100 text-purple-800',
      overdue: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      high: 'High',
      medium: 'Medium',
      low: 'Low',
    };
    return labels[priority?.toLowerCase()] || 'Normal';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    };
    return colors[priority?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  if (!isEventModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {t('maintenanceDetails') || 'Maintenance Details'}
            </h2>
            <button
              onClick={onClose}
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
              {/* Schedule Title and Status */}
              <div className="pb-4 border-b border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedEvent.scheduleTitle || selectedEvent.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedEvent.status)}`}>
                    {selectedEvent.status === 'inMaintenance' ? 'IN MAINTENANCE' : selectedEvent.status?.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(selectedEvent.priority)}`}>
                    {getPriorityLabel(selectedEvent.priority)} Priority
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                    {selectedEvent.scheduleType}
                  </span>
                  {selectedEvent.daysUntil !== undefined && (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      {selectedEvent.daysUntil > 0 ? `${selectedEvent.daysUntil} days until` : 
                       selectedEvent.daysUntil === 0 ? 'Today' : 
                       `${Math.abs(selectedEvent.daysUntil)} days overdue`}
                    </span>
                  )}
                </div>
              </div>

              {/* Car Information */}
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('car') || 'Car'}</p>
                <p className="text-base font-medium">{selectedEvent.carName || 'N/A'}</p>
                <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                  {selectedEvent.licensePlate && (
                    <div>
                      <p className="text-gray-600">{t('licensePlate') || 'License Plate'}</p>
                      <p className="font-medium">{selectedEvent.licensePlate}</p>
                    </div>
                  )}
                  {selectedEvent.carModel && (
                    <div>
                      <p className="text-gray-600">{t('year') || 'Year'}</p>
                      <p className="font-medium">{selectedEvent.carModel}</p>
                    </div>
                  )}
                  {selectedEvent.currentMileage && (
                    <div>
                      <p className="text-gray-600">{t('currentMileage') || 'Current Mileage'}</p>
                      <p className="font-medium">{selectedEvent.currentMileage.toLocaleString()} km</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Schedule Time */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-2">{t('scheduleTime') || 'Schedule Time'}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">{t('startDate') || 'Start Date'}</p>
                    <p className="text-base font-medium">{selectedEvent.startDateMaintenanceDate || 'N/A'}</p>
                    {selectedEvent.pickupTime && selectedEvent.pickupTime !== 'N/A' && (
                      <p className="text-sm text-gray-600">{selectedEvent.pickupTime}</p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{t('endDate') || 'End Date'}</p>
                    <p className="text-base font-medium">{selectedEvent.endDateMaintenanceDate || 'N/A'}</p>
                    {selectedEvent.returnTime && selectedEvent.returnTime !== 'N/A' && (
                      <p className="text-sm text-gray-600">{selectedEvent.returnTime}</p>
                    )}
                  </div>
                </div>
              </div>

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
                  onClick={onClose}
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

