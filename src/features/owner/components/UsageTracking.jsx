import { useState, useEffect, useMemo } from 'react';
import DropdownTemplate from '../../../shared/components/DropdownTemplate';
import Pagination from '../../../shared/components/Pagination';
import { tokenUtils } from '../../auth/utils';
import { filterCarUsageData } from '../utils/filterUtils';
import { getAllCars, getCarBookings } from '../ownerApi';
import { MaintenanceSchedulingModal, UsageDetailsModal } from './modal';

const UsageTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('month');
  const [brandFilter, setBrandFilter] = useState('all');
  const [modelFilter, setModelFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCar, setSelectedCar] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] = useState(false);
  const [usageData, setUsageData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;



  // Helper function to calculate days between two dates
  const calculateDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Fetch cars and their bookings from API
  useEffect(() => {
    const fetchCarsWithBookings = async () => {
      try {
        setLoading(true);

        // Get current user ID from JWT token (more secure)
        const currentOwnerId = tokenUtils.getUserId();

        if (!currentOwnerId) {
          setError('Unable to identify current user. Please log in again.');
          setLoading(false);
          return;
        }

        const allCars = await getAllCars();

        // Filter cars by current owner ID
        const cars = allCars.filter(car => car.owner.id === currentOwnerId);

        // Fetch bookings for each car in parallel
        const carsWithBookings = await Promise.all(
          cars.map(async (car) => {
            const bookings = await getCarBookings(car.id);

            // Calculate rental statistics (exclude canceled bookings)
            const activeBookings = bookings.filter(b =>
              b.status && b.status.toLowerCase() !== 'canceled' && b.status.toLowerCase() !== 'cancelled'
            );
            const totalRentals = activeBookings.length;
            const totalDaysRented = activeBookings.reduce((sum, booking) => {
              if (booking.pickupTime && booking.dropoffTime) {
                return sum + calculateDays(booking.pickupTime, booking.dropoffTime);
              }
              return sum;
            }, 0);

            // Find last rental date
            const sortedBookings = bookings
              .filter(b => b.pickupTime)
              .sort((a, b) => new Date(b.pickupTime) - new Date(a.pickupTime));
            const lastRentalDate = sortedBookings.length > 0
              ? new Date(sortedBookings[0].pickupTime).toLocaleDateString()
              : 'N/A';

            return {
              id: car.id,
              carId: car.id,
              carName: `${car.manufacturer || ''} ${car.model || ''}`.trim(),
              brand: car.manufacturer || 'Unknown',
              model: car.model || 'Unknown',
              carModel: car.yearofManufacture?.toString() || 'N/A',
              licensePlate: car.licensePlate || 'N/A',
              totalRentals,
              totalDaysRented,
              lastRentalDate,
              currentStatus: car.status?.toLowerCase() || 'unknown',
              seats: car.seats,
              transmission: car.transmission,
              fuelType: car.fuelType,
              bookings, // Store bookings for modal
            };
          })
        );

        setUsageData(carsWithBookings);
        setError(null);
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('Failed to load car data');
      } finally {
        setLoading(false);
      }
    };

    fetchCarsWithBookings();
  }, []);

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    const normalizedStatus = status?.toLowerCase();

    // Map pending to active for display
    // const displayStatus = normalizedStatus === 'pending' ? 'active' : normalizedStatus;

    switch (normalizedStatus) {
      case 'active':
        return { className: `${baseClasses} bg-green-100 text-green-800`, label: 'Available' };
      case 'reserved':
        return { className: `${baseClasses} bg-gray-100 text-gray-800`, label: 'Reserved' };
      case 'pending':
        return { className: `${baseClasses} bg-green-100 text-green-800`, label: 'Available' };
      // case 'active':
      //   return { className: `${baseClasses} bg-blue-100 text-blue-800`, label: 'Active' };
      case 'inactive':
        return { className: `${baseClasses} bg-yellow-100 text-yellow-800`, label: 'Maintenance' };
      // case 'inactive':
      //   return { className: `${baseClasses} bg-red-100 text-red-800`, label: 'Inactive' };
      case 'unavailable':
        return { className: `${baseClasses} bg-red-100 text-red-800`, label: 'Unavailable' };
      default:
        return { className: `${baseClasses} bg-gray-100 text-gray-800`, label: 'unknown' };
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

  const openMaintenanceModal = (car) => {
    setSelectedCar(car);
    setIsMaintenanceModalOpen(true);
  };

  const closeMaintenanceModal = () => {
    setIsMaintenanceModalOpen(false);
    setSelectedCar(null);
  };

  const filteredUsage = useMemo(() => {
    return usageData.filter(car =>
      filterCarUsageData(car, {
        searchTerm,
        brandFilter,
        modelFilter,
        statusFilter,
      })
    );
  }, [usageData, searchTerm, brandFilter, modelFilter, statusFilter]);

  // Get unique brands, models and statuses for filter dropdowns
  const uniqueBrands = [...new Set(usageData.map(car => car.brand))].sort();

  // Get models based on selected brand
  const availableModels = brandFilter === 'all'
    ? [...new Set(usageData.map(car => car.model))].sort()
    : [...new Set(usageData.filter(car => car.brand === brandFilter).map(car => car.model))].sort();

  const uniqueStatuses = [...new Set(usageData.map(car => car.currentStatus))].sort();

  // Reset model filter when brand changes
  useEffect(() => {
    if (brandFilter !== 'all') {
      // Check if current model filter is still valid for selected brand
      const isModelValid = usageData.some(car => car.brand === brandFilter && car.model === modelFilter);
      if (!isModelValid && modelFilter !== 'all') {
        setModelFilter('all');
      }
    }
  }, [brandFilter, modelFilter, usageData]);

  // Prepare dropdown options
  const brandOptions = [
    { id: 'all', value: 'all', label: 'All Brands' },
    ...uniqueBrands.map(brand => ({ id: brand, value: brand, label: brand }))
  ];

  const modelOptions = [
    { id: 'all', value: 'all', label: brandFilter === 'all' ? 'Select Brand First' : 'All Models' },
    ...availableModels.map(model => ({ id: model, value: model, label: model }))
  ];

  const statusOptions = [
    { id: 'all', value: 'all', label: 'All Status' },
    ...uniqueStatuses.map(status => {
      const badge = getStatusBadge(status);
      return {
        id: status,
        value: status,
        label: badge.label.charAt(0).toUpperCase() + badge.label.slice(1)
      };
    })
  ];

  // Pagination calculations
  const totalPages = Math.ceil(filteredUsage.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsage = filteredUsage.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateFilter, brandFilter, modelFilter, statusFilter]);



  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-full">
        <div className="text-gray-500">Loading car data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center min-h-full">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <>
      <div className="p-8 space-y-6 min-h-full bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý bảo dưỡng xe</h1>
            <p className="text-gray-600">theo dõi tình trạng xe</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
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

              <div className="w-full sm:w-48">
                <DropdownTemplate
                  value={brandFilter}
                  onChange={(option) => setBrandFilter(option.value)}
                  options={brandOptions}
                  placeholder="All Brands"
                  searchable={true}
                  searchPlaceholder="Search brands..."
                />
              </div>

              <div className="w-full sm:w-48">
                <DropdownTemplate
                  value={modelFilter}
                  onChange={(option) => setModelFilter(option.value)}
                  options={modelOptions}
                  placeholder="All Models"
                  searchable={true}
                  searchPlaceholder="Search models..."
                  disabled={brandFilter === 'all'}
                />
              </div>

              <div className="w-full sm:w-48">
                <DropdownTemplate
                  value={statusFilter}
                  onChange={(option) => setStatusFilter(option.value)}
                  options={statusOptions}
                  placeholder="All Status"
                  searchable={false}
                />
              </div>
            </div>

            <div className="text-sm text-gray-600 whitespace-nowrap">
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
                  {/* <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Total Mileage</th> */}
                  {/* <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Rental vs Personal</th> */}
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Rentals</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Days Rented</th>
                  {/* <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Utilization</th> */}
                  {/* <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Avg. Daily Mileage</th> */}
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedUsage.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-gray-500">
                      No cars found
                    </td>
                  </tr>
                ) : (
                  paginatedUsage.map((car) => {
                    return (
                      <tr key={car.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="font-medium text-gray-900 text-sm">{car.carName}</div>
                          <div className="text-xs text-gray-500">{car.carModel} • {car.licensePlate}</div>
                          <div className="text-xs text-gray-400">{car.seats} seats • {car.transmission} • {car.fuelType}</div>
                        </td>
                        {/* <td className="py-4 px-6">
                        <div className="text-sm font-medium text-gray-900">{car.totalMileage.toLocaleString()} km</div>
                      </td> */}
                        {/* <td className="py-4 px-6">
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
                      </td> */}
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-900">{car.totalRentals}</div>
                          <div className="text-xs text-gray-500">Total bookings</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-sm text-gray-900">{car.totalDaysRented}</div>
                          <div className="text-xs text-gray-500">days</div>
                        </td>
                        {/* <td className="py-4 px-6">
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
                      </td> */}
                        {/* <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">{car.averageDailyMileage} km</div>
                        <div className="text-xs text-gray-500">per day</div>
                      </td> */}
                        <td className="py-4 px-6">
                          {(() => {
                            const badge = getStatusBadge(car.currentStatus);
                            return <span className={badge.className}>{badge.label}</span>;
                          })()}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => openModal(car)}
                              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              View Details
                            </button>
                            {(car.currentStatus === 'pending' || car.currentStatus === 'active') && (
                              <>
                                <span className="text-gray-300">|</span>
                                <button
                                  onClick={() => openMaintenanceModal(car)}
                                  className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                                >
                                  Schedule
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalItems={filteredUsage.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* Usage Details Modal */}
      <UsageDetailsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        selectedCar={selectedCar}
        onScheduleMaintenance={openMaintenanceModal}
      />

      {/* Maintenance Scheduling Modal */}
      <MaintenanceSchedulingModal
        isOpen={isMaintenanceModalOpen}
        onClose={closeMaintenanceModal}
        selectedCar={selectedCar}
      />
    </>
  );
};

export default UsageTracking;