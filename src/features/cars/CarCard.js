import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, selectIsFavorite } from '../favorites/favoritesSlice';

const CarCard = ({ car }) => {
    const dispatch = useDispatch();
    const isCarFavorite = useSelector(selectIsFavorite(car.id));

    const handleCarToggleFavorite = () => {
        const carData = {
            id: car.id,
            name: car.name,
            type: car.type,
            price: car.price,
            originalPrice: car.originalPrice,
            image: car.image,
            fuel: car.fuel,
            transmission: car.transmission,
            capacity: car.capacity
        };
        dispatch(toggleFavorite({
            carId: car.id,
            carData: carData
        }));
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
                <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-48 object-cover"
                />
                <button
                    onClick={handleCarToggleFavorite}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-red-500 hover:text-red-600"
                >
                    <svg
                        className="w-5 h-5"
                        fill={isCarFavorite ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
                <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                    {car.type}
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{car.name}</h3>

                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        </svg>
                        {car.fuel}
                    </div>
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                        </svg>
                        {car.transmission}
                    </div>
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {car.capacity}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <div className='flex items-center justify-between'>
                            <div className="text-xl font-bold text-gray-900">${typeof car.price === 'number' ? car.price.toFixed(2) : (parseFloat(car.price) || 0).toFixed(2)}</div>
                            <div className="text-sm text-slate-400">/day</div>
                        </div>
                        {car.originalPrice && (
                            <div className="text-sm text-gray-500 line-through">${typeof car.originalPrice === 'number' ? car.originalPrice.toFixed(2) : (parseFloat(car.originalPrice) || 0).toFixed(2)}</div>
                        )}
                    </div>
                    <Link
                        to={`/cars/${car.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                        Rent Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CarCard;