import { useState, useEffect } from 'react';
import { axiosInstance } from '../../../shared/utils/axiosInstance';
import { CAR_ENDPOINTS, BOOKING_ENDPOINTS, SCHEDULE_ENDPOINTS } from '../../../config/api';
import DropdownTemplate from '../../../shared/components/DropdownTemplate';
import { tokenUtils } from '../../auth/utils';

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
  
  // Maintenance form state
  const [maintenanceForm, setMaintenanceForm] = useState({
    title: '',
    location: '',
    startDate: '',
    endDate: '',
    note: '',
  });
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);
  const [maintenanceError, setMaintenanceError] = useState(null);
  const [maintenanceSuccess, setMaintenanceSuccess] = useState(false);

  // Helper function to fetch bookings for a car
  const fetchCarBookings = async (carId) => {
    try {
      const response = await axiosInstance.get(BOOKING_ENDPOINTS.GET_CAR_BOOKINGS(carId));
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching bookings for car ${carId}:`, error);
      return [];
    }
  };

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
        
        const response = await axiosInstance.get(CAR_ENDPOINTS.GET_ALL_CARS);
        const allCars = response.data || [];
        
        // Filter cars by current owner ID
        const cars = allCars.filter(car => car.owner.id === currentOwnerId);
        
        // Fetch bookings for each car in parallel
        const carsWithBookings = await Promise.all(
          cars.map(async (car) => {
            const bookings = await fetchCarBookings(car.id);
            
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
              totalMileage: 0, // Not available in API
              rentalMileage: 0, // Not available in API
              personalMileage: 0, // Not available in API
              totalRentals,
              totalDaysRented,
              availabilityRate: 0, // Would need more data to calculate
              utilizationRate: 0, // Would need more data to calculate
              averageDailyMileage: 0, // Not available in API
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
      case 'available':
        return { className: `${baseClasses} bg-green-100 text-green-800`, label: 'Available' };
      case 'reserved':
        return { className: `${baseClasses} bg-gray-100 text-gray-800`, label: 'Reserved' };
      case 'pending':
        return { className: `${baseClasses} bg-blue-100 text-blue-800`, label: 'Active' };
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
    setMaintenanceForm({
      title: '',
      location: '',
      startDate: '',
      endDate: '',
      note: '',
    });
    setMaintenanceError(null);
    setMaintenanceSuccess(false);
  };

  const closeMaintenanceModal = () => {
    setIsMaintenanceModalOpen(false);
    setSelectedCar(null);
    setMaintenanceForm({
      title: '',
      location: '',
      startDate: '',
      endDate: '',
      note: '',
    });
    setMaintenanceError(null);
    setMaintenanceSuccess(false);
  };

  const handleMaintenanceFormChange = (e) => {
    const { name, value } = e.target;
    setMaintenanceForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleScheduleMaintenance = async (e) => {
    e.preventDefault();
    
    if (!selectedCar) return;
    
    // Validation
    if (!maintenanceForm.title || !maintenanceForm.location || !maintenanceForm.startDate || !maintenanceForm.endDate) {
      setMaintenanceError('Please fill in all required fields');
      return;
    }

    if (new Date(maintenanceForm.startDate) >= new Date(maintenanceForm.endDate)) {
      setMaintenanceError('End date must be after start date');
      return;
    }

    try {
      setMaintenanceLoading(true);
      setMaintenanceError(null);

      const payload = {
        title: maintenanceForm.title,
        location: maintenanceForm.location,
        startDate: new Date(maintenanceForm.startDate).toISOString(),
        endDate: new Date(maintenanceForm.endDate).toISOString(),
        note: maintenanceForm.note || '',
        carId: selectedCar.id
      };

      await axiosInstance.post(SCHEDULE_ENDPOINTS.CREATE_CAR_SCHEDULES, payload);
      
      setMaintenanceSuccess(true);
      setTimeout(() => {
        closeMaintenanceModal();
      }, 2000);
      
    } catch (err) {
      console.error('Error scheduling maintenance:', err);
      setMaintenanceError(err.response?.data?.message || 'Failed to schedule maintenance. Please try again.');
    } finally {
      setMaintenanceLoading(false);
    }
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // Calculate overall statistics
  const totalCars = usageData.length;
  const totalRentals = usageData.reduce((sum, car) => sum + car.totalRentals, 0);

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
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
        </div> */}

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

        {/* <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-orange-500">
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
        </div> */}
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
                  // const rentalPercentage = (car.rentalMileage / car.totalMileage * 100).toFixed(1);
                  // const personalPercentage = (car.personalMileage / car.totalMileage * 100).toFixed(1);
                  
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
                          {car.currentStatus === 'pending' && (
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
        <div className="flex items-center justify-between py-4 px-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {filteredUsage.length > 0 ? (
              <>Showing {startIndex + 1} to {Math.min(endIndex, filteredUsage.length)} of {filteredUsage.length} results</>
            ) : (
              <>No results</>
            )}
          </div>
          {totalPages > 0 && (
            <div className="flex items-center space-x-2">
              <button 
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Previous
              </button>
              <div className="flex space-x-1">
                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center text-gray-500">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 text-sm rounded ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  )
                ))}
              </div>
              <button 
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === totalPages 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

      {/* Modal for detailed usage view */}
      {isModalOpen && selectedCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
              {/* <div className="bg-gray-50 rounded-lg p-6 space-y-4">
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
              </div> */}

              {/* Rental Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Rentals</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedCar.totalRentals}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Total Days Rented</p>
                  <p className="text-2xl font-bold text-green-600">{selectedCar.totalDaysRented}</p>
                </div>
                {/* <div className="bg-orange-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Avg. Daily Mileage</p>
                  <p className="text-2xl font-bold text-orange-600">{selectedCar.averageDailyMileage} km</p>
                </div> */}
              </div>

              {/* Utilization Stats */}
              <div className="grid grid-cols-1 gap-4">
                {/* <div className="bg-gray-50 rounded-lg p-4">
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
                </div> */}
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
                <div className="grid grid-cols-1 gap-4 text-sm">
                  {/* <div>
                    <p className="text-gray-600">Last Rental Date</p>
                    <p className="font-medium text-gray-900">{selectedCar.lastRentalDate}</p>
                  </div> */}
                  <div>
                    <p className="text-gray-600">Current Status</p>
                    {(() => {
                      const badge = getStatusBadge(selectedCar.currentStatus);
                      return <span className={badge.className}>{badge.label}</span>;
                    })()}
                  </div>
                </div>
              </div>

              {/* Schedule Maintenance Button */}
              {selectedCar.currentStatus === 'pending' && (
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      closeModal();
                      openMaintenanceModal(selectedCar);
                    }}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                  >
                    Schedule Maintenance
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Maintenance Scheduling Modal */}
      {isMaintenanceModalOpen && selectedCar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Schedule Maintenance</h2>
                <button
                  onClick={closeMaintenanceModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleScheduleMaintenance} className="p-6 space-y-6">
              {/* Car Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-600">Car</p>
                <p className="font-medium text-gray-900 text-lg">{selectedCar.carName}</p>
                <p className="text-sm text-gray-500">{selectedCar.licensePlate}</p>
              </div>

              {/* Success Message */}
              {maintenanceSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-green-800 font-medium">Maintenance scheduled successfully!</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {maintenanceError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 text-sm">{maintenanceError}</p>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={maintenanceForm.title}
                    onChange={handleMaintenanceFormChange}
                    placeholder="e.g., Oil Change, Tire Replacement"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                    disabled={maintenanceLoading || maintenanceSuccess}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={maintenanceForm.location}
                    onChange={handleMaintenanceFormChange}
                    placeholder="e.g., ABC Auto Service Center"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                    disabled={maintenanceLoading || maintenanceSuccess}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="startDate"
                      value={maintenanceForm.startDate}
                      onChange={handleMaintenanceFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                      disabled={maintenanceLoading || maintenanceSuccess}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="datetime-local"
                      name="endDate"
                      value={maintenanceForm.endDate}
                      onChange={handleMaintenanceFormChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                      disabled={maintenanceLoading || maintenanceSuccess}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note
                  </label>
                  <textarea
                    name="note"
                    value={maintenanceForm.note}
                    onChange={handleMaintenanceFormChange}
                    placeholder="Additional notes or instructions..."
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    disabled={maintenanceLoading || maintenanceSuccess}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={closeMaintenanceModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={maintenanceLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                  disabled={maintenanceLoading || maintenanceSuccess}
                >
                  {maintenanceLoading ? 'Scheduling...' : 'Schedule Maintenance'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UsageTracking;

