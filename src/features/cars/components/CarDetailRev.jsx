import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchCarById } from '../carsSlice';
import { getCarRentalRate } from '../carApi';
import { DeliveryLocationModal, DateAndTimePicker } from './CarDetailRevModal';

const CarDetailRev = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedImage, setSelectedImage] = useState(0);
  const [rentalRate, setRentalRate] = useState(null);
  const [loadingRate, setLoadingRate] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [rentalDates, setRentalDates] = useState({
    pickupDate: '31/12',
    dropoffDate: '31/12',
    pickupTime: '07:00',
    dropoffTime: '11:00',
    duration: 1
  });

  // Get car data from Redux store
  const { currentCar, loading, error } = useSelector((state) => state.cars);

  // Fetch car by ID on component mount
  useEffect(() => {
    if (id) {
      dispatch(fetchCarById(id));
    }
  }, [dispatch, id]);

  // Fetch rental rate when car ID changes
  useEffect(() => {
    const fetchRentalRate = async () => {
      if (!id) return;

      setLoadingRate(true);
      try {
        const rateData = await getCarRentalRate(id);
        setRentalRate(rateData);
      } catch (error) {
        console.error('Failed to fetch rental rate:', error);
      } finally {
        setLoadingRate(false);
      }
    };

    fetchRentalRate();
  }, [id]);

  // Helper function to process image URLs
  const processImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop';
    return imageUrl.replace('<url>', process.env.REACT_APP_STORAGE_URL || 'https://your-storage-url.com');
  };

  // Get car images from API or use defaults
  const carImages = currentCar?.imageUrls && currentCar.imageUrls.length > 0
    ? currentCar.imageUrls.map(url => processImageUrl(url))
    : [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&h=600&fit=crop'
    ];

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('loadingCalendar')}</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{t('failed')}: {error}</p>
          <button
            onClick={() => dispatch(fetchCarById(id))}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            {t('tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  // Show not found state
  if (!loading && !currentCar) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('noBookingsFound')}</h2>
          <p className="text-gray-600 mb-6">{t('noFavouriteCarsMessage')}</p>
          <button
            onClick={() => navigate('/cars')}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
          >
            {t('browseCars')}
          </button>
        </div>
      </div>
    );
  }

  // Get car data with fallbacks
  const carName = currentCar ? `${currentCar.manufacturer} ${currentCar.model}`.toUpperCase() : 'MITSUBISHI XPANDER CROSS 2023';
  const carDescription = currentCar?.description || 'Xpander Cross 2024 bản full';
  const dailyPrice = rentalRate?.dailyRate || 913000;
  const transmission = currentCar?.transmission || 'Số tự động';
  const seats = currentCar?.seats || 7;
  const fuelType = currentCar?.fuelType || 'Xăng';
  const fuelConsumption = currentCar?.fuelConsumption || 8;
  const licensePlate = currentCar?.licensePlate || 'N/A';
  const yearOfManufacture = currentCar?.yearofManufacture || new Date().getFullYear();

  // Location information
  const locationName = currentCar?.preferredLot?.name || 'Phường Phạm Ngũ Lão, Quận 1';
  const locationAddress = currentCar?.preferredLot?.address || 'Phường Phạm Ngũ Lão, Quận 1';
  const locationCity = currentCar?.preferredLot?.city || 'TP.Hồ Chí Minh';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Car Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="relative">
                <img
                  src={carImages[selectedImage]}
                  alt="Car main view"
                  className="w-full h-96 object-cover"
                />
                <button className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512" fill="currentColor">
                    <g>
                      <path d="M78.01,78.01V512H512V78.01H78.01z M472.987,472.987H117.022V117.022h355.965V472.987z" />
                      <path d="M142.17,404.714h305.67c3.055,0,5.859-1.676,7.306-4.366c1.448-2.681,1.303-5.95-0.381-8.494l-94.854-143.716   c-3.84-5.82-10.346-9.316-17.324-9.316c-6.971,0.015-13.476,3.519-17.308,9.355L258.46,349.863l-36.879-41.801   c-4.281-4.845-10.574-7.427-17.019-6.962c-6.452,0.457-12.319,3.901-15.861,9.301l-53.464,81.469   c-1.676,2.552-1.813,5.805-0.365,8.487C136.319,403.045,139.123,404.714,142.17,404.714z" />
                      <path d="M220.065,269.4c23.228,0,42.053-18.824,42.053-42.052c0-23.228-18.825-42.052-42.053-42.052   c-23.228,0-42.06,18.824-42.06,42.052C178.005,250.576,196.837,269.4,220.065,269.4z" />
                      <polygon points="433.99,39.013 433.99,0 0,0 0,433.99 39.013,433.99 39.013,394.978 39.013,39.013 394.978,39.013" />
                    </g>
                  </svg>
                  <span>{t('viewAllPhotos')}</span>
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2 p-2">
                {carImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Car view ${idx + 1}`}
                    className={`w-full h-24 object-cover rounded cursor-pointer ${selectedImage === idx ? 'ring-2 ring-green-500' : ''}`}
                    onClick={() => setSelectedImage(idx)}
                  />
                ))}
              </div>
            </div>

            {/* Car Title */}
            <div className="bg-white rounded-lg p-6">
              <h1 className="text-2xl font-bold mb-2">{carName}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none"><path d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z" stroke="#1C274C" stroke-width="1.5"></path></svg>
                  <span>{currentCar?.rating || 5.0}</span>
                  <span>• 100+ {t('trips')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="16px" height="16px" viewBox="0 0 24 24" className="flex-shrink-0">
                    <path d="M5,22H19a3,3,0,0,0,3-3V5a3,3,0,0,0-3-3H5A3,3,0,0,0,2,5V19A3,3,0,0,0,5,22ZM4,5A1,1,0,0,1,5,4H19a1,1,0,0,1,1,1V19a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1ZM9,18a1,1,0,0,0,1-1V14h2a4,4,0,0,0,0-8H9A1,1,0,0,0,8,7V17A1,1,0,0,0,9,18ZM10,8h2a2,2,0,0,1,0,4H10Z" />
                  </svg>
                  <span>{locationName}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                <span>{t('plateNo')}: {licensePlate}</span>
                <span>•</span>
                <span>{t('yearOfManufacture')}: {yearOfManufacture}</span>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">{t('features')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-row items-center p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" viewBox="0 0 24 24" fill="none">
                    <path d="M6 4C6 5.10457 5.10457 6 4 6C2.89543 6 2 5.10457 2 4C2 2.89543 2.89543 2 4 2C5.10457 2 6 2.89543 6 4Z" stroke="#1C274C" stroke-width="1.5" />
                    <path d="M6 20C6 21.1046 5.10457 22 4 22C2.89543 22 2 21.1046 2 20C2 18.8954 2.89543 18 4 18C5.10457 18 6 18.8954 6 20Z" stroke="#1C274C" stroke-width="1.5" />
                    <path d="M14 20C14 21.1046 13.1046 22 12 22C10.8954 22 10 21.1046 10 20C10 18.8954 10.8954 18 12 18C13.1046 18 14 18.8954 14 20Z" stroke="#1C274C" stroke-width="1.5" />
                    <path d="M14 4C14 5.10457 13.1046 6 12 6C10.8954 6 10 5.10457 10 4C10 2.89543 10.8954 2 12 2C13.1046 2 14 2.89543 14 4Z" stroke="#1C274C" stroke-width="1.5" />
                    <path d="M22 4C22 5.10457 21.1046 6 20 6C18.8954 6 18 5.10457 18 4C18 2.89543 18.8954 2 20 2C21.1046 2 22 2.89543 22 4Z" stroke="#1C274C" stroke-width="1.5" />
                    <path d="M12 6V13M12 18V16" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" />
                    <path d="M4 18V11M4 6V8" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" />
                    <path d="M20 6V8C20 9.88562 20 10.8284 19.4142 11.4142C18.8284 12 17.8856 12 16 12H10M4 12H6" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" />
                    <path d="M18 15V14.25C17.5858 14.25 17.25 14.5858 17.25 15H18ZM17.25 22C17.25 22.4142 17.5858 22.75 18 22.75C18.4142 22.75 18.75 22.4142 18.75 22H17.25ZM21.3604 22.3916C21.5766 22.7449 22.0384 22.8559 22.3916 22.6396C22.7449 22.4234 22.8559 21.9616 22.6396 21.6084L21.3604 22.3916ZM18 15.75H20.2857V14.25H18V15.75ZM18.75 18.5V15H17.25V18.5H18.75ZM21.25 16.75C21.25 17.3169 20.8038 17.75 20.2857 17.75V19.25C21.6612 19.25 22.75 18.1161 22.75 16.75H21.25ZM20.2857 15.75C20.8038 15.75 21.25 16.1831 21.25 16.75H22.75C22.75 15.3839 21.6612 14.25 20.2857 14.25V15.75ZM20.2857 17.75H19.8571V19.25H20.2857V17.75ZM19.8571 17.75H18V19.25H19.8571V17.75ZM19.2175 18.8916L21.3604 22.3916L22.6396 21.6084L20.4968 18.1084L19.2175 18.8916ZM17.25 18.5V22H18.75V18.5H17.25Z" fill="#1C274C" />
                  </svg>
                  <div className="flex flex-col items-center p-3  rounded-lg" >
                    <span className="text-sm text-gray-600">{t('transmission')}</span>
                    <span className="font-semibold">{transmission}</span>
                  </div>
                </div>
                <div className="flex flex-row items-center p-3  rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="48px" width="48px" version="1.1" id="Capa_1" viewBox="0 0 353.926 353.926">
                    <path d="M210.286,344.926c0,4.971-4.029,9-9,9h-48.65c-4.971,0-9-4.029-9-9s4.029-9,9-9h48.65  C206.257,335.926,210.286,339.955,210.286,344.926z M289.677,258.958v25.928c0,19.259-15.67,34.928-34.931,34.928H99.177  c-19.259,0-34.928-15.668-34.928-34.928v-25.928c0-4.971,4.029-9,9-9h2.394c-0.021-0.258-0.033-0.52-0.033-0.784v-24.118  c-0.013-0.535,0.023-1.066,0.105-1.588c0.204-1.329,0.699-2.561,1.418-3.631c0.705-1.055,1.639-1.969,2.767-2.659  c0.457-0.281,0.94-0.522,1.446-0.719c3.564-1.483,7.107-3.016,10.605-4.586V101.909c0-17.877,11.375-33.581,27.599-39.623  c-0.019-0.492-0.028-0.984-0.028-1.48V38.578C119.521,17.306,136.827,0,158.098,0h37.725C217.095,0,234.4,17.306,234.4,38.578  v22.229c0,0.495-0.01,0.988-0.028,1.478c6.395,2.378,12.129,6.28,16.702,11.351c0.16-0.3,0.318-0.599,0.478-0.899  c2.318-4.396,7.761-6.081,12.16-3.76c4.396,2.319,6.079,7.764,3.76,12.16c-16.845,31.926-41.307,61.508-72.707,87.923  c-25.063,21.083-53.512,39.294-84.813,54.313v26.586h134.02V141.64c0-4.971,4.029-9,9-9s9,4.029,9,9v108.318h18.706  C285.647,249.958,289.677,253.987,289.677,258.958z M137.521,60.807c0,1.842,0.243,3.629,0.699,5.33  c0.073,0.22,0.138,0.444,0.193,0.672c2.574,8.428,10.424,14.576,19.684,14.576h37.725c9.259,0,17.109-6.146,19.685-14.573  c0.057-0.231,0.122-0.458,0.195-0.68c0.455-1.699,0.698-3.484,0.698-5.325V38.578C216.4,27.231,207.169,18,195.822,18h-37.725  c-11.346,0-20.576,9.231-20.576,20.578V60.807z M109.951,203.272c56.184-28.521,102.335-68.15,131.162-112.739  c-2.612-4.871-6.75-8.658-11.666-10.83c-6.622,11.738-19.213,19.681-33.625,19.681h-37.725c-14.411,0-27.002-7.944-33.624-19.682  c-8.604,3.8-14.522,12.438-14.522,22.207V203.272z M271.677,267.958h-18.57c-0.046,0-0.091,0.001-0.136,0.001h-152.02  c-0.045,0-0.09,0-0.136-0.001H82.249v16.928c0,9.334,7.594,16.928,16.928,16.928h155.569c9.336,0,16.931-7.594,16.931-16.928  V267.958z" />
                  </svg>
                  <div className="flex flex-col items-center p-3 rounded-lg" >
                    <span className="text-sm text-gray-600">{t('seats')}</span>
                    <span className="font-semibold">{seats} {t('person')}</span>
                  </div>
                </div>
                <div className="flex flex-row items-center p-3  rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" height="48px" width="48px" version="1.1" id="Layer_1" viewBox="0 0 32 32">
                    <path id="fuel_1_" d="M26,31.36H6c-1.301,0-2.36-1.059-2.36-2.36V6c0-1.179,0.869-2.159,2-2.333V1c0-0.199,0.161-0.36,0.36-0.36h10  c0.199,0,0.36,0.161,0.36,0.36v2.64H26c1.302,0,2.36,1.059,2.36,2.36v23C28.36,30.302,27.302,31.36,26,31.36z M6,4.36  C5.096,4.36,4.36,5.096,4.36,6v23c0,0.904,0.736,1.64,1.64,1.64h20c0.904,0,1.64-0.735,1.64-1.64V6c0-0.904-0.735-1.64-1.64-1.64H6z   M6.36,3.64h9.28V1.36H6.36V3.64z M23,24.36c-0.092,0-0.185-0.035-0.255-0.105l-14-14c-0.141-0.141-0.141-0.368,0-0.509  s0.368-0.141,0.509,0l14,14c0.141,0.141,0.141,0.369,0,0.51C23.185,24.325,23.092,24.36,23,24.36z M9,24.36  c-0.092,0-0.184-0.035-0.254-0.105c-0.141-0.141-0.141-0.369,0-0.51l5-5c0.141-0.141,0.368-0.141,0.509,0s0.141,0.369,0,0.51l-5,5  C9.184,24.325,9.092,24.36,9,24.36z M18,15.36c-0.092,0-0.185-0.035-0.255-0.105c-0.141-0.141-0.141-0.368,0-0.509l5-5  c0.141-0.141,0.369-0.141,0.51,0s0.141,0.368,0,0.509l-5,5C18.185,15.325,18.092,15.36,18,15.36z M25,1.64h-4v0.72h4V1.64z" />
                    <rect id="_Transparent_Rectangle" style={{ fill: 'none' }} width="32" height="32" />
                  </svg>
                  <div className="flex flex-col items-center p-3 rounded-lg" >
                    <span className="text-sm text-gray-600">{t('fuel')}</span>
                    <span className="font-semibold">{fuelType}</span>
                  </div>
                </div>
                <div className="flex flex-row items-center p-3 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="48px" height="48px" viewBox="0 0 1024 1024"><path d="M522.267 910.508c16.962 0 30.72-13.758 30.72-30.72v-736.43c0-16.962-13.758-30.72-30.72-30.72H143.356c-16.962 0-30.72 13.758-30.72 30.72v736.43c0 16.962 13.758 30.72 30.72 30.72h378.911zm0 40.96H143.356c-39.583 0-71.68-32.097-71.68-71.68v-736.43c0-39.583 32.097-71.68 71.68-71.68h378.911c39.583 0 71.68 32.097 71.68 71.68v736.43c0 39.583-32.097 71.68-71.68 71.68zm388.62-678.049v500.265c0 49.412-40.054 89.467-89.467 89.467-49.443 0-89.498-40.054-89.498-89.467 0-11.311-9.169-20.48-20.48-20.48s-20.48 9.169-20.48 20.48c0 72.034 58.393 130.427 130.427 130.427 72.065 0 130.458-58.393 130.458-130.427V273.419c0-11.311-9.169-20.48-20.48-20.48s-20.48 9.169-20.48 20.48z" /><path d="M731.92 779.436V368.648c0-11.311-9.169-20.48-20.48-20.48s-20.48 9.169-20.48 20.48v410.788c0 11.311 9.169 20.48 20.48 20.48s20.48-9.169 20.48-20.48z" /><path d="M731.943 365.513v-34.499c0-49.414-40.053-89.467-89.467-89.467-49.415 0-89.477 40.054-89.477 89.467v34.499c0 11.311 9.169 20.48 20.48 20.48s20.48-9.169 20.48-20.48v-34.499c0-26.789 21.722-48.507 48.517-48.507 26.792 0 48.507 21.715 48.507 48.507v34.499c0 11.311 9.169 20.48 20.48 20.48s20.48-9.169 20.48-20.48zM942.5 254.981L767.785 80.266c-7.998-7.998-20.965-7.998-28.963 0s-7.998 20.965 0 28.963l174.715 174.715c7.998 7.998 20.965 7.998 28.963 0s7.998-20.965 0-28.963zM438.84 281.52c5.657 0 10.24-4.583 10.24-10.24V225.2c0-5.657-4.583-10.24-10.24-10.24H225.541a10.238 10.238 0 00-10.24 10.24v46.08c0 5.657 4.583 10.24 10.24 10.24H438.84zm0 40.96H225.541c-28.278 0-51.2-22.922-51.2-51.2V225.2c0-28.278 22.922-51.2 51.2-51.2H438.84c28.278 0 51.2 22.922 51.2 51.2v46.08c0 28.278-22.922 51.2-51.2 51.2z" /><path d="M928.972 358.832h-48.978c-11.309 0-20.48-9.171-20.48-20.48V191.091c0-11.311-9.169-20.48-20.48-20.48s-20.48 9.169-20.48 20.48v147.261c0 33.931 27.509 61.44 61.44 61.44h48.978c11.311 0 20.48-9.169 20.48-20.48s-9.169-20.48-20.48-20.48z" /></svg>
                  <div className="flex flex-col items-center p-3  rounded-lg" >
                    <span className="text-sm text-gray-600">{t('consumption')}</span>
                    <span className="font-semibold">{fuelConsumption}L/100km</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mô tả */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Mô tả</h2>
              <div className="space-y-2 text-gray-700">
                <p className="flex items-start gap-2">
                  <span>{carDescription}</span>
                </p>
                {currentCar?.description && (
                  <p className="whitespace-pre-line">{currentCar.description}</p>
                )}
                {!currentCar?.description && (
                  <>
                    <p>- Hầy đủ options</p>
                    <p>- Xe mới 99%</p>
                    <p>- Cam 360, quạt hơi cao cấp</p>
                    <p>- Vietnam số 1 màn hình lớn, cam phạt nguội, am lam đi các cung đường lạ</p>
                    <p>- Dàn phanh cao nhất, Lumbar chỉnh hàng</p>
                    <p>- Màn hình Android Teyes 10.0, có đủ sẵn</p>
                  </>
                )}
              </div>
              <button className="text-green-600 font-semibold mt-3">Xem thêm</button>
            </div>

            {/* Các tiện nghi khác */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Các tiện nghi khác</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { icon: '📍', label: 'Bản đồ' },
                  { icon: '🔵', label: 'Bluetooth' },
                  { icon: '📷', label: 'Camera 360' },
                  { icon: '📷', label: 'Camera cập lề' },
                  { icon: '📷', label: 'Camera hành trình' },
                  { icon: '📷', label: 'Camera lùi' },
                  { icon: '🔌', label: 'Cảm biến lốp' },
                  { icon: '🚗', label: 'Cảm biến va chạm' },
                  { icon: '🔧', label: 'Cảnh báo tốc độ' },
                  { icon: '🛡️', label: 'Định vị GPS' },
                  { icon: '🔋', label: 'Khe cắm USB' },
                  { icon: '💰', label: 'Khác' },
                  { icon: '🎵', label: 'Lốp dự phòng' },
                  { icon: '📺', label: 'Màn hình DVD' },
                  { icon: '🎫', label: 'ETC' },
                  { icon: '🔧', label: 'Túi khí an toàn' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 border rounded">
                    <span>{item.icon}</span>
                    <span className="text-sm">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Giấy tờ thuê xe */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                Giấy tờ thuê xe
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                  <input type="radio" name="license" defaultChecked className="mt-1" />
                  <div>
                    <p className="font-medium">GPLX (đối chiếu) & CCCD (chụp chiếu VNeID)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded">
                  <input type="radio" name="license" className="mt-1" />
                  <div>
                    <p className="font-medium">GPLX (đối chiếu) & Passport (giữ lại)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tài sản thế chấp */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                Tài sản thế chấp
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
              </h2>
              <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
                <p className="text-gray-700">Không yêu cầu khách thuê thế chấp Tiền mặt hoặc Xe máy</p>
              </div>
            </div>

            {/* Điều khoản */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Điều khoản</h2>
              <div className="space-y-2 text-gray-700 text-sm">
                <p className="font-semibold">Quy định khác:</p>
                <p>- Sử dụng xe đúng mục đích</p>
                <p>- Không sử dụng xe thuê vào mục đích phi pháp, trái pháp luật</p>
                <p>- Không sử dụng xe thuê để cầm cố, thế chấp</p>
                <p>- Không hút thuốc, nhả kẹo cao su, xả rác trong xe</p>
                <p>- Không chở hàng quốc cấm dễ cháy nổ</p>
                <p>- Không chở hoa quả, thực phẩm nặng mùi trong xe</p>
              </div>
              <button className="text-green-600 font-semibold mt-3">Xem thêm</button>
            </div>

            {/* Chính sách hủy chuyến */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Chính sách hủy chuyến</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Thời điểm Hủy Chuyến</th>
                      <th className="text-center py-3 px-4">Phí Hủy Chuyến</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-3 px-4">Trong vòng 1h sau Đặt Chỗ</td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col items-center justify-center">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.25 2C6.74 2 2.25 6.49 2.25 12C2.25 17.51 6.74 22 12.25 22C17.76 22 22.25 17.51 22.25 12C22.25 6.49 17.76 2 12.25 2ZM15.84 10.59L12.32 14.11C12.17 14.26 11.98 14.33 11.79 14.33C11.6 14.33 11.4 14.26 11.26 14.11L9.5 12.35C9.2 12.06 9.2 11.58 9.5 11.29C9.79 11 10.27 11 10.56 11.29L11.79 12.52L14.78 9.53C15.07 9.24 15.54 9.24 15.84 9.53C16.13 9.82 16.13 10.3 15.84 10.59Z" fill="#12B76A"></path></svg>
                          <p className="text-sm">Miễn phí</p>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-3 px-4">Trước Chuyến Đi &gt;7 Ngày<br /><span className="text-xs text-gray-500">(Sau 1h Đặt Chỗ)</span></td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col items-center justify-center">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.25 2C6.74 2 2.25 6.49 2.25 12C2.25 17.51 6.74 22 12.25 22C17.76 22 22.25 17.51 22.25 12C22.25 6.49 17.76 2 12.25 2ZM15.84 10.59L12.32 14.11C12.17 14.26 11.98 14.33 11.79 14.33C11.6 14.33 11.4 14.26 11.26 14.11L9.5 12.35C9.2 12.06 9.2 11.58 9.5 11.29C9.79 11 10.27 11 10.56 11.29L11.79 12.52L14.78 9.53C15.07 9.24 15.54 9.24 15.84 9.53C16.13 9.82 16.13 10.3 15.84 10.59Z" fill="#12B76A"></path></svg>
                          <p className="text-sm">10% giá trị (tối thiểu đi)</p>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Trong vòng 7 Ngày Trước Chuyến Đi<br /><span className="text-xs text-gray-500">(Sau 1h Đặt Chỗ)</span></td>
                      <td className="py-3 px-4">
                        <div className="flex flex-col items-center justify-center">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.25 2C6.74 2 2.25 6.49 2.25 12C2.25 17.51 6.74 22 12.25 22C17.76 22 22.25 17.51 22.25 12C22.25 6.49 17.76 2 12.25 2ZM14.67 13.39C14.97 13.69 14.96 14.16 14.67 14.45C14.52 14.59 14.33 14.67 14.14 14.67C13.95 14.67 13.75 14.59 13.61 14.44L12.25 13.07L10.9 14.44C10.75 14.59 10.56 14.67 10.36 14.67C10.17 14.67 9.98 14.59 9.84 14.45C9.54 14.16 9.53999 13.69 9.82999 13.39L11.2 12L9.82999 10.61C9.53999 10.31 9.54 9.84 9.84 9.55C10.13 9.26 10.61 9.26 10.9 9.56L12.25 10.93L13.61 9.56C13.9 9.26 14.37 9.26 14.67 9.55C14.96 9.84 14.97 10.31 14.67 10.61L13.3 12L14.67 13.39Z" fill="#F04438"></path></svg>
                          <p className="text-sm">40% giá trị (tối thiểu đi)</p>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-sm text-gray-600 space-y-2">
                <p>* Khách hàng thuê chuyến đi sẽ chịu phí hủy chuyến nếu như không thể đi vào thời điểm đã đặt, trừ các trường hợp bất khả kháng (tai nạn, thiên tai, dịch bệnh, hoãn/hủy chuyến bay, phương tiện vận chuyển công cộng bị trục trặc, v.v.)</p>
                <p>* Nếu khách hàng không nhận xe trong vòng 1h kể từ thời điểm bắt đầu thuê chuyến (không báo trước với chủ xe)</p>
                <p>* Chủ xe không giao xe đúng thời điểm bắt đầu chuyến đi (không báo trước với khách thuê) (100% giá trị chuyến đi)</p>
                <p>* Tùy trường hợp cụ thể, Morrent sẽ xem xét để hỗ trợ khách hàng hoàn lại một phần hoặc toàn bộ chi phí đã thanh toán nếu chuyến đi bị hủy vì những lý do bất khả kháng. Trong trường hợp này, khách hàng cần liên hệ với bộ phận hỗ trợ khách hàng của Morrent để được hỗ trợ.</p>
              </div>
            </div>

            {/* Vị trí xe */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Vị trí xe</h2>
              <div className="flex items-start gap-3 mb-4">
                <svg class="w-5 h-5 " fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <div>
                  <p className="font-semibold">{locationName}</p>
                  <p className="text-sm text-gray-600">{locationAddress}, {locationCity}</p>
                  <p className="text-xs text-gray-500 mt-1">Địa chỉ cụ thể sẽ được hiển thị sau khi đặt thuận thành công</p>
                </div>
              </div>
              <button className="w-full py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 -0.28 46.384 46.384">
                  <g id="Group_47" data-name="Group 47" transform="translate(-369.028 -1786.405)">
                    <path id="Path_126" data-name="Path 126" d="M384.789,1824.733l-13.761,5.5v-36.329l13.761-5.5Z" fill="#ffffff" stroke="#231f20" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" />
                    <path id="Path_127" data-name="Path 127" d="M413.412,1824.733l-13.761,5.5v-36.329l13.761-5.5Z" fill="#ffffff" stroke="#231f20" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" />
                    <path id="Path_128" data-name="Path 128" d="M385.34,1824.733l13.761,5.5v-36.329l-13.761-5.5Z" fill="#d1d3d4" stroke="#231f20" stroke-linecap="round" stroke-linejoin="round" stroke-width="4" />
                  </g>
                </svg>
                <span>Xem bản đồ</span>
              </button>
            </div>

            {/* Chủ xe */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Chủ xe</h2>
              {/* <div className="flex items-start gap-4 mb-4">
                <img
                  src={ownerAvatar}
                  alt="Owner"
                  className="w-16 h-16 rounded-full object-cover bg-gray-200"
                  onError={(e) => {
                    e.target.onerror = null; // Prevent infinite loop
                    e.target.src = 'https://azibejwshiqctxbaawkk.supabase.co/storage/v1/object/public/UserAvatars/019ab934-197d-71a8-8066-044c0c99f060/avatar_28112025.png';
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{ownerName}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <span className="text-yellow-400">⭐</span>
                      <span>{ownerRating.toFixed(1)}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <span className="text-green-500">🚗</span>
                      <span>100+ chuyến</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Tỉ lệ phản hồi</p>
                      <p className="font-semibold">100%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Phản hồi trong</p>
                      <p className="font-semibold">5 phút</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Tỉ lệ đồng ý</p>
                      <p className="font-semibold">71%</p>
                    </div>
                  </div>
                </div>
              </div> */}
              <div className="flex items-center gap-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                  <path d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z" stroke="#1C274C" stroke-width="1.5" />
                </svg>
                <span className="font-semibold">5.0</span>
                <span className="text-gray-600">• 100+ đánh giá</span>
              </div>

              {/* Reviews */}
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <img src="/images/reviewer1.jpg" alt="Reviewer" className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">Do Khoa</p>
                        <p className="text-sm text-gray-500">07/11/2025</p>
                      </div>
                      <div className="flex gap-1 my-1">
                        {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-yellow-400">⭐</span>)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="border rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <img src="/images/reviewer2.jpg" alt="Reviewer" className="w-10 h-10 rounded-full" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">KIM LE</p>
                        <p className="text-sm text-gray-500">04/11/2025</p>
                      </div>
                      <div className="flex gap-1 my-1">
                        {[1, 2, 3, 4, 5].map(i => <span key={i} className="text-yellow-400">⭐</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button className="w-full mt-4 py-2 border border-green-500 text-green-600 rounded-lg font-semibold">
                Xem thêm
              </button>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-4">
              {/* Rental Info */}
              {/* <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold mb-3">Bảo hiểm thuê xe</h3>
                <p className="text-sm text-gray-700 mb-2">Chuyến đi có mua bảo hiểm. Khách hàng chỉ bồi thường tối đa 2.000.000đ trong trường hợp có sự cố ngoài ý muốn.</p>
                <button className="text-green-600 text-sm font-semibold">Xem thêm ›</button>
              </div> */}

              {/* Booking Details */}
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Đơn giá thuê</p>
                  <div className="flex items-center justify-between">
                    {loadingRate ? (
                      <span className="text-2xl font-bold text-gray-400">...</span>
                    ) : (
                      <>
                        <span className="text-2xl font-bold">{dailyPrice.toLocaleString('vi-VN')}₫ /{t('date')}</span>
                        {/* <span className="text-gray-600">/ngày</span> */}
                      </>
                    )}
                  </div>
                </div>
                
                {/* Choose Date and Time */}
                <div 
                  className="grid grid-cols-2 gap-3 p-4 border rounded-lg cursor-pointer hover:border-green-500 transition-colors"
                  onClick={() => setShowDateTimePicker(true)}
                >
                  <div>
                    <p className="text-xs text-gray-600">Nhận xe</p>
                    <p className="font-semibold">{rentalDates.pickupDate}/2025</p>
                    <p className="text-sm">{rentalDates.pickupTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Trả xe</p>
                    <p className="font-semibold">{rentalDates.dropoffDate}/2025</p>
                    <p className="text-sm">{rentalDates.dropoffTime}</p>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <p className="text-sm font-semibold mb-3">Địa điểm giao nhận xe</p>
                  {/* Choose pick-up & drop-off location */}
                  {/* Option 1: Self pickup */}
                  <div className="mb-3 p-4 border rounded-lg bg-white hover:border-green-500 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="pickup-option"
                        defaultChecked
                        className="mt-1 w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-700">Tôi tự đến lấy xe</p>
                          <span className="text-sm font-semibold text-green-600">Miễn phí</span>
                        </div>
                        <p className="text-sm text-gray-600">{locationName}</p>
                      </div>
                    </div>
                  </div>

                  {/* Option 2: Delivery */}
                  <div
                    className="p-4 border rounded-lg bg-white hover:border-green-500 transition-colors cursor-pointer"
                    onClick={() => setShowDeliveryModal(true)}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="pickup-option"
                        className="mt-1 w-4 h-4 text-green-600 focus:ring-green-500"
                        onChange={() => setShowDeliveryModal(true)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-700">Tôi muốn được giao xe tận nơi</p>
                          <span className="text-sm font-semibold text-green-600">60.000₫</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-600">{locationAddress}, {locationCity}</p>
                          <span className="text-gray-400">›</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Đơn giá thuê</span>
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#504b4bff" version="1.1" id="Capa_1" width="12px" height="12px" viewBox="0 0 488.484 488.484"><g><g><path d="M244.236,0.002C109.562,0.002,0,109.565,0,244.238c0,134.679,109.563,244.244,244.236,244.244    c134.684,0,244.249-109.564,244.249-244.244C488.484,109.566,378.92,0.002,244.236,0.002z M244.236,413.619    c-93.4,0-169.38-75.979-169.38-169.379c0-93.396,75.979-169.375,169.38-169.375s169.391,75.979,169.391,169.375    C413.627,337.641,337.637,413.619,244.236,413.619z"></path><path d="M244.236,206.816c-14.757,0-26.619,11.962-26.619,26.73v118.709c0,14.769,11.862,26.735,26.619,26.735    c14.769,0,26.62-11.967,26.62-26.735V233.546C270.855,218.778,259.005,206.816,244.236,206.816z"></path><path d="M244.236,107.893c-19.949,0-36.102,16.158-36.102,36.091c0,19.934,16.152,36.092,36.102,36.092    c19.929,0,36.081-16.158,36.081-36.092C280.316,124.051,264.165,107.893,244.236,107.893z"></path></g></g></svg>
                    {loadingRate ? (
                      <span>...</span>
                    ) : (
                      <span>{dailyPrice.toLocaleString('vi-VN')}₫/ngày</span>
                    )}
                  </span>
                </div>
                {/* <div className="flex justify-between text-sm">
                  <span>Bảo hiểm thuê xe</span>
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#504b4bff" version="1.1" id="Capa_1" width="12px" height="12px" viewBox="0 0 488.484 488.484"><g><g><path d="M244.236,0.002C109.562,0.002,0,109.565,0,244.238c0,134.679,109.563,244.244,244.236,244.244    c134.684,0,244.249-109.564,244.249-244.244C488.484,109.566,378.92,0.002,244.236,0.002z M244.236,413.619    c-93.4,0-169.38-75.979-169.38-169.379c0-93.396,75.979-169.375,169.38-169.375s169.391,75.979,169.391,169.375    C413.627,337.641,337.637,413.619,244.236,413.619z"></path><path d="M244.236,206.816c-14.757,0-26.619,11.962-26.619,26.73v118.709c0,14.769,11.862,26.735,26.619,26.735    c14.769,0,26.62-11.967,26.62-26.735V233.546C270.855,218.778,259.005,206.816,244.236,206.816z"></path><path d="M244.236,107.893c-19.949,0-36.102,16.158-36.102,36.091c0,19.934,16.152,36.092,36.102,36.092    c19.929,0,36.081-16.158,36.081-36.092C280.316,124.051,264.165,107.893,244.236,107.893z"></path></g></g></svg>
                    <span>92.701₫/ngày</span>
                  </span>
                </div> */}
                {/* <div className="border-t pt-2">
                  <p className="text-sm font-semibold mb-1">Bảo hiểm thể dưỡng</p>
                  <div className="flex justify-between text-sm">
                    <span>Bảo hiểm người lái</span>
                    <span>1.125.901₫ x 1 ngày</span>
                  </div>
                </div> */}
                <div className="flex justify-between text-sm">
                  <span>Tổng cộng</span>
                  <span>1.125.901₫ x 1 ngày</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Phí giao nhận xe</span>
                  <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="#504b4bff" version="1.1" id="Capa_1" width="12px" height="12px" viewBox="0 0 488.484 488.484"><g><g><path d="M244.236,0.002C109.562,0.002,0,109.565,0,244.238c0,134.679,109.563,244.244,244.236,244.244    c134.684,0,244.249-109.564,244.249-244.244C488.484,109.566,378.92,0.002,244.236,0.002z M244.236,413.619    c-93.4,0-169.38-75.979-169.38-169.379c0-93.396,75.979-169.375,169.38-169.375s169.391,75.979,169.391,169.375    C413.627,337.641,337.637,413.619,244.236,413.619z"></path><path d="M244.236,206.816c-14.757,0-26.619,11.962-26.619,26.73v118.709c0,14.769,11.862,26.735,26.619,26.735    c14.769,0,26.62-11.967,26.62-26.735V233.546C270.855,218.778,259.005,206.816,244.236,206.816z"></path><path d="M244.236,107.893c-19.949,0-36.102,16.158-36.102,36.091c0,19.934,16.152,36.092,36.102,36.092    c19.929,0,36.081-16.158,36.081-36.092C280.316,124.051,264.165,107.893,244.236,107.893z"></path></g></g></svg>
                    <span>30.000₫ (1km)</span>
                  </span>
                </div>
                {/* <div className="flex items-start gap-2 p-3 bg-red-50 rounded">
                  <span className="text-red-500">🎫</span>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-semibold">Chương trình giảm giá</span>
                      <span className="text-red-500 font-semibold">-120.000</span>
                    </div>
                    <p className="text-xs text-gray-500">Giảm 120k cho đơn giá</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-green-500 text-xs">✓</span>
                      <span className="text-xs">Mã khuyến mãi</span>
                      <span className="text-gray-400">›</span>
                    </div>
                  </div>
                </div> */}
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Thành tiền</span>
                  {loadingRate ? (
                    <span className="text-gray-400">...</span>
                  ) : (
                    <span>{dailyPrice.toLocaleString('vi-VN')}₫</span>
                  )}
                </div>
                {/* Rent Button */}
                <button
                  onClick={() => navigate('/payment', {
                    state: {
                      carId: id,
                      carName: carName,
                      carImage: carImages[0],
                      carPrice: dailyPrice,
                      carRating: 5.0,
                      carReviewCount: 100
                    }
                  })}
                  className="w-full bg-green-500 text-white py-3 rounded-lg font-semibold mb-4 hover:bg-green-600"
                >
                  {t('rentNow')}
                </button>
                {/* Additional Fees */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Phụ phí có thể phát sinh</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="#504b4bff" version="1.1" id="Capa_1" width="12px" height="12px" viewBox="0 0 488.484 488.484" className="flex-shrink-0 mt-0.5">
                        <g>
                          <g>
                            <path d="M244.236,0.002C109.562,0.002,0,109.565,0,244.238c0,134.679,109.563,244.244,244.236,244.244    c134.684,0,244.249-109.564,244.249-244.244C488.484,109.566,378.92,0.002,244.236,0.002z M244.236,413.619    c-93.4,0-169.38-75.979-169.38-169.379c0-93.396,75.979-169.375,169.38-169.375s169.391,75.979,169.391,169.375    C413.627,337.641,337.637,413.619,244.236,413.619z" />
                            <path d="M244.236,206.816c-14.757,0-26.619,11.962-26.619,26.73v118.709c0,14.769,11.862,26.735,26.619,26.735    c14.769,0,26.62-11.967,26.62-26.735V233.546C270.855,218.778,259.005,206.816,244.236,206.816z" />
                            <path d="M244.236,107.893c-19.949,0-36.102,16.158-36.102,36.091c0,19.934,16.152,36.092,36.102,36.092    c19.929,0,36.081-16.158,36.081-36.092C280.316,124.051,264.165,107.893,244.236,107.893z" />
                          </g>
                        </g>
                      </svg>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span>Phí vượt giới hạn</span>
                          <span className="text-green-600">5.000₫/km</span>
                        </div>
                        <p className="text-xs text-gray-500">Phí phát sinh nếu lộ trình di chuyển vượt quá 300km (Giới hạn: 300km/ngày)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="#504b4bff" version="1.1" id="Capa_1" width="12px" height="12px" viewBox="0 0 488.484 488.484" className="flex-shrink-0 mt-0.5">
                        <g>
                          <g>
                            <path d="M244.236,0.002C109.562,0.002,0,109.565,0,244.238c0,134.679,109.563,244.244,244.236,244.244    c134.684,0,244.249-109.564,244.249-244.244C488.484,109.566,378.92,0.002,244.236,0.002z M244.236,413.619    c-93.4,0-169.38-75.979-169.38-169.379c0-93.396,75.979-169.375,169.38-169.375s169.391,75.979,169.391,169.375    C413.627,337.641,337.637,413.619,244.236,413.619z" />
                            <path d="M244.236,206.816c-14.757,0-26.619,11.962-26.619,26.73v118.709c0,14.769,11.862,26.735,26.619,26.735    c14.769,0,26.62-11.967,26.62-26.735V233.546C270.855,218.778,259.005,206.816,244.236,206.816z" />
                            <path d="M244.236,107.893c-19.949,0-36.102,16.158-36.102,36.091c0,19.934,16.152,36.092,36.102,36.092    c19.929,0,36.081-16.158,36.081-36.092C280.316,124.051,264.165,107.893,244.236,107.893z" />
                          </g>
                        </g>
                      </svg>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span>Phí quá giờ</span>
                          <span className="text-green-600">380.500₫/ngày</span>
                        </div>
                        <p className="text-xs text-gray-500">Phí phát sinh nếu hoàn trả xe trễ giờ. Trường hợp trễ quá 5 giờ, phí phát sinh thêm 1 ngày</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="#504b4bff" version="1.1" id="Capa_1" width="12px" height="12px" viewBox="0 0 488.484 488.484" className="flex-shrink-0 mt-0.5">
                        <g>
                          <g>
                            <path d="M244.236,0.002C109.562,0.002,0,109.565,0,244.238c0,134.679,109.563,244.244,244.236,244.244    c134.684,0,244.249-109.564,244.249-244.244C488.484,109.566,378.92,0.002,244.236,0.002z M244.236,413.619    c-93.4,0-169.38-75.979-169.38-169.379c0-93.396,75.979-169.375,169.38-169.375s169.391,75.979,169.391,169.375    C413.627,337.641,337.637,413.619,244.236,413.619z" />
                            <path d="M244.236,206.816c-14.757,0-26.619,11.962-26.619,26.73v118.709c0,14.769,11.862,26.735,26.619,26.735    c14.769,0,26.62-11.967,26.62-26.735V233.546C270.855,218.778,259.005,206.816,244.236,206.816z" />
                            <path d="M244.236,107.893c-19.949,0-36.102,16.158-36.102,36.091c0,19.934,16.152,36.092,36.102,36.092    c19.929,0,36.081-16.158,36.081-36.092C280.316,124.051,264.165,107.893,244.236,107.893z" />
                          </g>
                        </g>
                      </svg>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <span>Phí khử mùi</span>
                          <span className="text-green-600">300.000₫</span>
                        </div>
                        <p className="text-xs text-gray-500">Phí phát sinh khi xe có mùi khó chịu (mùi thuốc lá, thực phẩm nặng mùi...)</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* <button className="w-full py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2">
                  <span>📋</span>
                  <span>Báo cáo xe này</span>
                </button> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Location Modal */}
      <DeliveryLocationModal
        isOpen={showDeliveryModal}
        onClose={() => setShowDeliveryModal(false)}
        locationAddress={locationAddress}
        locationCity={locationCity}
        selectedAirport={selectedAirport}
        setSelectedAirport={setSelectedAirport}
      />

      {/* Date and Time Picker Modal */}
      <DateAndTimePicker
        isOpen={showDateTimePicker}
        onClose={() => setShowDateTimePicker(false)}
        onConfirm={(dates) => {
          setRentalDates(dates);
          setShowDateTimePicker(false);
        }}
      />
    </div>
  );
};

export default CarDetailRev;
