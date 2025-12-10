
import DashboardMetrics from './StaffDashBoardSubsComponent/DashboardMetrics';
import RecentActivities from './StaffDashBoardSubsComponent/RecentActivities';
import PendingVerifications from './StaffDashBoardSubsComponent/PendingVerifications';
import CustomerAccountOverview from './StaffDashBoardSubsComponent/CustomerAccountOverview';

const StaffDashboard = () => {
  return (
    <div className="p-8 space-y-8 min-h-full bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Dashboard Metrics - Takes 1 column */}
        <div className="lg:col-span-2">
          <DashboardMetrics />
        </div>

        {/* Pending Verifications - Takes 1 column */}
        <div className="lg:col-span-1">
          <PendingVerifications />
        </div>

        {/* Customer Account Overview - Takes 1 column */}
        <div className="lg:col-span-1">
          <CustomerAccountOverview />
        </div>

      </div>
    </div>
  );
};

export default StaffDashboard;