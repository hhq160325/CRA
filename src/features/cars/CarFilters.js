<<<<<<< HEAD
import React, { useState } from 'react';

const CarFilters = () => {
  const [selectedTypes, setSelectedTypes] = useState(['Sport', 'SUV']);
  const [selectedCapacities, setSelectedCapacities] = useState(['2 Person', '8 or More']);
  const [priceRange, setPriceRange] = useState(100);

  const carTypes = [
    { name: 'Sport', count: 10 },
    { name: 'SUV', count: 12 },
    { name: 'MPV', count: 16 },
    { name: 'Sedan', count: 20 },
    { name: 'Coupe', count: 14 },
    { name: 'Hatchback', count: 14 }
  ];

  const capacities = [
    { name: '2 Person', count: 10 },
    { name: '4 Person', count: 14 },
    { name: '6 Person', count: 12 },
    { name: '8 or More', count: 16 }
  ];

  const handleTypeChange = (type, event) => {
    setSelectedTypes(prev =>
=======
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const CarFilters = ({ cars = [], onFilterChange }) => {
  const { t } = useTranslation();
  const [selectedFuelTypes, setSelectedFuelTypes] = useState([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);

  // Extract unique values from cars
  const fuelTypes = [...new Set(cars.map(car => car.fuelType).filter(Boolean))];
  const transmissions = [...new Set(cars.map(car => car.transmission).filter(Boolean))];
  const seats = [...new Set(cars.map(car => car.seats).filter(Boolean))].sort((a, b) => a - b);
  const years = [...new Set(cars.map(car => car.yearOfManufacture).filter(Boolean))].sort((a, b) => b - a);

  // Count cars for each filter option
  const countByFuelType = (type) => cars.filter(car => car.fuelType === type).length;
  const countByTransmission = (trans) => cars.filter(car => car.transmission === trans).length;
  const countBySeats = (seat) => cars.filter(car => car.seats === seat).length;
  const countByYear = (year) => cars.filter(car => car.yearOfManufacture === year).length;

  // Apply filters whenever selections change
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        fuelTypes: selectedFuelTypes,
        transmissions: selectedTransmissions,
        seats: selectedSeats,
        years: selectedYears
      });
    }
  }, [selectedFuelTypes, selectedTransmissions, selectedSeats, selectedYears, onFilterChange]);

  const handleFuelTypeChange = (type, event) => {
    setSelectedFuelTypes(prev =>
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
<<<<<<< HEAD
    // Remove focus to prevent blue border from persisting
    event.target.blur();
  };

  const handleCapacityChange = (capacity, event) => {
    setSelectedCapacities(prev =>
      prev.includes(capacity)
        ? prev.filter(c => c !== capacity)
        : [...prev, capacity]
    );
    // Remove focus to prevent blue border from persisting
    event.target.blur();
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      {/* Type Filter */}
      <div className="mb-12">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-7">TYPE</h3>
        <div className="space-y-8">
          {carTypes.map((type) => (
            <label key={type.name} className="flex items-center cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type.name)}
                  onChange={(e) => handleTypeChange(type.name, e)}
                  className="w-5 h-5 text-blue-600 border-2 border-gray-200 rounded focus:ring-blue-500 focus:ring-2"
                />
                {selectedTypes.includes(type.name) && (
                  <svg className="absolute inset-0 w-5 h-5 text-blue-600 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M1827.701 303.065 698.835 1431.801 92.299 825.266 0 917.564 698.835 1616.4 1919.869 395.234z" fill-rule="evenodd"></path>
                  </svg>
                  // <svg className="absolute inset-0 w-5 h-5 text-blue-600 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                  //   <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  // </svg>
                )}
              </div>
              <span className="ml-4 text-gray-600 flex-1 font-medium group-hover:text-gray-900 transition-colors">{type.name}</span>
              <span className="text-gray-400 text-sm">({type.count})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Capacity Filter */}
      <div className="mb-12">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-7">CAPACITY</h3>
        <div className="space-y-8">
          {capacities.map((capacity) => (
            <label key={capacity.name} className="flex items-center cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={selectedCapacities.includes(capacity.name)}
                  onChange={(e) => handleCapacityChange(capacity.name, e)}
                  className="w-5 h-5 text-blue-600 border-2 border-gray-200 rounded focus:ring-blue-500 focus:ring-2"
                />
                {selectedCapacities.includes(capacity.name) && (
                  <svg className="absolute inset-0 w-5 h-5 text-blue-600 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M1827.701 303.065 698.835 1431.801 92.299 825.266 0 917.564 698.835 1616.4 1919.869 395.234z" fill-rule="evenodd"></path>
                  </svg>
                )}
              </div>
              <span className="ml-4 text-gray-600 flex-1 font-medium group-hover:text-gray-900 transition-colors">{capacity.name}</span>
              <span className="text-gray-400 text-sm">({capacity.count})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div>
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-7">PRICE</h3>
        <div className="space-y-6">
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-4">
              <span>Max. $100.00</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider {
          background: linear-gradient(to right, #3B82F6 0%, #3B82F6 ${priceRange}%, #E5E7EB ${priceRange}%, #E5E7EB 100%);
        }
        
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }
      `}</style>
=======
    event.target.blur();
  };

  const handleTransmissionChange = (trans, event) => {
    setSelectedTransmissions(prev =>
      prev.includes(trans)
        ? prev.filter(t => t !== trans)
        : [...prev, trans]
    );
    event.target.blur();
  };

  const handleSeatsChange = (seat, event) => {
    setSelectedSeats(prev =>
      prev.includes(seat)
        ? prev.filter(s => s !== seat)
        : [...prev, seat]
    );
    event.target.blur();
  };

  const handleYearChange = (year, event) => {
    setSelectedYears(prev =>
      prev.includes(year)
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
    event.target.blur();
  };

  const getFuelTypeLabel = (type) => {
    const lowerType = type?.toLowerCase();
    if (lowerType === 'gasoline') return t('gasoline') || 'Gasoline';
    if (lowerType === 'diesel') return t('diesel') || 'Diesel';
    if (lowerType === 'electric') return t('electric') || 'Electric';
    if (lowerType === 'hybrid') return t('hybrid') || 'Hybrid';
    return type;
  };

  const getTransmissionLabel = (trans) => {
    const lowerTrans = trans?.toLowerCase();
    if (lowerTrans === 'manual') return t('manual') || 'Manual';
    if (lowerTrans === 'automatic') return t('automatic') || 'Automatic';
    return trans;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      {/* Fuel Type Filter */}
      {fuelTypes.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-7">
            {t('fuelType') || 'FUEL TYPE'}
          </h3>
          <div className="space-y-8">
            {fuelTypes.map((type) => (
              <label key={type} className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedFuelTypes.includes(type)}
                    onChange={(e) => handleFuelTypeChange(type, e)}
                    className="w-5 h-5 text-blue-600 border-2 border-gray-200 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  {selectedFuelTypes.includes(type) && (
                    <svg className="absolute inset-0 w-5 h-5 text-blue-600 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M1827.701 303.065 698.835 1431.801 92.299 825.266 0 917.564 698.835 1616.4 1919.869 395.234z" fillRule="evenodd"></path>
                    </svg>
                  )}
                </div>
                <span className="ml-4 text-gray-600 flex-1 font-medium group-hover:text-gray-900 transition-colors">
                  {getFuelTypeLabel(type)}
                </span>
                <span className="text-gray-400 text-sm">({countByFuelType(type)})</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Transmission Filter */}
      {transmissions.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-7">
            {t('transmission') || 'TRANSMISSION'}
          </h3>
          <div className="space-y-8">
            {transmissions.map((trans) => (
              <label key={trans} className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedTransmissions.includes(trans)}
                    onChange={(e) => handleTransmissionChange(trans, e)}
                    className="w-5 h-5 text-blue-600 border-2 border-gray-200 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  {selectedTransmissions.includes(trans) && (
                    <svg className="absolute inset-0 w-5 h-5 text-blue-600 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M1827.701 303.065 698.835 1431.801 92.299 825.266 0 917.564 698.835 1616.4 1919.869 395.234z" fillRule="evenodd"></path>
                    </svg>
                  )}
                </div>
                <span className="ml-4 text-gray-600 flex-1 font-medium group-hover:text-gray-900 transition-colors">
                  {getTransmissionLabel(trans)}
                </span>
                <span className="text-gray-400 text-sm">({countByTransmission(trans)})</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Seats Filter */}
      {seats.length > 0 && (
        <div className="mb-12">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-7">
            {t('capacity') || 'CAPACITY'}
          </h3>
          <div className="space-y-8">
            {seats.map((seat) => (
              <label key={seat} className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedSeats.includes(seat)}
                    onChange={(e) => handleSeatsChange(seat, e)}
                    className="w-5 h-5 text-blue-600 border-2 border-gray-200 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  {selectedSeats.includes(seat) && (
                    <svg className="absolute inset-0 w-5 h-5 text-blue-600 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M1827.701 303.065 698.835 1431.801 92.299 825.266 0 917.564 698.835 1616.4 1919.869 395.234z" fillRule="evenodd"></path>
                    </svg>
                  )}
                </div>
                <span className="ml-4 text-gray-600 flex-1 font-medium group-hover:text-gray-900 transition-colors">
                  {seat} {t('people') || 'People'}
                </span>
                <span className="text-gray-400 text-sm">({countBySeats(seat)})</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Year Filter */}
      {years.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-7">
            {t('yearOfManufacture') || 'YEAR'}
          </h3>
          <div className="space-y-8">
            {years.map((year) => (
              <label key={year} className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedYears.includes(year)}
                    onChange={(e) => handleYearChange(year, e)}
                    className="w-5 h-5 text-blue-600 border-2 border-gray-200 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  {selectedYears.includes(year) && (
                    <svg className="absolute inset-0 w-5 h-5 text-blue-600 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M1827.701 303.065 698.835 1431.801 92.299 825.266 0 917.564 698.835 1616.4 1919.869 395.234z" fillRule="evenodd"></path>
                    </svg>
                  )}
                </div>
                <span className="ml-4 text-gray-600 flex-1 font-medium group-hover:text-gray-900 transition-colors">
                  {year}
                </span>
                <span className="text-gray-400 text-sm">({countByYear(year)})</span>
              </label>
            ))}
          </div>
        </div>
      )}
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
    </div>
  );
};

export default CarFilters;