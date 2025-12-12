import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { closeEventModal } from '../../../maintenanceCalendarSlice';

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

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      1: 'High',
      2: 'Medium',
      3: 'Low',
    };
    return labels[priority] || 'Normal';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      1: 'bg-red-100 text-red-800',
      2: 'bg-yellow-100 text-yellow-800',
      3: 'bg-green-100 text-green-800',
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
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
              {/* Schedule Title and Status */}
              <div className="pb-4 border-b border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedEvent.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedEvent.status)}`}>
                    {selectedEvent.status?.toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPriorityColor(selectedEvent.priority)}`}>
                    {getPriorityLabel(selectedEvent.priority)} Priority
                  </span>
                  <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-800">
                    {selectedEvent.scheduleType}
                  </span>
                  {selectedEvent.isBlocking && (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                      Blocking
                    </span>
                  )}
                </div>
              </div>

              {/* Car Information */}
              <div>
                <p className="text-sm text-gray-500 mb-1">{t('car') || 'Car'}</p>
                <p className="text-base font-medium">{selectedEvent.carName || 'N/A'}</p>
                {selectedEvent.licensePlate && (
                  <p className="text-sm text-gray-600">{t('licensePlate') || 'License Plate'}: {selectedEvent.licensePlate}</p>
                )}
              </div>

              {/* Schedule Time */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-2">{t('scheduleTime') || 'Schedule Time'}</p>
                <div className="space-y-2">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-600">{t('startTime') || 'Start Time'}</p>
                      <p className="text-base">{formatDateTime(selectedEvent.start)}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-blue-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm text-gray-600">{t('endTime') || 'End Time'}</p>
                      <p className="text-base">{formatDateTime(selectedEvent.end)}</p>
                    </div>
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

