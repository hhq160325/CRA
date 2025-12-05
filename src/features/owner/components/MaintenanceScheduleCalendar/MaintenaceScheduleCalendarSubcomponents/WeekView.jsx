import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { openEventModal } from '../../../maintenanceCalendarSlice';
import EventCard from './EventCard';

const WeekView = ({ events, currentDate }) => {
  const dispatch = useDispatch();

  const weekDays = useMemo(() => {
    const date = currentDate instanceof Date ? currentDate : new Date(currentDate);
    const start = new Date(date);
    start.setDate(date.getDate() - ((date.getDay() + 6) % 7)); // Start on Monday
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      days.push(day);
    }
    return days;
  }, [currentDate]);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
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

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="p-4 overflow-x-auto">
      <div className="flex min-w-[800px]">
        {/* Time column */}
        <div className="w-16 flex-shrink-0">
          <div className="h-12 border-b border-gray-200"></div>
          {hours.map(hour => (
            <div key={hour} className="h-12 border-b border-gray-100 text-xs text-gray-500 px-2">
              {hour.toString().padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {/* Days columns */}
        {weekDays.map((day, dayIdx) => {
          const dayEvents = getEventsForDate(day);
          const today = isToday(day);

          return (
            <div key={dayIdx} className="flex-1 border-l border-gray-200">
              {/* Day header */}
              <div className={`h-12 border-b border-gray-200 p-2 text-center ${today ? 'bg-blue-50' : ''}`}>
                <div className="text-xs text-gray-500">
                  {day.toLocaleDateString(undefined, { weekday: 'short' })}
                </div>
                <div className={`text-sm font-semibold ${today ? 'text-blue-600' : 'text-gray-900'}`}>
                  {day.getDate()}
                </div>
              </div>

              {/* Time slots */}
              <div className="relative">
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
                      className="absolute left-1 right-1 cursor-pointer z-10"
                      style={{ top: `${top}px`, height: `${height}px` }}
                    >
                      <EventCard event={event} compact />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;

