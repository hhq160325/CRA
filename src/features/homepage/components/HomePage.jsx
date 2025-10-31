import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite, selectIsFavorite } from '../../favorites/favoritesSlice';
const HomePage = () => {
  // const [isCarFavorite, setIsFavorited] = useState({
  //   koenigsegg: true,
  //   nissan1: false,
  //   rolls: true,
  //   nissan2: false,
  //   rush: false,
  //   crv1: true,
  //   terios: false,
  //   crv2: true,
  //   mg1: true,
  //   mg2: false,
  //   mg3: true,
  //   mg4: false
  // });

  // const handleCarToggleFavorite = (carId) => {
  //   setIsFavorited(prev => ({
  //     ...prev,
  //     [carId]: !prev[carId]
  //   }));
  // };
  const dispatch = useDispatch();

  const popularCars = [
    {
      id: 1,
      name: 'Koenigsegg',
      type: 'Sport',
      image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop',
      fuel: '90L',
      transmission: 'Manual',
      capacity: '2 People',
      price: '99.00',
      originalPrice: '100.00'
    },
    {
      id: 2,
      name: 'Nissan GT-R',
      type: 'Sport',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop',
      fuel: '90L',
      transmission: 'Manual',
      capacity: '2 People',
      price: '80.00',
      originalPrice: '100.00'
    },
    {
      id: 3,
      name: 'Rolls-Royce',
      type: 'Sedan',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
      fuel: '70L',
      transmission: 'Manual',
      capacity: '4 People',
      price: '96.00'
    },
    {
      id: 4,
      name: 'Nissan GT-R',
      type: 'Sport',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop',
      fuel: '80L',
      transmission: 'Manual',
      capacity: '2 People',
      price: '80.00',
      originalPrice: '100.00'
    }
  ];

  const handleToggleFavorite = (carId, carData = null) => {
    dispatch(toggleFavorite({
      carId,
      carData
    }));
  };
  // const handleMainCarToggleFavorite = () => {
  //   const mainCarData = {
  //     id: parseInt(id) || 1,
  //     name: popularCars.name,
  //     type: popularCars.type,
  //     price: popularCars.price,
  //     originalPrice: popularCars.originalPrice,
  //     image: popularCars.images[0],
  //     specifications: popularCars.specifications,
  //   };
  //   handleToggleFavorite(parseInt(id) || 1, mainCarData);
  // };

  const CarCard = ({ car }) => {
    const isCarFavorite = useSelector(selectIsFavorite(car.id));

    const handleCarToggleFavorite = () => {
      const carData = {
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
      handleToggleFavorite(car.id, carData);
    };

    return (<div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
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
            className={`w-5 h-5`}
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
            <div className='flex items-center'><div className="text-xl font-bold text-gray-900">${car.price}</div><div className="text-sm text-slate-400">/day</div></div>
            {car.originalPrice && (
              <div className="text-sm text-gray-500 line-through">${car.originalPrice}</div>
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
    </div>)
  }



  const recommendationCars = [
    {
      id: 'rush',
      name: 'All New Rush',
      type: 'SUV',
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop',
      fuel: '70L',
      transmission: 'Manual',
      capacity: '6 People',
      price: '72.00',
      originalPrice: '80.00'
    },
    {
      id: 'crv1',
      name: 'CR-V',
      type: 'SUV',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop',
      fuel: '80L',
      transmission: 'Manual',
      capacity: '6 People',
      price: '80.00'
    },
    {
      id: 'terios',
      name: 'All New Terios',
      type: 'SUV',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop',
      fuel: '90L',
      transmission: 'Manual',
      capacity: '6 People',
      price: '74.00'
    },
    {
      id: 'crv2',
      name: 'CR-V',
      type: 'SUV',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop',
      fuel: '80L',
      transmission: 'Manual',
      capacity: '6 People',
      price: '80.00'
    },
    {
      id: 'mg1',
      name: 'MG ZX Exclusive',
      type: 'Hatchback',
      image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop',
      fuel: '70L',
      transmission: 'Manual',
      capacity: '4 People',
      price: '76.00',
      originalPrice: '80.00'
    },
    {
      id: 'mg2',
      name: 'New MG ZS',
      type: 'SUV',
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop',
      fuel: '80L',
      transmission: 'Manual',
      capacity: '6 People',
      price: '80.00'
    },
    {
      id: 'mg3',
      name: 'MG ZX Excite',
      type: 'Hatchback',
      image: 'https://images.unsplash.com/photo-1549924231-f129b911e442?w=400&h=300&fit=crop',
      fuel: '90L',
      transmission: 'Manual',
      capacity: '4 People',
      price: '74.00'
    },
    {
      id: 'mg4',
      name: 'New MG ZS',
      type: 'SUV',
      image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=300&fit=crop',
      fuel: '80L',
      transmission: 'Manual',
      capacity: '6 People',
      price: '80.00'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left Banner */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-4">The Best Platform for Car Rental</h1>
              <p className="text-blue-100 mb-6 text-lg">
                Ease of doing a car rental safely and reliably. Of course at a low price.
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Rental Car
              </button>
            </div>
            <div className="absolute bottom-0 right-0 w-64 h-48">
              <img
                src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop"
                alt="Koenigsegg"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Right Banner */}
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <defs>
                  <pattern id="chevron" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M0 10 L10 0 L20 10 L10 20 Z" fill="currentColor" />
                  </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#chevron)" />
              </svg>
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Easy way to rent a car at a low price</h2>
              <p className="text-gray-600 mb-6 text-lg">
                Providing cheap car rental services and safe and comfortable facilities.
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Rental Car
              </button>
            </div>
            <div className="absolute bottom-0 right-0 w-64 h-48">
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop"
                alt="Nissan GT-R"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className='bg-white rounded-2xl p-6 shadow-sm mb-8'>
          <div className='grid grid-cols-1 lg:grid-cols-7 gap-6 items-end'>
            {/* Pick-up */}
            <div className='lg:col-span-3 space-y-4'>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-blue-600 rounded-full'></div>
                <h3 className='text-lg font-semibold text-gray-900'>Pick-up</h3>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label className='block-text-sm font-medium text-gray-700 mb-2'>Location</label>
                  <select className='w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500'>
                    <option>Select your city</option>
                    <option>Ho Chi Minh City</option>
                    <option>Hanoi</option>
                    <option>Da Nang</option>
                  </select>
                </div>
                <div>
                  <label className='block-text-sm font-medium text-gray-700 mb-2'>Date</label>
                  <select className='w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500'>
                    <option>Select your date</option>
                    <option>Today</option>
                    <option>Tomorrow</option>
                    <option>Next week</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <select className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500">
                    <option>Select your time</option>
                    <option>08:00 AM</option>
                    <option>10:00 AM</option>
                    <option>12:00 PM</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Swap Button */}
            <div className='lg:col-span-1 flex justify-center'>
              <button className='bg-blue-600 text-white p-3 rounded-lg hove:bg-blue-700 transition-colors'>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>
            {/* Drop-off */}
            <div className='lg:col-span-3 space-y-4'>
              <div className='flex items-center space-x-2'>
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <h3 className="text-lg font-semibold text-gray-900">Drop - Off</h3>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label className='block-text-sm font-medium text-gray-700 mb-2'>Location</label>
                  <select className='w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500'>
                    <option>Select your city</option>
                    <option>Ho Chi Minh City</option>
                    <option>Hanoi</option>
                    <option>Da Nang</option>
                  </select>
                </div>
                <div>
                  <label className='block-text-sm font-medium text-gray-700 mb-2'>Date</label>
                  <select className='w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500'>
                    <option>Select your date</option>
                    <option>Today</option>
                    <option>Tomorrow</option>
                    <option>Next week</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                  <select className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500">
                    <option>Select your time</option>
                    <option>08:00 AM</option>
                    <option>10:00 AM</option>
                    <option>12:00 PM</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Cars Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Popular Car</h2>
            <Link to="/cars" className="text-blue-600 hover:text-blue-700 font-medium">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        </div>

        {/* Recommendation Cars Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommendation Car</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {recommendationCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          <div className="text-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium mr-4">
              Show more car
            </button>
            <span className="text-gray-500">120 Car</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;