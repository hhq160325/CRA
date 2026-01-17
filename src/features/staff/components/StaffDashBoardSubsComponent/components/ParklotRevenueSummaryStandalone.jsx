import { useState, useEffect } from 'react';
import { parkLotRevenueService } from '../services/parkLotRevenueService';

const ParklotRevenueSummaryStandalone = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [compareData, setCompareData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch park lots and their revenue data
  useEffect(() => {
    const fetchCompareData = async () => {
      try {
        setLoading(true);
        setError(null);

        // console.log('Fetching park lots for summary:', { selectedPeriod });

        // Get all park lots
        const parkLotsData = await parkLotRevenueService.getAllParkLots();

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
        
        // console.log('Park lot summary data:', {
        //   totalParkLots: compareResults.length,
        //   period: selectedPeriod,
        //   data: compareResults
        // });

        setCompareData(compareResults);
      } catch (error) {
        console.error('Error fetching park lot summary data:', error);
        setError('Failed to load park lot summary data');
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

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="text-center text-red-600">
          <p>Error loading park lot summary data</p>
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Park Lot Revenue Summary</h2>
          <p className="text-sm text-gray-600">
            Ranked list of park lots by revenue - {' '}
            {selectedPeriod === '7days' && 'Last 7 days'}
            {selectedPeriod === '7months' && 'Last 7 months'}
            {selectedPeriod === '7years' && 'Last 7 years'}
          </p>
        </div>
        
        {/* Period Selection Dropdown */}
        <div className="relative">
          <select
            value={selectedPeriod}
            onChange={(e) => {
              const newPeriod = e.target.value;
              // console.log('Period Selection Changed:', {
              //   previousValue: selectedPeriod,
              //   newValue: newPeriod,
              //   timestamp: new Date().toISOString()
              // });
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
        </div>
      </div>

      {/* Revenue Summary Table */}
      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">Loading summary data...</div>
        </div>
      ) : compareData.length === 0 ? (
        <div className="flex items-center justify-center h-32">
          <div className="text-gray-500">No park lot data available</div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Park Lot
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {compareData.map((parkLot, index) => (
                <tr key={parkLot.id} className={index < 3 ? 'bg-yellow-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {parkLot.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {parkLot.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                    {formatVND(parkLot.totalRevenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ParklotRevenueSummaryStandalone;