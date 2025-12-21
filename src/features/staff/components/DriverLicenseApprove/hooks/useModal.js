import { useState } from 'react';

export const useModal = () => {
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (license) => {
    setSelectedLicense(license);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLicense(null);
  };

  return {
    selectedLicense,
    isModalOpen,
    openModal,
    closeModal
  };
};