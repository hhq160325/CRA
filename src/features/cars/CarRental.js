import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import CarCard from './CarCard';
import CarFilters from './CarFilters';
import { fetchAllCars } from './carsSlice';

const CarRental = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { cars, loading, error } = useSelector((state) => state.cars);
  const [showFilters, setShowFilters] = useState(false);

  // Parse URL parameters
  const urlParams = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return {
      q: params.get('q') || '',
      fuel: params.get('fuel') || '',
      seats: params.get('seats') || ''
    };
  }, [location.search]);

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

  const [filters, setFilters] = useState({
    brands: [],
    carTypes: [],
    fuelTypes: [],
    transmissions: [],
    seats: [],
    years: []
  });

  // Memoize display cars to prevent recalculation
  // Only use fallback if there's an error, otherwise wait for API data
  const displayCars = useMemo(() => {
    if (loading && cars.length === 0) {
      // Still loading initial data, don't show anything yet
      return [];
    }
    const activeCars = cars.filter(car => car.status && car.status.toLowerCase() !== 'inactive');
    // Only use fallback if API failed (error) and no cars available
    if (activeCars.length === 0 && error) {
      return fallbackCars;
    }
    return activeCars;
  }, [cars, loading, error]);

  // Memoize filtered cars to prevent unnecessary re-renders
  const filteredCars = useMemo(() => {
    return displayCars.filter(car => {
      // Apply URL parameter filters first
      const searchQuery = urlParams.q.toLowerCase();
      const fuelFilter = urlParams.fuel.toLowerCase();
      const seatsFilter = urlParams.seats;

      // Check URL parameter matches - updated for API data structure
      const matchesSearch = !searchQuery || 
                           car.model?.toLowerCase().includes(searchQuery) ||
                           car.manufacturer?.toLowerCase().includes(searchQuery) ||
                           car.name?.toLowerCase().includes(searchQuery) ||
                           car.brand?.toLowerCase().includes(searchQuery);
      
      const matchesUrlFuel = !fuelFilter || 
                            car.fuelType?.toLowerCase().includes(fuelFilter) ||
                            car.fuel?.toLowerCase().includes(fuelFilter);
      
      const matchesUrlSeats = !seatsFilter || 
                             car.seats?.toString() === seatsFilter ||
                             (typeof car.capacity === 'string' && car.capacity.includes(seatsFilter));

      // If URL parameters don't match, exclude the car
      if (!matchesSearch || !matchesUrlFuel || !matchesUrlSeats) {
        return false;
      }

      // Then apply sidebar filters
      const hasFilters = filters.brands.length > 0 ||
                         filters.carTypes.length > 0 ||
                         filters.fuelTypes.length > 0 || 
                         filters.transmissions.length > 0 || 
                         filters.seats.length > 0 || 
                         filters.years.length > 0;
      
      if (!hasFilters) return true;

      // Check if car matches selected sidebar filters - updated for API data structure
      const matchesBrand = filters.brands.length === 0 || 
                           filters.brands.includes(car.manufacturer || car.brand || car.model?.split(' ')[0]);
      const matchesCarType = filters.carTypes.length === 0 || 
                             filters.carTypes.includes(car.carType || car.type);
      const matchesFuelType = filters.fuelTypes.length === 0 || 
                              filters.fuelTypes.includes(car.fuelType || car.fuel);
      const matchesTransmission = filters.transmissions.length === 0 || 
                                  filters.transmissions.includes(car.transmission);
      const matchesSeats = filters.seats.length === 0 || 
                           filters.seats.includes(car.seats) ||
                           (typeof car.capacity === 'string' && filters.seats.some(s => car.capacity.includes(s.toString())));
      const matchesYear = filters.years.length === 0 || 
                          filters.years.includes(car.yearofManufacture || car.yearOfManufacture);

      return matchesBrand && matchesCarType && matchesFuelType && matchesTransmission && matchesSeats && matchesYear;
    });
  }, [displayCars, filters, urlParams]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

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
            {/* Active URL Filters Display */}
            {(urlParams.q || urlParams.fuel || urlParams.seats) && (
              <div className="mb-6 bg-white rounded-xl p-4 shadow-sm border">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-gray-900">{t('activeFilters') || 'Active Filters'}</h3>
                  <button
                    onClick={() => navigate('/cars')}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {t('clearAll') || 'Clear All'}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {urlParams.q && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                      {t('search') || 'Search'}: "{urlParams.q}"
                      <button
                        onClick={() => {
                          const params = new URLSearchParams(location.search);
                          params.delete('q');
                          navigate(`/cars?${params.toString()}`);
                        }}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {urlParams.fuel && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                      {t('fuel') || 'Fuel'}: {urlParams.fuel}
                      <button
                        onClick={() => {
                          const params = new URLSearchParams(location.search);
                          params.delete('fuel');
                          navigate(`/cars?${params.toString()}`);
                        }}
                        className="ml-2 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {urlParams.seats && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                      {t('seats') || 'Seats'}: {urlParams.seats}
                      <button
                        onClick={() => {
                          const params = new URLSearchParams(location.search);
                          params.delete('seats');
                          navigate(`/cars?${params.toString()}`);
                        }}
                        className="ml-2 text-purple-600 hover:text-purple-800"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Car Grid */}
            {loading && displayCars.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">{t('loadingCars') || 'Loading cars...'}</p>
              </div>
            ) : error && displayCars.length > 0 ? (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 text-sm">{t('showingFallbackData') || 'Showing sample data due to connection issue'}</p>
              </div>
            ) : null}

            {filteredCars.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {urlParams.q || urlParams.fuel || urlParams.seats 
                    ? (t('noMatchingCars') || 'No cars match your search criteria')
                    : (t('noCarsFound') || 'No cars found')
                  }
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {urlParams.q || urlParams.fuel || urlParams.seats
                    ? (t('tryDifferentFilters') || 'Try different search terms or filters')
                    : (t('tryAdjustingFilters') || 'Try adjusting your filters')
                  }
                </p>
              </div>
            ) : (
              <>
                {/* Results header */}
                {(urlParams.q || urlParams.fuel || urlParams.seats) && (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {t('searchResults') || 'Search Results'}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {t('showing') || 'Showing'} {filteredCars.length} {filteredCars.length === 1 ? (t('car') || 'car') : (t('cars') || 'cars')}
                      {urlParams.q && ` ${t('for') || 'for'} "${urlParams.q}"`}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 lg:mb-12">
                  {filteredCars.map((car) => (
                    <CarCard 
                      key={car.id} 
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