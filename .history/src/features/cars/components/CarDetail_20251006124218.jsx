import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchCarById, fetchRelatedCars } from '../carsSlice';

const CarDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { currentCar, relatedCars, loading, error } = useSelector(state => state.cars);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showAllReviews, setShowAllReviews] = useState(false);

    // Temporarily disable API calls until backend is ready
    // useEffect(() => {
    //     if (id) {
    //         dispatch(fetchCarById(id));
    //         dispatch(fetchRelatedCars(id));
    //     }
    // }, [dispatch, id]);

    // Mock data - replace with actual data from Redux store when API is ready
    const carData = currentCar || {
        id: 1,
        name: "Nissan GT - R",
        type: "Sport",
        rating: 4.5,
        reviewCount: 440,
        description: "NISMO has become the embodiment of Nissan's outstanding performance, inspired by the most unforgiving proving ground, the 'race track'.",
        specifications: {
            typecar: "Sport",
            capacity: "2 Person",
            steering: "Manual",
            gasoline: "70L"
        },
        price: 80.00,
        originalPrice: 100.00,
        images: [
            "/api/placeholder/400/240",
            "/api/placeholder/400/240",
            "/api/placeholder/400/240"
        ],
        reviews: [
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
        ]
    };

    const mockRelatedCars = [
        {
            id: 2,
            name: "Koenigsegg",
            type: "Sport",
            price: 99.00,
            image: "/api/placeholder/300/200",
            specifications: { gasoline: "90L", steering: "Manual", capacity: "2 Person" },
            isFavorite: true
        },
        {
            id: 3,
            name: "Nissan GT - R",
            type: "Sport",
            price: 80.00,
            originalPrice: 100.00,
            image: "/api/placeholder/300/200",
            specifications: { gasoline: "80L", steering: "Manual", capacity: "2 Person" },
            isFavorite: false
        },
        {
            id: 4,
            name: "Rolls - Royce",
            type: "Sedan",
            price: 96.00,
            image: "/api/placeholder/300/200",
            specifications: { gasoline: "70L", steering: "Manual", capacity: "4 Person" },
            isFavorite: false
        },
        {
            id: 5,
            name: "All New Rush",
            type: "SUV",
            price: 72.00,
            originalPrice: 80.00,
            image: "/api/placeholder/300/200",
            specifications: { gasoline: "70L", steering: "Manual", capacity: "6 Person" },
            isFavorite: false
        },
        {
            id: 6,
            name: "CR - V",
            type: "SUV",
            price: 80.00,
            image: "/api/placeholder/300/200",
            specifications: { gasoline: "80L", steering: "Manual", capacity: "6 Person" },
            isFavorite: true
        },
        {
            id: 7,
            name: "All New Terios",
            type: "SUV",
            price: 74.00,
            image: "/api/placeholder/300/200",
            specifications: { gasoline: "90L", steering: "Manual", capacity: "6 Person" },
            isFavorite: false
        }
    ];

    const displayRelatedCars = relatedCars.length > 0 ? relatedCars : mockRelatedCars;

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading car details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Error loading car details: {error}</p>
                    <button
                        onClick={() => dispatch(fetchCarById(id))}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

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

    const CarCard = ({ car }) => (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-lg text-gray-900">{car.name}</h3>
                    <p className="text-gray-500 text-sm">{car.type}</p>
                </div>
                <button className="text-red-500 hover:text-red-600">
                    <svg className="w-6 h-6" fill={car.isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>

            <div className="mb-4">
                <img src={car.image} alt={car.name} className="w-full h-40 object-cover rounded-lg" />
            </div>

            <div className="flex justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                    <span>{car.specifications.gasoline}</span>
                </div>
                <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    <span>{car.specifications.steering}</span>
                </div>
                <div className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                    </svg>
                    <span>{car.specifications.capacity}</span>
                </div>
            </div>

            <div className="flex justify-between items-center">
                <div>
                    <span className="text-xl font-bold text-gray-900">${car.price.toFixed(2)}/</span>
                    <span className="text-gray-500">day</span>
                    {car.originalPrice && (
                        <span className="text-gray-400 line-through ml-2">${car.originalPrice.toFixed(2)}</span>
                    )}
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Rent Now
                </button>
            </div>
        </div>
    );

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

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Car Images */}
                        <div className="bg-white rounded-lg p-6 mb-8">
                            <div className="mb-4">
                                <img
                                    src={carData.images[selectedImageIndex]}
                                    alt={carData.name}
                                    className="w-full h-80 object-cover rounded-lg"
                                />
                            </div>
                            <div className="flex gap-4">
                                {carData.images.map((image, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImageIndex(index)}
                                        className={`w-20 h-16 rounded-lg overflow-hidden border-2 ${selectedImageIndex === index ? 'border-blue-600' : 'border-gray-200'
                                            }`}
                                    >
                                        <img src={image} alt={`${carData.name} ${index + 1}`} className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Reviews */}
                        <div className="bg-white rounded-lg p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
                                <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm">{carData.reviews.length}</span>
                            </div>

                            <div className="space-y-6">
                                {carData.reviews.slice(0, showAllReviews ? carData.reviews.length : 2).map((review) => (
                                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                                                <span className="text-gray-600 font-medium">{review.name.charAt(0)}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">{review.name}</h4>
                                                        <p className="text-gray-500 text-sm">{review.role}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-gray-500 text-sm">{review.date}</p>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            {renderStars(review.rating)}
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-gray-600">{review.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {carData.reviews.length > 2 && (
                                <button
                                    onClick={() => setShowAllReviews(!showAllReviews)}
                                    className="text-blue-600 hover:text-blue-700 font-medium mt-4"
                                >
                                    {showAllReviews ? 'Show Less' : `Show All ${carData.reviews.length} Reviews`}
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg p-6 sticky top-8">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 mb-1">{carData.name}</h1>
                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center">
                                            {renderStars(Math.floor(carData.rating))}
                                        </div>
                                        <span className="text-gray-500 text-sm">{carData.reviewCount}+ Reviewer</span>
                                    </div>
                                </div>
                                <button className="text-red-500 hover:text-red-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>

                            <p className="text-gray-600 mb-6">{carData.description}</p>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div>
                                    <span className="text-gray-500 text-sm">Type Car</span>
                                    <p className="font-medium text-gray-900">{carData.specifications.typecar}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500 text-sm">Capacity</span>
                                    <p className="font-medium text-gray-900">{carData.specifications.capacity}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500 text-sm">Steering</span>
                                    <p className="font-medium text-gray-900">{carData.specifications.steering}</p>
                                </div>
                                <div>
                                    <span className="text-gray-500 text-sm">Gasoline</span>
                                    <p className="font-medium text-gray-900">{carData.specifications.gasoline}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <span className="text-3xl font-bold text-gray-900">${carData.price.toFixed(2)}/</span>
                                    <span className="text-gray-500">day</span>
                                    {carData.originalPrice && (
                                        <div className="text-gray-400 line-through">${carData.originalPrice.toFixed(2)}</div>
                                    )}
                                </div>
                                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                    Rent Now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Cars */}
                <div className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Recent Car</h2>
                        <button className="text-blue-600 hover:text-blue-700 font-medium">View All</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayRelatedCars.slice(0, 3).map((car) => (
                            <CarCard key={car.id} car={car} />
                        ))}
                    </div>
                </div>

                {/* Recommendation Cars */}
                <div className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900">Recommendation Car</h2>
                        <button className="text-blue-600 hover:text-blue-700 font-medium">View All</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayRelatedCars.slice(3).map((car) => (
                            <CarCard key={car.id} car={car} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarDetail;