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
  const [location, setLocation] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [locationCity, setLocationCity] = useState('');
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
  // const activeCars = cars.filter(car => car.status && car.status.toLowerCase() !== 'reserved');
  const activeCars = cars;

  const popularCars = [];

  const recommendationCars = [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Left Banner */}
          <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden min-h-[200px] sm:min-h-[280px]">
            {/* Dark gradient overlay from left */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent/10 pointer-events-none z-[5]"></div>
            
            <div className="relative z-10 max-w-[60%] sm:max-w-none">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-4">{t('heroTitle')}</h1>
              <p className="text-blue-100 text-balance mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg">
                {t('heroSubtitle')}
              </p>
              <button className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base">
                {t('rentalCar')}
              </button>
            </div>
            <div className="absolute bottom-0 right-0 w-full h-full sm:w-full sm:h-full lg:w-full lg:h-full">
              <img
                src="/images/forza1.png"
                alt="Featured Car"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Right Banner */}
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl sm:rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden min-h-[200px] sm:min-h-[280px]">
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
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent/10 pointer-events-none z-[5]"></div>
            <div className="relative z-10 max-w-[60%] sm:max-w-none">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-4">{t('heroTitle2')}</h2>
              <p className="text-blue-100 text-balance mb-4 sm:mb-6 text-sm sm:text-base lg:text-lg">
                {t('heroSubtitle2')}
              </p>
              <button className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base">
                {t('rentalCar')}
              </button>
            </div>
            <div className="absolute bottom-0 right-0 w-full h-full sm:w-full sm:h-full lg:w-full lg:h-full">
              <img
                src="/images/forza2.png"
                alt="Featured Car"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

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
                {t('location')}
              </label>
              <button
                type="button"
                onClick={() => setLocationModalOpen(true)}
                className='w-full text-left flex items-center justify-between group hover:opacity-80 transition-opacity'
              >
                <span className='text-sm sm:text-base text-gray-900 font-medium'>
                  {location || t('pickYourLocation')}
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
                {t('rentalPeriod')}
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
                {t('search')}
              </button>
            </div>
          </div>
        </div>

        {/* Delivery Location Modal */}
        <DeliveryLocationModal
          isOpen={locationModalOpen}
          onClose={() => setLocationModalOpen(false)}
          locationAddress={locationAddress}
          locationCity={locationCity}
          selectedAirport={selectedAirport}
          setSelectedAirport={setSelectedAirport}
          showParkLotOptions={true}
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
              <p className="mt-2 text-gray-600">{t('loadingCars')}</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600">{t('errorLoadingCars')} {error}</p>
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