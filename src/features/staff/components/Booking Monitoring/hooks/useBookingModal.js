import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateBookingStatus } from '../../../staffSlice';

export const useBookingModal = () => {
  const dispatch = useDispatch();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleStatusUpdate = (bookingId, newStatus, notes = '') => {
    dispatch(updateBookingStatus({ id: bookingId, status: newStatus, notes }));
  };

  const openModal = (booking, type) => {
    setSelectedBooking(booking);
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
    setModalType(null);
  };

  const handleCancel = (reason) => {
    if (selectedBooking) {
      handleStatusUpdate(selectedBooking.id, 'cancelled', reason);
      closeModal();
    }
  };

  const handleResolve = () => {
    if (selectedBooking) {
      handleStatusUpdate(selectedBooking.id, 'completed');
      closeModal();
    }
  };

  const handleEdit = (formData) => {
    console.log('Editing booking:', selectedBooking.id, formData);
    closeModal();
  };

  const handleChangeModalType = (newType) => {
    setModalType(newType);
  };

  return {
    selectedBooking,
    modalType,
    isModalOpen,
    openModal,
    closeModal,
    handleCancel,
    handleResolve,
    handleEdit,
    handleChangeModalType
  };
};