import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { toggleFavorite, selectIsFavorite } from '../favorites/favoritesSlice';
import { getCarRentalRate } from './carApi';

const CarCard = ({ car, isApiData = false }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const carId = car.id;
    const isCarFavorite = useSelector(selectIsFavorite(carId));
    const [rentalRate, setRentalRate] = useState(null);
    const [loadingRate, setLoadingRate] = useState(false);

    // Fetch rental rate when component mounts
    useEffect(() => {
        const fetchRentalRate = async () => {
            if (!carId) return;
            
            setLoadingRate(true);
            try {
                const rateData = await getCarRentalRate(carId);
                setRentalRate(rateData);
            } catch (error) {
                console.error('Failed to fetch rental rate:', error);
                // Keep default price if API fails
            } finally {
                setLoadingRate(false);
            }
        };

        fetchRentalRate();
    }, [carId]);

    // Helper function to process image URL
    const getImageUrl = (imageUrl) => {
        if (!imageUrl) return 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop';
        // Replace <url> placeholder with actual storage URL
        return imageUrl.replace('<url>', process.env.REACT_APP_STORAGE_URL || 'http://localhost:7184');
    };

    const handleCarToggleFavorite = () => {
        const carData = isApiData ? {
            id: car.id,
            name: `${car.manufacturer} ${car.model}`,
            type: car.fuelType,
            transmission: car.transmission,
            capacity: `${car.seats} People`,
            price: '80.00',
            image: getImageUrl(car.imageUrls?.[0])
        } : {
            id: car.id,
            name: car.name,
            type: car.type,
            image: car.image,
            fuel: car.fuel,
            transmission: car.transmission,
            capacity: car.capacity,
            price: car.price,
            originalPrice: car.originalPrice
        };
        dispatch(toggleFavorite({
            carId,
            carData
        }));
    };

    // Helper function to translate Fuel Type : Xăng, Dầu, Điện, Hybrid
    const getFuelTypeText = (type) => {
        if (!type) return '';
        const lowerType = type.toLowerCase();
        if (lowerType === 'gasoline') return t('gasoline');
        if (lowerType === 'diesel') return t('diesel');
        if (lowerType === 'electric') return t('electric');
        if (lowerType === 'hybrid') return t('hybrid');
        return type;
    };


    // Helper function to translate transmission
    const getTransmissionText = (transmission) => {
        if (transmission.toLowerCase() === 'manual') return t('manual');
        if (transmission.toLowerCase() === 'automatic') return t('automatic');
        return transmission;
    };

    // Helper function to translate capacity
    const getCapacityText = (capacity) => {
        if (typeof capacity === 'number') {
            return `${capacity} ${t('people')}`;
        }
        const match = capacity.match(/(\d+)\s*People/i);
        if (match) {
            return `${match[1]} ${t('people')}`;
        }
        return capacity;
    };

    // Format car data based on source
    const carName = isApiData ? `${car.manufacturer} ${car.model}` : car.name;
    const carImage = isApiData ? getImageUrl(car.imageUrls?.[0]) : car.image;
    const carTransmission = car.transmission;
    const carSeats = isApiData ? car.seats : car.capacity;
    const carFuelType = isApiData ? car.fuelType : car.fuel;
    
    // Use rental rate from API if available, otherwise fallback to default
    const carPrice = rentalRate?.dailyRate || (isApiData ? 10000 : car.price);
    const carOriginalPrice = isApiData ? null : car.originalPrice;
    
    // Format price in Vietnamese format
    const formatPrice = (price) => {
        const numPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
        return numPrice.toLocaleString('vi-VN');
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative">
                <img
                    src={carImage}
                    alt={carName}
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
                {/* <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                    {carType}
                </div> */}
            </div>

            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{carName}</h3>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        </svg>
                        <span className="leading-none">{getFuelTypeText(carFuelType)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                        </svg>
                        <span className="leading-none">{getTransmissionText(carTransmission)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="leading-none">{getCapacityText(carSeats)}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <div className='flex items-baseline gap-1'>
                            {loadingRate ? (
                                <span className="text-xl font-bold text-gray-400">...</span>
                            ) : (
                                <>
                                    <span className="text-xl font-bold text-gray-900">{formatPrice(carPrice)} đ</span>
                                    <span className="text-sm text-slate-400">{t('perDay')}</span>
                                </>
                            )}
                        </div>
                        {carOriginalPrice && (
                            <div className="text-sm text-gray-500 line-through">{formatPrice(carOriginalPrice)} đ</div>
                        )}
                    </div>
                    <Link
                        to={`/cars/${carId}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                        {t('rentNow')}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CarCard;