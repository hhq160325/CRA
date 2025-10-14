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

  const handleTypeChange = (type) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const handleCapacityChange = (capacity) => {
    setSelectedCapacities(prev => 
      prev.includes(capacity) 
        ? prev.filter(c => c !== capacity)
        : [...prev, capacity]
    );
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
                  onChange={() => handleTypeChange(type.name)}
                  className="w-5 h-5 text-blue-600 border-2 border-gray-200 rounded focus:ring-blue-500 focus:ring-2"
                />
                {selectedTypes.includes(type.name) && (
                  <svg className="absolute inset-0 w-5 h-5 text-blue-600 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
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
                  onChange={() => handleCapacityChange(capacity.name)}
                  className="w-5 h-5 text-blue-600 border-2 border-gray-200 rounded focus:ring-blue-500 focus:ring-2"
                />
                {selectedCapacities.includes(capacity.name) && (
                  <svg className="absolute inset-0 w-5 h-5 text-blue-600 pointer-events-none" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
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
    </div>
  );
};

export default CarFilters;