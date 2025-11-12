import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, selectIsFavorite } from '../../favorites/favoritesSlice';
import useEmblaCarousel from 'embla-carousel-react';
import './embla.css';


const CarCard = ({ car, onToggleFavorite }) => {
    const isCarFavorite = useSelector(selectIsFavorite(car.id));

    const handleCarToggleFavorite = () => {
        const carData = {
            id: car.id,
            name: car.name,
            type: car.type,
            price: car.price,
            originalPrice: car.originalPrice,
            image: car.image,
            specifications: car.specifications,
        };
        onToggleFavorite(car.id, carData);
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
                        {car.specifications.gasoline}
                    </div>
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                        </svg>
                        {car.specifications.steering}
                    </div>
                    <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {car.specifications.capacity}
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

const RecentCarsCarousel = ({ cars, onToggleFavorite }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
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
                        <div key={car.id} className="flex-none w-80">
                            <CarCard car={car} onToggleFavorite={onToggleFavorite} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation dots removed for swipe-only interaction */}
        </div>
    );
};

const RecommendationCarsCarousel = ({ cars, onToggleFavorite }) => {
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
                        <div key={car.id} className="flex-none w-80">
                            <CarCard car={car} onToggleFavorite={onToggleFavorite} />
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

    // Get favorite status for the current car
    const isCurrentCarFavorite = useSelector(selectIsFavorite(parseInt(id) || 1));

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
            "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop",
            "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop"
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
            image: "https://images.unsplash.com/photo-1683216497578-899ee0033067?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop",
            specifications: { gasoline: "90L", steering: "Manual", capacity: "2 Person" },
            isFavorite: true
        },
        {
            id: 3,
            name: "Nissan GT - R",
            type: "Sport",
            price: 80.00,
            originalPrice: 100.00,
            image: "https://images.unsplash.com/photo-1683216497578-899ee0033067?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop",
            specifications: { gasoline: "80L", steering: "Manual", capacity: "2 Person" },
            isFavorite: false
        },
        {
            id: 4,
            name: "Rolls - Royce",
            type: "Sedan",
            price: 96.00,
            image: "https://images.unsplash.com/photo-1683216497578-899ee0033067?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop",
            specifications: { gasoline: "70L", steering: "Manual", capacity: "4 Person" },
            isFavorite: false
        },
        {
            id: 5,
            name: "All New Rush",
            type: "SUV",
            price: 72.00,
            originalPrice: 80.00,
            image: "https://images.unsplash.com/photo-1683216497578-899ee0033067?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop",
            specifications: { gasoline: "70L", steering: "Manual", capacity: "6 Person" },
            isFavorite: false
        },
        {
            id: 6,
            name: "CR - V",
            type: "SUV",
            price: 80.00,
            image: "https://images.unsplash.com/photo-1683216497578-899ee0033067?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop",
            specifications: { gasoline: "80L", steering: "Manual", capacity: "6 Person" },
            isFavorite: true
        },
        {
            id: 7,
            name: "All New Terios",
            type: "SUV",
            price: 74.00,
            image: "https://images.unsplash.com/photo-1683216497578-899ee0033067?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop",
            specifications: { gasoline: "90L", steering: "Manual", capacity: "6 Person" },
            isFavorite: false
        }
    ];

    const displayRelatedCars = mockRelatedCars;

    const handleToggleFavorite = (carId, carData = null) => {
        dispatch(toggleFavorite({
            carId,
            carData: carData || (carId === parseInt(id) ? carData : null)
        }));
    };

    const handleMainCarToggleFavorite = () => {
        const mainCarData = {
            id: parseInt(id) || 1,
            name: carData.name,
            type: carData.type,
            price: carData.price,
            originalPrice: carData.originalPrice,
            image: carData.images[0],
            specifications: carData.specifications,
        };
        handleToggleFavorite(parseInt(id) || 1, mainCarData);
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
    //                     <span>{car.specifications.gasoline}</span>
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
                                <span className="text-gray-400 text-sm block mb-2">Gasoline</span>
                                <p className="font-semibold text-gray-800 text-lg">{carData.specifications.gasoline}</p>
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
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Recent Car</h2>
                        {/* <button className="text-blue-600 hover:text-blue-700 font-medium text-lg">View All</button> */}
                        <Link to="/cars" className="text-blue-600 hover:text-blue-700 font-medium">
                            View All
                        </Link>
                    </div>
                    <RecentCarsCarousel cars={displayRelatedCars.slice(0, 6)} onToggleFavorite={handleToggleFavorite} />
                </div>

                {/* Recommendation Cars */}
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold text-gray-900">Recommendation Car</h2>
                        {/* <button className="text-blue-600 hover:text-blue-700 font-medium text-lg">View All</button> */}
                        <Link to="/cars" className="text-blue-600 hover:text-blue-700 font-medium">
                            View All
                        </Link>
                    </div>
                    <RecommendationCarsCarousel cars={displayRelatedCars} onToggleFavorite={handleToggleFavorite} />
                </div>
            </div>
        </div>
    );
};

export default CarDetail;