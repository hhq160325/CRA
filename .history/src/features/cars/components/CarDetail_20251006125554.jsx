import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavoriteLocal, addToFavorites, removeFromFavorites } from '../../favorites/favoritesSlice';

const CarDetail = () => {
    const { id } = useParams();
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showAllReviews, setShowAllReviews] = useState(false);

    // Mock data - replace with actual data from Redux store when API is ready
    const carData = {
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
            "https://via.placeholder.com/400x240/1f2937/ffffff?text=Nissan+GT-R+1",
            "https://via.placeholder.com/400x240/374151/ffffff?text=Interior",
            "https://via.placeholder.com/400x240/dc2626/ffffff?text=Engine"
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
            image: "https://via.placeholder.com/300x200/1f2937/ffffff?text=Koenigsegg",
            specifications: { gasoline: "90L", steering: "Manual", capacity: "2 Person" },
            isFavorite: true
        },
        {
            id: 3,
            name: "Nissan GT - R",
            type: "Sport",
            price: 80.00,
            originalPrice: 100.00,
            image: "https://via.placeholder.com/300x200/374151/ffffff?text=Nissan+GT-R",
            specifications: { gasoline: "80L", steering: "Manual", capacity: "2 Person" },
            isFavorite: false
        },
        {
            id: 4,
            name: "Rolls - Royce",
            type: "Sedan",
            price: 96.00,
            image: "https://via.placeholder.com/300x200/059669/ffffff?text=Rolls+Royce",
            specifications: { gasoline: "70L", steering: "Manual", capacity: "4 Person" },
            isFavorite: false
        },
        {
            id: 5,
            name: "All New Rush",
            type: "SUV",
            price: 72.00,
            originalPrice: 80.00,
            image: "https://via.placeholder.com/300x200/7c3aed/ffffff?text=All+New+Rush",
            specifications: { gasoline: "70L", steering: "Manual", capacity: "6 Person" },
            isFavorite: false
        },
        {
            id: 6,
            name: "CR - V",
            type: "SUV",
            price: 80.00,
            image: "https://via.placeholder.com/300x200/dc2626/ffffff?text=CR-V",
            specifications: { gasoline: "80L", steering: "Manual", capacity: "6 Person" },
            isFavorite: true
        },
        {
            id: 7,
            name: "All New Terios",
            type: "SUV",
            price: 74.00,
            image: "https://via.placeholder.com/300x200/ea580c/ffffff?text=All+New+Terios",
            specifications: { gasoline: "90L", steering: "Manual", capacity: "6 Person" },
            isFavorite: false
        }
    ];

    const displayRelatedCars = mockRelatedCars;

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

                {/* Main Layout - Two Column Design */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Left Side - Hero Image Section */}
                    <div className="space-y-6">
                        {/* Main Hero Card */}
                        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-8 text-white relative overflow-hidden min-h-[360px]">
                            <div className="relative z-10 max-w-sm">
                                <h2 className="text-3xl font-bold mb-2">Sports car with the best</h2>
                                <h3 className="text-3xl font-bold mb-4">design and acceleration</h3>
                                <p className="text-blue-100 mb-8 leading-relaxed">
                                    Safety and comfort while driving a futuristic and elegant sports car
                                </p>
                            </div>
                            <div className="absolute right-4 bottom-4 w-72 h-44">
                                <img 
                                    src={carData.images[selectedImageIndex]} 
                                    alt={carData.name}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        </div>

                        {/* Thumbnail Images */}
                        <div className="flex gap-4">
                            {carData.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImageIndex(index)}
                                    className={`flex-1 h-28 rounded-lg overflow-hidden border-3 transition-all ${
                                        selectedImageIndex === index ? 'border-blue-600 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
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
                            <button className="text-red-500 hover:text-red-600 p-2">
                                <svg className="w-7 h-7" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
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
                                <span className="text-gray-400 text-sm block mb-2">Gasoline</span>
                                <p className="font-semibold text-gray-800 text-lg">{carData.specifications.gasoline}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-gray-900">${carData.price.toFixed(2)}/</span>
                                    <span className="text-gray-500 text-lg">day</span>
                                </div>
                                {carData.originalPrice && (
                                    <div className="text-gray-400 line-through text-lg mt-1">${carData.originalPrice.toFixed(2)}</div>
                                )}
                            </div>
                            <button className="bg-blue-600 text-white px-10 py-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg">
                                Rent Now
                            </button>
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
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Recent Car</h2>
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-lg">View All</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayRelatedCars.slice(0, 3).map((car) => (
                            <CarCard key={car.id} car={car} />
                        ))}
                    </div>
                </div>

                {/* Recommendation Cars */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Recommendation Car</h2>
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-lg">View All</button>
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