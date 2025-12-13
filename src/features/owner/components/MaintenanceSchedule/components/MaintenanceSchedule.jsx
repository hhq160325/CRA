import { useState } from 'react';
import { useMaintenanceSchedule } from '../hooks/useMaintenanceSchedule';
import { getStatusBadge, getPriorityBadge } from '../utils/badgeUtils';
import MaintenanceScheduleHeader from './MaintenanceScheduleHeader';
import MaintenanceScheduleFilters from './MaintenanceScheduleFilters';
import MaintenanceScheduleTable from './MaintenanceScheduleTable';
import MaintenanceDetailsModal from './MaintenanceDetailsModal';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import NoMaintenanceCars from './NoMaintenanceCars';
import NoResultsFound from './NoResultsFound';

const MaintenanceSchedule = () => {
  const { maintenanceSchedules, loading, error, refetch } = useMaintenanceSchedule();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleFormData, setScheduleFormData] = useState({
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    note: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const handleViewDetails = (car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCar(null);
  };

  const handleMarkCompleted = (id) => {
    // Handle mark as completed logic
    console.log('Marking maintenance as completed for car:', id);
    handleCloseModal();
  };

  const handleScheduleMaintenance = (schedule) => {
    // Open schedule modal with car info
    setSelectedCar(schedule);
    setIsScheduleModalOpen(true);
    setIsModalOpen(false);

    // Pre-fill form with existing data if available
    if (schedule.startDateMaintenanceDate !== 'N/A') {
      setScheduleFormData({
        title: schedule.maintenanceType || '',
        location: '',
        startDate: schedule.startDateMaintenanceDate,
        endDate: schedule.endDateMaintenanceDate,
        note: ''
      });
    }
  };

  const handleCloseScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setSelectedCar(null);
    setScheduleFormData({
      title: '',
      location: '',
      startDate: '',
      endDate: '',
      note: ''
    });
  };
  // Filter and pagination logic
  const filteredSchedules = maintenanceSchedules.filter(schedule => {
    const matchesSearch = schedule.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.carId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || schedule.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredSchedules.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSchedules = filteredSchedules.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setCurrentPage(1);
  };

  // Loading and error states
  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  // No maintenance cars state
  if (maintenanceSchedules.length === 0) {
    return <NoMaintenanceCars />;
  }

  return (
    <>
      <div className="p-8 space-y-6 min-h-full bg-gray-50">
        <MaintenanceScheduleHeader />
        
        <MaintenanceScheduleFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          filteredCount={filteredSchedules.length}
          totalCount={maintenanceSchedules.length}
        />

        {filteredSchedules.length === 0 ? (
          <NoResultsFound onClearFilters={handleClearFilters} />
        ) : (
          <MaintenanceScheduleTable
            paginatedSchedules={paginatedSchedules}
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onViewDetails={handleViewDetails}
            onMarkCompleted={handleMarkCompleted}
            getStatusBadge={getStatusBadge}
            getPriorityBadge={getPriorityBadge}
          />
        )}
      </div>

      <MaintenanceDetailsModal
        isOpen={isModalOpen}
        selectedCar={selectedCar}
        onClose={handleCloseModal}
        onScheduleMaintenance={handleScheduleMaintenance}
        onMarkCompleted={handleMarkCompleted}
        getStatusBadge={getStatusBadge}
        getPriorityBadge={getPriorityBadge}
      />
    </>
  );
};

export default MaintenanceSchedule;

