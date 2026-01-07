import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFavorite, selectIsFavorite } from '../../../favorites/favoritesSlice';
import { fetchCarById } from '../../carsSlice';
import { getCarWalletByCarId } from '../../carApi';
import SendInquiry from './SendInquiry';
import MapModal from './MapModal';
import { tokenUtils } from '../../../auth/utils';

const CarDetailSection = ({
  carImages,
  selectedImage,
  setSelectedImage,
  setShowGallery,
  carName,
  currentCar,
  locationName,
  licensePlate,
  yearOfManufacture,
  transmission,
  seats,
  fuelType,
  fuelConsumption,
  carDescription,
  locationAddress,
  locationCity,
  feedbacks,
  loadingFeedback,
  feedbackUsers,
  coordinates
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const carId = currentCar?.id;
  const isFavorite = useSelector(selectIsFavorite(carId));
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [carWallet, setCarWallet] = useState(null);
  const [loadingWallet, setLoadingWallet] = useState(false);

  // Get car data from Redux store
  const carFromStore = useSelector((state) => state.cars.currentCar);
  
  // Get current user ID from token
  const currentUserId = tokenUtils.getUserId();
  // console.log("Nguoi gui",currentUserId);
  // Get owner ID from Redux store or fallback to prop
  const carOwnerId = carFromStore?.owner.id;
  console.log("carFromStore",carFromStore);
  const carOwnerEmail = carFromStore?.owner.email
  const carOwnerPhoneNumber = carFromStore?.owner.phoneNumber
  // console.log("Nguoi nhan",carOwnerId);

  // Fetch car wallet when component mounts or carId changes
  useEffect(() => {
    const fetchCarWallet = async () => {
      if (!carId) return;
      
      setLoadingWallet(true);
      try {
        const walletData = await getCarWalletByCarId(carId);
        setCarWallet(walletData);
      } catch (error) {
        console.error('Failed to fetch car wallet:', error);
        setCarWallet(null);
      } finally {
        setLoadingWallet(false);
      }
    };

    fetchCarWallet();
  }, [carId]);

  const handleToggleFavorite = () => {
    if (!currentCar) return;

    const carData = {
      id: currentCar.id,
      name: `${currentCar.manufacturer} ${currentCar.model}`,
      type: currentCar.fuelType,
      fuelType: currentCar.fuelType,
      fuel: currentCar.fuelType,
      transmission: currentCar.transmission,
      capacity: `${currentCar.seats} People`,
      seats: currentCar.seats,
      image: carImages[0]
    };

    dispatch(toggleFavorite({
      carId: currentCar.id,
      carData
    }));
  };

  return (
    <>
      <div className="lg:col-span-2 space-y-6">
        {/* Image Gallery */}
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="relative">
            <img
              src={carImages[selectedImage]}
              alt="Car main view"
              className="w-full h-96 object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-2 p-2">
            {carImages.slice(0, 3).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Car view ${idx + 1}`}
                className={`w-full h-24 object-cover rounded cursor-pointer ${selectedImage === idx ? 'ring-2 ring-primary-500' : ''}`}
                onClick={() => setSelectedImage(idx)}
              />
            ))}
            {carImages.length > 3 && (
              <div
                className="relative w-full h-24 rounded cursor-pointer overflow-hidden"
                onClick={() => setShowGallery(true)}
              >
                <img
                  src={carImages[3]}
                  alt="More photos"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center hover:bg-opacity-70 transition-all">
                  <span className="text-white font-semibold text-lg">
                    +{carImages.length - 3}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Car Title */}
        <div className="bg-white rounded-lg p-6">
          <div className="flex items-start justify-between mb-2">
            <h1 className="text-2xl font-bold flex-1">{carName}</h1>
            <button
              onClick={handleToggleFavorite}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-red-500 hover:text-red-600"
              title={isFavorite ? t('removeFromFavorites') : t('addToFavorites')}
            >
              <svg
                className="w-6 h-6"
                fill={isFavorite ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" width="16px" height="16px" viewBox="0 0 24 24" fill="none"><path d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z" stroke="#1C274C" strokeWidth="1.5"></path></svg>
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex flex-row items-center p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" viewBox="0 0 24 24" fill="none">
                <path d="M6 4C6 5.10457 5.10457 6 4 6C2.89543 6 2 5.10457 2 4C2 2.89543 2.89543 2 4 2C5.10457 2 6 2.89543 6 4Z" stroke="#1C274C" strokeWidth="1.5" />
                <path d="M6 20C6 21.1046 5.10457 22 4 22C2.89543 22 2 21.1046 2 20C2 18.8954 2.89543 18 4 18C5.10457 18 6 18.8954 6 20Z" stroke="#1C274C" strokeWidth="1.5" />
                <path d="M14 20C14 21.1046 13.1046 22 12 22C10.8954 22 10 21.1046 10 20C10 18.8954 10.8954 18 12 18C13.1046 18 14 18.8954 14 20Z" stroke="#1C274C" strokeWidth="1.5" />
                <path d="M14 4C14 5.10457 13.1046 6 12 6C10.8954 6 10 5.10457 10 4C10 2.89543 10.8954 2 12 2C13.1046 2 14 2.89543 14 4Z" stroke="#1C274C" strokeWidth="1.5" />
                <path d="M22 4C22 5.10457 21.1046 6 20 6C18.8954 6 18 5.10457 18 4C18 2.89543 18.8954 2 20 2C21.1046 2 22 2.89543 22 4Z" stroke="#1C274C" strokeWidth="1.5" />
                <path d="M12 6V13M12 18V16" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M4 18V11M4 6V8" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M20 6V8C20 9.88562 20 10.8284 19.4142 11.4142C18.8284 12 17.8856 12 16 12H10M4 12H6" stroke="#1C274C" strokeWidth="1.5" strokeLinecap="round" />
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
            {/* <div className="flex flex-row items-center p-3 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" width="48px" height="48px" viewBox="0 0 1024 1024"><path d="M522.267 910.508c16.962 0 30.72-13.758 30.72-30.72v-736.43c0-16.962-13.758-30.72-30.72-30.72H143.356c-16.962 0-30.72 13.758-30.72 30.72v736.43c0 16.962 13.758 30.72 30.72 30.72h378.911zm0 40.96H143.356c-39.583 0-71.68-32.097-71.68-71.68v-736.43c0-39.583 32.097-71.68 71.68-71.68h378.911c39.583 0 71.68 32.097 71.68 71.68v736.43c0 39.583-32.097 71.68-71.68 71.68zm388.62-678.049v500.265c0 49.412-40.054 89.467-89.467 89.467-49.443 0-89.498-40.054-89.498-89.467 0-11.311-9.169-20.48-20.48-20.48s-20.48 9.169-20.48 20.48c0 72.034 58.393 130.427 130.427 130.427 72.065 0 130.458-58.393 130.458-130.427V273.419c0-11.311-9.169-20.48-20.48-20.48s-20.48 9.169-20.48 20.48z" /><path d="M731.92 779.436V368.648c0-11.311-9.169-20.48-20.48-20.48s-20.48 9.169-20.48 20.48v410.788c0 11.311 9.169 20.48 20.48 20.48s20.48-9.169 20.48-20.48z" /><path d="M731.943 365.513v-34.499c0-49.414-40.053-89.467-89.467-89.467-49.415 0-89.477 40.054-89.477 89.467v34.499c0 11.311 9.169 20.48 20.48 20.48s20.48-9.169 20.48-20.48v-34.499c0-26.789 21.722-48.507 48.517-48.507 26.792 0 48.507 21.715 48.507 48.507v34.499c0 11.311 9.169 20.48 20.48 20.48s20.48-9.169 20.48-20.48zM942.5 254.981L767.785 80.266c-7.998-7.998-20.965-7.998-28.963 0s-7.998 20.965 0 28.963l174.715 174.715c7.998 7.998 20.965 7.998 28.963 0s7.998-20.965 0-28.963zM438.84 281.52c5.657 0 10.24-4.583 10.24-10.24V225.2c0-5.657-4.583-10.24-10.24-10.24H225.541a10.238 10.238 0 00-10.24 10.24v46.08c0 5.657 4.583 10.24 10.24 10.24H438.84zm0 40.96H225.541c-28.278 0-51.2-22.922-51.2-51.2V225.2c0-28.278 22.922-51.2 51.2-51.2H438.84c28.278 0 51.2 22.922 51.2 51.2v46.08c0 28.278-22.922 51.2-51.2 51.2z" /><path d="M928.972 358.832h-48.978c-11.309 0-20.48-9.171-20.48-20.48V191.091c0-11.311-9.169-20.48-20.48-20.48s-20.48 9.169-20.48 20.48v147.261c0 33.931 27.509 61.44 61.44 61.44h48.978c11.311 0 20.48-9.169 20.48-20.48s-9.169-20.48-20.48-20.48z" /></svg>
              <div className="flex flex-col items-center p-3  rounded-lg" >
                <span className="text-sm text-gray-600">{t('consumption')}</span>
                <span className="font-semibold">{fuelConsumption}L/100km</span>
              </div>
            </div> */}
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">{t('description')}</h2>
          <div className="space-y-2 text-gray-700">
            {currentCar?.description && (
              <p className="whitespace-pre-line text-wrap">{currentCar.description}</p>
            )}
            {!currentCar?.description && (
              <>
                <p className="text-wrap">- Hầy đủ options</p>
                <p className="text-wrap">- Xe mới 99%</p>
                <p className="text-wrap">- Cam 360, quạt hơi cao cấp</p>
                <p className="text-wrap">- Vietnam số 1 màn hình lớn, cam phạt nguội, am lam đi các cung đường lạ</p>
                <p className="text-wrap">- Dàn phanh cao nhất, Lumbar chỉnh hàng</p>
                <p className="text-wrap">- Màn hình Android Teyes 10.0, có đủ sẵn</p>
              </>
            )}
          </div>
          <button className="text-primary-600 font-semibold mt-3">{t('seeMore')}</button>
        </div>

        {/* Car rental documents*/}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">{t('rentalDocuments')}</h2>
          <div className="border-l-4 border-orange-500 bg-orange-50 pl-4 py-2 mb-4">
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">{t('chooseOneOfTwo')}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg">
              <svg className="w-6 h-6 flex-shrink-0 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M2 10h20" />
                <circle cx="7" cy="15" r="1" fill="currentColor" />
                <path d="M11 15h6" strokeLinecap="round" />
              </svg>
              <p className="font-medium text-gray-900">{t('licenseAndPassportHold')}</p>
            </div>
            <div className="flex items-center gap-3 p-4 border border-gray-300 rounded-lg">
              <svg className="w-6 h-6 flex-shrink-0 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M7 9h.01M7 12h.01M7 15h.01" strokeLinecap="round" />
                <path d="M11 9h6M11 12h6M11 15h4" strokeLinecap="round" />
              </svg>
              <p className="font-medium text-gray-900">{t('licenseAndIdVneID')}</p>
            </div>
          </div>
        </div>

        {/* Collateral */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            {t('collateral')}
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path></svg>
          </h2>
          <div className="p-4 border-l-4 border-orange-500 bg-orange-50">
            <p className="text-gray-700">{t('noCollateralRequired')}</p>
          </div>
        </div>

        {/* Term */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">{t('terms')}</h2>
          <div className="space-y-2 text-gray-700 text-sm">
            <p className="font-semibold">{t('termsOtherRules')}</p>
            <p>{t('termsUseProper')}</p>
            <p>{t('termsNoIllegal')}</p>
            <p>{t('termsNoPawn')}</p>
            <p>{t('termsNoSmoking')}</p>
            <p>{t('termsNoExplosives')}</p>
            <p>{t('termsNoStrongSmell')}</p>
          </div>
          <button className="text-primary-600 font-semibold mt-3">{t('seeMore')}</button>
        </div>

        {/* Cancellation policy */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">{t('cancellationPolicy')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">{t('cancellationTime')}</th>
                  <th className="text-center py-3 px-4">{t('cancellationFee')}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4">{t('within1Hour')}</td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.25 2C6.74 2 2.25 6.49 2.25 12C2.25 17.51 6.74 22 12.25 22C17.76 22 22.25 17.51 22.25 12C22.25 6.49 17.76 2 12.25 2ZM15.84 10.59L12.32 14.11C12.17 14.26 11.98 14.33 11.79 14.33C11.6 14.33 11.4 14.26 11.26 14.11L9.5 12.35C9.2 12.06 9.2 11.58 9.5 11.29C9.79 11 10.27 11 10.56 11.29L11.79 12.52L14.78 9.53C15.07 9.24 15.54 9.24 15.84 9.53C16.13 9.82 16.13 10.3 15.84 10.59Z" fill="#12B76A"></path></svg>
                      <p className="text-sm">{t('free')}</p>
                    </div>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4">{t('moreThan7Days')}<br /><span className="text-xs text-gray-500">{t('after1HourBooking')}</span></td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.25 2C6.74 2 2.25 6.49 2.25 12C2.25 17.51 6.74 22 12.25 22C17.76 22 22.25 17.51 22.25 12C22.25 6.49 17.76 2 12.25 2ZM15.84 10.59L12.32 14.11C12.17 14.26 11.98 14.33 11.79 14.33C11.6 14.33 11.4 14.26 11.26 14.11L9.5 12.35C9.2 12.06 9.2 11.58 9.5 11.29C9.79 11 10.27 11 10.56 11.29L11.79 12.52L14.78 9.53C15.07 9.24 15.54 9.24 15.84 9.53C16.13 9.82 16.13 10.3 15.84 10.59Z" fill="#12B76A"></path></svg>
                      <p className="text-sm">{t('minValueTrip')}</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4">{t('within7Days')}<br /><span className="text-xs text-gray-500">{t('after1HourBooking')}</span></td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col items-center justify-center">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.25 2C6.74 2 2.25 6.49 2.25 12C2.25 17.51 6.74 22 12.25 22C17.76 22 22.25 17.51 22.25 12C22.25 6.49 17.76 2 12.25 2ZM14.67 13.39C14.97 13.69 14.96 14.16 14.67 14.45C14.52 14.59 14.33 14.67 14.14 14.67C13.95 14.67 13.75 14.59 13.61 14.44L12.25 13.07L10.9 14.44C10.75 14.59 10.56 14.67 10.36 14.67C10.17 14.67 9.98 14.59 9.84 14.45C9.54 14.16 9.53999 13.69 9.82999 13.39L11.2 12L9.82999 10.61C9.53999 10.31 9.54 9.84 9.84 9.55C10.13 9.26 10.61 9.26 10.9 9.56L12.25 10.93L13.61 9.56C13.9 9.26 14.37 9.26 14.67 9.55C14.96 9.84 14.97 10.31 14.67 10.61L13.3 12L14.67 13.39Z" fill="#F04438"></path></svg>
                      <p className="text-sm">{t('minValue40')}</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-sm text-gray-600 space-y-2">
            <p>{t('cancellationNote1')}</p>
            <p>{t('cancellationNote2')}</p>
            <p>{t('cancellationNote3')}</p>
            <p>{t('cancellationNote4')}</p>
          </div>
        </div>
        {/* Car Owner */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">{t('carOwner') || 'Chủ xe'}</h2>
          <div className="flex items-start gap-3 mb-4">
            <svg className="w-5 h-5 " fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <div className="flex-1">
              <p className="font-semibold">{t('managedByMorrent') || 'Xe được vận hành bởi MORRENT'}</p>
              {/* <button
                onClick={() => setIsInquiryOpen(true)}
                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                {t('contact') || 'Contact'}
              </button> */}
              <p className="font-regular"> Contact through email: {carOwnerEmail}</p><p className="font-regular"> Contact through phone number: {carOwnerPhoneNumber}</p>
            </div>
          </div>
        </div>

        {/* Car Wallet Balance */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">{t('Car Wallet') || 'Ví xe'}</h2>
          
          {loadingWallet ? (
            <div className="flex items-center gap-2 text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
              <span>{t('loadingWallet') || 'Đang tải...'}</span>
            </div>
          ) : carWallet ? (
            <p className="text-xl font-bold text-green-600">
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(carWallet.balance || 0)}
            </p>
          ) : (
            <p className="text-gray-500">{t('walletNotFound') || 'Không tìm thấy ví'}</p>
          )}
        </div>
        {/* Car location */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">{t('vehicleLocation')}</h2>
          <div className="flex items-start gap-3 mb-4">
            <svg className="w-5 h-5 " fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <div>
              <p className="font-semibold">{locationName}</p>
              <p className="text-sm text-gray-600">{locationAddress}</p>
            </div>
          </div>
          
          <button 
            className="w-full py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
            onClick={() => setShowMapModal(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 -0.28 46.384 46.384">
              <g id="Group_47" data-name="Group 47" transform="translate(-369.028 -1786.405)">
                <path id="Path_126" data-name="Path 126" d="M384.789,1824.733l-13.761,5.5v-36.329l13.761-5.5Z" fill="#ffffff" stroke="#231f20" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                <path id="Path_127" data-name="Path 127" d="M413.412,1824.733l-13.761,5.5v-36.329l13.761-5.5Z" fill="#ffffff" stroke="#231f20" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                <path id="Path_128" data-name="Path 128" d="M385.34,1824.733l13.761,5.5v-36.329l-13.761-5.5Z" fill="#d1d3d4" stroke="#231f20" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
              </g>
            </svg>
            <span>{t('viewMap')}</span>
          </button>
        </div>

        {/* Feedback */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">{t('ratings')}</h2>

          {loadingFeedback ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">{t('loadingReviews')}</p>
            </div>
          ) : feedbacks.length === 0 ? (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" width="48px" height="48px" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3 text-gray-300">
                <path d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z" stroke="currentColor" strokeWidth="1.5" />
              </svg>
              <p className="text-gray-600">{t('noReviews')}</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
                  <path d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z" stroke="#1C274C" strokeWidth="1.5" />
                </svg>
                <span className="font-semibold">
                  {feedbacks.length > 0
                    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
                    : '5.0'}
                </span>
                <span className="text-gray-600">• {feedbacks.length} {t('ratings')}</span>
              </div>

              {/* Reviews */}
              <div className="space-y-4">
                {feedbacks.slice(0, showAllReviews ? feedbacks.length : 2).map((feedback, index) => {
                  const user = feedbackUsers[feedback.bookingId] || { username: 'Người dùng', avatar: null };
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div
                          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
                          style={{ display: user.avatar ? 'none' : 'flex' }}
                        >
                          <span className="text-gray-600 font-semibold">
                            {user.username?.[0]?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold">{user.username}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(feedback.createDate).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          <div className="flex gap-1 my-1">
                            {[1, 2, 3, 4, 5].map(i => (
                              <span key={i} className={i <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'}>
                                ⭐
                              </span>
                            ))}
                          </div>
                          {feedback.title && (
                            <p className="font-medium text-sm mt-2">{feedback.title}</p>
                          )}
                          {feedback.content && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-3 text-wrap">{feedback.content}</p>
                          )}
                          {feedback.imageUrls && feedback.imageUrls.length > 0 && (
                            <div className="flex gap-2 mt-2 overflow-x-auto">
                              {feedback.imageUrls.slice(0, 4).map((imgUrl, imgIndex) => (
                                <img
                                  key={imgIndex}
                                  src={imgUrl}
                                  alt={`Feedback ${imgIndex + 1}`}
                                  className="w-20 h-20 object-cover rounded"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {feedbacks.length > 2 && !showAllReviews && (
                <button 
                  onClick={() => setShowAllReviews(true)}
                  className="w-full mt-4 py-2 border border-primary-500 text-primary-600 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  {t('viewMoreReviews')} ({feedbacks.length - 2} {t('moreReviews')})
                </button>
              )}
              {showAllReviews && feedbacks.length > 2 && (
                <button 
                  onClick={() => setShowAllReviews(false)}
                  className="w-full mt-4 py-2 border border-gray-300 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  {t('showLess') || 'Show less'}
                </button>
              )}
            </>
          )}
        </div>
      </div>
      {/* Send Inquiry Modal */}
      <SendInquiry
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        carOwnerId={carOwnerId}
        currentUserId={currentUserId}
      />
      
      {/* Map Modal */}
      <MapModal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        locationName={locationName}
        locationAddress={locationAddress}
        locationCity={locationCity}
        coordinates={coordinates}
      />
    </>
  );
};

export default CarDetailSection;
