import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { maintenanceScheduleApi } from '../../MaintenanceSchedule/api/maintenanceScheduleApi';
import { maintenanceScheduleService } from '../../MaintenanceSchedule/services/maintenanceScheduleService';
import { getStatusBadge, getPriorityBadge } from '../../MaintenanceSchedule/utils/badgeUtils';
import { selectIsAuthenticated } from '../../../../auth/authSlice';
import { useSelector } from 'react-redux';
import CalendarToolbar from './CalendarToolbar';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import AgendaView from './AgendaView';
import MaintenanceDetailsModal from '../../MaintenanceSchedule/components/MaintenanceDetailsModal';
import DayEventsModal from './DayEventsModal';

const CalendarView = () => {
  const { t } = useTranslation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Local state management instead of Redux
  const [currentView, setCurrentView] = useState('month');
  const [currentDate, setCurrentDate] = useState(new Date().toISOString());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ car: 'all' }); // Removed status filter since only showing Active
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  // Transform maintenance schedules to calendar events
  const transformToCalendarEvents = (schedules) => {
    return schedules.map(schedule => {
      console.log("schedules",schedules);
      
      // Use the already formatted dates and times from the service
      let startDate, endDate;
      
      if (schedule.startDateMaintenanceDate !== 'N/A') {
        const timeStr = schedule.pickupTime !== 'N/A' ? schedule.pickupTime : '09:00';
        startDate = new Date(`${schedule.startDateMaintenanceDate}T${timeStr}:00`);
      } else {
        startDate = new Date();
      }
      
      if (schedule.endDateMaintenanceDate !== 'N/A') {
        const timeStr = schedule.returnTime !== 'N/A' ? schedule.returnTime : '17:00';
        endDate = new Date(`${schedule.endDateMaintenanceDate}T${timeStr}:00`);
      } else {
        endDate = new Date();
      }
      
      return {
        id: schedule.scheduleId || schedule.id,
        title: `${schedule.scheduleTitle || schedule.maintenanceType} - ${schedule.carName}`,
        start: startDate,
        end: endDate,
        allDay: false,
        // Store full schedule details for modal display (pass the original schedule data)
        ...schedule
      };
    });
  };

  // Fetch maintenance schedules directly
  const fetchMaintenanceSchedules = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch raw data from API (same as maintenance schedule table)
      const carSchedulesData = await maintenanceScheduleApi();
      
      // Process and format the data using the same service
      const formattedSchedules = maintenanceScheduleService(carSchedulesData, t);
      
      // Filter to only show schedules with status "Active" (in maintenance)
      const activeSchedules = formattedSchedules.filter(schedule => schedule.status === 'Active');
      
      // Transform to calendar events
      const calendarEvents = transformToCalendarEvents(activeSchedules);
      
      setEvents(calendarEvents);
    } catch (err) {
      console.error('Error fetching maintenance schedules:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMaintenanceSchedules();
    }
  }, [isAuthenticated, t]);

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const handleNavigate = (direction) => {
    const date = new Date(currentDate);
    
    if (currentView === 'month') {
      date.setMonth(date.getMonth() + direction);
    } else if (currentView === 'week') {
      date.setDate(date.getDate() + (direction * 7));
    } else if (currentView === 'day') {
      date.setDate(date.getDate() + direction);
    }
    
    setCurrentDate(date.toISOString());
  };

  const handleToday = () => {
    setCurrentDate(new Date().toISOString());
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const openEventModal = (event) => {
    setSelectedEvent(event);
    setIsEventModalOpen(true);
  };

  const closeEventModal = () => {
    setIsEventModalOpen(false);
    setSelectedEvent(null);
  };

  const handleScheduleMaintenance = (schedule) => {
    // Handle schedule maintenance logic
    closeEventModal();
  };

  const handleMarkCompleted = (scheduleId) => {
    // Handle mark as completed logic
    closeEventModal();
  };

  // Filter events based on search and filters (status is always Active)
  const filteredEvents = events.filter(event => {
    const matchesSearch = !searchQuery || 
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.carName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.scheduleTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.licensePlate?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Only show Active schedules (already filtered in fetchMaintenanceSchedules)
    // Remove status filter since we only show Active schedules
    const matchesCar = filters.car === 'all' || event.carName === filters.car;
    
    return matchesSearch && matchesCar;
  });

  const renderView = () => {
    const viewProps = {
      events: filteredEvents,
      currentDate,
      onEventClick: openEventModal
    };

    switch (currentView) {
      case 'month':
        return <MonthView {...viewProps} />;
      case 'week':
        return <WeekView {...viewProps} />;
      case 'day':
        return <DayView {...viewProps} />;
      case 'agenda':
        return <AgendaView {...viewProps} />;
      default:
        return <MonthView {...viewProps} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">{t('loadingCalendar') || 'Loading calendar...'}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <CalendarToolbar
        currentView={currentView}
        currentDate={currentDate}
        onViewChange={handleViewChange}
        onNavigate={handleNavigate}
        onToday={handleToday}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        filters={filters}
        events={events}
      />
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
        {renderView()}
      </div>

      {isEventModalOpen && (
        <MaintenanceDetailsModal
          isOpen={isEventModalOpen}
          selectedCar={selectedEvent}
          onClose={closeEventModal}
          onScheduleMaintenance={handleScheduleMaintenance}
          onMarkCompleted={handleMarkCompleted}
          getStatusBadge={getStatusBadge}
          getPriorityBadge={getPriorityBadge}
        />
      )}
      <DayEventsModal />
    </div>
  );
};

export default CalendarView;

