import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { openEventModal } from '../../calendarSlice';
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
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      if (!event.start || !event.end) return false;
      const eventStart = (event.start instanceof Date ? event.start : new Date(event.start)).toISOString().split('T')[0];
      const eventEnd = (event.end instanceof Date ? event.end : new Date(event.end)).toISOString().split('T')[0];
      return dateStr >= eventStart && dateStr <= eventEnd;
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

  const handleDateClick = (date) => {
    const endDate = new Date(date);
    endDate.setDate(date.getDate() + 1);
    dispatch(openEventModal({ start: date, end: endDate }));
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
              onClick={() => handleDateClick(date)}
              className={`min-h-[120px] bg-white p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
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
                    compact
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch(openEventModal(event));
                    }}
                  />
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 px-1">
                    +{dayEvents.length - 3} {t('more')}
                  </div>
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

