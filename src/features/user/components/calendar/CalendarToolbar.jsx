import React from 'react';
import { useDispatch } from 'react-redux';
import { openEventModal } from '../../calendarSlice';

const CalendarToolbar = ({
  currentView,
  currentDate,
  onViewChange,
  onNavigate,
  onToday,
  onSearch,
  onFilterChange,
  filters,
  events,
}) => {
  const dispatch = useDispatch();

  const viewButtons = [
    { id: 'month', label: 'Month' },
    { id: 'week', label: 'Week' },
    { id: 'day', label: 'Day' },
    { id: 'agenda', label: 'Agenda' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  const formatDate = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    const options = { 
      month: 'long', 
      year: 'numeric',
    };
    
    if (currentView === 'week') {
      const weekStart = new Date(d);
      weekStart.setDate(d.getDate() - ((d.getDay() + 6) % 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    
    if (currentView === 'day') {
      return d.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric',
        year: 'numeric',
      });
    }
    
    return d.toLocaleDateString('en-US', options);
  };

  const handleNewEvent = () => {
    dispatch(openEventModal(null));
  };

  const handleExport = () => {
    // Export to ICS file
    const icsContent = generateICS(events);
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bookings.ics';
    link.click();
    URL.revokeObjectURL(url);
  };

  const generateICS = (events) => {
    let ics = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Car Rental//Calendar//EN\n';
    events.forEach(event => {
      ics += 'BEGIN:VEVENT\n';
      ics += `UID:${event.id}@carrental.com\n`;
      ics += `DTSTART:${formatICSDate(event.start)}\n`;
      ics += `DTEND:${formatICSDate(event.end)}\n`;
      ics += `SUMMARY:${event.title}\n`;
      ics += `DESCRIPTION:${event.notes || ''}\n`;
      ics += 'END:VEVENT\n';
    });
    ics += 'END:VCALENDAR';
    return ics;
  };

  const formatICSDate = (date) => {
    const d = date instanceof Date ? date : new Date(date);
    return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-4">
      {/* Top Row: View Buttons & Navigation */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          {viewButtons.map(btn => (
            <button
              key={btn.id}
              onClick={() => onViewChange(btn.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentView === btn.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate(-1)}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            aria-label="Previous"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={onToday}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium"
          >
            Today
          </button>
          <button
            onClick={() => onNavigate(1)}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            aria-label="Next"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="px-4 py-2 text-gray-900 font-semibold min-w-[200px] text-center">
            {formatDate(currentDate)}
          </div>
        </div>
      </div>

      {/* Bottom Row: Search, Filters & Actions */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search bookings..."
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {statusOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <button
          onClick={handleNewEvent}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          + New Event
        </button>

        <button
          onClick={handleExport}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Export to Outlook
        </button>
      </div>
    </div>
  );
};

export default CalendarToolbar;

