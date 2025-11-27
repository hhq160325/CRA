import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchAllCars } from '../../cars/carsSlice';
import CarCard from '../../cars/CarCard';
import Calendar from '../../../shared/components/Calendar';
import TimePicker from '../../../shared/components/TimePicker';

const HomePage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { cars, loading, error } = useSelector((state) => state.cars);

  // Dropdown states
  const [pickupDateOpen, setPickupDateOpen] = useState(false);
  const [pickupTimeOpen, setPickupTimeOpen] = useState(false);
  const [dropoffDateOpen, setDropoffDateOpen] = useState(false);
  const [dropoffTimeOpen, setDropoffTimeOpen] = useState(false);

  // Selected values
  const [pickupLocation, setPickupLocation] = useState('');
  const [pickupDate, setPickupDate] = useState(null);
  const [pickupTime, setPickupTime] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [dropoffDate, setDropoffDate] = useState(null);
  const [dropoffTime, setDropoffTime] = useState('');

  useEffect(() => {
    dispatch(fetchAllCars());
  }, [dispatch]);

  // Filter out cars with Inactive status
  const activeCars = cars.filter(car => car.status && car.status.toLowerCase() !== 'inactive');
  
  const popularCars = [];

  const recommendationCars = [];

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

        {/* Pick-up and Drop-off Section */}
        <div className='bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm mb-6 sm:mb-8 relative z-10'>
          <div className='flex flex-col lg:flex-row gap-4 sm:gap-6'>
            {/* Pick-up */}
            <div className='flex-1'>
              <div className='flex items-center space-x-2 mb-3 sm:mb-4'>
                <div className='w-3 h-3 sm:w-4 sm:h-4 bg-blue-600 rounded-full flex-shrink-0'></div>
                <h3 className='text-base sm:text-lg font-semibold text-gray-900'>{t('pickUp')}</h3>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4'>
                {/* Pickup Location */}
                <div className='w-full relative'>
                  <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2'>{t('location')}</label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    placeholder={t('selectCity')}
                    className='w-full border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white'
                  />
                </div>

                {/* Pickup Date */}
                <div className='w-full relative'>
                  <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2'>{t('date')}</label>
                  <button
                    type="button"
                    onClick={() => setPickupDateOpen(!pickupDateOpen)}
                    className='w-full border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white text-left flex items-center justify-between'
                  >
                    <span className={pickupDate ? 'text-gray-900' : 'text-gray-400'}>
                      {pickupDate ? pickupDate.toLocaleDateString() : t('selectDate')}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform ${pickupDateOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  {pickupDateOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setPickupDateOpen(false)}
                      />
                      <div className="absolute z-20 mt-1">
                        <Calendar
                          selectedDate={pickupDate}
                          onDateSelect={setPickupDate}
                          onClose={() => setPickupDateOpen(false)}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Pickup Time */}
                <div className='w-full relative'>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">{t('time')}</label>
                  <button
                    type="button"
                    onClick={() => setPickupTimeOpen(!pickupTimeOpen)}
                    className='w-full border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white text-left flex items-center justify-between'
                  >
                    <span className={pickupTime ? 'text-gray-900' : 'text-gray-400'}>
                      {pickupTime || t('selectTime')}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform ${pickupTimeOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  {pickupTimeOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setPickupTimeOpen(false)}
                      />
                      <div className="absolute z-20 mt-1">
                        <TimePicker
                          selectedTime={pickupTime}
                          onTimeSelect={setPickupTime}
                          onClose={() => setPickupTimeOpen(false)}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className='flex items-center justify-center lg:items-end lg:pb-2'>
              <button className='bg-blue-600 text-white p-3 sm:p-3.5 rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg'>
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
              </button>
            </div>

            {/* Drop-off */}
            <div className='flex-1'>
              <div className='flex items-center space-x-2 mb-3 sm:mb-4'>
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-blue-600 rounded-full flex-shrink-0"></div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-900">{t('dropOff')}</h3>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4'>
                {/* Dropoff Location */}
                <div className='w-full relative'>
                  <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2'>{t('location')}</label>
                  <input
                    type="text"
                    value={dropoffLocation}
                    onChange={(e) => setDropoffLocation(e.target.value)}
                    placeholder={t('selectCity')}
                    className='w-full border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white'
                  />
                </div>

                {/* Dropoff Date */}
                <div className='w-full relative'>
                  <label className='block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2'>{t('date')}</label>
                  <button
                    type="button"
                    onClick={() => setDropoffDateOpen(!dropoffDateOpen)}
                    className='w-full border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white text-left flex items-center justify-between'
                  >
                    <span className={dropoffDate ? 'text-gray-900' : 'text-gray-400'}>
                      {dropoffDate ? dropoffDate.toLocaleDateString() : t('selectDate')}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform ${dropoffDateOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  {dropoffDateOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setDropoffDateOpen(false)}
                      />
                      <div className="absolute z-20 mt-1">
                        <Calendar
                          selectedDate={dropoffDate}
                          onDateSelect={setDropoffDate}
                          onClose={() => setDropoffDateOpen(false)}
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Dropoff Time */}
                <div className='w-full relative'>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">{t('time')}</label>
                  <button
                    type="button"
                    onClick={() => setDropoffTimeOpen(!dropoffTimeOpen)}
                    className='w-full border border-gray-200 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base bg-white text-left flex items-center justify-between'
                  >
                    <span className={dropoffTime ? 'text-gray-900' : 'text-gray-400'}>
                      {dropoffTime || t('selectTime')}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform ${dropoffTimeOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  {dropoffTimeOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setDropoffTimeOpen(false)}
                      />
                      <div className="absolute z-20 mt-1">
                        <TimePicker
                          selectedTime={dropoffTime}
                          onTimeSelect={setDropoffTime}
                          onClose={() => setDropoffTimeOpen(false)}
                          minTime={pickupTime}
                        />
                      </div>
                    </>
                  )}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;