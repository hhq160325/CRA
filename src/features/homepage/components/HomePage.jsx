<<<<<<< HEAD
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toggleFavorite, selectIsFavorite } from '../../favorites/favoritesSlice';
const HomePage = () => {
  const { t } = useTranslation();
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

    // Helper function to translate transmission
    const getTransmissionText = (transmission) => {
      if (transmission.toLowerCase() === 'manual') return t('manual');
      if (transmission.toLowerCase() === 'automatic') return t('automatic');
      return transmission;
    };

    // Helper function to translate capacity
    const getCapacityText = (capacity) => {
      const match = capacity.match(/(\d+)\s*People/i);
      if (match) {
        return `${match[1]} ${t('people')}`;
      }
      return capacity;
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
            {getTransmissionText(car.transmission)}
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {getCapacityText(car.capacity)}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className='flex items-center'><div className="text-xl font-bold text-gray-900">${car.price}</div><div className="text-sm text-slate-400">{t('perDay')}</div></div>
            {car.originalPrice && (
              <div className="text-sm text-gray-500 line-through">${car.originalPrice}</div>
            )}
          </div>
          <Link
            to={`/cars/${car.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            {t('rentNow')}
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
=======
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchAllCars } from '../../cars/carsSlice';
import CarCard from '../../cars/CarCard';
import DeliveryLocationModal from '../../cars/components/CarDetailRevModal/DeliveryLocationModal';
import DateAndTimePicker from '../../cars/components/CarDetailRevModal/DateAndTimePicker';

const HomePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { cars, loading, error } = useSelector((state) => state.cars);

  // Modal states
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [dateTimePickerOpen, setDateTimePickerOpen] = useState(false);

  // Selected values
  const [location, setLocation] = useState('Pick your location');
  const [locationAddress, setLocationAddress] = useState('');
  const [locationCity, setLocationCity] = useState('Pick your location');
  const [selectedAirport, setSelectedAirport] = useState('');
  const [pickupDateStr, setPickupDateStr] = useState('01/12');
  const [dropoffDateStr, setDropoffDateStr] = useState('02/12');
  const [pickupTime, setPickupTime] = useState('21:00');
  const [dropoffTime, setDropoffTime] = useState('20:00');
  const [rentalDuration, setRentalDuration] = useState(1);

  useEffect(() => {
    dispatch(fetchAllCars());
  }, [dispatch]);

  // Filter out cars with Reserved status
  const activeCars = cars.filter(car => car.status && car.status.toLowerCase() !== 'reserved');
  
  const popularCars = [];

  const recommendationCars = [];
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
<<<<<<< HEAD
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Left Banner */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h1 className="text-3xl font-bold mb-4">{t('heroTitle')}</h1>
              <p className="text-blue-100 mb-6 text-lg">
                {t('heroSubtitle')}
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                {t('rentalCar')}
              </button>
            </div>
            <div className="absolute bottom-0 right-0 w-64 h-48">
=======
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Left Banner */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden min-h-[200px] sm:min-h-[280px]">
            <div className="relative z-10 max-w-[60%] sm:max-w-none">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-4">{t('heroTitle')}</h1>
              <p className="text-blue-100 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg">
                {t('heroSubtitle')}
              </p>
              <button className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base">
                {t('rentalCar')}
              </button>
            </div>
            <div className="absolute bottom-0 right-0 w-40 h-32 sm:w-56 sm:h-40 lg:w-64 lg:h-48">
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
              <img
                src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop"
                alt="Koenigsegg"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Right Banner */}
<<<<<<< HEAD
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-8 relative overflow-hidden">
=======
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 relative overflow-hidden min-h-[200px] sm:min-h-[280px]">
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
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
<<<<<<< HEAD
            <div className="relative z-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('heroTitle2')}</h2>
              <p className="text-gray-600 mb-6 text-lg">
                {t('heroSubtitle2')}
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                {t('rentalCar')}
              </button>
            </div>
            <div className="absolute bottom-0 right-0 w-64 h-48">
=======
            <div className="relative z-10 max-w-[60%] sm:max-w-none">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">{t('heroTitle2')}</h2>
              <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg">
                {t('heroSubtitle2')}
              </p>
              <button className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base">
                {t('rentalCar')}
              </button>
            </div>
            <div className="absolute bottom-0 right-0 w-40 h-32 sm:w-56 sm:h-40 lg:w-64 lg:h-48">
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop"
                alt="Nissan GT-R"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

<<<<<<< HEAD
        {/* Search Section */}
        <div className='bg-white rounded-2xl p-6 shadow-sm mb-8'>
          <div className='grid grid-cols-1 lg:grid-cols-7 gap-6 items-end'>
            {/* Pick-up */}
            <div className='lg:col-span-3 space-y-4'>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-blue-600 rounded-full'></div>
                <h3 className='text-lg font-semibold text-gray-900'>{t('pickUp')}</h3>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label className='block-text-sm font-medium text-gray-700 mb-2'>{t('location')}</label>
                  <select className='w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500'>
                    <option>{t('selectCity')}</option>
                    <option>{t('hoChiMinhCity')}</option>
                    <option>{t('hanoi')}</option>
                    <option>{t('daNang')}</option>
                  </select>
                </div>
                <div>
                  <label className='block-text-sm font-medium text-gray-700 mb-2'>{t('date')}</label>
                  <select className='w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500'>
                    <option>{t('selectDate')}</option>
                    <option>{t('today')}</option>
                    <option>{t('tomorrow')}</option>
                    <option>{t('nextWeek')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('time')}</label>
                  <select className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500">
                    <option>{t('selectTime')}</option>
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
                <h3 className="text-lg font-semibold text-gray-900">{t('dropOff')}</h3>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div>
                  <label className='block-text-sm font-medium text-gray-700 mb-2'>{t('location')}</label>
                  <select className='w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500'>
                    <option>{t('selectCity')}</option>
                    <option>{t('hoChiMinhCity')}</option>
                    <option>{t('hanoi')}</option>
                    <option>{t('daNang')}</option>
                  </select>
                </div>
                <div>
                  <label className='block-text-sm font-medium text-gray-700 mb-2'>{t('date')}</label>
                  <select className='w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500'>
                    <option>{t('selectDate')}</option>
                    <option>{t('today')}</option>
                    <option>{t('tomorrow')}</option>
                    <option>{t('nextWeek')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t('time')}</label>
                  <select className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500">
                    <option>{t('selectTime')}</option>
                    <option>08:00 AM</option>
                    <option>10:00 AM</option>
                    <option>12:00 PM</option>
                  </select>
                </div>
              </div>
=======
        {/* Pick-up and Drop-off Section */}
        <div className='bg-white rounded-xl p-3 sm:p-4 shadow-sm mb-6 sm:mb-8 relative z-10'>
          <div className='flex flex-col md:flex-row items-stretch gap-2 md:gap-0'>
            {/* Location Section */}
            <div className='flex-1 relative border-r-0 md:border-r border-gray-200 pr-0 md:pr-4'>
              <label className='flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5'>
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {t('location') || 'Địa điểm'}
              </label>
              <button
                type="button"
                onClick={() => setLocationModalOpen(true)}
                className='w-full text-left flex items-center justify-between group hover:opacity-80 transition-opacity'
              >
                <span className='text-sm sm:text-base text-gray-900 font-medium'>
                  {location}
                </span>
                <svg
                  className='w-4 h-4 text-gray-400 flex-shrink-0 ml-2'
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Time Range Section */}
            <div className='flex-1 relative pl-0 md:pl-4'>
              <label className='flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5'>
                <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {t('rentalPeriod') || 'Thời gian thuê'}
              </label>
              <button
                type="button"
                onClick={() => setDateTimePickerOpen(true)}
                className='w-full text-left flex items-center justify-between group hover:opacity-80 transition-opacity'
              >
                <span className='text-sm sm:text-base text-gray-900 font-medium'>
                  {`${pickupTime}, ${pickupDateStr}/2025 - ${dropoffTime}, ${dropoffDateStr}/2025`}
                </span>
                <svg
                  className='w-4 h-4 text-gray-400 flex-shrink-0 ml-2'
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Search Button */}
            <div className='flex items-end md:items-center md:ml-3'>
              <button className='w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-medium text-sm whitespace-nowrap'>
                {t('search') || 'Tìm Xe'}
              </button>
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
            </div>
          </div>
        </div>

<<<<<<< HEAD
        {/* Popular Cars Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{t('popularCar')}</h2>
            <Link to="/cars" className="text-blue-600 hover:text-blue-700 font-medium">
              {t('viewAll')}
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('recommendationCar')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {recommendationCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          <div className="text-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium mr-4">
              {t('showMoreCar')}
            </button>
            <span className="text-gray-500">120 {t('car')}</span>
=======
        {/* Delivery Location Modal */}
        <DeliveryLocationModal
          isOpen={locationModalOpen}
          onClose={() => setLocationModalOpen(false)}
          locationAddress={locationAddress}
          locationCity={locationCity}
          selectedAirport={selectedAirport}
          setSelectedAirport={setSelectedAirport}
          onLocationUpdate={(newLocation) => {
            setLocation(newLocation);
            // Parse address and city if needed
            const parts = newLocation.split(',');
            if (parts.length >= 2) {
              setLocationCity(parts[parts.length - 1].trim());
              setLocationAddress(parts.slice(0, -1).join(',').trim());
            }
          }}
        />

        {/* Date and Time Picker Modal */}
        <DateAndTimePicker
          isOpen={dateTimePickerOpen}
          onClose={() => setDateTimePickerOpen(false)}
          onConfirm={(dateTimeData) => {
            setPickupDateStr(dateTimeData.pickupDate);
            setDropoffDateStr(dateTimeData.dropoffDate);
            setPickupTime(dateTimeData.pickupTime);
            setDropoffTime(dateTimeData.dropoffTime);
            setRentalDuration(dateTimeData.duration);
          }}
        />

        {/* Popular Cars Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{t('popularCar')}</h2>
            <Link to="/cars" className="text-sm sm:text-base text-blue-600 hover:text-blue-700 font-medium">
              {t('viewAll')}
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading cars...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">Error loading cars: {error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {activeCars.length > 0 ? (
                activeCars.slice(0, 4).map((car) => (
                  <CarCard key={car.id} car={car} isApiData={true} />
                ))
              ) : (
                popularCars.map((car) => (
                  <CarCard key={car.id} car={car} isApiData={false} />
                ))
              )}
            </div>
          )}
        </div>

        {/* Recommendation Cars Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">{t('recommendationCar')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {activeCars.length > 4 ? (
              activeCars.slice(4, 12).map((car) => (
                <CarCard key={car.id} car={car} isApiData={true} />
              ))
            ) : (
              recommendationCars.map((car) => (
                <CarCard key={car.id} car={car} isApiData={false} />
              ))
            )}
          </div>

          <div className="text-center">
            <button className="bg-blue-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium mr-2 sm:mr-4 text-sm sm:text-base">
              {t('showMoreCar')}
            </button>
            <span className="text-sm sm:text-base text-gray-500">{activeCars.length > 0 ? activeCars.length : 120} {t('car')}</span>
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;