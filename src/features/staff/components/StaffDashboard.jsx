
import DashboardMetrics from './StaffDashBoardSubsComponent/components/DashboardMetrics';
import RecentActivities from './StaffDashBoardSubsComponent/components/RecentActivities';
import PendingVerifications from './StaffDashBoardSubsComponent/components/PendingVerifications';
import CustomerAccountOverview from './StaffDashBoardSubsComponent/components/CustomerAccountOverview';
import ParkLotRevenue from './StaffDashBoardSubsComponent/components/ParkLotRevenue';
import ParklotCompare from './StaffDashBoardSubsComponent/components/ParklotCompare';
import ParklotRevenueSummaryStandalone from './StaffDashBoardSubsComponent/components/ParklotRevenueSummaryStandalone';

const StaffDashboard = () => {
  return (
    <div className="p-8 space-y-8 min-h-full bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Dashboard Metrics - Takes 2 columns */}
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
        {/* Park Lot Revenue - Takes 2 columns */}
        <div className="lg:col-span-1">
          <ParkLotRevenue />
        </div>

        {/* Park Lot Comparison - Takes 2 columns */}
        <div className="lg:col-span-1">
          <ParklotCompare />
        </div>
        {/* Park Lot Revenue Summary - Takes 2 columns */}
        <div className="lg:col-span-2">
          <ParklotRevenueSummaryStandalone />
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;