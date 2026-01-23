import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchCarById } from '../carsSlice';
import { DeliveryLocationModal, DateAndTimePicker, CarGallery } from './CarDetailRevModal';
import CarBookingCardSection from './CDRSubsComponent/CarBookingCardSection';
import CarDetailSection from './CDRSubsComponent/CarDetailSection';
import { useCarDetail, useRentalDates, useDeliveryLocation } from '../hooks';
import { getAllManufacturers, getModelsByManufacturerId } from '../carApi';

const CarDetailRev = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Local component state
  const [selectedImage, setSelectedImage] = useState(0);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedAirport, setSelectedAirport] = useState(null);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [carType, setCarType] = useState(null);
  const [loadingCarType, setLoadingCarType] = useState(false);

  // Custom hooks
  const {
    currentCar,
    loading,
    error,
    rentalRate,
    loadingRate,
    feedbacks,
    loadingFeedback,
    feedbackUsers
  } = useCarDetail(id);

  const { rentalDates, setRentalDates } = useRentalDates();

  const {
    deliveryLocation,
    setDeliveryLocation,
    deliveryDistance,
    setDeliveryDistance,
    deliveryFee,
    setDeliveryFee,
    loadingDistance
  } = useDeliveryLocation(currentCar);

  // Fetch car type based on manufacturer and model
  useEffect(() => {
    const fetchCarType = async () => {
      if (!currentCar?.manufacturer || !currentCar?.model) {
        return;
      }

      setLoadingCarType(true);
      try {
        // Step 1: Get all manufacturers
        const manufacturersData = await getAllManufacturers();
        console.log("manufacturersData",manufacturersData);
        
        // Check if manufacturers data is valid
        if (!manufacturersData || !Array.isArray(manufacturersData)) {
          console.warn('Invalid manufacturers data received');
          setCarType(null);
          return;
        }
        
        // Step 2: Find the manufacturer ID by matching the manufacturer field
        const manufacturer = manufacturersData.find(
          m => m && m.manufacturer && m.manufacturer.toLowerCase() === currentCar.manufacturer.toLowerCase()
        );

        if (!manufacturer) {
          console.warn(`Manufacturer "${currentCar.manufacturer}" not found`);
          setCarType(null);
          return;
        }

        // Step 3: Get models by manufacturer ID
        const modelsData = await getModelsByManufacturerId(manufacturer.id);
        console.log("modelsData",modelsData);
        console.log("Looking for model:", currentCar.model);
        
        // Check if models data is valid
        if (!modelsData || !Array.isArray(modelsData)) {
          console.warn('Invalid models data received');
          setCarType(null);
          return;
        }
        
        // Step 4: Find the model and extract carType
        const model = modelsData.find(
          m => m && m.model && m.model.toLowerCase() === currentCar.model.toLowerCase()
        );
        
        console.log("Found model:", model);

        if (model && model.carType) {
          setCarType(model.carType);
          console.log('Car Type:', model.carType);
        } else {
          console.warn(`Model "${currentCar.model}" not found or has no carType`);
          setCarType(null);
        }
      } catch (error) {
        console.error('Error fetching car type:', error);
        setCarType(null);
      } finally {
        setLoadingCarType(false);
      }
    };

    fetchCarType();
  }, [currentCar?.manufacturer, currentCar?.model]);



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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
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
            className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600"
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
            className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600"
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
  const currentCarLongtitude = currentCar?.preferredLot?.longtitude
  const currentCarLatitude = currentCar?.preferredLot?.latitude

  // console.log("currentCarLongtitude", currentCarLongtitude);


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden text-wrap">

          {/* Left Column - Car Details*/}
          <CarDetailSection
            carImages={carImages}
            selectedImage={selectedImage}
            setSelectedImage={setSelectedImage}
            setShowGallery={setShowGallery}
            carName={carName}
            currentCar={currentCar}
            locationName={locationName}
            licensePlate={licensePlate}
            yearOfManufacture={yearOfManufacture}
            transmission={transmission}
            seats={seats}
            fuelType={fuelType}
            fuelConsumption={fuelConsumption}
            carDescription={carDescription}
            locationAddress={locationAddress}
            locationCity={locationCity}
            feedbacks={feedbacks}
            loadingFeedback={loadingFeedback}
            feedbackUsers={feedbackUsers}
            coordinates={currentCarLongtitude && currentCarLatitude ? [currentCarLongtitude, currentCarLatitude] : null}
            carType={carType}
            loadingCarType={loadingCarType}
          />

          {/* Right Column - Booking Card*/}
          <CarBookingCardSection
            id={id}
            carName={carName}
            carImages={carImages}
            dailyPrice={dailyPrice}
            loadingRate={loadingRate}
            rentalDates={rentalDates}
            setShowDateTimePicker={setShowDateTimePicker}
            locationName={locationName}
            locationAddress={locationAddress}
            locationCity={locationCity}
            deliveryLocation={deliveryLocation}
            setDeliveryLocation={setDeliveryLocation}
            setDeliveryDistance={setDeliveryDistance}
            deliveryDistance={deliveryDistance}
            deliveryFee={deliveryFee}
            loadingDistance={loadingDistance}
            setShowDeliveryModal={setShowDeliveryModal}
            currentCar={currentCar}
          />
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
        onLocationUpdate={(newLocation) => {
          setDeliveryLocation(newLocation);
          // Save car park lot information to localStorage for PaymentPage
          if (currentCar?.preferredLot) {
            const carParkLot = {
              name: currentCar.preferredLot.name,
              address: currentCar.preferredLot.address,
              city: currentCar.preferredLot.city,
              fullAddress: `${currentCar.preferredLot.address}, ${currentCar.preferredLot.city}`
            };
            // console.log('Removing selfpickupparklot from localStorage');
            localStorage.removeItem('selfpickupparklot');
            localStorage.setItem('carParkLot', JSON.stringify(carParkLot));
          }
        }}
      />

      {/* Date and Time Picker Modal */}
      <DateAndTimePicker
        isOpen={showDateTimePicker}
        onClose={() => setShowDateTimePicker(false)}
        onConfirm={(dates) => {
          setRentalDates(dates);
          setShowDateTimePicker(false);
        }}
        dailyPrice={dailyPrice}
      />

      {/* Car Gallery Modal */}
      <CarGallery
        isOpen={showGallery}
        onClose={() => setShowGallery(false)}
        images={carImages}
        initialIndex={selectedImage}
      />
    </div>
  );
};

export default CarDetailRev;
