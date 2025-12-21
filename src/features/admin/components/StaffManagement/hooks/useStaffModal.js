import { useState } from 'react';
import { useDispatch } from 'react-redux';
// COMMENTED OUT: Car owner status update functionality
// import { updateCarOwnerStatus } from '../../../../adminSlice';

export const useStaffModal = () => {
  const dispatch = useDispatch();
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [modalType, setModalType] = useState(null); // 'view', 'edit', 'suspend'
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (staff, type) => {
    setSelectedStaff(staff);
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStaff(null);
    setModalType(null);
  };

  const handleStatusChange = (staffId, newStatus) => {
    // COMMENTED OUT: Redux action for updating car owner status
    // dispatch(updateCarOwnerStatus({ id: staffId, status: newStatus }));
    console.log('Status change requested:', staffId, newStatus);
    // TODO: Implement staff status update API call
  };

  const handleSuspend = () => {
    if (selectedStaff) {
      handleStatusChange(selectedStaff.id, 'suspended');
      closeModal();
    }
  };

  const handleEdit = (formData) => {
    // Handle edit logic here
    console.log('Editing staff:', selectedStaff.id, formData);
    closeModal();
  };

  const handleChangeModalType = (type) => {
    setModalType(type);
  };

  return {
    selectedStaff,
    modalType,
    isModalOpen,
    openModal,
    closeModal,
    handleSuspend,
    handleEdit,
    handleChangeModalType,
    handleStatusChange
  };
};