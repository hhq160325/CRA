
import DashboardMetrics from './DashboardMetrics';
import RecentActivities from './RecentActivities';
import PendingVerifications from './PendingVerifications';

const StaffDashboard = () => {
  return (
    <div className="p-8 space-y-8 min-h-full bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Dashboard Metrics - Takes 2 columns */}
        <div className="lg:col-span-2">
          <DashboardMetrics />
        </div>

        {/* Pending Verifications - Takes 1 column */}
        <div className="lg:col-span-1">
          <PendingVerifications />
        </div>
      </div>

      {/* Recent Activities - Full width */}
      <div className="w-full">
        <RecentActivities />
      </div>
    </div>
  );
};

export default StaffDashboard;