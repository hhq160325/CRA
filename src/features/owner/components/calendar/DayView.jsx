import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { openEventModal, openDayEventsModal } from '../../calendarSlice';
import EventCard from './EventCard';

const DayView = ({ events, currentDate }) => {
  const dispatch = useDispatch();

  const day = useMemo(() => {
    return currentDate instanceof Date ? currentDate : new Date(currentDate);
  }, [currentDate]);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDate = () => {
    // Use local date string to avoid timezone issues
    const year = day.getFullYear();
    const month = String(day.getMonth() + 1).padStart(2, '0');
    const dayNum = String(day.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${dayNum}`;
    
    return events.filter(event => {
      if (!event.start || !event.end) return false;
      
      // Get local date strings for event start and end
      const startDate = event.start instanceof Date ? event.start : new Date(event.start);
      const startYear = startDate.getFullYear();
      const startMonth = String(startDate.getMonth() + 1).padStart(2, '0');
      const startDay = String(startDate.getDate()).padStart(2, '0');
      const eventStart = `${startYear}-${startMonth}-${startDay}`;
      
      const endDate = event.end instanceof Date ? event.end : new Date(event.end);
      const endYear = endDate.getFullYear();
      const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
      const endDay = String(endDate.getDate()).padStart(2, '0');
      const eventEnd = `${endYear}-${endMonth}-${endDay}`;
      
      // Only show event on pickup date (start) and dropoff date (end)
      return dateStr === eventStart || dateStr === eventEnd;
    });
  };

  const groupEventsByTimeSlot = (dayEvents) => {
    const timeSlots = {};
    
    dayEvents.forEach(event => {
      const start = event.start instanceof Date ? event.start : new Date(event.start);
      const hour = start.getHours();
      const minute = start.getMinutes();
      const timeKey = `${hour}:${minute.toString().padStart(2, '0')}`;
      
      if (!timeSlots[timeKey]) {
        timeSlots[timeKey] = [];
      }
      timeSlots[timeKey].push(event);
    });
    
    return timeSlots;
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
          {(() => {
            const timeSlots = groupEventsByTimeSlot(dayEvents);
            const renderedElements = [];
            
            Object.entries(timeSlots).forEach(([timeKey, timeEvents]) => {
              const firstEvent = timeEvents[0];
              const { top, height } = getEventPosition(firstEvent);
              
              if (timeEvents.length === 1) {
                // Single event - render normally
                renderedElements.push(
                  <div
                    key={firstEvent.id}
                    onClick={() => dispatch(openEventModal(firstEvent))}
                    className="absolute left-2 right-2 cursor-pointer z-10 flex flex-col"
                    style={{ top: `${top}px`, height: `${height}px` }}
                  >
                    <EventCard event={firstEvent} />
                  </div>
                );
              } else {
                // Multiple events at same time - show compact event + button
                const eventCardHeight = 26; // Smaller height for multiple events
                const buttonHeight = 20; // Button height
                const totalHeight = eventCardHeight + buttonHeight + 1; // 4px spacing
                
                renderedElements.push(
                  <div
                    key={`${timeKey}-group`}
                    className="absolute left-2 right-2 z-10"
                    style={{ top: `${top}px`, height: `${totalHeight}px` }}
                  >
                    <div 
                      onClick={() => dispatch(openEventModal(firstEvent))}
                      className="cursor-pointer"
                      style={{ height: `${eventCardHeight}px`, overflow: 'hidden' }}
                    >
                      <EventCard event={firstEvent} compact />
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(openDayEventsModal(timeEvents));
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 hover:underline px-2 py-0.5 bg-blue-50 rounded border border-blue-200 w-full text-left transition-colors"
                      style={{ height: `${buttonHeight}px`, fontSize: '10px', lineHeight: '1' }}
                    >
                      +{timeEvents.length - 1} more at {timeKey}
                    </button>
                  </div>
                );
              }
            });
            
            return renderedElements;
          })()}
        </div>
      </div>
    </div>
  );
};

export default DayView;

