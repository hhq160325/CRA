import { useState } from 'react';

const MaintenanceSchedule = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data for maintenance schedules
  const maintenanceSchedules = [
    {
      id: 1,
      carId: 'C001',
      carName: 'Tesla Model 3',
      carModel: '2022',
      licensePlate: 'ABC-1234',
      lastMaintenanceDate: '2024-09-15',
      nextMaintenanceDate: '2024-11-15',
      mileageAtLastService: 15000,
      currentMileage: 18500,
      maintenanceType: 'Regular Service',
      status: 'upcoming',
      daysUntil: 31,
      priority: 'medium'
    },
    {
      id: 2,
      carId: 'C002',
      carName: 'BMW X5',
      carModel: '2021',
      licensePlate: 'XYZ-5678',
      lastMaintenanceDate: '2024-08-20',
      nextMaintenanceDate: '2024-10-20',
      mileageAtLastService: 25000,
      currentMileage: 28750,
      maintenanceType: 'Oil Change',
      status: 'overdue',
      daysUntil: -5,
      priority: 'high'
    },
    {
      id: 3,
      carId: 'C003',
      carName: 'Honda Civic',
      carModel: '2023',
      licensePlate: 'DEF-9012',
      lastMaintenanceDate: '2024-10-01',
      nextMaintenanceDate: '2024-12-01',
      mileageAtLastService: 8000,
      currentMileage: 9200,
      maintenanceType: 'Regular Service',
      status: 'upcoming',
      daysUntil: 52,
      priority: 'low'
    },
    {
      id: 4,
      carId: 'C004',
      carName: 'Mercedes C-Class',
      carModel: '2022',
      licensePlate: 'GHI-3456',
      lastMaintenanceDate: '2024-10-05',
      nextMaintenanceDate: '2024-11-05',
      mileageAtLastService: 30000,
      currentMileage: 31200,
      maintenanceType: 'Major Service',
      status: 'upcoming',
      daysUntil: 21,
      priority: 'high'
    },
    {
      id: 5,
      carId: 'C005',
      carName: 'Toyota Camry',
      carModel: '2023',
      licensePlate: 'JKL-7890',
      lastMaintenanceDate: '2024-09-10',
      nextMaintenanceDate: '2024-10-10',
      mileageAtLastService: 12000,
      currentMileage: 14800,
      maintenanceType: 'Oil Change',
      status: 'due',
      daysUntil: 0,
      priority: 'high'
    }
  ];

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'upcoming':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'due':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'overdue':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getPriorityBadge = (priority) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (priority) {
      case 'high':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'medium':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'low':
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const openModal = (car) => {
    setSelectedCar(car);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCar(null);
  };

  const handleMarkCompleted = (id) => {
    // Handle mark as completed logic
    console.log('Marking maintenance as completed for car:', id);
    closeModal();
  };

  const handleScheduleMaintenance = (id) => {
    // Handle schedule maintenance logic
    console.log('Scheduling maintenance for car:', id);
    closeModal();
  };

  const filteredSchedules = maintenanceSchedules.filter(schedule => {
    const matchesSearch = schedule.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      schedule.carId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || schedule.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const overdueCount = maintenanceSchedules.filter(s => s.status === 'overdue').length;
  const dueCount = maintenanceSchedules.filter(s => s.status === 'due').length;
  const upcomingCount = maintenanceSchedules.filter(s => s.status === 'upcoming').length;

  return (
    <div className="p-8 space-y-6 min-h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Schedule</h1>
          <p className="text-gray-600">Track maintenance schedule and view notifications for each car</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Export Report
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Add Maintenance Record
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{overdueCount}</p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Due Now</p>
              <p className="text-2xl font-bold text-yellow-600">{dueCount}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-blue-600">{upcomingCount}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cars</p>
              <p className="text-2xl font-bold text-green-600">{maintenanceSchedules.length}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative">
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by car name, license plate, or ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="overdue">Overdue</option>
              <option value="due">Due Now</option>
              <option value="upcoming">Upcoming</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredSchedules.length} of {maintenanceSchedules.length} cars
          </div>
        </div>
      </div>

      {/* Maintenance Schedule Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Car Information</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Last Maintenance</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Next Maintenance</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Mileage</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Maintenance Type</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Priority</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSchedules.map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900 text-sm">{schedule.carName}</div>
                    <div className="text-xs text-gray-500">{schedule.carModel} • {schedule.licensePlate}</div>
                    <div className="text-xs text-gray-400">{schedule.carId}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{schedule.lastMaintenanceDate}</div>
                    <div className="text-xs text-gray-500">{schedule.mileageAtLastService.toLocaleString()} km</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-medium text-gray-900">{schedule.nextMaintenanceDate}</div>
                    {schedule.daysUntil >= 0 ? (
                      <div className="text-xs text-gray-500">In {schedule.daysUntil} days</div>
                    ) : (
                      <div className="text-xs text-red-600 font-medium">{Math.abs(schedule.daysUntil)} days overdue</div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{schedule.currentMileage.toLocaleString()} km</div>
                    <div className="text-xs text-gray-500">
                      {schedule.currentMileage - schedule.mileageAtLastService} km since last service
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{schedule.maintenanceType}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={getStatusBadge(schedule.status)}>
                      {schedule.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={getPriorityBadge(schedule.priority)}>
                      {schedule.priority}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openModal(schedule)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleScheduleMaintenance(schedule.id)}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        Schedule
                      </button>
                      {schedule.status === 'due' || schedule.status === 'overdue' ? (
                        <button
                          onClick={() => handleMarkCompleted(schedule.id)}
                          className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                        >
                          Complete
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center py-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">Previous</button>
            <div className="flex space-x-1">
              <button className="w-8 h-8 text-sm bg-blue-600 text-white rounded">1</button>
              <button className="w-8 h-8 text-sm text-gray-600 hover:bg-gray-100 rounded">2</button>
              <button className="w-8 h-8 text-sm text-gray-600 hover:bg-gray-100 rounded">3</button>
            </div>
            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">Next</button>
          </div>
        </div>
      </div>

      {/* Modal for viewing maintenance details */}
      {isModalOpen && selectedCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Maintenance Details</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Car Name</p>
                  <p className="font-medium text-gray-900">{selectedCar.carName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">License Plate</p>
                  <p className="font-medium text-gray-900">{selectedCar.licensePlate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Mileage</p>
                  <p className="font-medium text-gray-900">{selectedCar.currentMileage.toLocaleString()} km</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Maintenance Type</p>
                  <p className="font-medium text-gray-900">{selectedCar.maintenanceType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Maintenance Date</p>
                  <p className="font-medium text-gray-900">{selectedCar.lastMaintenanceDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Next Maintenance Date</p>
                  <p className="font-medium text-gray-900">{selectedCar.nextMaintenanceDate}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <span className={getStatusBadge(selectedCar.status)}>{selectedCar.status}</span>
                  <span className={getPriorityBadge(selectedCar.priority)}>{selectedCar.priority} priority</span>
                </div>
              </div>
              <div className="pt-4 flex space-x-3">
                <button
                  onClick={() => handleScheduleMaintenance(selectedCar.id)}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Schedule Maintenance
                </button>
                {(selectedCar.status === 'due' || selectedCar.status === 'overdue') && (
                  <button
                    onClick={() => handleMarkCompleted(selectedCar.id)}
                    className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceSchedule;

