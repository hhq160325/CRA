import { useState } from 'react';
import { useSelector } from 'react-redux';
import BookingModal from '../../modals/bookingModal/BookingModal';
import BookingHeader from './BookingHeader';
import BookingFilters from './BookingFilters';
import BookingTable from './BookingTable';
import { useBookingData } from '../hooks/useBookingData';
import { useBookingFilters } from '../hooks/useBookingFilters';
import { useBookingModal } from '../hooks/useBookingModal';
import { getStatusBadge, getPaymentBadge } from '../utils/bookingUtils';


const BookingMonitoring = () => {
  const bookingActivities = useSelector((state) => state.staff.bookingActivities);
  const loading = useSelector((state) => state.staff.loading.bookings);
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize hooks
  useBookingData();
  const filterProps = useBookingFilters(bookingActivities);
  const modalProps = useBookingModal();

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <div className="p-8 space-y-6 min-h-full bg-gray-50">
        <BookingHeader filteredBookings={filterProps.filteredBookings} />

        <BookingFilters
          {...filterProps}
          filteredCount={filterProps.filteredBookings.length}
          totalCount={bookingActivities.length}
        />

        <BookingTable
          bookings={filterProps.filteredBookings}
          loading={loading}
          currentPage={currentPage}
          itemsPerPage={10}
          onPageChange={handlePageChange}
          onOpenModal={modalProps.openModal}
        />
      </div>
      <BookingModal
        isOpen={modalProps.isModalOpen}
        onClose={modalProps.closeModal}
        selectedBooking={modalProps.selectedBooking}
        modalType={modalProps.modalType}
        onEdit={modalProps.handleEdit}
        onCancel={modalProps.handleCancel}
        onResolve={modalProps.handleResolve}
        onChangeModalType={modalProps.handleChangeModalType}
        getStatusBadge={getStatusBadge}
        getPaymentBadge={getPaymentBadge}
      />
    </>
  );
};

export default BookingMonitoring;