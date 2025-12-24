import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import RentalDetailsModal from './RentalDetailsModal';
import ExtendedBooking from './ExtendedBooking';
import RentalHistoryHeader from './RentalMonitoringHeader';
import RentalHistoryFilters from './RentalMonitoringFilters';
import RentalHistoryTable from './RentalMonitoringTable';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import { useRentalMonitoring } from '../hooks/useRentalMonitoring';
import { useRentalFilters } from '../hooks/useRentalFilters';
import { getStatusBadge, getPaymentBadge, useTranslateStatus } from '../utils/rentalUtils';
import { exportFilteredToCSV } from '../utils/csvExport';

const RentalMonitoring = () => {
  const { t } = useTranslation();
  const translateStatus = useTranslateStatus();
  const [selectedRental, setSelectedRental] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExtendModalOpen, setIsExtendModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const itemsPerPage = 10;

  // Custom hooks
  const { rentalHistory, loading, error, fetchRentalHistory } = useRentalMonitoring();
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
    extendBookingFeeStatusFilter,
    setExtendBookingFeeStatusFilter,
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
    extendBookingFeeStatusOptions,
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

  // CSV Export handler
  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportFilteredToCSV(filteredRentals, t, translateStatus);
    } catch (error) {
      console.error('Export failed:', error);
      alert(t('rentalHistory.exportFailed'));
    } finally {
      setIsExporting(false);
    }
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
        <RentalHistoryHeader 
          onExport={handleExport}
          isExporting={isExporting}
        />
        
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
          extendBookingFeeStatusFilter={extendBookingFeeStatusFilter}
          setExtendBookingFeeStatusFilter={setExtendBookingFeeStatusFilter}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          carOptions={carOptions}
          statusOptions={statusOptions}
          bookingFeeStatusOptions={bookingFeeStatusOptions}
          rentalFeeStatusOptions={rentalFeeStatusOptions}
          additionalFeeStatusOptions={additionalFeeStatusOptions}
          extendBookingFeeStatusOptions={extendBookingFeeStatusOptions}
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

export default RentalMonitoring;

