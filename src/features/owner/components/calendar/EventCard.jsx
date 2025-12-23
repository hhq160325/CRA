import React from 'react';
import { useTranslation } from 'react-i18next';

const getStatusColor = (status) => {
  const colors = {
    active: 'bg-blue-100 text-blue-800 border-blue-300',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-300',
    completed: 'bg-green-100 text-green-800 border-green-300',
    cancelled: 'bg-red-100 text-red-800 border-red-300',
    rejected: 'bg-gray-100 text-gray-800 border-gray-300',
    overdue: 'bg-red-100 text-red-800 border-red-300',
  };
  return colors[status?.toLowerCase()] || colors.pending;
};

const EventCard = ({ event, compact = false, onClick, date }) => {
  const { t } = useTranslation();
  // Use bookingStatus if available, otherwise fall back to status
  const displayStatus = event.bookingStatus || event.status;
  const statusColor = getStatusColor(displayStatus);
  console.log(event);
  
  const formatTime = (date) => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // const getEventType = () => {
  //   if (!date || !event.start || !event.end) return '';
  //   
  //   // Use local date strings to avoid timezone issues
  //   const year = date.getFullYear();
  //   const month = String(date.getMonth() + 1).padStart(2, '0');
  //   const day = String(date.getDate()).padStart(2, '0');
  //   const dateStr = `${year}-${month}-${day}`;
  //   
  //   const startDate = event.start instanceof Date ? event.start : new Date(event.start);
  //   const startYear = startDate.getFullYear();
  //   const startMonth = String(startDate.getMonth() + 1).padStart(2, '0');
  //   const startDay = String(startDate.getDate()).padStart(2, '0');
  //   const startStr = `${startYear}-${startMonth}-${startDay}`;
  //   
  //   const endDate = event.end instanceof Date ? event.end : new Date(event.end);
  //   const endYear = endDate.getFullYear();
  //   const endMonth = String(endDate.getMonth() + 1).padStart(2, '0');
  //   const endDay = String(endDate.getDate()).padStart(2, '0');
  //   const endStr = `${endYear}-${endMonth}-${endDay}`;
  // };

  if (compact) {
    return (
      <div
        onClick={onClick}
        className={`text-xs px-2 py-1 rounded border ${statusColor} cursor-pointer hover:opacity-80 truncate overflow-hidden`}
        title={`${formatTime(event.start)} • ${event.title}`}
      >
        <span className="truncate block">
          {formatTime(event.start)} • {event.title}
        </span>
      </div>
    );
  }

  // return (
  //   <div
  //     onClick={onClick}
  //     className={`p-3 rounded-lg border ${statusColor} cursor-pointer hover:shadow-md transition-shadow overflow-hidden`}
  //   >
  //     <div className="font-semibold text-sm mb-1 truncate" title={event.title}>{event.title}</div>
  //     <div className="text-xs text-gray-600 truncate">
  //       {formatTime(event.start)} - {formatTime(event.end)}
  //     </div>
  //     {(event.carName || event.car) && (
  //       <div className="text-xs text-gray-500 mt-1 truncate" title={event.carName || event.car}>{t('car')}: {event.carName || event.car}</div>
  //     )}
  //     <div className={`text-xs mt-2 px-2 py-1 rounded inline-block ${statusColor} truncate`}>
  //       {t(displayStatus?.toLowerCase())}
  //     </div>
  //   </div>
  // );
  return (
    <div
      onClick={onClick}
      className={`text-xs px-2 py-1 rounded border ${statusColor} cursor-pointer hover:opacity-80 truncate overflow-hidden`}
      title={`${formatTime(event.start)} • ${event.title}`}
    >
      <span className="truncate block">
        {formatTime(event.start)} • {event.title}
      </span>
    </div>
  );
};

export default EventCard;

