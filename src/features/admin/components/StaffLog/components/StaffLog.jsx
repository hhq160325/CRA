import { useState } from 'react';
import Pagination from '../../../../../shared/components/Pagination';
import { useStaffLogs } from '../hooks/useStaffLogs';
import { useStaffLogFilters } from '../hooks/useStaffLogFilters';
import { useStaffLogModal } from '../hooks/useStaffLogModal';
import StaffLogHeader from './StaffLogHeader';
import StaffLogFilters from './StaffLogFilters';
import StaffLogTable from './StaffLogTable';
import StaffLogModal from './StaffLogModal';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';

const StaffLog = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Custom hooks
  const { staffLogs, staffMap, loading, error } = useStaffLogs();
  const {
    searchTerm,
    setSearchTerm,
    actionFilter,
    setActionFilter,
    filteredLogs
  } = useStaffLogFilters(staffLogs, staffMap);
  const { selectedLog, isModalOpen, openModal, closeModal } = useStaffLogModal();

  // Pagination calculations
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredLogs.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading and error states
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <>
      <div className="p-8 space-y-6 space-y-reverse-0 min-h-full bg-gray-50">
        <StaffLogHeader />

        <StaffLogFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          actionFilter={actionFilter}
          setActionFilter={setActionFilter}
          filteredCount={filteredLogs.length}
          totalCount={staffLogs.length}
        />

        <StaffLogTable
          logs={currentItems}
          staffMap={staffMap}
          onViewLog={openModal}
        />

        {filteredLogs.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalItems={filteredLogs.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      <StaffLogModal
        isOpen={isModalOpen}
        log={selectedLog}
        staffMap={staffMap}
        onClose={closeModal}
      />
    </>
  );
};

export default StaffLog;