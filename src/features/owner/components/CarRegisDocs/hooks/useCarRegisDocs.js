import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { getUserIdFromToken } from '../../../../user/api';
import { carRegisDocsService } from '../services/carRegisDocsService';

export const useCarRegisDocs = () => {
  const { t } = useTranslation();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showTooltip, setShowTooltip] = useState(null);
  const [uploadingCarId, setUploadingCarId] = useState(null);
  const [uploadSuccessCarId, setUploadSuccessCarId] = useState(null);
  
  const currentUserId = getUserIdFromToken();
  const carsPerPage = 5;

  const fetchCars = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userCars = await carRegisDocsService.fetchUserCars(currentUserId);
      setCars(userCars);
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError(t('carRegisDocs.loadingError'));
    } finally {
      setLoading(false);
    }
  }, [currentUserId, t]);

  const handleFileUpload = async (carId, files) => {
    if (!files || files.length === 0) return;

    try {
      setUploadingCarId(carId);
      setUploadSuccessCarId(null);
      
      await carRegisDocsService.uploadDocuments(carId, currentUserId, files);
      
      setUploadSuccessCarId(carId);
      await fetchCars();
      
      setTimeout(() => {
        setUploadSuccessCarId(null);
      }, 3000);
    } catch (err) {
      console.error('Error uploading documents:', err);
      alert(t('carRegisDocs.uploadError'));
    } finally {
      setUploadingCarId(null);
    }
  };

  const filteredCars = cars.filter(car => {
    if (filter === 'all') return true;
    if (filter === 'pending') return car.status === 'Pending';
    if (filter === 'approved') return car.status === 'Active';
    return true;
  });

  // Pagination calculations
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  return {
    // State
    cars,
    loading,
    error,
    filter,
    currentPage,
    showTooltip,
    uploadingCarId,
    uploadSuccessCarId,
    filteredCars,
    currentCars,
    carsPerPage,
    
    // Actions
    setFilter,
    setCurrentPage,
    setShowTooltip,
    handleFileUpload,
    fetchCars
  };
};