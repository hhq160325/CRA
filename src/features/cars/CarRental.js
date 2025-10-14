import React, { useState } from 'react';
import CarCard from './CarCard';
import CarFilters from './CarFilters';

const CarRental = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [cars] = useState([
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
  ]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Sidebar Filters - Hidden on mobile, can be toggled */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <CarFilters />
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
              <span className="font-semibold text-gray-900">Filters</span>
              <svg className={`w-5 h-5 ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Mobile Filters Dropdown */}
          {showFilters && (
            <div className="lg:hidden mb-6">
              <CarFilters />
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1">
            {/* Pick-Up and Drop-Off Section */}
            <div className="relative mb-6 lg:mb-8">
              <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-16 relative">
                  {/* Pick-Up Section */}
                  <div>
                    <div className="flex items-center mb-4 lg:mb-6">
                      <div className="w-4 h-4 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
                      <span className="font-semibold text-gray-900">Pick-Up</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Locations</label>
                        <select className="w-full p-3 border-0 bg-gray-50 rounded-lg text-sm text-gray-500 focus:outline-none">
                          <option>Select city</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Date</label>
                        <select className="w-full p-3 border-0 bg-gray-50 rounded-lg text-sm text-gray-500 focus:outline-none">
                          <option>Select date</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Time</label>
                        <select className="w-full p-3 border-0 bg-gray-50 rounded-lg text-sm text-gray-500 focus:outline-none">
                          <option>Select time</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Drop-Off Section */}
                  <div>
                    <div className="flex items-center mb-4 lg:mb-6">
                      <div className="w-4 h-4 bg-blue-300 rounded-full mr-3 flex-shrink-0"></div>
                      <span className="font-semibold text-gray-900">Drop-Off</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Locations</label>
                        <select className="w-full p-3 border-0 bg-gray-50 rounded-lg text-sm text-gray-500 focus:outline-none">
                          <option>Select city</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Date</label>
                        <select className="w-full p-3 border-0 bg-gray-50 rounded-lg text-sm text-gray-500 focus:outline-none">
                          <option>Select date</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Time</label>
                        <select className="w-full p-3 border-0 bg-gray-50 rounded-lg text-sm text-gray-500 focus:outline-none">
                          <option>Select time</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overlapping Swap Button - Hidden on mobile, shown on larger screens */}
              <div className="hidden lg:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <button className="bg-gray-900 text-white p-4 rounded-xl hover:bg-blue-700 shadow-xl">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Car Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 lg:mb-12">
              {cars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>

            {/* Show More Button */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="hidden sm:block"></div>
              <button className="bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl hover:bg-blue-700 font-semibold transition-colors w-full sm:w-auto">
                Show more car
              </button>
              <p className="text-gray-500 text-sm order-first sm:order-last">120 Car</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarRental;