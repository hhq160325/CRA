import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import CarCard from './CarCard';
import CarFilters from './CarFilters';
import { fetchAllCars } from './carsSlice';

const CarRental = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { cars, loading, error } = useSelector((state) => state.cars);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(fetchAllCars());
  }, [dispatch]);

  // Fallback data if API fails
  const fallbackCars = [
    {
      id: 1,
      name: 'Koenigsegg',
      type: 'Sport',
      image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=250&fit=crop',
      fuel: '90L',
      transmission: 'Manual',
      capacity: '2 People',
      price: 99.00,
      originalPrice: null
    },
    {
      id: 2,
      name: 'Nissan GT - R',
      type: 'Sport',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop',
      fuel: '80L',
      transmission: 'Manual',
      capacity: '2 People',
      price: 80.00,
      originalPrice: 100.00
    },
    {
      id: 3,
      name: 'Rolls - Royce',
      type: 'Sport',
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=250&fit=crop',
      fuel: '70L',
      transmission: 'Manual',
      capacity: '4 People',
      price: 96.00,
      originalPrice: null
    },
    {
      id: 4,
      name: 'All New Rush',
      type: 'SUV',
      image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=250&fit=crop',
      fuel: '70L',
      transmission: 'Manual',
      capacity: '6 People',
      price: 72.00,
      originalPrice: 80.00
    },
    {
      id: 5,
      name: 'CR - V',
      type: 'SUV',
      image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=250&fit=crop',
      fuel: '80L',
      transmission: 'Manual',
      capacity: '6 People',
      price: 80.00,
      originalPrice: null
    },
    {
      id: 6,
      name: 'All New Terios',
      type: 'SUV',
      image: 'https://images.unsplash.com/photo-1581540222194-0def2dda95b8?w=400&h=250&fit=crop',
      fuel: '90L',
      transmission: 'Manual',
      capacity: '6 People',
      price: 74.00,
      originalPrice: null
    },
    {
      id: 7,
      name: 'MG ZX Exclusice',
      type: 'Hatchback',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=250&fit=crop',
      fuel: '70L',
      transmission: 'Electric',
      capacity: '4 People',
      price: 76.00,
      originalPrice: 80.00
    },
    {
      id: 8,
      name: 'New MG ZS',
      type: 'SUV',
      image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=400&h=250&fit=crop',
      fuel: '80L',
      transmission: 'Manual',
      capacity: '6 People',
      price: 80.00,
      originalPrice: null
    },
    {
      id: 9,
      name: 'MG ZX Excite',
      type: 'Hatchback',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=250&fit=crop',
      fuel: '90L',
      transmission: 'Electric',
      capacity: '4 People',
      price: 74.00,
      originalPrice: null
    }
  ];

  const displayCars = cars.length > 0 ? cars : fallbackCars;
  const [filters, setFilters] = useState({
    fuelTypes: [],
    transmissions: [],
    seats: [],
    years: []
  });

  // Apply filters to cars
  const filteredCars = displayCars.filter(car => {
    // If no filters selected, show all cars
    const hasFilters = filters.fuelTypes.length > 0 || 
                       filters.transmissions.length > 0 || 
                       filters.seats.length > 0 || 
                       filters.years.length > 0;
    
    if (!hasFilters) return true;

    // Check if car matches selected filters
    const matchesFuelType = filters.fuelTypes.length === 0 || 
                            filters.fuelTypes.includes(car.fuelType || car.fuel);
    const matchesTransmission = filters.transmissions.length === 0 || 
                                filters.transmissions.includes(car.transmission);
    const matchesSeats = filters.seats.length === 0 || 
                         filters.seats.includes(car.seats) ||
                         (typeof car.capacity === 'string' && filters.seats.some(s => car.capacity.includes(s.toString())));
    const matchesYear = filters.years.length === 0 || 
                        filters.years.includes(car.yearOfManufacture);

    return matchesFuelType && matchesTransmission && matchesSeats && matchesYear;
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Sidebar Filters - Hidden on mobile, can be toggled */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <CarFilters cars={displayCars} onFilterChange={handleFilterChange} />
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center w-full bg-white rounded-xl p-4 shadow-sm border"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="font-semibold text-gray-900">{t('filters') || 'Filters'}</span>
              <svg className={`w-5 h-5 ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Mobile Filters Dropdown */}
          {showFilters && (
            <div className="lg:hidden mb-6">
              <CarFilters cars={displayCars} onFilterChange={handleFilterChange} />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Pick-Up and Drop-Off Section */}
            {/* <div className="mb-6 lg:mb-8">
              <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8"> */}
                  {/* Pick-Up Section */}
                  {/* <div className="flex-1">
                    <div className="flex items-center mb-4 lg:mb-6">
                      <div className="w-4 h-4 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                      <span className="font-semibold text-gray-900">{t('pickUp') || 'Pick-Up'}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">{t('location') || 'Locations'}</label>
                        <select className="w-full p-3 border-0 bg-gray-50 rounded-lg text-sm text-gray-500 focus:outline-none">
                          <option>{t('selectCity') || 'Select city'}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">{t('date') || 'Date'}</label>
                        <select className="w-full p-3 border-0 bg-gray-50 rounded-lg text-sm text-gray-500 focus:outline-none">
                          <option>{t('selectDate') || 'Select date'}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">{t('time') || 'Time'}</label>
                        <select className="w-full p-3 border-0 bg-gray-50 rounded-lg text-sm text-gray-500 focus:outline-none">
                          <option>{t('selectTime') || 'Select time'}</option>
                        </select>
                      </div>
                    </div>
                  </div> */}

                  {/* Swap Button */}
                  {/* <div className="flex justify-center lg:block lg:pt-8">
                    <button className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 shadow-md transition-colors">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </button>
                  </div> */}

                  {/* Drop-Off Section */}
                  {/* <div className="flex-1">
                    <div className="flex items-center mb-4 lg:mb-6">
                      <div className="w-4 h-4 bg-blue-300 rounded-full mr-3 flex-shrink-0"></div>
                      <span className="font-semibold text-gray-900">{t('dropOff') || 'Drop-Off'}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">{t('location') || 'Locations'}</label>
                        <select className="w-full p-3 border-0 bg-gray-50 rounded-lg text-sm text-gray-500 focus:outline-none">
                          <option>{t('selectCity') || 'Select city'}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">{t('date') || 'Date'}</label>
                        <select className="w-full p-3 border-0 bg-gray-50 rounded-lg text-sm text-gray-500 focus:outline-none">
                          <option>{t('selectDate') || 'Select date'}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">{t('time') || 'Time'}</label>
                        <select className="w-full p-3 border-0 bg-gray-50 rounded-lg text-sm text-gray-500 focus:outline-none">
                          <option>{t('selectTime') || 'Select time'}</option>
                        </select>
                      </div>
                    </div>
                  </div> */}
                {/* </div>
              </div>
            </div> */}

            {/* Car Grid */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">{t('loadingCars') || 'Loading cars...'}</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">{t('errorLoadingCars') || 'Error loading cars'}: {error}</p>
                <p className="text-gray-500 mt-2">{t('showingFallbackData') || 'Showing sample data'}</p>
              </div>
            ) : null}

            {filteredCars.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">{t('noCarsFound') || 'No cars found'}</h3>
                <p className="mt-1 text-sm text-gray-500">{t('tryAdjustingFilters') || 'Try adjusting your filters'}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 lg:mb-12">
                  {filteredCars.map((car) => (
                    <CarCard 
                      key={cars.length > 0 ? car.carId : car.id} 
                      car={car} 
                      isApiData={cars.length > 0}
                    />
                  ))}
                </div>

                {/* Show More Button */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="hidden sm:block"></div>
                  <button className="bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-blue-700 font-semibold transition-colors w-full sm:w-auto">
                    {t('showMoreCar') || 'Show more car'}
                  </button>
                  <p className="text-gray-500 text-sm order-first sm:order-last">
                    {filteredCars.length} {t('car') || 'Car'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarRental;