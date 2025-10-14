import React from 'react';
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
            specifications: {
                gasoline: car.fuel,
                steering: car.transmission,
                capacity: car.capacity
            },
        };
        dispatch(toggleFavorite({
            carId: car.id,
            carData: carData
        }));
    };

    return (
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-gray-900 truncate">{car.name}</h3>
                    <p className="text-gray-500 text-sm">{car.type}</p>
                </div>
                <button
                    onClick={handleCarToggleFavorite}
                    className="text-red-500 hover:text-red-600 transition-colors ml-2 flex-shrink-0"
                >
                    <svg
                        className="w-6 h-6"
                        fill={isCarFavorite ? "currentColor" : "none"}
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>

            <div className="mb-4">
                <img src={car.image} alt={car.name} className="w-full h-32 sm:h-40 object-cover rounded-lg" />
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between text-sm text-gray-500 mb-4 gap-2 sm:gap-0">
                <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    </svg>
                    <span>{car.fuel}</span>
                </div>
                <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                    </svg>
                    <span>{car.transmission}</span>
                </div>
                <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span>{car.capacity}</span>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                <div>
                    <div className="flex items-baseline">
                        <span className="text-xl font-bold text-gray-900">${car.price.toFixed(2)}/</span>
                        <span className="text-gray-500">day</span>
                    </div>
                    {car.originalPrice && (
                        <div className="text-gray-400 line-through text-sm mt-1">${car.originalPrice.toFixed(2)}</div>
                    )}
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto">
                    Rent Now
                </button>
            </div>
        </div>
    );
};

export default CarCard;