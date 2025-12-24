import React from 'react';
import { useTranslation } from 'react-i18next';

const getStatusColor = (status) => {
  const colors = {
    // Maintenance schedule statuses
    upcoming: 'bg-blue-100 text-blue-800 border-blue-300',
    due: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'in maintenance': 'bg-purple-100 text-purple-800 border-purple-300',
    inMaintenance: 'bg-purple-100 text-purple-800 border-purple-300',
    overdue: 'bg-red-100 text-red-800 border-red-300',
    completed: 'bg-green-100 text-green-800 border-green-300',
    // Legacy booking statuses (fallback)
    // Active: 'bg-blue-100 text-blue-800 border-blue-300',
    Active: 'bg-purple-100 text-purple-800 border-purple-300',
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Confirmed: 'bg-green-100 text-green-800 border-green-300',
    Completed: 'bg-purple-100 text-purple-800 border-purple-300',
    Cancelled: 'bg-red-100 text-red-800 border-red-300',
    Rejected: 'bg-gray-100 text-gray-800 border-gray-300',
  };
  return colors[status] || colors.upcoming;
};

const EventCard = ({ event, compact = false, onClick, date }) => {
  const { t } = useTranslation();
  
  // For maintenance schedules, use the status directly
  const displayStatus = event.status || 'upcoming';
  const statusColor = getStatusColor(displayStatus);

  const formatTime = (date) => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Format status for display
  const formatStatus = (status) => {
    if (status === 'inMaintenance' || status === 'in maintenance') {
      return 'In Maintenance';
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
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
        className={`text-xs px-2 py-1 rounded border ${statusColor} cursor-pointer hover:opacity-80 truncate`}
        title={event.title}
      >
        {formatTime(event.start)} • {event.title}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`p-3 rounded-lg border ${statusColor} cursor-pointer hover:shadow-md transition-shadow`}
    >
      <div className="font-semibold text-sm mb-1">{event.title}</div>
      <div className="text-xs text-gray-600">
        {formatTime(event.start)} - {formatTime(event.end)}
      </div>
      {event.carName && (
        <div className="text-xs text-gray-500 mt-1">
          {t('car') || 'Car'}: {event.carName}
        </div>
      )}
      {event.scheduleType && (
        <div className="text-xs text-gray-500 mt-1">
          {t('type') || 'Type'}: {event.scheduleType}
        </div>
      )}
      <div className={`text-xs mt-2 px-2 py-1 rounded inline-block ${statusColor}`}>
        {formatStatus(displayStatus)}
      </div>
    </div>
  );
};

export default EventCard;

