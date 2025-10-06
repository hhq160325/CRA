import { useSelector } from 'react-redux';
import StatusOverview from './StatusOverview';
import TopCarRental from './TopCarRental';
import RecentTransaction from './RecentTransaction';

const AdminDashboard = () => {
  return (
    <div className="p-8 space-y-8 min-h-full bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Overview - Takes 2 columns */}
        <div className="lg:col-span-2">
          <StatusOverview />
        </div>

        {/* Top 5 Car Rental - Takes 1 column */}
        <div className="lg:col-span-1">
          <TopCarRental />
        </div>
      </div>

      {/* Recent Transaction - Full width */}
      <div className="w-full">
        <RecentTransaction />
      </div>
    </div>
  );
};

export default AdminDashboard;