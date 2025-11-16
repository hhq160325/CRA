import React from 'react';

const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-800 border-green-300',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    completed: 'bg-blue-100 text-blue-800 border-blue-300',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-300',
    overdue: 'bg-red-100 text-red-800 border-red-300',
  };
  return colors[status] || colors.pending;
};

const EventCard = ({ event, compact = false, onClick }) => {
  const statusColor = getStatusColor(event.status);

  const formatTime = (date) => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

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
      {event.car && (
        <div className="text-xs text-gray-500 mt-1">Car: {event.car}</div>
      )}
      <div className={`text-xs mt-2 px-2 py-1 rounded inline-block ${statusColor}`}>
        {event.status}
      </div>
    </div>
  );
};

export default EventCard;

