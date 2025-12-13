import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { maintenanceScheduleApi } from '../api/maintenanceScheduleApi';
import { maintenanceScheduleService } from '../services/maintenanceScheduleService';

export const useMaintenanceSchedule = () => {
  const { t } = useTranslation();
  const [maintenanceSchedules, setMaintenanceSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMaintenanceSchedules = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch raw data from API
      const carSchedulesData = await maintenanceScheduleApi();
      
      // Process and format the data
      const formattedSchedules = maintenanceScheduleService(carSchedulesData, t);
      
      setMaintenanceSchedules(formattedSchedules);
    } catch (err) {
      console.error('Error fetching maintenance schedules:', err);
      setError(t('maintenanceSchedule.errorLoadingSchedules'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceSchedules();
  }, []);

  return {
    maintenanceSchedules,
    loading,
    error,
    refetch: fetchMaintenanceSchedules
  };
};