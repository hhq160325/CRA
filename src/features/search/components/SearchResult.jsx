import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import CarCard from '../../cars/CarCard';

const STATIC_CARS = [
  { id: 1, name: 'Koenigsegg', type: 'Sport', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=250&fit=crop', fuel: 'Electric', transmission: 'Automatic', capacity: '2', price: 99.00 },
  { id: 2, name: 'Nissan GT-R', type: 'Sport', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=250&fit=crop', fuel: 'Gasoline', transmission: 'Manual', capacity: '2', price: 80.00, originalPrice: 100.00 },
  { id: 3, name: 'Rolls-Royce', type: 'Luxury', image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=250&fit=crop', fuel: 'Hybrid', transmission: 'Automatic', capacity: '4', price: 96.00 },
  { id: 4, name: 'All New Rush', type: 'SUV', image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=400&h=250&fit=crop', fuel: 'Diesel', transmission: 'Automatic', capacity: '6', price: 72.00, originalPrice: 80.00 },
  { id: 5, name: 'CR-V', type: 'SUV', image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=400&h=250&fit=crop', fuel: 'Gasoline', transmission: 'Automatic', capacity: '5', price: 80.00 },
  { id: 6, name: 'All New Terios', type: 'SUV', image: 'https://images.unsplash.com/photo-1511391401215-3e5fe8c714c6?w=400&h=250&fit=crop', fuel: 'Gasoline', transmission: 'Manual', capacity: '7', price: 74.00 }
];

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const SearchResult = () => {
  const query = useQuery();
  const q = (query.get('q') || '').toLowerCase();
  const fuel = (query.get('fuel') || '').toLowerCase();
  const seats = query.get('seats') || '';

  const filtered = useMemo(() => {
    return STATIC_CARS.filter((car) => {
      const matchName = q ? car.name.toLowerCase().includes(q) : true;
      const matchFuel = fuel ? car.fuel.toLowerCase().includes(fuel) : true;
      const matchSeats = seats ? car.capacity.toString().startsWith(seats) : true;
      return matchName && matchFuel && matchSeats;
    });
  }, [q, fuel, seats]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Search Results</h1>
        <p className="text-sm text-gray-600 mt-1">
          Showing {filtered.length} {filtered.length === 1 ? 'car' : 'cars'}{q ? ` for "${q}"` : ''}
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="text-gray-500 text-sm">No cars match your criteria.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((car) => (
            <CarCard key={car.id} car={{ ...car, capacity: `${car.capacity} People`, fuel: car.fuel }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResult;


