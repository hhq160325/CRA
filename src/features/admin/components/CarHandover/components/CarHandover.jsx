import { useCarHandoverData } from '../hooks/useCarHandoverData';
import { useCarHandoverFilters } from '../hooks/useCarHandoverFilters';
import { useModal } from '../hooks/useModal';
import { usePagination } from '../hooks/usePagination';
import CarHandoverHeader from './CarHandoverHeader';
import CarHandoverFilters from './CarHandoverFilters';
import CarHandoverTable from './CarHandoverTable';
import CarHandoverModal from './CarHandoverModal';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';

const CarHandover = () => {
  // Custom hooks
  const { carHandoverLogs, staffMap, loading, error } = useCarHandoverData();
  const { searchTerm, setSearchTerm, actionFilter, setActionFilter, filteredLogs } = useCarHandoverFilters(carHandoverLogs, staffMap);
  const { selectedLog, isModalOpen, openModal, closeModal } = useModal();
  const { currentPage, currentItems, handlePageChange, totalItems } = usePagination(filteredLogs, 10);

  // Loading and error states
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="p-8 space-y-6 space-y-reverse-0 min-h-full bg-gray-50">
      <CarHandoverHeader />
      
      <CarHandoverFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        actionFilter={actionFilter}
        setActionFilter={setActionFilter}
        filteredCount={filteredLogs.length}
        totalCount={carHandoverLogs.length}
      />

      <CarHandoverTable
        currentItems={currentItems}
        staffMap={staffMap}
        openModal={openModal}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={10}
        onPageChange={handlePageChange}
      />

      <CarHandoverModal
        isOpen={isModalOpen}
        selectedLog={selectedLog}
        staffMap={staffMap}
        onClose={closeModal}
      />
    </div>
  );
};

export default CarHandover;