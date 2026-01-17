import { useState } from 'react';
import { useTranslation } from 'react-i18next';
// COMMENTED OUT: Car owner modal functionality
// import { CarOwnerModal } from './modals/carOwnerModal';
import StaffHeader from './StaffHeader';
import StaffFilters from './StaffFilters';
import StaffTable from './StaffTable';
import { useStaffData } from '../hooks/useStaffData';
import { useStaffFilters } from '../hooks/useStaffFilters';
import { useStaffModal } from '../hooks/useStaffModal';
// import { getStatusBadge } from '../utils/staffUtils';

const StaffManagement = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Initialize hooks
  const { staffMembers, loading, error } = useStaffData();
  const filterProps = useStaffFilters(staffMembers);
  const modalProps = useStaffModal();

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExportData = () => {
    // TODO: Implement export functionality
    // console.log('Exporting staff data...');
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6 min-h-full bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t('loading') || 'Loading...'}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 space-y-6 min-h-full bg-gray-50">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <svg className="w-12 h-12 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="mt-4 text-gray-600">{t('failedToLoadStaffData')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 min-h-full bg-gray-50">
      {/* Header */}
      <StaffHeader onExportData={handleExportData} />

      {/* Filters */}
      <StaffFilters
        {...filterProps}
        filteredCount={filterProps.filteredStaff.length}
        totalCount={staffMembers.length}
      />

      {/* Staff Table */}
      <StaffTable
        staffMembers={filterProps.filteredStaff}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onOpenModal={modalProps.openModal}
      />

      {/* COMMENTED OUT: Car Owner Modal functionality */}
      {/* <CarOwnerModal
        isOpen={modalProps.isModalOpen}
        onClose={modalProps.closeModal}
        selectedOwner={modalProps.selectedStaff}
        modalType={modalProps.modalType}
        onEdit={modalProps.handleEdit}
        onSuspend={modalProps.handleSuspend}
        onChangeModalType={modalProps.handleChangeModalType}
        getStatusBadge={getStatusBadge}
      /> */}
    </div>
  );
};

export default StaffManagement;