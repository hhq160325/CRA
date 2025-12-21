import { useDriverLicenseData } from '../hooks/useDriverLicenseData';
import { useDriverLicenseFilters } from '../hooks/useDriverLicenseFilters';
import { useDriverLicenseActions } from '../hooks/useDriverLicenseActions';
import { useModal } from '../hooks/useModal';
import { usePagination } from '../hooks/usePagination';
import DriverLicenseHeader from './DriverLicenseHeader';
import DriverLicenseFilters from './DriverLicenseFilters';
import DriverLicenseTable from './DriverLicenseTable';
import DriverLicenseModal from './DriverLicenseModal';

const DriverLicenseApprove = () => {
  // Custom hooks
  const { driverLicenses, setDriverLicenses } = useDriverLicenseData();
  const { searchTerm, setSearchTerm, statusFilter, setStatusFilter, filteredLicenses } = useDriverLicenseFilters(driverLicenses);
  const { handleApprove, handleReject } = useDriverLicenseActions(setDriverLicenses);
  const { selectedLicense, isModalOpen, openModal, closeModal } = useModal();
  const { currentPage, currentItems, handlePageChange, totalItems } = usePagination(filteredLicenses, 20);

  return (
    <>
      <div className="p-8 space-y-6 min-h-full bg-gray-50">
        <DriverLicenseHeader />

        <DriverLicenseFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          filteredCount={filteredLicenses.length}
          totalCount={driverLicenses.length}
        />

        <DriverLicenseTable
          currentItems={currentItems}
          openModal={openModal}
          handleApprove={handleApprove}
          handleReject={handleReject}
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={20}
          onPageChange={handlePageChange}
          driverLicenses={driverLicenses}
        />
      </div>
      <DriverLicenseModal
        isOpen={isModalOpen}
        selectedLicense={selectedLicense}
        onClose={closeModal}
        handleApprove={handleApprove}
        handleReject={handleReject}
        driverLicenses={driverLicenses}
      />
    </>
  );
};

export default DriverLicenseApprove;
