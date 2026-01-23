import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useTranslation } from 'react-i18next';
import { convertToVietnamTime } from '../../../../../shared/utils/CheckUTC';
import { useDashboardCar } from '../hooks/useDashboardCar';

const TrendingCar = ({ ownerCars = [] }) => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedManufacturer, setSelectedManufacturer] = useState('all');
  
  // Use the car trending data hook
  const { trendingData, topModels, topManufacturers, trendingLoading } = useDashboardCar(ownerCars, false, selectedPeriod);

  // Extract unique manufacturers from ownerCars
  const manufacturers = React.useMemo(() => {
    const uniqueManufacturers = [...new Set(ownerCars.map(car => car.manufacturer).filter(Boolean))];
    return uniqueManufacturers.sort();
  }, [ownerCars]);

  // Extract unique car models from the data
  const allCarModels = trendingData.length > 0
    ? Object.keys(trendingData[0]).filter(key => key !== 'date' && key !== 'day' && key !== 'weekEnd')
    : [];

  // Filter car models based on selected manufacturer
  const carModels = React.useMemo(() => {
    if (selectedManufacturer === 'all') {
      return allCarModels;
    }
    
    // Filter allCarModels to only include models that start with the selected manufacturer
    // This handles cases where the model name includes the manufacturer (e.g., "Acura TLX", "Honda Civic RS 2023")
    return allCarModels.filter(model => 
      model.toLowerCase().startsWith(selectedManufacturer.toLowerCase())
    );
  }, [allCarModels, selectedManufacturer]);
  
  // Process the data to format dates
  const processedData = trendingData.map(item => ({
    ...item,
    day: item.day || convertToVietnamTime(item.date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }),
    // Keep weekEnd for tooltip display
    weekEnd: item.weekEnd
  }));

  // Generate colors for each car model
  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
    '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
  ];

  // Custom tooltip to show formatted data
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      // Filter out entries with zero values for cleaner tooltip
      const nonZeroPayload = payload.filter(entry => entry.value > 0);
      
      // Get the data point for additional information
      const dataPoint = processedData.find(item => item.day === label);
      
      // Format date range for weeks
      const getDateRangeText = () => {
        if (selectedPeriod === '7weeks' && dataPoint && dataPoint.weekEnd) {
          const startDate = new Date(dataPoint.date);
          const endDate = new Date(dataPoint.weekEnd);
          const startFormatted = startDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });
          const endFormatted = endDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          });
          return `${startFormatted} - ${endFormatted}`;
        }
        return label;
      };
      
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{`${t('date')}: ${getDateRangeText()}`}</p>
          {nonZeroPayload.length > 0 ? (
            nonZeroPayload.map((entry, index) => (
              <p key={index} style={{ color: entry.color }} className="text-sm">
                {`${entry.name}: ${entry.value} ${entry.value === 1 ? 'booking' : 'bookings'}`}
              </p>
            ))
          ) : (
            <p className="text-sm text-gray-500">No bookings for this period</p>
          )}
        </div>
      );
    }
    return null;
  };

  // Get period display text
  const getPeriodConfig = () => {
    switch (selectedPeriod) {
      case '7days':
        return {
          title: 'Car Model Booking Trends (Last 7 Days)',
          description: 'Track booking trends for each car model over the last 7 days'
        };
      case '7weeks':
        return {
          title: 'Car Model Booking Trends (Last 7 Weeks)',
          description: 'Track booking trends for each car model over the last 7 weeks'
        };
      case '7months':
        return {
          title: 'Car Model Booking Trends (Last 7 Months)',
          description: 'Track booking trends for each car model over the last 7 months'
        };
      default:
        return {
          title: 'Car Model Booking Trends',
          description: 'Track booking trends for each car model'
        };
    }
  };

  const periodConfig = getPeriodConfig();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {t('carModelTrends', 'Car Model Booking Trends')}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {t('carModelTrendsDescription', periodConfig.description)}
            </p>
          </div>
          
          {/* Filter Controls */}
          <div className="flex items-center gap-3">
            {/* Manufacturer Filter Dropdown */}
            <div className="relative">
              <select
                value={selectedManufacturer}
                onChange={(e) => setSelectedManufacturer(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">{t('allManufacturers', 'All Manufacturers')}</option>
                {manufacturers.map((manufacturer) => (
                  <option key={manufacturer} value={manufacturer}>
                    {manufacturer}
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
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7days">{t('last7Days', 'Last 7 Days')}</option>
                <option value="7weeks">{t('last7Weeks', 'Last 7 Weeks')}</option>
                <option value="7months">{t('last7Months', 'Last 7 Months')}</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      {/* {processedData.length > 0 && carModels.length > 0 && (
        <div className="mt-6 pt-4 pb-4 border-t border-b border-gray-200">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-xl font-bold text-blue-600">
                {carModels.length}
              </p>
              <p className="text-sm text-gray-600">{t('totalModels', 'Car Models')}</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-green-600">
                {processedData.reduce((sum, item) => {
                  return sum + carModels.reduce((modelSum, model) => modelSum + (item[model] || 0), 0);
                }, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">{t('totalBookings', 'Total Bookings')}</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-purple-600">
                {Math.max(...processedData.map(item =>
                  carModels.reduce((max, model) => Math.max(max, item[model] || 0), 0)
                ))}
              </p>
              <p className="text-sm text-gray-600">{t('peakDay', 'Peak Day')}</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-bold text-orange-600">
                {(processedData.reduce((sum, item) => {
                  return sum + carModels.reduce((modelSum, model) => modelSum + (item[model] || 0), 0);
                }, 0) / 7).toFixed(1)}
              </p>
              <p className="text-sm text-gray-600">{t('avgPerDay', 'Avg/Day')}</p>
            </div>
          </div>
        </div>
      )} */}

      {trendingLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading chart data...</div>
        </div>
      ) : processedData.length === 0 || carModels.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-gray-500">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <p className="mt-2 text-sm">{t('noTrendingData', 'No trending data available')}</p>
          </div>
        </div>
      ) : (
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={processedData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="day"
                stroke="#6b7280"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                stroke="#6b7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                label={{ value: t('bookings', 'Bookings'), angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              {carModels.map((model, index) => (
                <Line
                  key={model}
                  type="monotone"
                  dataKey={model}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: colors[index % colors.length], strokeWidth: 2 }}
                  name={model}
                  connectNulls={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Car Models Legend */}
      {/* {carModels.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h4 className="text-md font-semibold text-gray-900 mb-4">
            {t('carModelsInChart', 'Car Models in Chart')}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {carModels.map((model, index) => (
              <div key={index} className="flex items-center bg-gray-50 rounded-lg p-3">
                <div 
                  className="w-4 h-4 rounded-full mr-3" 
                  style={{ backgroundColor: colors[index % colors.length] }}
                ></div>
                <span className="text-sm font-medium text-gray-900">{model}</span>
              </div>
            ))}
          </div>
        </div>
      )} */}
    </div>
  );
};

export default TrendingCar;