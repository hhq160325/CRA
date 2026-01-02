import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectIsAuthenticated } from '../../auth/authSlice';
import { getUserById, getUserIdFromToken } from '../../user/api';
import { createBooking } from '../api';
import DeliveryLocationModal from '../../cars/components/CarDetailRevModal/DeliveryLocationModal';
import DateAndTimePicker from '../../cars/components/CarDetailRevModal/DateAndTimePicker';
import { useTranslation } from 'react-i18next';
const PaymentPage = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const user = useSelector(selectUser);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    
    const carData = location.state || {
        carId: null,
        carName: 'Nissan GT - R',
        carImage: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=120&h=80&fit=crop',
        carPrice: 80.00,
        carRating: 4.8,
        carReviewCount: 440
    };

    const [billingInfo, setBillingInfo] = useState({
        name: '',
        phoneNumber: '',
        address: '',
        townCity: ''
    });

    // Modal states
    const [locationModalOpen, setLocationModalOpen] = useState(false);
    const [dateTimePickerOpen, setDateTimePickerOpen] = useState(false);

    // Selected values - Initialize from localStorage using lazy initialization
    const [rentalLocation, setRentalLocation] = useState(() => {
        // Check for delivery location first
        const deliveryLocation = localStorage.getItem('deliveryLocation');
        if (deliveryLocation) {
            return deliveryLocation;
        }
        
        // Check for self-pickup park lot
        const selfPickupParkLot = localStorage.getItem('selfpickupparklot');
        if (selfPickupParkLot) {
            try {
                const parkLot = JSON.parse(selfPickupParkLot);
                return parkLot.fullAddress || parkLot.address || 'Pick your location';
            } catch (e) {
                console.error('Failed to parse selfpickupparklot:', e);
            }
        }
        
        return 'Pick your location';
    });
    const [locationAddress, setLocationAddress] = useState('');
    const [locationCity, setLocationCity] = useState(() => {
        // Check for delivery location first
        const deliveryLocation = localStorage.getItem('deliveryLocation');
        if (deliveryLocation) {
            return deliveryLocation;
        }
        
        // Check for self-pickup park lot
        const selfPickupParkLot = localStorage.getItem('selfpickupparklot');
        if (selfPickupParkLot) {
            try {
                const parkLot = JSON.parse(selfPickupParkLot);
                return parkLot.city || 'Pick your location';
            } catch (e) {
                console.error('Failed to parse selfpickupparklot:', e);
            }
        }
        
        return 'Pick your location';
    });
    const [selectedAirport, setSelectedAirport] = useState('');
    const [pickupDateStr, setPickupDateStr] = useState(() => {
        const saved = localStorage.getItem('rentalDates');
        if (saved) {
            try {
                const dates = JSON.parse(saved);
                return dates.pickupDate || '01/12';
            } catch (e) {
                return '01/12';
            }
        }
        return '01/12';
    });
    const [dropoffDateStr, setDropoffDateStr] = useState(() => {
        const saved = localStorage.getItem('rentalDates');
        if (saved) {
            try {
                const dates = JSON.parse(saved);
                return dates.dropoffDate || '02/12';
            } catch (e) {
                return '02/12';
            }
        }
        return '02/12';
    });
    const [pickupTime, setPickupTime] = useState(() => {
        const saved = localStorage.getItem('rentalDates');
        if (saved) {
            try {
                const dates = JSON.parse(saved);
                return dates.pickupTime || '21:00';
            } catch (e) {
                return '21:00';
            }
        }
        return '21:00';
    });
    const [dropoffTime, setDropoffTime] = useState(() => {
        const saved = localStorage.getItem('rentalDates');
        if (saved) {
            try {
                const dates = JSON.parse(saved);
                return dates.dropoffTime || '20:00';
            } catch (e) {
                return '20:00';
            }
        }
        return '20:00';
    });
    const [rentalDuration, setRentalDuration] = useState(() => {
        const saved = localStorage.getItem('rentalDates');
        if (saved) {
            try {
                const dates = JSON.parse(saved);
                return dates.duration || 1;
            } catch (e) {
                return 1;
            }
        }
        return 1;
    });

    // Log car data on component mount
    useEffect(() => {
        console.log('PaymentPage - Car Data from location.state:', location.state);
        console.log('PaymentPage - Car ID:', carData.carId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Update localStorage when rental location changes
    useEffect(() => {
        if (rentalLocation && rentalLocation !== 'Pick your location') {
            localStorage.setItem('deliveryLocation', rentalLocation);
        }
    }, [rentalLocation]);

    // Update localStorage when rental dates change
    useEffect(() => {
        const rentalDatesData = {
            pickupDate: pickupDateStr,
            dropoffDate: dropoffDateStr,
            pickupTime: pickupTime,
            dropoffTime: dropoffTime,
            duration: rentalDuration
        };
        localStorage.setItem('rentalDates', JSON.stringify(rentalDatesData));
    }, [pickupDateStr, dropoffDateStr, pickupTime, dropoffTime, rentalDuration]);

    // Fetch full user data from API when component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            if (isAuthenticated && user) {
                try {
                    const fullUserData = await getUserById();
                    setBillingInfo({
                        name: fullUserData.fullname || fullUserData.username || user.username || '',
                        phoneNumber: fullUserData.phoneNumber || '',
                        address: fullUserData.address || '',
                        townCity: '' // townCity is not in user data, keep empty
                    });
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                    // Fallback to user data from Redux if API call fails
                    setBillingInfo({
                        name: user.fullname || user.username || '',
                        phoneNumber: user.phoneNumber || '',
                        address: user.address || '',
                        townCity: ''
                    });
                }
            }
        };

        fetchUserData();
    }, [isAuthenticated, user]);


    const [paymentMethod, setPaymentMethod] = useState('credit-card');

    const [confirmations, setConfirmations] = useState({
        marketing: false,
        terms: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleBillingChange = (field, value) => {
        setBillingInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleConfirmationChange = (field) => {
        setConfirmations(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const handleRentNow = async () => {
        // Validate required fields
        if (!confirmations.terms) {
            setError('Please agree to the terms and conditions');
            return;
        }

        if (!rentalLocation || rentalLocation === 'Pick your location' || !pickupTime || !dropoffTime) {
            setError('Please fill in all pickup and drop-off information');
            return;
        }

        if (!carData.carId) {
            console.error('PaymentPage - Car ID is missing:', carData);
            setError('Car information is missing');
            return;
        }

        // Only proceed with API call if QR payment is selected
        if (paymentMethod !== 'qr-payment') {
            setError('Please select QR Payment method');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const customerId = getUserIdFromToken();
            if (!customerId) {
                throw new Error('User not authenticated');
            }

            console.log('PaymentPage - Creating booking with Car ID:', carData.carId);

            // Parse date strings (format: "01/12" means December 1st, 2025)
            const [pickupDay, pickupMonth] = pickupDateStr.split('/').map(Number);
            const [dropoffDay, dropoffMonth] = dropoffDateStr.split('/').map(Number);
            
            // Create date objects for 2025
            const pickupDateTime = new Date(2025, pickupMonth - 1, pickupDay);
            const dropoffDateTime = new Date(2025, dropoffMonth - 1, dropoffDay);
            
            // Parse time strings (format: "21:00" in 24-hour format)
            const [pickupHour, pickupMinute] = pickupTime.split(':').map(Number);
            const [dropoffHour, dropoffMinute] = dropoffTime.split(':').map(Number);
            
            // Set hours and minutes
            pickupDateTime.setHours(pickupHour, pickupMinute, 0, 0);
            dropoffDateTime.setHours(dropoffHour, dropoffMinute, 0, 0);

            // Get car park lot from localStorage
            const carParkLotData = localStorage.getItem('carParkLot'); // For delivery option
            const selfPickupParkLotData = localStorage.getItem('selfpickupparklot'); // For self-pickup option
            let pickupPlace = rentalLocation;
            let dropoffPlace = rentalLocation;
            
            // If delivery option is selected (carParkLot exists)
            if (carParkLotData) {
                try {
                    // For delivery option: both pickup and dropoff are at customer's delivery location
                    pickupPlace = rentalLocation; // Customer's delivery location
                    dropoffPlace = rentalLocation; // Customer's delivery location
                } catch (e) {
                    console.error('Failed to parse carParkLot from localStorage:', e);
                }
            }
            // If self-pickup option is selected (selfpickupparklot exists)
            else if (selfPickupParkLotData) {
                try {
                    const selfPickupParkLot = JSON.parse(selfPickupParkLotData);
                    const parkLotAddress = selfPickupParkLot.fullAddress || selfPickupParkLot.address;
                    pickupPlace = parkLotAddress || rentalLocation;
                    dropoffPlace = parkLotAddress || rentalLocation; // Same location for self-pickup
                } catch (e) {
                    console.error('Failed to parse selfpickupparklot from localStorage:', e);
                }
            }

            const bookingData = {
                customerId: customerId,
                carId: carData.carId,
                pickupPlace: pickupPlace,
                pickupTime: pickupDateTime.toISOString(),
                dropoffPlace: dropoffPlace,
                dropoffTime: dropoffDateTime.toISOString(),
                bookingFee: 15, // 15% cut
                carRentPrice: typeof carData.carPrice === 'number' ? carData.carPrice : parseFloat(carData.carPrice) || 0,
                rentime: rentalDuration,
                rentType: "Daily Rental"
            };
            const response = await createBooking(bookingData);           
            // Extract payment URL and bookingId from response
            // Response structure: { booking: { id: "...", ... }, payment: "https://..." }
            let paymentUrl = '';
            let bookingId = null;
            let bookingIdInSchedule=null
            if (typeof response === 'string') {
                paymentUrl = response;
            } else if (response && typeof response === 'object') {
                // Extract bookingId from response.booking.id
                // bookingId = response.booking?.id || response.bookingId || response.id || null;
                bookingIdInSchedule = response.schedule?.booking?.id || null
                // Extract payment URL from response.payment
                paymentUrl = response.payment || response.paymentUrl || response.checkoutUrl || response.url || '';
            }
            
            // console.log('PaymentPage - Extracted bookingId:', bookingId);
            // console.log('PaymentPage - Extracted bookingIdInSchedule:', bookingIdInSchedule);
            // console.log('PaymentPage - Extracted paymentUrl:', paymentUrl);
            
            // Store booking data to localStorage after successful API call
            const bookingDataToStore = {
                ...bookingData,
                bookingId: bookingIdInSchedule, // Store the bookingId for later use
                carName: carData.carName,
                carImage: carData.carImage,
                carRating: carData.carRating,
                carReviewCount: carData.carReviewCount,
                billingInfo: {
                    name: billingInfo.name,
                    email: user?.email || '[email]',
                    phoneNumber: billingInfo.phoneNumber,
                    address: billingInfo.address,
                    townCity: billingInfo.townCity
                },
                createdAt: new Date().toISOString()
            };
            localStorage.setItem('pendingBooking', JSON.stringify(bookingDataToStore));
            // console.log('PaymentPage - Booking data stored to localStorage with bookingId:', bookingIdInSchedule);
            
            // Redirect to payment URL
            if (paymentUrl && paymentUrl.startsWith('http')) {
                window.location.href = paymentUrl;
            } else {
                setError('Invalid payment URL received');
            }
        } catch (err) {
            console.error('Booking error:', err);
            setError(err.response?.data?.message || err.message || 'Failed to create booking. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center">
                    {/* Left Column - Forms */}
                    <div className="w-full max-w-4xl space-y-6">
                        {/* Billing Info */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">{t('billinginfo')}</h2>
                                <span className="text-sm text-gray-500">{t('pleaseenteryourbillinginfo')}</span>
                                <span className="text-sm text-gray-500">{t('step')} 1 </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('Name')}</label>
                                    <input
                                        type="text"
                                        placeholder="Your name"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={billingInfo.name}
                                        onChange={(e) => handleBillingChange('name', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('phonenumber')}</label>
                                    <input
                                        type="tel"
                                        placeholder="Phone number"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={billingInfo.phoneNumber}
                                        onChange={(e) => handleBillingChange('phoneNumber', e.target.value)}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">{t('address')}</label>
                                    <input
                                        type="text"
                                        placeholder="Address"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={billingInfo.address}
                                        onChange={(e) => handleBillingChange('address', e.target.value)}
                                    />
                                </div>
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Town / City</label>
                                    <input
                                        type="text"
                                        placeholder="Town or city"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={billingInfo.townCity}
                                        onChange={(e) => handleBillingChange('townCity', e.target.value)}
                                    />
                                </div> */}
                            </div>
                        </div>

                        {/* Rental Info */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">{t('rentalinfo')}</h2>
                                <span className="text-sm text-gray-500">{t('pleaseselectyourrentaldate')}</span>
                                <span className="text-sm text-gray-500">{t('step')} 2</span>
                            </div>

                            {/* Pick-up and Drop-off Section */}
                            <div className='flex flex-col md:flex-row items-stretch gap-2 md:gap-0'>
                                {/* Location Section */}
                                <div className='flex-1 relative border-r-0 md:border-r border-gray-200 pr-0 md:pr-4'>
                                    <label className='flex items-center gap-1.5 text-xs font-medium text-gray-600 mb-1.5'>
                                        <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Location
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setLocationModalOpen(true)}
                                        className='w-full text-left flex items-center justify-between group hover:opacity-80 transition-opacity'
                                    >
                                        <span className='text-sm sm:text-base text-gray-900 font-medium'>
                                            {rentalLocation}
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
                                        Rental Period
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
                            </div>

                            {/* Delivery Location Modal */}
                            <DeliveryLocationModal
                                isOpen={locationModalOpen}
                                onClose={() => setLocationModalOpen(false)}
                                locationAddress={locationAddress}
                                locationCity={locationCity}
                                selectedAirport={selectedAirport}
                                setSelectedAirport={setSelectedAirport}
                                onLocationUpdate={(newLocation) => {
                                    setRentalLocation(newLocation);
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
                                dailyPrice={carData.carPrice}
                            />
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">{t('paymentmethod')}</h2>
                                <span className="text-sm text-gray-500">{t('pleaseenteryourpaymentmethod')}</span>
                                <span className="text-sm text-gray-500">{t('step')} 3</span>
                            </div>
                            {/* Cash */}
                            {/* <div className="mb-6">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="cash"
                                            name="payment-method"
                                            value="cash"
                                            checked={paymentMethod === 'cash'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="mr-3"
                                        />
                                        <label htmlFor="cash" className="font-medium text-gray-900">{t('cash')}</label>
                                    </div>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z" />
                                    </svg>
                                </div>

                                {paymentMethod === 'cash' && (
                                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                                        <div className="flex items-start space-x-3 mb-4">
                                            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                            <div>
                                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Pay with Cash</h4>
                                                <p className="text-sm text-gray-600 mb-3">
                                                    You can pay with cash when you pick up the vehicle at the rental location.
                                                </p>
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                                                    <p className="text-sm text-blue-800 font-medium mb-2">Important Information:</p>
                                                    <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                                                        <li>Please bring exact amount or sufficient cash</li>
                                                        <li>Valid ID is required at pickup</li>
                                                        <li>A security deposit may be required</li>
                                                        <li>Payment must be made before vehicle handover</li>
                                                    </ul>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    By selecting cash payment, you agree to pay the full rental amount at the pickup location.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div> */}

                            {/* QR Payment */}
                            <div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="qr-payment"
                                            name="payment-method"
                                            value="qr-payment"
                                            checked={paymentMethod === 'qr-payment'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="mr-3"
                                        />
                                        <label htmlFor="qr-payment" className="font-medium text-gray-900">QR Payment</label>
                                    </div>
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM19 13h2v2h-2zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM15 19h2v2h-2zM17 17h2v2h-2zM17 13h2v2h-2zM19 15h2v2h-2z" />
                                    </svg>
                                </div>

                                {paymentMethod === 'qr-payment' && (
                                    <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Quét mã QR để thanh toán</h4>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Dùng ứng dụng ngân hàng hoặc ví điện tử để quét mã
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Confirmation */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">{t('confirmation')}</h2>
                                {/* <span className="text-sm text-gray-500">{t('confirmmessage')}</span> */}
                                <span className="text-sm text-gray-500">{t('step')} 4</span>
                            </div>

                            <div className="space-y-4 mb-6">
                                {/* <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        id="marketing"
                                        checked={confirmations.marketing}
                                        onChange={() => handleConfirmationChange('marketing')}
                                        className="mt-1 mr-3"
                                    />
                                    <label htmlFor="marketing" className="text-sm text-gray-600">
                                        I agree with sending an Marketing and newsletter emails
                                    </label>
                                </div> */}
                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={confirmations.terms}
                                        onChange={() => handleConfirmationChange('terms')}
                                        className="mt-1 mr-3"
                                    />
                                    <label htmlFor="terms" className="text-sm text-gray-600">
                                        {t('termandpolicy')}
                                    </label>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600">{error}</p>
                                </div>
                            )}

                            <button 
                                onClick={handleRentNow}
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-4 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Processing...' : 'Thuê Ngay'}
                            </button>
{/* 
                            <div className="flex items-center text-sm text-gray-500">
                                <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                All your data are safe
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                                We are using the most advanced security to provide you the best experience ever.
                            </p> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;