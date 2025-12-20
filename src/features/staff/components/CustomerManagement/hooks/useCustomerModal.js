import { useState } from 'react';

export const useCustomerModal = () => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (customer, type) => {
    setSelectedCustomer(customer);
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
    setModalType(null);
  };

  const changeModalType = (type) => {
    setModalType(type);
  };

  return {
    selectedCustomer,
    modalType,
    isModalOpen,
    openModal,
    closeModal,
    changeModalType
  };
};