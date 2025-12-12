import { useState } from 'react';
import RentalDetailsModal from './RentalDetailsModal';
import ExtendedBooking from './ExtendedBooking';
import RentalHistoryHeader from './RentalHistoryHeader';
import RentalHistoryFilters from './RentalHistoryFilters';
import RentalHistoryTable from './RentalHistoryTable';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import { useRentalHistory } from '../hooks/useRentalHistory';
import { useRentalFilters } from '../hooks/useRentalFilters';
import { getStatusBadge, getPaymentBadge } from '../utils/rentalUtils';

const RentalHistory = () => {
  const [selectedRental, setSelectedRental] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const itemsPerPage = 10;

  // Custom hooks
  const { rentalHistory, loading, error, fetchRentalHistory } = useRentalHistory();
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    carFilter,
    setCarFilter,
    bookingFeeStatusFilter,
    setBookingFeeStatusFilter,
    rentalFeeStatusFilter,
    setRentalFeeStatusFilter,
    additionalFeeStatusFilter,
    setAdditionalFeeStatusFilter,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    currentPage,
    setCurrentPage,
    carOptions,
    statusOptions,
    bookingFeeStatusOptions,
    rentalFeeStatusOptions,
    additionalFeeStatusOptions,
    filteredRentals,
    clearDateFilters
  } = useRentalFilters(rentalHistory);





  // Modal handlers
  const openModal = (rental) => {
    setSelectedRental(rental);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRental(null);
  };

  const openExtendModal = (rental) => {
    setSelectedRental(rental);
    setIsExtendModalOpen(true);
  };

  const closeExtendModal = () => {
    setIsExtendModalOpen(false);
    setSelectedRental(null);
  };

  const handleExtendSuccess = () => {
    fetchRentalHistory();
  };

  // Pagination calculations
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRentals = filteredRentals.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };



  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} onRetry={fetchRentalHistory} />;

  return (
    <>
      <div className="p-8 space-y-6 min-h-full bg-gray-50">
        <RentalHistoryHeader />
        
        <RentalHistoryFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          carFilter={carFilter}
          setCarFilter={setCarFilter}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          bookingFeeStatusFilter={bookingFeeStatusFilter}
          setBookingFeeStatusFilter={setBookingFeeStatusFilter}
          rentalFeeStatusFilter={rentalFeeStatusFilter}
          setRentalFeeStatusFilter={setRentalFeeStatusFilter}
          additionalFeeStatusFilter={additionalFeeStatusFilter}
          setAdditionalFeeStatusFilter={setAdditionalFeeStatusFilter}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          carOptions={carOptions}
          statusOptions={statusOptions}
          bookingFeeStatusOptions={bookingFeeStatusOptions}
          rentalFeeStatusOptions={rentalFeeStatusOptions}
          additionalFeeStatusOptions={additionalFeeStatusOptions}
          clearDateFilters={clearDateFilters}
        />

        <RentalHistoryTable
          paginatedRentals={paginatedRentals}
          currentPage={currentPage}
          totalItems={filteredRentals.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onViewDetails={openModal}
          onExtendBooking={openExtendModal}
        />
      </div>

      <RentalDetailsModal
        isOpen={isModalOpen}
        rental={selectedRental}
        onClose={closeModal}
        getStatusBadge={getStatusBadge}
        getPaymentBadge={getPaymentBadge}
        onExtendBooking={openExtendModal}
      />

      <ExtendedBooking
        isOpen={isExtendModalOpen}
        rental={selectedRental}
        onClose={closeExtendModal}
        onSuccess={handleExtendSuccess}
      />
    </>
  );
};

export default RentalHistory;

