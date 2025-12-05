import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { openEventModal, openDayEventsModal } from '../../../maintenanceCalendarSlice';
import EventCard from './EventCard';

const MonthView = ({ events, currentDate }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const monthMatrix = useMemo(() => {
    const date = currentDate instanceof Date ? currentDate : new Date(currentDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    const first = new Date(year, month, 1);
    const start = new Date(first);
    start.setDate(first.getDate() - ((first.getDay() + 6) % 7)); // Start on Monday
    
    const weeks = [];
    for (let w = 0; w < 6; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const dayDate = new Date(start);
        dayDate.setDate(start.getDate() + w * 7 + d);
        days.push(dayDate);
      }
      weeks.push(days);
    }
    return weeks;
  }, [currentDate]);

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

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date) => {
    const d = currentDate instanceof Date ? currentDate : new Date(currentDate);
    return date.getMonth() === d.getMonth();
  };

  const handleDateClick = (date, dayEvents) => {
    // Don't open modal for empty dates - this is a view-only calendar for bookings
    if (dayEvents.length === 0) {
      return;
    }
    // If there's only one event, open it directly
    if (dayEvents.length === 1) {
      dispatch(openEventModal(dayEvents[0]));
    }
    // If multiple events, could show a list or just do nothing
    // For now, open the first event
    if (dayEvents.length > 1) {
      dispatch(openEventModal(dayEvents[0]));
    }
  };

  const weekDays = [t('mon'), t('tue'), t('wed'), t('thu'), t('fri'), t('sat'), t('sun')];

  return (
    <div className="p-4">
      {/* Week day headers */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 mb-1">
        {weekDays.map(day => (
          <div key={day} className="bg-gray-50 p-2 text-center text-xs font-semibold text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {monthMatrix.flat().map((date, idx) => {
          const dayEvents = getEventsForDate(date);
          const today = isToday(date);
          const inMonth = isCurrentMonth(date);

          return (
            <div
              key={idx}
              onClick={() => handleDateClick(date, dayEvents)}
              className={`min-h-[120px] bg-white p-2 ${dayEvents.length > 0 ? 'cursor-pointer hover:bg-gray-50' : ''} transition-colors ${
                !inMonth ? 'opacity-40' : ''
              } ${today ? 'ring-2 ring-blue-500' : ''}`}
            >
              <div className={`text-sm font-medium mb-1 ${today ? 'text-blue-600' : 'text-gray-900'}`}>
                {date.getDate()}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                    date={date}
                    compact
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(openEventModal(event));
                    }}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(openDayEventsModal(dayEvents));
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline px-1 w-full text-left transition-colors"
                  >
                    +{dayEvents.length - 3} {t('more')}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;

