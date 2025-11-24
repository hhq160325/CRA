import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser, selectIsAuthenticated } from '../../auth/authSlice';
import { getUserById, getUserIdFromToken } from '../../user/api';
import { createBooking } from '../api';
import Calendar from '../../../shared/components/Calendar';
import TimePicker from '../../../shared/components/TimePicker';

const PaymentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
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

    // Log car data on component mount
    useEffect(() => {
        console.log('PaymentPage - Car Data from location.state:', location.state);
        console.log('PaymentPage - Car ID:', carData.carId);
    }, []);

    const [billingInfo, setBillingInfo] = useState({
        name: '',
        phoneNumber: '',
        address: '',
        townCity: ''
    });

    const [isLoadingUserData, setIsLoadingUserData] = useState(false);

    // Fetch full user data from API when component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            if (isAuthenticated && user) {
                setIsLoadingUserData(true);
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
                } finally {
                    setIsLoadingUserData(false);
                }
            }
        };

        fetchUserData();
    }, [isAuthenticated, user]);

    // Dropdown states for rental info
    const [pickupLocationOpen, setPickupLocationOpen] = useState(false);
    const [pickupDateOpen, setPickupDateOpen] = useState(false);
    const [pickupTimeOpen, setPickupTimeOpen] = useState(false);
    const [dropoffLocationOpen, setDropoffLocationOpen] = useState(false);
    const [dropoffDateOpen, setDropoffDateOpen] = useState(false);
    const [dropoffTimeOpen, setDropoffTimeOpen] = useState(false);

    // Selected values for rental info
    const [pickupLocation, setPickupLocation] = useState('');
    const [pickupDate, setPickupDate] = useState(null);
    const [pickupTime, setPickupTime] = useState('');
    const [dropoffLocation, setDropoffLocation] = useState('');
    const [dropoffDate, setDropoffDate] = useState(null);
    const [dropoffTime, setDropoffTime] = useState('');

    // Location options
    const locations = [
        { value: 'hcm', label: 'Ho Chi Minh City' },
        { value: 'hanoi', label: 'Hanoi' },
        { value: 'danang', label: 'Da Nang' }
    ];

    const [paymentMethod, setPaymentMethod] = useState('credit-card');
    const [cardInfo, setCardInfo] = useState({
        cardNumber: '',
        expirationDate: '',
        cardHolder: '',
        cvc: ''
    });

    const [confirmations, setConfirmations] = useState({
        marketing: false,
        terms: false
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleBillingChange = (field, value) => {
        setBillingInfo(prev => ({ ...prev, [field]: value }));
    };



    const handleCardChange = (field, value) => {
        setCardInfo(prev => ({ ...prev, [field]: value }));
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

        if (!pickupLocation || !pickupDate || !pickupTime) {
            setError('Please fill in all pickup information');
            return;
        }

        if (!dropoffLocation || !dropoffDate || !dropoffTime) {
            setError('Please fill in all drop-off information');
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

            // Combine date and time for pickup
            const pickupDateTime = new Date(pickupDate);
            const pickupTimeParts = pickupTime.split(' '); // Split "08:00 AM" into ["08:00", "AM"]
            const [pickupHour, pickupMinute] = pickupTimeParts[0].split(':').map(Number);
            const pickupPeriod = pickupTimeParts[1];
            
            // Convert to 24-hour format
            let pickup24Hour = pickupHour;
            if (pickupPeriod === 'PM' && pickupHour !== 12) {
                pickup24Hour += 12;
            } else if (pickupPeriod === 'AM' && pickupHour === 12) {
                pickup24Hour = 0;
            }
            pickupDateTime.setHours(pickup24Hour, pickupMinute, 0, 0);

            // Combine date and time for dropoff
            const dropoffDateTime = new Date(dropoffDate);
            const dropoffTimeParts = dropoffTime.split(' '); // Split "08:00 AM" into ["08:00", "AM"]
            const [dropoffHour, dropoffMinute] = dropoffTimeParts[0].split(':').map(Number);
            const dropoffPeriod = dropoffTimeParts[1];
            
            // Convert to 24-hour format
            let dropoff24Hour = dropoffHour;
            if (dropoffPeriod === 'PM' && dropoffHour !== 12) {
                dropoff24Hour += 12;
            } else if (dropoffPeriod === 'AM' && dropoffHour === 12) {
                dropoff24Hour = 0;
            }
            dropoffDateTime.setHours(dropoff24Hour, dropoffMinute, 0, 0);

            // Calculate rental time in days
            const timeDiff = dropoffDateTime - pickupDateTime;
            const rentalDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

            const bookingData = {
                customerId: customerId,
                carId: carData.carId,
                pickupPlace: locations.find(l => l.value === pickupLocation)?.label || pickupLocation,
                pickupTime: pickupDateTime.toISOString(),
                dropoffPlace: locations.find(l => l.value === dropoffLocation)?.label || dropoffLocation,
                dropoffTime: dropoffDateTime.toISOString(),
                bookingFee: 15, //For testing purpose - should use as 15% cut in the future
                carRentPrice: typeof carData.carPrice === 'number' ? carData.carPrice : parseFloat(carData.carPrice) || 0,
                rentime: rentalDays,
                rentType: "Daily Rental"
            };

            console.log('PaymentPage - Booking Data being sent to API:', bookingData);

            const response = await createBooking(bookingData);
            
            console.log('PaymentPage - API Response:', response);
            console.log('PaymentPage - Expected return URLs should be configured on backend:');
            console.log('  - Success URL:', `${window.location.origin}/payment-success`);
            console.log('  - Cancel URL:', `${window.location.origin}/payment-cancel`);
            
            // Extract payment URL and bookingId from response
            // Response structure: { booking: { id: "...", ... }, payment: "https://..." }
            let paymentUrl = '';
            let bookingId = null;
            
            if (typeof response === 'string') {
                paymentUrl = response;
            } else if (response && typeof response === 'object') {
                // Extract bookingId from response.booking.id
                bookingId = response.booking?.id || response.bookingId || response.id || null;
                // Extract payment URL from response.payment
                paymentUrl = response.payment || response.paymentUrl || response.checkoutUrl || response.url || '';
            }
            
            console.log('PaymentPage - Extracted bookingId:', bookingId);
            console.log('PaymentPage - Extracted paymentUrl:', paymentUrl);
            
            // Store booking data to localStorage after successful API call
            const bookingDataToStore = {
                ...bookingData,
                bookingId: bookingId, // Store the bookingId for later use
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
            console.log('PaymentPage - Booking data stored to localStorage with bookingId:', bookingId);
            
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
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Billing Info */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Billing Info</h2>
                                <span className="text-sm text-gray-500">Please enter your billing info</span>
                                <span className="text-sm text-gray-500">Step 1 of 4</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        placeholder="Your name"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={billingInfo.name}
                                        onChange={(e) => handleBillingChange('name', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <input
                                        type="tel"
                                        placeholder="Phone number"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={billingInfo.phoneNumber}
                                        onChange={(e) => handleBillingChange('phoneNumber', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                    <input
                                        type="text"
                                        placeholder="Address"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={billingInfo.address}
                                        onChange={(e) => handleBillingChange('address', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Town / City</label>
                                    <input
                                        type="text"
                                        placeholder="Town or city"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={billingInfo.townCity}
                                        onChange={(e) => handleBillingChange('townCity', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Rental Info */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Rental Info</h2>
                                <span className="text-sm text-gray-500">Please select your rental date</span>
                                <span className="text-sm text-gray-500">Step 2 of 4</span>
                            </div>

                            {/* Pick-Up */}
                            <div className="mb-8">
                                <div className="flex items-center mb-4">
                                    <div className="w-4 h-4 bg-blue-600 rounded-full mr-3"></div>
                                    <h3 className="text-lg font-semibold text-gray-900">Pick - Up</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Pickup Location */}
                                    <div className="w-full relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Locations</label>
                                        <button
                                            type="button"
                                            onClick={() => setPickupLocationOpen(!pickupLocationOpen)}
                                            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-left flex items-center justify-between"
                                        >
                                            <span className={pickupLocation ? 'text-gray-900' : 'text-gray-400'}>
                                                {pickupLocation ? locations.find(l => l.value === pickupLocation)?.label : 'Select your city'}
                                            </span>
                                            <svg
                                                className={`w-4 h-4 text-gray-500 transition-transform ${pickupLocationOpen ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {pickupLocationOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-10"
                                                    onClick={() => setPickupLocationOpen(false)}
                                                />
                                                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                                                    {locations.map((location) => (
                                                        <button
                                                            key={location.value}
                                                            type="button"
                                                            onClick={() => {
                                                                setPickupLocation(location.value);
                                                                setPickupLocationOpen(false);
                                                            }}
                                                            className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors ${pickupLocation === location.value ? 'bg-gray-50 text-gray-900 font-medium' : 'text-gray-700'}`}
                                                        >
                                                            {location.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Pickup Date */}
                                    <div className="w-full relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                        <button
                                            type="button"
                                            onClick={() => setPickupDateOpen(!pickupDateOpen)}
                                            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-left flex items-center justify-between"
                                        >
                                            <span className={pickupDate ? 'text-gray-900' : 'text-gray-400'}>
                                                {pickupDate ? pickupDate.toLocaleDateString() : 'Select your date'}
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
                                    <div className="w-full relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                                        <button
                                            type="button"
                                            onClick={() => setPickupTimeOpen(!pickupTimeOpen)}
                                            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-left flex items-center justify-between"
                                        >
                                            <span className={pickupTime ? 'text-gray-900' : 'text-gray-400'}>
                                                {pickupTime || 'Select your time'}
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

                            {/* Drop-Off */}
                            <div>
                                <div className="flex items-center mb-4">
                                    <div className="w-4 h-4 bg-blue-600 rounded-full mr-3"></div>
                                    <h3 className="text-lg font-semibold text-gray-900">Drop - Off</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Dropoff Location */}
                                    <div className="w-full relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Locations</label>
                                        <button
                                            type="button"
                                            onClick={() => setDropoffLocationOpen(!dropoffLocationOpen)}
                                            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-left flex items-center justify-between"
                                        >
                                            <span className={dropoffLocation ? 'text-gray-900' : 'text-gray-400'}>
                                                {dropoffLocation ? locations.find(l => l.value === dropoffLocation)?.label : 'Select your city'}
                                            </span>
                                            <svg
                                                className={`w-4 h-4 text-gray-500 transition-transform ${dropoffLocationOpen ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {dropoffLocationOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-10"
                                                    onClick={() => setDropoffLocationOpen(false)}
                                                />
                                                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                                                    {locations.map((location) => (
                                                        <button
                                                            key={location.value}
                                                            type="button"
                                                            onClick={() => {
                                                                setDropoffLocation(location.value);
                                                                setDropoffLocationOpen(false);
                                                            }}
                                                            className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors ${dropoffLocation === location.value ? 'bg-gray-50 text-gray-900 font-medium' : 'text-gray-700'}`}
                                                        >
                                                            {location.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Dropoff Date */}
                                    <div className="w-full relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                        <button
                                            type="button"
                                            onClick={() => setDropoffDateOpen(!dropoffDateOpen)}
                                            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-left flex items-center justify-between"
                                        >
                                            <span className={dropoffDate ? 'text-gray-900' : 'text-gray-400'}>
                                                {dropoffDate ? dropoffDate.toLocaleDateString() : 'Select your date'}
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
                                    <div className="w-full relative">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                                        <button
                                            type="button"
                                            onClick={() => setDropoffTimeOpen(!dropoffTimeOpen)}
                                            className="w-full border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-left flex items-center justify-between"
                                        >
                                            <span className={dropoffTime ? 'text-gray-900' : 'text-gray-400'}>
                                                {dropoffTime || 'Select your time'}
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
                                                        minTime={
                                                            pickupDate && dropoffDate && 
                                                            pickupDate.toDateString() === dropoffDate.toDateString() 
                                                                ? pickupTime 
                                                                : null
                                                        }
                                                    />
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                                <span className="text-sm text-gray-500">Please enter your payment method</span>
                                <span className="text-sm text-gray-500">Step 3 of 4</span>
                            </div>
                            {/* Cash */}
                            <div className="mb-6">
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
                                        <label htmlFor="cash" className="font-medium text-gray-900">Cash</label>
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
                            </div>

                            {/* Credit Card */}
                            {/* <div className="mb-6">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg mb-4">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="credit-card"
                                            name="payment-method"
                                            value="credit-card"
                                            checked={paymentMethod === 'credit-card'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="mr-3"
                                        />
                                        <label htmlFor="credit-card" className="font-medium text-gray-900">Credit Card</label>
                                    </div>
                                    <svg className="h-6 w-10" viewBox="0 0 40 24" fill="none">
                                        <rect width="40" height="24" rx="4" fill="#374151" stroke="#6B7280" strokeWidth="1"/>
                                        <rect x="4" y="6" width="32" height="3" fill="#9CA3AF"/>
                                        <rect x="4" y="12" width="12" height="2" fill="#D1D5DB"/>
                                        <rect x="4" y="16" width="8" height="2" fill="#D1D5DB"/>
                                        <rect x="28" y="12" width="8" height="6" fill="#E5E7EB" rx="1"/>
                                        <text x="32" y="16" fontSize="3" fill="#6B7280" textAnchor="middle">****</text>
                                    </svg>
                                </div>

                                {paymentMethod === 'credit-card' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                                            <input
                                                type="text"
                                                placeholder="Card number"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={cardInfo.cardNumber}
                                                onChange={(e) => handleCardChange('cardNumber', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Expiration Date</label>
                                            <input
                                                type="text"
                                                placeholder="DD / MM / YY"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={cardInfo.expirationDate}
                                                onChange={(e) => handleCardChange('expirationDate', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Card Holder</label>
                                            <input
                                                type="text"
                                                placeholder="Card holder"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={cardInfo.cardHolder}
                                                onChange={(e) => handleCardChange('cardHolder', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                                            <input
                                                type="text"
                                                placeholder="CVC"
                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                value={cardInfo.cvc}
                                                onChange={(e) => handleCardChange('cvc', e.target.value)}
                                            />
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
                                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Scan QR Code to Pay</h4>
                                        <div className="flex justify-center mb-4">
                                            <div className="bg-white p-4 border-2 border-gray-300 rounded-lg">
                                                <img 
                                                    src="https://genqrcode.com/embedded?style=0&inner_eye_style=0&outer_eye_style=0&logo=null&color=%23000000FF&background_color=%23FFFFFFFF&inner_eye_color=%23000000&outer_eye_color=%23000000&imageformat=svg&language=en&frame_style=0&frame_text=SCAN%20ME&frame_text_icon_color=%23000000&frame_text_icon=null&frame_color=%23000000&frame_background_color=%23FFFFFF&frame_text_color=%23FFFFFF&invert_colors=false&gradient_style=0&gradient_color_start=%23FF0000&gradient_color_end=%237F007F&gradient_start_offset=5&gradient_end_offset=95&stl_type=1&logo_remove_background=null&stl_size=100&stl_qr_height=1.5&stl_base_height=2&stl_include_stands=false&stl_qr_magnet_type=3&stl_qr_magnet_count=0&type=0&text=https%3A%2F%2Fpokemondb.net%2Fpokedex%2Foshawott%23dex-evolution&width=500&height=500&bordersize=2" 
                                                    alt="QR code for payment" 
                                                    className="w-48 h-48 mx-auto"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Use your mobile banking app or digital wallet to scan this QR code
                                        </p>
                                        <div className="border-t pt-4">
                                            <p className="text-sm text-gray-500 mb-2">Can't scan the QR code?</p>
                                            <a
                                                href="https://payment.example.com/pay/rental-80usd"
                                                className="text-blue-600 hover:text-blue-700 underline text-sm font-medium"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Click here to pay online
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Confirmation */}
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold text-gray-900">Confirmation</h2>
                                <span className="text-sm text-gray-500">We are getting to the end. Just few clicks and your rental is ready!</span>
                                <span className="text-sm text-gray-500">Step 4 of 4</span>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-start">
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
                                </div>
                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={confirmations.terms}
                                        onChange={() => handleConfirmationChange('terms')}
                                        className="mt-1 mr-3"
                                    />
                                    <label htmlFor="terms" className="text-sm text-gray-600">
                                        I agree with our terms and conditions and privacy policy.
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
                                {isSubmitting ? 'Processing...' : 'Rent Now'}
                            </button>

                            <div className="flex items-center text-sm text-gray-500">
                                <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                </svg>
                                All your data are safe
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                                We are using the most advanced security to provide you the best experience ever.
                            </p>
                        </div>
                    </div>

                    {/* Right Column - Rental Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg p-6 shadow-sm sticky top-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Rental Summary</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Prices may change depending on the length of the rental and the price of your rental car.
                            </p>

                            {/* Car Info */}
                            <div className="flex items-center mb-6">
                                <img
                                    src={carData.carImage}
                                    alt={carData.carName}
                                    className="w-20 h-16 object-cover rounded-lg mr-4"
                                />
                                <div>
                                    <h4 className="font-bold text-gray-900">{carData.carName}</h4>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <div className="flex items-center mr-2">
                                            <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            {carData.carRating}
                                        </div>
                                        <span>({carData.carReviewCount}+ Reviewer)</span>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-6" />

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">{(typeof carData.carPrice === 'number' ? carData.carPrice : parseFloat(carData.carPrice) || 0).toLocaleString('vi-VN')} đ</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-medium">0 đ</span>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                <div className="flex justify-between items-center">
                                    <input
                                        type="text"
                                        placeholder="Apply promo code"
                                        className="bg-transparent border-none outline-none text-sm flex-1"
                                    />
                                    <button className="text-sm font-medium text-gray-900">Apply now</button>
                                </div>
                            </div>

                            <hr className="my-6" />

                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="text-lg font-bold text-gray-900">Total Rental Price</span>
                                    <p className="text-xs text-gray-500">Overall price and includes rental discount</p>
                                </div>
                                <span className="text-2xl font-bold text-gray-900">{(typeof carData.carPrice === 'number' ? carData.carPrice : parseFloat(carData.carPrice) || 0).toLocaleString('vi-VN')} đ</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;