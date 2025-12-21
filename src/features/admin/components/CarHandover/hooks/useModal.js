import { useState } from 'react';

export const useModal = () => {
  const [selectedLog, setSelectedLog] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (log) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLog(null);
  };

  return {
    selectedLog,
    isModalOpen,
    openModal,
    closeModal
  };
};