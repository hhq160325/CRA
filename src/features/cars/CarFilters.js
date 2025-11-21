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
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
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
    </div>
  );
};

export default CarFilters;