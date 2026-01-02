import { useState, useEffect } from 'react';
import { parkLotRevenueService } from '../services/parkLotRevenueService';

export const useParkLotRevenueData = (selectedPeriod, selectedParkLot) => {
  const [revenueStats, setRevenueStats] = useState({
    totalRevenue: 0
  });
  const [chartData, setChartData] = useState([]);
  const [parkLots, setParkLots] = useState([]);
  const [revenueLoading, setRevenueLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch park lots on component mount
  useEffect(() => {
    const fetchParkLots = async () => {
      try {
        const parkLotsData = await parkLotRevenueService.getAllParkLots();
        setParkLots(parkLotsData);
      } catch (err) {
        console.error('Error fetching park lots:', err);
        setError('Failed to load park lots');
      }
    };

    fetchParkLots();
  }, []);

  // Fetch revenue data when period or park lot changes
  useEffect(() => {
    const fetchRevenueData = async () => {
      if (parkLots.length === 0) return; // Wait for park lots to load first
      
      setRevenueLoading(true);
      setError(null);

      try {
        let revenueData;
        
        if (selectedParkLot === 'all') {
          // Fetch revenue for all park lots
          revenueData = await parkLotRevenueService.getAllParkLotsRevenue(selectedPeriod);
        } else {
          // Fetch revenue for specific park lot
          revenueData = await parkLotRevenueService.getParkLotRevenue(selectedParkLot, selectedPeriod);
        }

        setRevenueStats({
          totalRevenue: revenueData.totalRevenue
        });
        setChartData(revenueData.chartData);
      } catch (err) {
        console.error('Error fetching revenue data:', err);
        setError('Failed to load revenue data');
        setRevenueStats({ totalRevenue: 0 });
        setChartData([]);
      } finally {
        setRevenueLoading(false);
      }
    };

    fetchRevenueData();
  }, [selectedPeriod, selectedParkLot, parkLots]);

  return {
    revenueStats,
    chartData,
    parkLots,
    revenueLoading,
    error
  };
};