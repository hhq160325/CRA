import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchUserBookings, setCurrentView, goToToday, navigateDate, setSearchQuery, setFilter } from '../../../maintenanceCalendarSlice';
import { selectIsAuthenticated } from '../../../../auth/authSlice';
import CalendarToolbar from './CalendarToolbar';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import AgendaView from './AgendaView';
import EventModal from './EventModal';
import DayEventsModal from './DayEventsModal';

const CalendarView = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { 
    currentView, 
    currentDate, 
    events, 
    loading, 
    isEventModalOpen,
    searchQuery,
    filters 
  } = useSelector(state => state.calendar || { 
    currentView: 'month',
    currentDate: new Date().toISOString(),
    events: [],
    loading: false,
    isEventModalOpen: false,
    searchQuery: '',
    filters: { status: 'all', car: 'all' }
  });

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserBookings());
    }
  }, [dispatch, isAuthenticated]);

  const handleViewChange = (view) => {
    dispatch(setCurrentView(view));
  };

  const handleNavigate = (direction) => {
    dispatch(navigateDate({ direction, view: currentView }));
  };

  const handleToday = () => {
    dispatch(goToToday());
  };

  const handleSearch = (query) => {
    dispatch(setSearchQuery(query));
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilter({ key, value }));
  };

  // Filter events based on search and filters
  const filteredEvents = events.filter(event => {
    const matchesSearch = !searchQuery || 
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.carName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.car?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.bookingId?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.pickupPlace?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.dropoffPlace?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || event.status === filters.status;
    const matchesCar = filters.car === 'all' || event.carName === filters.car || event.car === filters.car;
    
    return matchesSearch && matchesStatus && matchesCar;
  });

  const renderView = () => {
    switch (currentView) {
      case 'month':
        return <MonthView events={filteredEvents} currentDate={currentDate} />;
      case 'week':
        return <WeekView events={filteredEvents} currentDate={currentDate} />;
      case 'day':
        return <DayView events={filteredEvents} currentDate={currentDate} />;
      case 'agenda':
        return <AgendaView events={filteredEvents} currentDate={currentDate} />;
      default:
        return <MonthView events={filteredEvents} currentDate={currentDate} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-gray-500">{t('loadingCalendar')}</div>
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

      {isEventModalOpen && <EventModal />}
      <DayEventsModal />
    </div>
  );
};

export default CalendarView;

