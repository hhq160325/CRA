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
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCarTypes, setSelectedCarTypes] = useState([]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    brand: true,
    carType: true,
    fuelType: true,
    transmission: true,
    capacity: true,
    year: true
  });

  // Extract unique values from cars
  const brands = [...new Set(cars.map(car => car.manufacturer || car.brand || car.name?.split(' ')[0]).filter(Boolean))].sort();
  const carTypes = [...new Set(cars.map(car => car.carType || car.type).filter(Boolean))].sort();
  const fuelTypes = [...new Set(cars.map(car => car.fuelType).filter(Boolean))];
  const transmissions = [...new Set(cars.map(car => car.transmission).filter(Boolean))];
  const seats = [...new Set(cars.map(car => car.seats).filter(Boolean))].sort((a, b) => a - b);
  const years = [...new Set(cars.map(car => car.yearOfManufacture).filter(Boolean))].sort((a, b) => b - a);

  // Count cars for each filter option
  const countByBrand = (brand) => cars.filter(car => (car.manufacturer || car.brand || car.name?.split(' ')[0]) === brand).length;
  const countByCarType = (type) => cars.filter(car => (car.carType || car.type) === type).length;
  const countByFuelType = (type) => cars.filter(car => car.fuelType === type).length;
  const countByTransmission = (trans) => cars.filter(car => car.transmission === trans).length;
  const countBySeats = (seat) => cars.filter(car => car.seats === seat).length;
  const countByYear = (year) => cars.filter(car => car.yearOfManufacture === year).length;

  // Apply filters whenever selections change
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        brands: selectedBrands,
        carTypes: selectedCarTypes,
        fuelTypes: selectedFuelTypes,
        transmissions: selectedTransmissions,
        seats: selectedSeats,
        years: selectedYears
      });
    }
  }, [selectedBrands, selectedCarTypes, selectedFuelTypes, selectedTransmissions, selectedSeats, selectedYears, onFilterChange]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleBrandChange = (brand, event) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
    event.target.blur();
  };

  const handleCarTypeChange = (type, event) => {
    setSelectedCarTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
    event.target.blur();
  };

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

  const renderFilterSection = (title, items, selectedItems, onItemChange, countFn, labelFn, sectionKey) => {
    if (items.length === 0) return null;

    return (
      <div key={sectionKey} className="mb-8 border-b border-gray-100 pb-8 last:border-b-0 last:pb-0">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="flex items-center justify-between w-full text-left mb-4 hover:text-blue-600 transition-colors"
        >
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            {title}
          </h3>
          <svg
            className={`w-4 h-4 text-gray-400 transform transition-transform ${expandedSections[sectionKey] ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedSections[sectionKey] && (
          <div className="space-y-6">
            {items.map((item) => (
              <label key={item} className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item)}
                    onChange={(e) => onItemChange(item, e)}
                    className="w-5 h-5 text-blue-600 border-2 border-gray-200 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  {selectedItems.includes(item) && (
                    <svg className="absolute inset-0 w-5 h-5 text-blue-600 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M1827.701 303.065 698.835 1431.801 92.299 825.266 0 917.564 698.835 1616.4 1919.869 395.234z" fillRule="evenodd"></path>
                    </svg>
                  )}
                </div>
                <span className="ml-4 text-gray-600 flex-1 font-medium group-hover:text-gray-900 transition-colors">
                  {labelFn ? labelFn(item) : item}
                </span>
                <span className="text-gray-400 text-sm">({countFn(item)})</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      {/* Brand Filter */}
      {renderFilterSection(
        t('brand') || 'BRAND',
        brands,
        selectedBrands,
        handleBrandChange,
        countByBrand,
        null,
        'brand'
      )}

      {/* Car Type Filter */}
      {renderFilterSection(
        t('carType') || 'CAR TYPE',
        carTypes,
        selectedCarTypes,
        handleCarTypeChange,
        countByCarType,
        null,
        'carType'
      )}

      {/* Fuel Type Filter */}
      {renderFilterSection(
        t('fuelType') || 'FUEL TYPE',
        fuelTypes,
        selectedFuelTypes,
        handleFuelTypeChange,
        countByFuelType,
        getFuelTypeLabel,
        'fuelType'
      )}

      {/* Transmission Filter */}
      {renderFilterSection(
        t('transmission') || 'TRANSMISSION',
        transmissions,
        selectedTransmissions,
        handleTransmissionChange,
        countByTransmission,
        getTransmissionLabel,
        'transmission'
      )}

      {/* Seats Filter */}
      {renderFilterSection(
        t('capacity') || 'CAPACITY',
        seats,
        selectedSeats,
        handleSeatsChange,
        countBySeats,
        (seat) => `${seat} ${t('people') || 'People'}`,
        'capacity'
      )}

      {/* Year Filter */}
      {renderFilterSection(
        t('yearOfManufacture') || 'YEAR',
        years,
        selectedYears,
        handleYearChange,
        countByYear,
        null,
        'year'
      )}
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
    </div>
  );
};

export default CarFilters;