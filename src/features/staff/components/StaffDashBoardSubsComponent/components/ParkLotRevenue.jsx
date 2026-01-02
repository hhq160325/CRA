import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useParkLotRevenueData } from '../hooks/useParkLotRevenueData';

const ParkLotRevenue = () => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedParkLot, setSelectedParkLot] = useState('all');
  
  // Use the hook with the selected period and park lot
  const { 
    revenueStats, 
    chartData, 
    parkLots, 
    revenueLoading, 
    error 
  } = useParkLotRevenueData(selectedPeriod, selectedParkLot);

  // Log when park lot selection changes
  useEffect(() => {
    console.log('Park Lot Selection Changed:', {
      selectedParkLot,
      selectedParkLotName: getSelectedParkLotName(),
      selectedPeriod,
      timestamp: new Date().toISOString()
    });
  }, [selectedParkLot, selectedPeriod]);

  // Log revenue data changes
  useEffect(() => {
    if (!revenueLoading && revenueStats) {
      console.log('Revenue Data Updated:', {
        selectedParkLot,
        selectedPeriod,
        totalRevenue: revenueStats.totalRevenue,
        chartDataPoints: chartData?.length || 0,
        formattedRevenue: formatVND(revenueStats.totalRevenue),
        timestamp: new Date().toISOString()
      });
    }
  }, [revenueStats, chartData, revenueLoading, selectedParkLot, selectedPeriod]);

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Get bar color based on period
  const getBarColor = () => {
    switch (selectedPeriod) {
      case '7days':
        return '#3b82f6'; // Blue
      case '7months':
        return '#10b981'; // Green
      case '7years':
        return '#f59e0b'; // Amber
      default:
        return '#3b82f6';
    }
  };

  // Get period display text and Y-axis formatter
  const getPeriodConfig = () => {
    const formatYAxisValue = (value) => {
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}K`;
      } else {
        return value.toString();
      }
    };

    switch (selectedPeriod) {
      case '7days':
        return {
          title: 'Park Lot Revenue (Last 7 Days)',
          yAxisFormatter: formatYAxisValue
        };
      case '7months':
        return {
          title: 'Park Lot Revenue (Last 7 Months)',
          yAxisFormatter: formatYAxisValue
        };
      case '7years':
        return {
          title: 'Park Lot Revenue (Last 7 Years)',
          yAxisFormatter: formatYAxisValue
        };
      default:
        return {
          title: 'Park Lot Revenue',
          yAxisFormatter: formatYAxisValue
        };
    }
  };

  const periodConfig = getPeriodConfig();

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const date = payload[0].payload.date;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-700 font-medium">{date}</p>
          <p className="text-blue-600 font-semibold">
            {formatVND(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Get selected park lot name for display
  const getSelectedParkLotName = () => {
    if (selectedParkLot === 'all') return 'All Park Lots';
    const parkLot = parkLots.find(lot => lot.id === selectedParkLot);
    return parkLot ? parkLot.name : 'Unknown Park Lot';
  };

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-1">
        <div className="text-center text-red-600">
          <p>Error loading park lot revenue data</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-1 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Park Lot Revenue</h2>
          {/* <p className="text-sm text-gray-600">
            {getSelectedParkLotName()} - {' '}
            {selectedPeriod === '7days' && 'Last 7 days'}
            {selectedPeriod === '7months' && 'Last 7 months'}
            {selectedPeriod === '7years' && 'Last 7 years'}
          </p> */}
        </div>
        
        {/* Controls Container */}
        <div className="flex gap-3">
          {/* Park Lot Selection Dropdown */}
          <div className="relative">
            <select
              value={selectedParkLot}
              onChange={(e) => {
                const newParkLotId = e.target.value;
                console.log('Park Lot Dropdown Changed:', {
                  previousValue: selectedParkLot,
                  newValue: newParkLotId,
                  parkLotName: newParkLotId === 'all' ? 'All Park Lots' : parkLots.find(lot => lot.id === newParkLotId)?.name || 'Unknown',
                  timestamp: new Date().toISOString()
                });
                setSelectedParkLot(newParkLotId);
              }}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={revenueLoading}
            >
              <option value="all">All Park Lots</option>
              {parkLots.map(parkLot => (
                <option key={parkLot.id} value={parkLot.id}>
                  {parkLot.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>

          {/* Period Selection Dropdown */}
          <div className="relative">
            <select
              value={selectedPeriod}
              onChange={(e) => {
                const newPeriod = e.target.value;
                console.log('Period Selection Changed:', {
                  previousValue: selectedPeriod,
                  newValue: newPeriod,
                  currentParkLot: selectedParkLot,
                  timestamp: new Date().toISOString()
                });
                setSelectedPeriod(newPeriod);
              }}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={revenueLoading}
            >
              <option value="7days">Last 7 Days</option>
              <option value="7months">Last 7 Months</option>
              <option value="7years">Last 7 Years</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Total Revenue Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-blue-800">Total Revenue</p>
            <p className="text-2xl font-bold text-blue-900">
              {revenueLoading ? 'Loading...' : formatVND(revenueStats.totalRevenue)}
            </p>
          </div>
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mt-6">
        <h3 className="text-md font-medium text-gray-700 mb-4">{periodConfig.title}</h3>
        <div className="h-80">
          {revenueLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading chart data...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={periodConfig.yAxisFormatter}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, (dataMax) => Math.max(dataMax * 1.3, 1000000)]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="amount" 
                  radius={[4, 4, 0, 0]}
                  fill={getBarColor()}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParkLotRevenue;