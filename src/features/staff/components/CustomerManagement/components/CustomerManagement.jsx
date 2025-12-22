import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCustomerAccount } from '../../../staffSlice';
import { CustomerModal } from '../../modals/customerModal';

// Custom hooks
import { useCustomers } from '../hooks/useCustomers';
import { useCustomerFilters } from '../hooks/useCustomerFilters';
import { useCustomerModal } from '../hooks/useCustomerModal';

// Components
import CustomerHeader from './CustomerHeader';
import CustomerFilters from './CustomerFilters';
import CustomerTable from './CustomerTable';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';

// Utils
import { getStatusBadge, getVerificationBadge } from '../utils/customerUtils';

const CustomerManagement = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Custom hooks
  const { customers, loading, error } = useCustomers();
  const { searchTerm, setSearchTerm, statusFilter, setStatusFilter, filteredCustomers } = useCustomerFilters(customers);
  const { selectedCustomer, modalType, isModalOpen, openModal, closeModal, changeModalType } = useCustomerModal();

  // Customer actions
  const handleAccountUpdate = (customerId, updates) => {
    dispatch(updateCustomerAccount({ id: customerId, updates }));
  };

  const handleSuspend = () => {
    if (selectedCustomer) {
      handleAccountUpdate(selectedCustomer.id, { status: 'suspended' });
      closeModal();
    }
  };

  const handleEdit = (formData) => {
    if (selectedCustomer) {
      handleAccountUpdate(selectedCustomer.id, formData);
      closeModal();
    }
  };

  // Table actions
  const handleViewCustomer = (customer) => openModal(customer, 'view');
  const handleEditCustomer = (customer) => openModal(customer, 'edit');
  const handleSuspendCustomer = (customer) => openModal(customer, 'suspend');
  const handleActivateCustomer = (customer) => {
    handleAccountUpdate(customer.id, { status: 'active' });
  };
  const handleReportUser = (customer) => {
    // This function can be used to refresh customer data after reporting
    // or perform any additional actions needed after a user is reported
    console.log('User reported:', customer);
  };

  // Pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Loading and error states
  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;

  return (
    <div className="p-8 space-y-6 min-h-full bg-gray-50">
      <CustomerHeader />

      <CustomerFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        filteredCount={filteredCustomers.length}
        totalCount={customers.length}
      />

      <CustomerTable
        customers={filteredCustomers}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onViewCustomer={handleViewCustomer}
        onEditCustomer={handleEditCustomer}
        onSuspendCustomer={handleSuspendCustomer}
        onActivateCustomer={handleActivateCustomer}
        onReportUser={handleReportUser}
        getStatusBadge={getStatusBadge}
        getVerificationBadge={getVerificationBadge}
      />

      <CustomerModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedCustomer={selectedCustomer}
        modalType={modalType}
        onEdit={handleEdit}
        onSuspend={handleSuspend}
        onChangeModalType={changeModalType}
        getStatusBadge={getStatusBadge}
        getVerificationBadge={getVerificationBadge}
      />
    </div>
  );
};

export default CustomerManagement;