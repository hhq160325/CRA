import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { openEventModal } from '../../../maintenanceCalendarSlice';
import EventCard from './EventCard';

const DayView = ({ events, currentDate }) => {
  const dispatch = useDispatch();

  const day = useMemo(() => {
    return currentDate instanceof Date ? currentDate : new Date(currentDate);
  }, [currentDate]);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDate = () => {
    const dateStr = day.toISOString().split('T')[0];
    return events.filter(event => {
      if (!event.start) return false;
      const eventStart = (event.start instanceof Date ? event.start : new Date(event.start)).toISOString().split('T')[0];
      return dateStr === eventStart;
    });
  };

  const getEventPosition = (event) => {
    if (!event.start) return { top: 0, height: 60 };
    const start = event.start instanceof Date ? event.start : new Date(event.start);
    const end = event.end instanceof Date ? event.end : new Date(event.end);
    const top = (start.getHours() * 60 + start.getMinutes()) * 0.8;
    const duration = (end - start) / (1000 * 60);
    const height = Math.max(duration * 0.8, 30);
    return { top, height };
  };

  const isToday = () => {
    const today = new Date();
    return day.toDateString() === today.toDateString();
  };

  const dayEvents = getEventsForDate();
  const today = isToday();

  return (
    <div className="p-4">
      {/* Day header */}
      <div className={`mb-4 p-4 rounded-lg ${today ? 'bg-blue-50' : 'bg-gray-50'}`}>
        <div className="text-sm text-gray-500">
          {day.toLocaleDateString(undefined, { weekday: 'long' })}
        </div>
        <div className={`text-2xl font-semibold ${today ? 'text-blue-600' : 'text-gray-900'}`}>
          {day.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      <div className="flex">
        {/* Time column */}
        <div className="w-16 flex-shrink-0">
          {hours.map(hour => (
            <div key={hour} className="h-12 border-b border-gray-100 text-xs text-gray-500 px-2">
              {hour.toString().padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {/* Events column */}
        <div className="flex-1 relative border-l border-gray-200">
          {hours.map(hour => (
            <div key={hour} className="h-12 border-b border-gray-100"></div>
          ))}
          
          {/* Events */}
          {dayEvents.map(event => {
            const { top, height } = getEventPosition(event);
            return (
              <div
                key={event.id}
                onClick={() => dispatch(openEventModal(event))}
                className="absolute left-2 right-2 cursor-pointer z-10"
                style={{ top: `${top}px`, height: `${height}px` }}
              >
                <EventCard event={event} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DayView;

