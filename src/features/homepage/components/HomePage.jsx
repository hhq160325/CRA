import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchAllCars } from '../../cars/carsSlice';
import CarCard from '../../cars/CarCard';

const HomePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { cars, loading, error } = useSelector((state) => state.cars);

  useEffect(() => {
    dispatch(fetchAllCars());
  }, [dispatch]);

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
              <img
                src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop"
                alt="Koenigsegg"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Right Banner */}
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 relative overflow-hidden min-h-[200px] sm:min-h-[280px]">
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
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop"
                alt="Nissan GT-R"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className='bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm mb-6 sm:mb-8'>
          <div className='flex flex-col lg:flex-row lg:items-end gap-4 sm:gap-6'>
            {/* Pick-up */}
            <div className='flex-1 space-y-3 sm:space-y-4'>
              <div className='flex items-center space-x-2'>
                <div className='w-3 h-3 bg-blue-600 rounded-full'></div>
                <h3 className='text-base sm:text-lg font-semibold text-gray-900'>{t('pickUp')}</h3>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4'>
                <div>
                  <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2'>{t('location')}</label>
                  <select className='w-full border border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500 text-sm sm:text-base'>
                    <option>{t('selectCity')}</option>
                    <option>{t('hoChiMinhCity')}</option>
                    <option>{t('hanoi')}</option>
                    <option>{t('daNang')}</option>
                  </select>
                </div>
                <div>
                  <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2'>{t('date')}</label>
                  <select className='w-full border border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500 text-sm sm:text-base'>
                    <option>{t('selectDate')}</option>
                    <option>{t('today')}</option>
                    <option>{t('tomorrow')}</option>
                    <option>{t('nextWeek')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">{t('time')}</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500 text-sm sm:text-base">
                    <option>{t('selectTime')}</option>
                    <option>08:00 AM</option>
                    <option>10:00 AM</option>
                    <option>12:00 PM</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Swap Button */}
            <div className='flex justify-center lg:block'>
              <button className='bg-blue-600 text-white p-2 sm:p-3 rounded-lg hover:bg-blue-700 transition-colors'>
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>
            {/* Drop-off */}
            <div className='flex-1 space-y-3 sm:space-y-4'>
              <div className='flex items-center space-x-2'>
                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">{t('dropOff')}</h3>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4'>
                <div>
                  <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2'>{t('location')}</label>
                  <select className='w-full border border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500 text-sm sm:text-base'>
                    <option>{t('selectCity')}</option>
                    <option>{t('hoChiMinhCity')}</option>
                    <option>{t('hanoi')}</option>
                    <option>{t('daNang')}</option>
                  </select>
                </div>
                <div>
                  <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2'>{t('date')}</label>
                  <select className='w-full border border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500 text-sm sm:text-base'>
                    <option>{t('selectDate')}</option>
                    <option>{t('today')}</option>
                    <option>{t('tomorrow')}</option>
                    <option>{t('nextWeek')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">{t('time')}</label>
                  <select className="w-full border border-gray-200 rounded-lg px-3 sm:px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500 text-sm sm:text-base">
                    <option>{t('selectTime')}</option>
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
              {cars.length > 0 ? (
                cars.slice(0, 4).map((car) => (
                  <CarCard key={car.licensePlate} car={car} isApiData={true} />
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
            {cars.length > 4 ? (
              cars.slice(4, 12).map((car) => (
                <CarCard key={car.licensePlate} car={car} isApiData={true} />
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
            <span className="text-sm sm:text-base text-gray-500">{cars.length > 0 ? cars.length : 120} {t('car')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;