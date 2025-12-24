import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../auth/authSlice';
import { useVerificationStatus } from '../../../auth/hooks/useVerificationStatus';
import VerificationModal from '../VerificationModal';
import ReportCarModal from '../ReportCarModal';

const CarBookingCardSection = ({
  id,
  carName,
  carImages,
  dailyPrice,
  loadingRate,
  rentalDates,
  setShowDateTimePicker,
  locationName,
  locationAddress,
  locationCity,
  deliveryLocation,
  setDeliveryLocation,
  setDeliveryDistance,
  deliveryDistance,
  deliveryFee,
  loadingDistance,
  setShowDeliveryModal,
  currentCar
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const { isVerified, hasVerificationStatus, refreshVerificationStatus } = useVerificationStatus();
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Fetch verification status if not available
  useEffect(() => {
    if (user && !hasVerificationStatus) {
      refreshVerificationStatus();
    }
  }, [user, hasVerificationStatus, refreshVerificationStatus]);

  // Save total price with delivery to localStorage whenever values change
  useEffect(() => {
    if (!loadingRate && dailyPrice && rentalDates.duration) {
      const totalPriceDelivery = Math.round(dailyPrice * rentalDates.duration * 0.15 + (deliveryLocation ? deliveryFee : 0));
      localStorage.setItem('totalPriceDelivery', totalPriceDelivery.toString());
    }
  }, [dailyPrice, rentalDates.duration, deliveryLocation, deliveryFee, loadingRate]);
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-lg p-6 sticky top-4">
        {/* Booking Details */}
        <div className="mt-4 space-y-3">
          <div>
            <p className="text-sm text-gray-600 mb-1">{t('dailyRate')}</p>
            <div className="flex items-center justify-between">
              {loadingRate ? (
                <span className="text-2xl font-bold text-gray-400">...</span>
              ) : (
                <>
                  <span className="text-2xl font-bold">{dailyPrice.toLocaleString('vi-VN')}₫ /{t('date')}</span>
                </>
              )}
            </div>
          </div>

          {/* Choose Date and Time */}
          <div
            className="grid grid-cols-2 gap-3 p-4 border rounded-lg cursor-pointer hover:border-primary-500 transition-colors"
            onClick={() => setShowDateTimePicker(true)}
          >
            <div>
              <p className="text-xs text-gray-600">{t('pickupDate')}</p>
              <p className="font-semibold">{rentalDates.pickupDate}/2025</p>
              <p className="text-sm">{rentalDates.pickupTime}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">{t('dropoffDate')}</p>
              <p className="font-semibold">{rentalDates.dropoffDate}/2025</p>
              <p className="text-sm">{rentalDates.dropoffTime}</p>
            </div>
          </div>

          <div className="border-t pt-3">
            <p className="text-sm font-semibold mb-3">{t('pickupLocation')}</p>
            {/* Choose pick-up & drop-off location */}
            {/* Option 1: Self pickup */}
            <div className="mb-3 p-4 border rounded-lg bg-white hover:border-primary-500 transition-colors cursor-pointer"
              onClick={() => {
                setDeliveryLocation(null);
                setDeliveryDistance(null);
                localStorage.removeItem('deliveryLocation');
                localStorage.removeItem('carParkLot');
                // Save car park lot for self-pickup
                if (currentCar?.preferredLot) {
                  const carParkLot = {
                    name: currentCar.preferredLot.name,
                    address: currentCar.preferredLot.address,
                    city: currentCar.preferredLot.city,
                    fullAddress: `${currentCar.preferredLot.address}, ${currentCar.preferredLot.city}`
                  };
                  localStorage.setItem('selfpickupparklot', JSON.stringify(carParkLot));
                }
              }}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="pickup-option"
                  checked={!deliveryLocation}
                  onChange={() => {
                    setDeliveryLocation(null);
                    setDeliveryDistance(null);
                    localStorage.removeItem('deliveryLocation');
                    localStorage.removeItem('carParkLot');
                    // Save car park lot for self-pickup
                    if (currentCar?.preferredLot) {
                      const carParkLot = {
                        name: currentCar.preferredLot.name,
                        address: currentCar.preferredLot.address,
                        city: currentCar.preferredLot.city,
                        fullAddress: `${currentCar.preferredLot.address}, ${currentCar.preferredLot.city}`
                      };
                      localStorage.setItem('selfpickupparklot', JSON.stringify(carParkLot));
                    }
                  }}
                  className="mt-1 w-4 h-4 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-700">{t('selfPickup')}</p>
                    <span className="text-sm font-semibold text-primary-600">{t('free')}</span>
                  </div>
                  <p className="text-sm text-gray-600 text-wrap">{locationName},{locationAddress}</p>
                </div>
              </div>
            </div>

            {/* Option 2: Delivery */}
            <div
              className="p-4 border rounded-lg bg-white hover:border-primary-500 transition-colors cursor-pointer"
              onClick={() => setShowDeliveryModal(true)}
            >
              <div className="flex items-start gap-3">
                <input
                  type="radio"
                  name="pickup-option"
                  checked={!!deliveryLocation}
                  className="mt-1 w-4 h-4 text-primary-600 focus:ring-primary-500"
                  onChange={() => {
                    setShowDeliveryModal(true)
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-700">{t('driverDelivery')}</p>
                    <span className="text-sm font-semibold text-primary-600">
                      {loadingDistance ? (
                        <span className="text-gray-400">...</span>
                      ) : (
                        `${deliveryFee.toLocaleString('vi-VN')}₫`
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 text-wrap">
                        {deliveryLocation || `${locationAddress}`}
                      </p>
                      {deliveryDistance && (
                        <p className="text-xs text-gray-500 mt-1">
                          {t('distance')}: ~{deliveryDistance} km
                        </p>
                      )}
                    </div>
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
            <span>{t('dailyRate')} x {rentalDates.duration} {t('date')}</span>
            <span className="flex items-center gap-1">
              {loadingRate ? (
                <span>...</span>
              ) : (
                <span>{(dailyPrice * rentalDates.duration).toLocaleString('vi-VN')}₫</span>
              )}
            </span>
          </div>

          {deliveryLocation && (
            <div className="flex justify-between text-sm">
              <span>{t('deliveryFee')}</span>
              <span className="flex items-center gap-1">
                {loadingDistance ? (
                  <span>...</span>
                ) : (
                  <span>{deliveryFee.toLocaleString('vi-VN')}₫</span>
                )}
              </span>
            </div>
          )}

          <div className="flex justify-between text-sm text-blue-600">
            <span>{t('bookingFeesPayNow')}</span>
            <span className="flex items-center gap-1">
              {loadingRate ? (
                <span>...</span>
              ) : (
                <span>{Math.round(dailyPrice * rentalDates.duration * 0.15).toLocaleString('vi-VN')}₫</span>
              )}
            </span>
          </div>

          <div className="flex justify-between text-sm text-gray-600">
            <span>{t('remainingAmountPayAfter')}</span>
            <span className="flex items-center gap-1">
              {loadingRate ? (
                <span>...</span>
              ) : (
                <span>{Math.round(dailyPrice * rentalDates.duration * 0.85).toLocaleString('vi-VN')}₫</span>
              )}
            </span>
          </div>

          <div className="flex justify-between font-bold text-lg pt-2 border-t">
            <span>{t('totalPricePayNow')}</span>
            {loadingRate ? (
              <span className="text-gray-400">...</span>
            ) : (
              <span>{Math.round(dailyPrice * rentalDates.duration * 0.15 + (deliveryLocation ? deliveryFee : 0)).toLocaleString('vi-VN')}₫</span>
            )}
          </div>
          {/* Rent Button */}
          <button
            onClick={() => {
              // Check if user is verified
              if (!isVerified) {
                setShowVerificationModal(true);
                return;
              }

              // If verified, proceed to payment
              navigate('/payment', {
                state: {
                  carId: id,
                  carName: carName,
                  carImage: carImages[0],
                  carPrice: dailyPrice,
                  carRating: 5.0,
                  carReviewCount: 100
                }
              });
            }}
            className="w-full bg-primary-500 text-white py-3 rounded-lg font-semibold mb-4 hover:bg-primary-600"
          >
            {t('rentNow')}
          </button>
          {/* Additional Fees */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{t('additionalFees')}</h3>
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
                    <span>{t('mileageFee')}</span>
                    <span className="text-primary-600">5.000₫/km</span>
                  </div>
                  <p className="text-xs text-gray-500">{t('mileageFeeDesc')}</p>
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
                    <span>{t('overtimeFee')}</span>
                    <span className="text-primary-600">380.500₫/{t('date')}</span>
                  </div>
                  <p className="text-xs text-gray-500">{t('overtimeFeeDesc')}</p>
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
                    <span>{t('deodorizingFee')}</span>
                    <span className="text-primary-600">300.000₫</span>
                  </div>
                  <p className="text-xs text-gray-500">{t('deodorizingFeeDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Report Button */}
        <button 
          onClick={() => setShowReportModal(true)}
          className="w-full mt-5 py-2 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
        >
          <span><svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" fill="white" />
            <g filter="url(#filter0_d_15_295)">
              <path d="M4.5 21V16M4.5 16V6.5C5.5 5.5 7 5 8.5 5C11.5 5 13.5 7.5 17.5 5.5V15.5C13.5 17.5 11.5 14.5 8.5 14.5C7.5 14.5 5.5 15 4.5 16Z" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
              <filter id="filter0_d_15_295" x="3" y="4.5" width="16" height="19" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="1" />
                <feGaussianBlur stdDeviation="0.5" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_15_295" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_15_295" result="shape" />
              </filter>
            </defs>
          </svg></span>
          <span>{t('report')}</span>
        </button>
      </div>

      {/* Verification Modal */}
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
      />

      {/* Report Car Modal */}
      <ReportCarModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        carId={id}
        carName={carName}
      />
    </div>
  );
};

export default CarBookingCardSection;
