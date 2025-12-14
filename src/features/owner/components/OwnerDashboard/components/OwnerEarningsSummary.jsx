const OwnerEarningsSummary = ({ monthlyEarnings }) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  
  const getMaxEarning = () => {
    return Math.max(...monthlyEarnings, 1);
  };

  const maxEarning = getMaxEarning();

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Earnings Summary</h2>
        <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option>Jan 2025 - Jun 2025</option>
        </select>
      </div>
      <div className="relative h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-gray-400">
          <span>$200k</span>
          <span>$150k</span>
          <span>$100k</span>
          <span>$50k</span>
          <span>$0</span>
        </div>
        {/* Chart area */}
        <div className="ml-12 h-full relative">
          <svg className="w-full h-full" viewBox="0 0 600 240" preserveAspectRatio="none">
            {/* Area fill */}
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ef4444" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <path
              d={`M 0 ${240 - (monthlyEarnings[0] / maxEarning) * 200} 
                  L 120 ${240 - (monthlyEarnings[1] / maxEarning) * 200}
                  L 240 ${240 - (monthlyEarnings[2] / maxEarning) * 200}
                  L 360 ${240 - (monthlyEarnings[3] / maxEarning) * 200}
                  L 480 ${240 - (monthlyEarnings[4] / maxEarning) * 200}
                  L 600 ${240 - (monthlyEarnings[5] / maxEarning) * 200}
                  L 600 240 L 0 240 Z`}
              fill="url(#areaGradient)"
            />
            {/* Line */}
            <polyline
              points={`0,${240 - (monthlyEarnings[0] / maxEarning) * 200} 
                      120,${240 - (monthlyEarnings[1] / maxEarning) * 200}
                      240,${240 - (monthlyEarnings[2] / maxEarning) * 200}
                      360,${240 - (monthlyEarnings[3] / maxEarning) * 200}
                      480,${240 - (monthlyEarnings[4] / maxEarning) * 200}
                      600,${240 - (monthlyEarnings[5] / maxEarning) * 200}`}
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
            />
            {/* Dots */}
            {monthlyEarnings.map((earning, index) => (
              <circle
                key={index}
                cx={index * 120}
                cy={240 - (earning / maxEarning) * 200}
                r="5"
                fill="#ef4444"
              />
            ))}
          </svg>
          {/* X-axis labels */}
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            {months.map((month, index) => (
              <span key={index}>{month}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerEarningsSummary;
