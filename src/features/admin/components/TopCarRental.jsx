import { useSelector } from 'react-redux';

const TopCarRental = () => {
  const { carStats, totalRentalCar } = useSelector(state => state.admin || {});

  const chartData = [
    { name: 'Sport Car', count: carStats?.sportCar?.count || 17439, color: '#1E40AF', percentage: 35 },
    { name: 'SUV', count: carStats?.suv?.count || 9478, color: '#3B82F6', percentage: 20 },
    { name: 'Coupe', count: carStats?.coupe?.count || 18197, color: '#60A5FA', percentage: 37 },
    { name: 'Hatchback', count: carStats?.hatchback?.count || 12510, color: '#93C5FD', percentage: 25 },
    { name: 'MPV', count: carStats?.mpv?.count || 14406, color: '#DBEAFE', percentage: 28 }
  ];

  // Calculate the stroke-dasharray for each segment
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  
  let cumulativePercentage = 0;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Top 5 Car Rental</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col items-center">
        {/* Donut Chart */}
        <div className="relative mb-6">
          <svg width="200" height="200" className="transform -rotate-90">
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#F3F4F6"
              strokeWidth="20"
            />
            {chartData.map((item, index) => {
              const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -cumulativePercentage * circumference / 100;
              cumulativePercentage += item.percentage;
              
              return (
                <circle
                  key={index}
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke={item.color}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300"
                />
              );
            })}
          </svg>
          
          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-gray-900">
              {totalRentalCar?.toLocaleString() || '72,030'}
            </div>
            <div className="text-sm text-gray-500">Rental Car</div>
          </div>
        </div>

        {/* Legend */}
        <div className="w-full space-y-3">
          {chartData.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {item.count.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopCarRental;