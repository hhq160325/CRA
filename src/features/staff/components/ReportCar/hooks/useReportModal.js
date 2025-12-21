import { useState } from 'react';

export const useReportModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const openModal = (report, modalType = 'view') => {
    console.log('Opening modal with report:', report, 'modalType:', modalType);
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedReport(null);
  };

  const handleRecallCar = (reportId, carId) => {
    // TODO: Implement API call to recall the car
    console.log('Recalling car for report:', reportId, 'Car ID:', carId);
    // You can add API call here when the endpoint is available
    // Example: await recallCar(reportId, carId);
    
    // Show confirmation or success message
    alert(`Car recall initiated for report ${reportId}`);
  };

  return {
    isModalOpen,
    selectedReport,
    openModal,
    closeModal,
    handleRecallCar
  };
};