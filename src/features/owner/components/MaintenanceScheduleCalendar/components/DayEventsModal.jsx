import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { closeDayEventsModal, openEventModal } from '../../../maintenanceCalendarSlice';
import EventCard from './EventCard';

const DayEventsModal = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { selectedDayEvents, isDayEventsModalOpen } = useSelector(state => state.calendar);

  if (!isDayEventsModalOpen) return null;

  const handleClose = () => {
    dispatch(closeDayEventsModal());
  };

  const handleEventClick = (event) => {
    dispatch(closeDayEventsModal());
    dispatch(openEventModal(event));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('allEvents')} ({selectedDayEvents.length})
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
          <div className="space-y-2">
            {selectedDayEvents.map(event => (
              <div
                key={event.id}
                onClick={() => handleEventClick(event)}
                className="cursor-pointer"
              >
                <EventCard event={event} compact={false} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayEventsModal;
