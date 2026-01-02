import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { parkLotRevenueService } from '../services/parkLotRevenueService';
import ParklotRevenueSummary from './ParklotRevenueSummary';

const ParklotCompare = () => {
  const { t } = useTranslation();
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [parkLots, setParkLots] = useState([]);
  const [compareData, setCompareData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompareData = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Fetching park lots for comparison:', { selectedPeriod });

        // Get all park lots
        const parkLotsData = await parkLotRevenueService.getAllParkLots();
        setParkLots(parkLotsData);

        // Get revenue data for each park lot
        const compareResults = [];
        for (const parkLot of parkLotsData) {
          try {
            const revenueData = await parkLotRevenueService.getParkLotRevenue(parkLot.id, selectedPeriod);
            compareResults.push({
              id: parkLot.id,
              name: parkLot.name || `Park Lot ${parkLot.id}`,
              totalRevenue: revenueData.totalRevenue || 0,
              address: parkLot.address || 'N/A'
            });
          } catch (error) {
            console.warn(`Failed to fetch revenue for park lot ${parkLot.id}:`, error);
            // Include park lot with zero revenue if data fetch fails
            compareResults.push({
              id: parkLot.id,
              name: parkLot.name || `Park Lot ${parkLot.id}`,
              totalRevenue: 0,
              address: parkLot.address || 'N/A'
            });
          }
        }

        // Sort by revenue (highest first)
        compareResults.sort((a, b) => b.totalRevenue - a.totalRevenue);

        console.log('Park lot comparison data:', {
          totalParkLots: compareResults.length,
          period: selectedPeriod,
          data: compareResults
        });

        setCompareData(compareResults);
      } catch (error) {
        console.error('Error fetching park lot comparison data:', error);
        setError('Failed to load park lot comparison data');
      } finally {
        setLoading(false);
      }
    };

    fetchCompareData();
  }, [selectedPeriod]);

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

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
      // case '7days':
      //   return {
      //     title: 'Park Lot Revenue Comparison (Last 7 Days)',
      //     yAxisFormatter: formatYAxisValue
      //   };
      // case '7months':
      //   return {
      //     title: 'Park Lot Revenue Comparison (Last 7 Months)',
      //     yAxisFormatter: formatYAxisValue
      //   };
      // case '7years':
      //   return {
      //     title: 'Park Lot Revenue Comparison (Last 7 Years)',
      //     yAxisFormatter: formatYAxisValue
      //   };
      default:
        return {
          title: 'Park Lot Revenue Comparison',
          yAxisFormatter: formatYAxisValue
        };
    }
  };

  const periodConfig = getPeriodConfig();

  // Custom tooltip formatter
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-gray-900 font-semibold">{data.name}</p>
          <p className="text-sm text-gray-600">{data.address}</p>
          <p className="text-blue-600 font-semibold mt-1">
            Revenue: {formatVND(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  // Calculate total revenue across all park lots
  const totalRevenue = compareData.reduce((sum, parkLot) => sum + parkLot.totalRevenue, 0);
  const topPerformer = compareData.length > 0 ? compareData[0] : null;

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center text-red-600">
          <p>Error loading park lot comparison data</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Park Lot Revenue Comparison</h2>
          {/* <p className="text-sm text-gray-600">
            Compare revenue across all park lots - {' '}
            {selectedPeriod === '7days' && 'Last 7 days'}
            {selectedPeriod === '7months' && 'Last 7 months'}
            {selectedPeriod === '7years' && 'Last 7 years'}
          </p> */}
        </div>

        {/* Period Selection Dropdown */}
        {/* <div className="relative">
          <select
            value={selectedPeriod}
            onChange={(e) => {
              const newPeriod = e.target.value;
              console.log('Period Selection Changed:', {
                previousValue: selectedPeriod,
                newValue: newPeriod,
                timestamp: new Date().toISOString()
              });
              setSelectedPeriod(newPeriod);
            }}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
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
        </div> */}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-6">
        {/* Total Revenue Card */}
        {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">Total Revenue</p>
              <p className="text-xl font-bold text-blue-900">
                {loading ? 'Loading...' : formatVND(totalRevenue)}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div> */}

        {/* Top Performer Card */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-800">Top Performer</p>
              <p className="text-lg font-bold text-green-900">
                {loading ? 'Loading...' : (topPerformer ? `${topPerformer.name}: ${formatVND(topPerformer.totalRevenue)}` : 'No data')}
              </p>
            </div>
            {/* <div>
              <p className="text-sm font-medium text-green-800">Top Performer</p>
              <p className="text-lg font-bold text-green-900">
                {loading ? 'Loading...' : (topPerformer ? topPerformer.name : 'No data')}
              </p>
              {topPerformer && (
                <p className="text-sm text-green-700">
                  {formatVND(topPerformer.totalRevenue)}
                </p>
              )}
            </div> */}
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mt-6">
        <h3 className="text-md font-medium text-gray-700 mb-4">{periodConfig.title}</h3>
        <div className="h-64">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading comparison data...</div>
            </div>
          ) : compareData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">No park lot data available</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={compareData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 3,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={periodConfig.yAxisFormatter}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, (dataMax) => Math.max(dataMax * 1.1, 100000)]}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="totalRevenue"
                  radius={[4, 4, 0, 0]}
                  fill="#3b82f6"
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Park Lots Summary Table */}
      {/* <ParklotRevenueSummary 
        compareData={compareData}
        loading={loading}
        formatVND={formatVND}
      /> */}
    </div>
  );
};

export default ParklotCompare;