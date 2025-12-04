import React, { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { openEventModal } from '../../calendarSlice';
import EventCard from './EventCard';

const AgendaView = ({ events, currentDate }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const groupedEvents = useMemo(() => {
    const sorted = [...events].sort((a, b) => {
      const aStart = a.start instanceof Date ? a.start : new Date(a.start);
      const bStart = b.start instanceof Date ? b.start : new Date(b.start);
      return aStart - bStart;
    });

    const groups = {};
    sorted.forEach(event => {
      if (!event.start) return;
      const date = event.start instanceof Date ? event.start : new Date(event.start);
      const dateKey = date.toISOString().split('T')[0];
      
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(event);
    });

    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [events]);

  const formatDateHeader = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return t('today');
    }
    if (date.toDateString() === tomorrow.toDateString()) {
      return t('tomorrow');
    }
    return date.toLocaleDateString(undefined, { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (groupedEvents.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>{t('noEventsScheduled')}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="space-y-6">
        {groupedEvents.map(([dateKey, dayEvents]) => (
          <div key={dateKey} className="border-b border-gray-200 pb-6 last:border-b-0">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {formatDateHeader(dateKey)}
              </h3>
              <p className="text-sm text-gray-500">
                {dayEvents.length} {dayEvents.length === 1 ? t('event') : t('events')}
              </p>
            </div>
            
            <div className="space-y-3">
              {dayEvents.map(event => (
                <div
                  key={event.id}
                  onClick={() => dispatch(openEventModal(event))}
                  className="cursor-pointer"
                >
                  <EventCard event={event} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgendaView;

