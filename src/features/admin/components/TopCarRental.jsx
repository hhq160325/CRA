import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { fetchAllAdminData } from '../adminapi/adminAPI';

const TopCarRental = () => {
  const { t } = useTranslation();
  const [chartData, setChartData] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const { cars, bookings } = await fetchAllAdminData();

        // Calculate manufacturer statistics from actual data
        const manufacturerStats = {};
        const carModelStats = {};

        bookings.forEach(booking => {
          const car = cars.find(c => c.id === booking.carId);
          if (car && car.manufacturer) {
            const manufacturer = car.manufacturer;
            const carName = `${car.manufacturer} ${car.model}`;
            
            // Count by manufacturer
            manufacturerStats[manufacturer] = (manufacturerStats[manufacturer] || 0) + 1;
            
            // Count by specific car model
            carModelStats[carName] = (carModelStats[carName] || 0) + 1;
          }
        });

        // Convert to array and sort by booking count (top 5 car models)
        const sortedCarModels = Object.entries(carModelStats)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([carName, count], index) => {
            const manufacturer = carName.split(' ')[0]; // Extract manufacturer from car name
            return {
              name: carName,
              value: count,
              manufacturer: manufacturer,
              color: COLORS[index % COLORS.length]
            };
          });

        setChartData(sortedCarModels);
        setTotalBookings(bookings.length);
      } catch (err) {
        console.error('Error loading car rental data:', err);
        // Fallback to sample data if API fails
        setChartData([
          { name: 'No Data', value: 1, manufacturer: 'Unknown', color: '#9CA3AF' }
        ]);
        setTotalBookings(0);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const COLORS = ['#1E40AF', '#3B82F6', '#60A5FA', '#93C5FD', '#DBEAFE'];

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">{t('loading')}...</div>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">{t('manufacturer')}: {data.manufacturer}</p>
          <p className="text-sm text-blue-600">{t('bookings')}: {data.value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = () => {
    return (
      <div className="w-full space-y-3 mt-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[index] }}
              ></div>
              <span className="text-sm text-gray-600">{item.name}</span>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {item.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{t('topCarManufacturers')}</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col items-center">
        {/* Recharts Pie Chart */}
        <div className="w-full h-80 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Total Bookings Display */}
        <div className="text-center mb-6">
          <div className="text-3xl font-bold text-gray-900">
            {totalBookings?.toLocaleString() || '0'}
          </div>
          <div className="text-sm text-gray-500">{t('totalBookings')}</div>
        </div>

        {/* Custom Legend */}
        <CustomLegend />
      </div>
    </div>
  );
};

export default TopCarRental;