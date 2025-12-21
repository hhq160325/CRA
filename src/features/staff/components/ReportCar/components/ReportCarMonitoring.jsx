import { useState } from 'react';
import { useSelector } from 'react-redux';
import ReportDetailsModal from '../modals/ReportDetailsModal';
import ReportCarHeader from './ReportCarHeader';
import ReportCarFilters from './ReportCarFilters';
import ReportCarTable from './ReportCarTable';
import { useReportCarData } from '../hooks/useReportCarData';
import { useReportCarFilters } from '../hooks/useReportCarFilters';
import { useReportModal } from '../hooks/useReportModal';


const ReportCarMonitoring = () => {
  const bookingActivities = useSelector((state) => state.staff.bookingActivities);
  const loading = useSelector((state) => state.staff.loading.bookings);
  const [currentPage, setCurrentPage] = useState(1);

  // Log the data to see what we're getting
  console.log('bookingActivities (actually reports):', bookingActivities);
  console.log('loading:', loading);

  // Initialize hooks
  useReportCarData();
  const filterProps = useReportCarFilters(bookingActivities);
  const modalProps = useReportModal();

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="p-8 space-y-6 min-h-full bg-gray-50">
        <ReportCarHeader />

        <ReportCarFilters
          {...filterProps}
          filteredCount={filterProps.filteredBookings.length}
          totalCount={bookingActivities.length}
        />

        <ReportCarTable
          bookings={filterProps.filteredBookings}
          loading={loading}
          currentPage={currentPage}
          itemsPerPage={10}
          onPageChange={handlePageChange}
          onOpenModal={modalProps.openModal}
        />
      </div>
      
      <ReportDetailsModal
        isOpen={modalProps.isModalOpen}
        onClose={modalProps.closeModal}
        selectedReport={modalProps.selectedReport}
        onRecallCar={modalProps.handleRecallCar}
      />
    </>
  );
};

export default ReportCarMonitoring;