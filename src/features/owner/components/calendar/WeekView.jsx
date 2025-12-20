import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { openEventModal, openDayEventsModal } from '../../calendarSlice';
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
    // Use local date string to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
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
                          className="absolute left-1 right-1 cursor-pointer z-10"
                          style={{ top: `${top}px`, height: `${height}px` }}
                        >
                          <EventCard event={firstEvent} compact />
                        </div>
                      );
                    } else {
                      // Multiple events at same time - calculate proper height for event + button
                      const eventCardHeight = 24; // Compact event card height
                      const buttonHeight = 20; // Button height
                      const spacing = 2; // Spacing between elements
                      const totalHeight = eventCardHeight + buttonHeight + spacing;
                      
                      renderedElements.push(
                        <div
                          key={`${timeKey}-group`}
                          className="absolute left-1 right-1 z-10 flex flex-col"
                          style={{ top: `${top}px`, height: `${totalHeight}px` }}
                        >
                          <div 
                            onClick={() => dispatch(openEventModal(firstEvent))}
                            className="cursor-pointer flex-shrink-0"
                            style={{ height: `${eventCardHeight}px` }}
                          >
                            <EventCard event={firstEvent} compact />
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(openDayEventsModal(timeEvents));
                            }}
                            className="text-xs text-blue-600 hover:text-blue-800 hover:underline px-1 bg-blue-50 rounded border border-blue-200 w-full text-left transition-colors flex-shrink-0"
                            style={{ height: `${buttonHeight}px`, lineHeight: `${buttonHeight}px` }}
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
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;

