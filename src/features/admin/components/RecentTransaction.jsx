import { useSelector } from 'react-redux';

const RecentTransaction = () => {
  const recentTransactions = useSelector(state => state.admin?.recentTransactions || []);

  const getCarImage = (carName) => {
    // Return a colored div representing different car types
    const carType = carName.toLowerCase();
    if (carType.includes('gt') || carType.includes('koegnigsegg')) {
      return <div className="w-16 h-12 bg-gray-800 rounded-lg"></div>;
    } else if (carType.includes('rolls')) {
      return <div className="w-16 h-12 bg-blue-900 rounded-lg"></div>;
    } else if (carType.includes('cr-v')) {
      return <div className="w-16 h-12 bg-gray-700 rounded-lg"></div>;
    }
    return <div className="w-16 h-12 bg-gray-600 rounded-lg"></div>;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Transaction</h2>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {recentTransactions.map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center space-x-4">
              {/* Car Image */}
              {getCarImage(transaction.car)}
              
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{transaction.car}</h3>
                <p className="text-sm text-gray-500">{transaction.type}</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1">{transaction.date}</div>
              <div className="font-semibold text-gray-900">
                ${transaction.price.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransaction;