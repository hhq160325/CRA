import { useState } from 'react';

const UsageTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('month');
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data for usage tracking
  const usageData = [
    {
      id: 1,
      carId: 'C001',
      carName: 'Tesla Model 3',
      carModel: '2022',
      licensePlate: 'ABC-1234',
      totalMileage: 18500,
      rentalMileage: 14200,
      personalMileage: 4300,
      totalRentals: 45,
      totalDaysRented: 120,
      availabilityRate: 75,
      utilizationRate: 65,
      averageDailyMileage: 154,
      lastRentalDate: '2024-10-06',
      currentStatus: 'available'
    },
    {
      id: 2,
      carId: 'C002',
      carName: 'BMW X5',
      carModel: '2021',
      licensePlate: 'XYZ-5678',
      totalMileage: 28750,
      rentalMileage: 22100,
      personalMileage: 6650,
      totalRentals: 62,
      totalDaysRented: 185,
      availabilityRate: 68,
      utilizationRate: 58,
      averageDailyMileage: 155,
      lastRentalDate: '2024-10-05',
      currentStatus: 'rented'
    },
    {
      id: 3,
      carId: 'C003',
      carName: 'Honda Civic',
      carModel: '2023',
      licensePlate: 'DEF-9012',
      totalMileage: 9200,
      rentalMileage: 6800,
      personalMileage: 2400,
      totalRentals: 28,
      totalDaysRented: 85,
      availabilityRate: 82,
      utilizationRate: 72,
      averageDailyMileage: 108,
      lastRentalDate: '2024-10-04',
      currentStatus: 'available'
    },
    {
      id: 4,
      carId: 'C004',
      carName: 'Mercedes C-Class',
      carModel: '2022',
      licensePlate: 'GHI-3456',
      totalMileage: 31200,
      rentalMileage: 24500,
      personalMileage: 6700,
      totalRentals: 78,
      totalDaysRented: 210,
      availabilityRate: 70,
      utilizationRate: 60,
      averageDailyMileage: 149,
      lastRentalDate: '2024-10-07',
      currentStatus: 'maintenance'
    },
    {
      id: 5,
      carId: 'C005',
      carName: 'Toyota Camry',
      carModel: '2023',
      licensePlate: 'JKL-7890',
      totalMileage: 14800,
      rentalMileage: 11200,
      personalMileage: 3600,
      totalRentals: 35,
      totalDaysRented: 105,
      availabilityRate: 80,
      utilizationRate: 70,
      averageDailyMileage: 141,
      lastRentalDate: '2024-10-03',
      currentStatus: 'available'
    }
  ];

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'available':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'rented':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'maintenance':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'unavailable':
        return `${baseClasses} bg-red-100 text-red-800`;
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

  const filteredUsage = usageData.filter(car => {
    const matchesSearch = car.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.carId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Calculate overall statistics
  const totalCars = usageData.length;
  const totalMileage = usageData.reduce((sum, car) => sum + car.totalMileage, 0);
  const totalRentals = usageData.reduce((sum, car) => sum + car.totalRentals, 0);
  const averageUtilization = usageData.reduce((sum, car) => sum + car.utilizationRate, 0) / totalCars;

  return (
    <div className="p-8 space-y-6 min-h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usage & Mileage</h1>
          <p className="text-gray-600">Monitor car usage, mileage and utilization details</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
            Export Report
          </button>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cars</p>
              <p className="text-2xl font-bold text-blue-600">{totalCars}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Mileage</p>
              <p className="text-2xl font-bold text-green-600">{(totalMileage / 1000).toFixed(1)}k km</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Rentals</p>
              <p className="text-2xl font-bold text-purple-600">{totalRentals}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Utilization</p>
              <p className="text-2xl font-bold text-orange-600">{averageUtilization.toFixed(1)}%</p>
            </div>
            <div className="bg-orange-100 rounded-full p-3">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="relative flex-1 max-w-md">
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by car name, license plate, or ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredUsage.length} of {usageData.length} cars
          </div>
        </div>
      </div>

      {/* Usage Tracking Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Car Information</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Total Mileage</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Rental vs Personal</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Rentals</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Days Rented</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Utilization</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Avg. Daily Mileage</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsage.map((car) => {
                const rentalPercentage = (car.rentalMileage / car.totalMileage * 100).toFixed(1);
                const personalPercentage = (car.personalMileage / car.totalMileage * 100).toFixed(1);
                
                return (
                  <tr key={car.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900 text-sm">{car.carName}</div>
                      <div className="text-xs text-gray-500">{car.carModel} • {car.licensePlate}</div>
                      <div className="text-xs text-gray-400">{car.carId}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm font-medium text-gray-900">{car.totalMileage.toLocaleString()} km</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${rentalPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">{rentalPercentage}%</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Rental: {car.rentalMileage.toLocaleString()} km | Personal: {car.personalMileage.toLocaleString()} km
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-900">{car.totalRentals}</div>
                      <div className="text-xs text-gray-500">Total bookings</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-900">{car.totalDaysRented}</div>
                      <div className="text-xs text-gray-500">days</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${car.utilizationRate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{car.utilizationRate}%</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">Availability: {car.availabilityRate}%</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-900">{car.averageDailyMileage} km</div>
                      <div className="text-xs text-gray-500">per day</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={getStatusBadge(car.currentStatus)}>
                        {car.currentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => openModal(car)}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
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

      {/* Modal for detailed usage view */}
      {isModalOpen && selectedCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Usage & Mileage Details</h2>
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
            <div className="p-6 space-y-6">
              {/* Car Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Car Name</p>
                  <p className="font-medium text-gray-900 text-lg">{selectedCar.carName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">License Plate</p>
                  <p className="font-medium text-gray-900 text-lg">{selectedCar.licensePlate}</p>
                </div>
              </div>

              {/* Mileage Stats */}
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">Mileage Statistics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Total Mileage</p>
                    <p className="text-2xl font-bold text-gray-900">{selectedCar.totalMileage.toLocaleString()} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Rental Mileage</p>
                    <p className="text-2xl font-bold text-blue-600">{selectedCar.rentalMileage.toLocaleString()} km</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Personal Mileage</p>
                    <p className="text-2xl font-bold text-purple-600">{selectedCar.personalMileage.toLocaleString()} km</p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Rental Usage</span>
                    <span>{((selectedCar.rentalMileage / selectedCar.totalMileage) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-blue-600 h-4 rounded-full" 
                      style={{ width: `${(selectedCar.rentalMileage / selectedCar.totalMileage) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Rental Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Rentals</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedCar.totalRentals}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Days Rented</p>
                  <p className="text-2xl font-bold text-green-600">{selectedCar.totalDaysRented}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Avg. Daily Mileage</p>
                  <p className="text-2xl font-bold text-orange-600">{selectedCar.averageDailyMileage} km</p>
                </div>
              </div>

              {/* Utilization Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Utilization Rate</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-600 h-3 rounded-full" 
                        style={{ width: `${selectedCar.utilizationRate}%` }}
                      ></div>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{selectedCar.utilizationRate}%</span>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600 mb-2">Availability Rate</p>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full" 
                        style={{ width: `${selectedCar.availabilityRate}%` }}
                      ></div>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{selectedCar.availabilityRate}%</span>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Last Rental Date</p>
                    <p className="font-medium text-gray-900">{selectedCar.lastRentalDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Current Status</p>
                    <span className={getStatusBadge(selectedCar.currentStatus)}>
                      {selectedCar.currentStatus}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsageTracking;

