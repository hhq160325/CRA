import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { fetchCarById } from '../carsSlice';
import { getCarRentalRate, getCarFeedback, getBookingById, getUserById, getDistanceBetweenAddresses } from '../carApi';
import { DeliveryLocationModal, DateAndTimePicker, CarGallery } from './CarDetailRevModal';
import CarBookingCardSection from './CDRSubsComponent/CarBookingCardSection';
import CarDetailSection from './CDRSubsComponent/CarDetailSection';

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
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [showGallery, setShowGallery] = useState(false);
  // Initialize rental dates with current date as default
  const getCurrentDateDefaults = () => {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth() + 1;
    return {
      pickupDate: `${day}/${month}`,
      dropoffDate: `${day}/${month}`,
      pickupTime: '',
      dropoffTime: '',
      duration: 0
    };
  };

  const [rentalDates, setRentalDates] = useState(getCurrentDateDefaults());
  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [feedbackUsers, setFeedbackUsers] = useState({});
  const [deliveryDistance, setDeliveryDistance] = useState(null);
  const [deliveryFee, setDeliveryFee] = useState(60000);
  const [loadingDistance, setLoadingDistance] = useState(false);

  // Load rental dates and delivery location from localStorage on mount
  useEffect(() => {
    // Load rental dates
    const savedRentalDates = localStorage.getItem('rentalDates');
    if (savedRentalDates) {
      try {
        const parsed = JSON.parse(savedRentalDates);
        if (parsed.pickupDate && parsed.dropoffDate && parsed.pickupTime && parsed.dropoffTime) {
          setRentalDates({
            pickupDate: parsed.pickupDate,
            dropoffDate: parsed.dropoffDate,
            pickupTime: parsed.pickupTime,
            dropoffTime: parsed.dropoffTime,
            duration: parsed.duration || 0
          });
        }
      } catch (error) {
        console.error('Failed to load rental dates from localStorage:', error);
      }
    } else {
      // If no saved data, initialize with current date in localStorage
      const today = new Date();
      const defaultPickupDate = {
        day: today.getDate(),
        month: today.getMonth(),
        year: today.getFullYear()
      };
      const defaultData = {
        selectedPickupDate: defaultPickupDate,
        selectedDropoffDate: null,
        pickupTime: '06:00',
        dropoffTime: '23:00'
      };
      localStorage.setItem('rentalDates', JSON.stringify(defaultData));
    }

    // Load delivery location
    const savedDeliveryLocation = localStorage.getItem('deliveryLocation');
    if (savedDeliveryLocation) {
      setDeliveryLocation(savedDeliveryLocation);
    }
  }, []);

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

  // Fetch feedback when car ID changes
  useEffect(() => {
    const fetchFeedback = async () => {
      if (!id) return;

      setLoadingFeedback(true);
      try {
        const feedbackData = await getCarFeedback(id);
        const feedbackArray = Array.isArray(feedbackData) ? feedbackData : [];
        setFeedbacks(feedbackArray);

        // Fetch user data for each feedback
        const usersData = {};
        for (const feedback of feedbackArray) {
          if (feedback.bookingId && !usersData[feedback.bookingId]) {
            try {
              const bookingData = await getBookingById(feedback.bookingId);

              if (!bookingData) {
                usersData[feedback.bookingId] = {
                  username: 'Người dùng',
                  avatar: null
                };
                continue;
              }

              const userId = bookingData?.userId || bookingData?.customerId;
              if (userId) {
                const userData = await getUserById(userId);

                if (!userData) {
                  usersData[feedback.bookingId] = {
                    username: 'Người dùng',
                    avatar: null
                  };
                  continue;
                }

                usersData[feedback.bookingId] = {
                  username: userData.username || 'Người dùng',
                  avatar: userData.imageAvatar || null
                };
              } else {
                usersData[feedback.bookingId] = {
                  username: 'Người dùng',
                  avatar: null
                };
              }
            } catch (error) {
              console.error(`Failed to fetch user data for booking ${feedback.bookingId}:`, error);
              usersData[feedback.bookingId] = {
                username: 'Người dùng',
                avatar: null
              };
            }
          }
        }
        setFeedbackUsers(usersData);
      } catch (error) {
        console.error('Failed to fetch feedback:', error);
        setFeedbacks([]);
      } finally {
        setLoadingFeedback(false);
      }
    };

    fetchFeedback();
  }, [id]);

  // Calculate distance when delivery location changes
  useEffect(() => {
    const calculateDistance = async () => {
      if (!deliveryLocation || !currentCar?.preferredLot) {
        console.log('Distance calculation skipped:', {
          hasDeliveryLocation: !!deliveryLocation,
          hasPreferredLot: !!currentCar?.preferredLot
        });
        return;
      }

      setLoadingDistance(true);
      try {
        const sourceAddress = `${currentCar.preferredLot.address}, ${currentCar.preferredLot.city}`;
        console.log('Calculating distance from:', sourceAddress, 'to:', deliveryLocation);

        const distanceData = await getDistanceBetweenAddresses(sourceAddress, deliveryLocation);
        console.log('Distance API response:', distanceData);

        // API returns distance in meters, convert to kilometers
        const distanceInMeters = distanceData?.distanceInMeters;

        if (distanceInMeters) {
          const distanceInKm = distanceInMeters / 1000;
          setDeliveryDistance(distanceInKm);
          // Calculate delivery fee based on distance (20000 VND per km, minimum 60000 VND)
          const calculatedFee = Math.max(60000, Math.round(distanceInKm * 20000));
          setDeliveryFee(calculatedFee);
          console.log('Distance calculated:', distanceInKm, 'km, Fee:', calculatedFee, 'VND');
        } else {
          console.warn('No distance found in response:', distanceData);
          setDeliveryDistance(null);
          setDeliveryFee(60000);
        }
      } catch (error) {
        console.error('Failed to calculate distance:', error);
        // Keep default fee if calculation fails
        setDeliveryDistance(null);
        setDeliveryFee(60000);
      } finally {
        setLoadingDistance(false);
      }
    };

    calculateDistance();
  }, [deliveryLocation, currentCar]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

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
            console.log('Removing selfpickupparklot from localStorage');
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
