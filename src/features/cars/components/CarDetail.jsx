import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, selectIsFavorite } from '../../favorites/favoritesSlice';
import { fetchCarById, fetchAllCars } from '../carsSlice';
import useEmblaCarousel from 'embla-carousel-react';
import CarCard from '../CarCard';
import './embla.css';

const RecentCarsCarousel = ({ cars }) => {
    const [emblaRef] = useEmblaCarousel({
        align: 'start',
        dragFree: true,
        containScroll: 'trimSnaps',
        keyboard: true
    });

    return (
        <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-6">
                    {cars.map((car) => (
                        <div key={car.carId || car.id} className="flex-none w-80">
                            <CarCard car={car} isApiData={true} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation dots removed for swipe-only interaction */}
        </div>
    );
};

const RecommendationCarsCarousel = ({ cars }) => {
    const [emblaRef] = useEmblaCarousel({
        align: 'start',
        dragFree: true,
        containScroll: 'trimSnaps',
        keyboard: true
    });

    return (
        <div className="relative">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-6">
                    {cars.map((car) => (
                        <div key={car.carId || car.id} className="flex-none w-80">
                            <CarCard car={car} isApiData={true} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation dots removed for swipe-only interaction */}
        </div>
    );
};

const CarDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showAllReviews, setShowAllReviews] = useState(false);

    // Get cars from Redux store
    const { cars, currentCar, loading, error } = useSelector((state) => state.cars);

    // Get favorite status for the current car
    const isCurrentCarFavorite = useSelector(selectIsFavorite(id));

    // Fetch car by ID on component mount or when ID changes
    useEffect(() => {
        dispatch(fetchCarById(id));
    }, [dispatch, id]);

    // Mock reviews data (since API doesn't provide reviews yet)
    const mockReviews = [
        {
            id: 1,
            name: "Alex Stanton",
            role: "CEO at Bukalapak",
            date: "21 July 2022",
            rating: 4,
            comment: "We are very happy with the service from the MORENT App. Morent has a low price and also a large variety of cars with good and comfortable facilities. In addition, the service provided by the officers is also very friendly and very polite."
        },
        {
            id: 2,
            name: "Skylar Dias",
            role: "CEO at Amazon",
            date: "20 July 2022",
            rating: 4,
            comment: "We are greatly helped by the services of the MORENT Application. Morent has low prices and also a wide variety of cars with good and comfortable facilities. In addition, the service provided by the officers is also very friendly and very polite."
        }
    ];

    // Transform API car data to match the component's expected format
    const carData = currentCar ? {
        id: currentCar.carId,
        name: `${currentCar.manufacturer} ${currentCar.model}`,
        type: currentCar.model,
        rating: 4.5, // Mock rating
        reviewCount: 440, // Mock review count
        description: currentCar.description || `Experience the power and elegance of the ${currentCar.manufacturer} ${currentCar.model}. This ${currentCar.fuelType} vehicle offers exceptional performance and comfort.`,
        specifications: {
            typecar: currentCar.model,
            capacity: `${currentCar.seats} Person`,
            steering: currentCar.transmission,
            fueltype: currentCar.fuelType,
        },
        price: 80.00, // Mock price - replace with actual price when available
        originalPrice: 100.00, // Mock original price
        images: currentCar.imageUrls && currentCar.imageUrls.length > 0 
            ? currentCar.imageUrls 
            : [
                "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop",
                "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop"
            ],
        reviews: mockReviews
    } : null;

    // Fetch all cars for related cars section
    useEffect(() => {
        if (cars.length === 0) {
            dispatch(fetchAllCars());
        }
    }, [dispatch, cars.length]);

    // Get related cars from API (all cars except current one)
    const displayRelatedCars = cars.filter(car => car.carId !== id).slice(0, 8);

    const handleMainCarToggleFavorite = () => {
        if (!carData) return;
        
        const mainCarData = {
            id: id,
            name: carData.name,
            type: carData.type,
            price: carData.price,
            originalPrice: carData.originalPrice,
            image: carData.images[0],
            specifications: carData.specifications,
        };
        dispatch(toggleFavorite({
            carId: id,
            carData: mainCarData
        }));
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <svg
                key={index}
                className={`w-4 h-4 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ));
    };

    // const CarCard = ({ car }) => {
    //     const isCarFavorite = useSelector(selectIsFavorite(car.id));

    //     const handleCarToggleFavorite = () => {
    //         const carData = {
    //             id: car.id,
    //             name: car.name,
    //             type: car.type,
    //             price: car.price,
    //             originalPrice: car.originalPrice,
    //             image: car.image,
    //             specifications: car.specifications,
    //         };
    //         handleToggleFavorite(car.id, carData);
    //     };

    //     return (
    //         <div className="bg-white rounded-lg p-6 shadow-sm border">
    //             <div className="flex justify-between items-start mb-4">
    //                 <div>
    //                     <h3 className="font-bold text-lg text-gray-900">{car.name}</h3>
    //                     <p className="text-gray-500 text-sm">{car.type}</p>
    //                 </div>
    //                 <button
    //                     onClick={handleCarToggleFavorite}
    //                     className="text-red-500 hover:text-red-600 transition-colors"
    //                 >
    //                     <svg
    //                         className="w-6 h-6"
    //                         fill={isCarFavorite ? "currentColor" : "none"}
    //                         stroke="currentColor"
    //                         viewBox="0 0 24 24"
    //                     >
    //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    //                     </svg>
    //                 </button>
    //             </div>

    //             <div className="mb-4">
    //                 <img src={car.image} alt={car.name} className="w-full h-40 object-cover rounded-lg" />
    //             </div>

    //             <div className="flex justify-between text-sm text-gray-500 mb-4">
    //                 <div className="flex items-center gap-1">
    //                     <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    //                     </svg>
    //                     <span>{car.specifications.fueltype}</span>
    //                 </div>
    //                 <div className="flex items-center gap-1">
    //                     <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
    //                     </svg>
    //                     <span>{car.specifications.steering}</span>
    //                 </div>
    //                 <div className="flex items-center gap-1">
    //                     <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    //                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    //                     </svg>
    //                     <span>{car.specifications.capacity}</span>
    //                 </div>
    //             </div>

    //             <div className="flex justify-between items-center">
    //                 <div>
    //                     <span className="text-xl font-bold text-gray-900">${car.price.toFixed(2)}/</span>
    //                     <span className="text-gray-500">day</span>
    //                     {car.originalPrice && (
    //                         <span className="text-gray-400 line-through ml-2">${car.originalPrice.toFixed(2)}</span>
    //                     )}
    //                 </div>
    //                 <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
    //                     Rent Now
    //                 </button>
    //             </div>
    //         </div>
    //     );
    // };

    // Show loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading car details...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Error loading car details: {error}</p>
                    <button 
                        onClick={() => dispatch(fetchCarById(id))}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Show not found state if car doesn't exist
    if (!loading && !carData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Car Not Found</h2>
                    <p className="text-gray-600 mb-6">The car you're looking for doesn't exist or has been removed.</p>
                    <Link 
                        to="/cars"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-block"
                    >
                        Browse All Cars
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-6 py-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <span>Home</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-900">Detail Car Rent</span>
                </div>

                {/* Main Layout - Two Column Design */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Left Side - Hero Image Section */}
                    <div className="space-y-6">
                        {/* Main Hero Card */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg text-white relative overflow-hidden min-h-[360px]">
                            {/* <div className="relative z-10 max-w-sm">
                                <h2 className="text-3xl font-bold mb-2">Sports car with the best</h2>
                                <h3 className="text-3xl font-bold mb-4">design and acceleration</h3>
                                <p className="text-blue-100 mb-8 leading-relaxed">
                                    Safety and comfort while driving a futuristic and elegant sports car
                                </p>
                            </div> */}
                            <img
                                src={carData.images[selectedImageIndex]}
                                alt={carData.name}
                                className="w-full object-contain"
                            />
                            {/* <div className="absolute right-4 bottom-4 w-72 h-44">
                                <img
                                    src={carData.images[selectedImageIndex]}
                                    alt={carData.name}
                                    className="w-full h-full object-contain"
                                />
                            </div> */}
                        </div>

                        {/* Thumbnail Images */}
                        <div className="flex gap-4">
                            {carData.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`flex-1 h-28 rounded-lg overflow-hidden border-3 transition-all ${selectedImageIndex === index ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <img src={image} alt={`${carData.name} ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right Side - Car Details */}
                    <div className="bg-white rounded-lg p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-3">{carData.name}</h1>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center">
                                        {renderStars(Math.floor(carData.rating))}
                                    </div>
                                    <span className="text-gray-500 text-sm font-medium">{carData.reviewCount}+ Reviewer</span>
                                </div>
                            </div>
                            <button
                                onClick={handleMainCarToggleFavorite}
                                className="text-red-500 hover:text-red-600 p-2 transition-colors"
                            >
                                <svg
                                    className="w-7 h-7"
                                    fill={isCurrentCarFavorite ? "currentColor" : "none"}
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>

                        <p className="text-gray-600 mb-10 leading-relaxed text-lg">{carData.description}</p>

                        <div className="grid grid-cols-2 gap-8 mb-10">
                            <div>
                                <span className="text-gray-400 text-sm block mb-2">Type Car</span>
                                <p className="font-semibold text-gray-800 text-lg">{carData.specifications.typecar}</p>
                            </div>
                            <div>
                                <span className="text-gray-400 text-sm block mb-2">Capacity</span>
                                <p className="font-semibold text-gray-800 text-lg">{carData.specifications.capacity}</p>
                            </div>
                            <div>
                                <span className="text-gray-400 text-sm block mb-2">Steering</span>
                                <p className="font-semibold text-gray-800 text-lg">{carData.specifications.steering}</p>
                            </div>
                            <div>
                                <span className="text-gray-400 text-sm block mb-2">Fuel Type</span>
                                <p className="font-semibold text-gray-800 text-lg">{carData.specifications.fueltype}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-gray-900">${typeof carData.price === 'number' ? carData.price.toFixed(2) : (parseFloat(carData.price) || 0).toFixed(2)}/</span>
                                    <span className="text-gray-500 text-4xl">day</span>
                                </div>
                                {carData.originalPrice && (
                                    <div className="text-gray-400 line-through text-lg mt-1">${typeof carData.originalPrice === 'number' ? carData.originalPrice.toFixed(2) : (parseFloat(carData.originalPrice) || 0).toFixed(2)}</div>
                                )}
                            </div>
                            <Link 
                                to="/payment" 
                                className="bg-blue-600 text-white px-10 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg inline-block text-center"
                            >
                                Rent Now
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-lg p-8 mb-12">
                    <div className="flex items-center gap-3 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm font-medium">{carData.reviews.length}</span>
                    </div>

                    <div className="space-y-8">
                        {carData.reviews.slice(0, showAllReviews ? carData.reviews.length : 2).map((review) => (
                            <div key={review.id} className="border-b border-gray-200 pb-8 last:border-b-0">
                                <div className="flex items-start gap-4">
                                    <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center">
                                        <span className="text-gray-600 font-semibold text-lg">{review.name.charAt(0)}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <h4 className="font-bold text-gray-900 text-lg">{review.name}</h4>
                                                <p className="text-gray-500">{review.role}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-gray-500 text-sm mb-1">{review.date}</p>
                                                <div className="flex items-center gap-1">
                                                    {renderStars(review.rating)}
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {carData.reviews.length > 2 && (
                        <div className="text-center mt-8">
                            <button
                                onClick={() => setShowAllReviews(!showAllReviews)}
                                className="text-blue-600 hover:text-blue-700 font-medium text-lg"
                            >
                                {showAllReviews ? 'Show Less' : `Show All ${carData.reviews.length} Reviews`}
                            </button>
                        </div>
                    )}
                </div>

                {/* Recent Cars */}
                {displayRelatedCars.length > 0 && (
                    <div className="mb-12">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Recent Car</h2>
                            <Link to="/cars" className="text-blue-600 hover:text-blue-700 font-medium">
                                View All
                            </Link>
                        </div>
                        <RecentCarsCarousel cars={displayRelatedCars.slice(0, 6)} />
                    </div>
                )}

                {/* Recommendation Cars */}
                {displayRelatedCars.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">Recommendation Car</h2>
                            <Link to="/cars" className="text-blue-600 hover:text-blue-700 font-medium">
                                View All
                            </Link>
                        </div>
                        <RecommendationCarsCarousel cars={displayRelatedCars} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CarDetail;