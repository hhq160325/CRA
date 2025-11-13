import React, { useState } from 'react';

const PaymentPage = () => {
    const [billingInfo, setBillingInfo] = useState({
        name: '',
        phoneNumber: '',
        address: '',
        townCity: ''
    });

    const [rentalInfo, setRentalInfo] = useState({
        pickUpLocation: '',
        pickUpDate: '',
        pickUpTime: '',
        dropOffLocation: '',
        dropOffDate: '',
        dropOffTime: ''
    });

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

    const handleBillingChange = (field, value) => {
        setBillingInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleRentalChange = (field, value) => {
        setRentalInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleCardChange = (field, value) => {
        setCardInfo(prev => ({ ...prev, [field]: value }));
    };

    const handleConfirmationChange = (field) => {
        setConfirmations(prev => ({ ...prev, [field]: !prev[field] }));
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
                                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                                    <h3 className="text-lg font-semibold text-gray-900">Pick - Up</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Locations</label>
                                        <select
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={rentalInfo.pickUpLocation}
                                            onChange={(e) => handleRentalChange('pickUpLocation', e.target.value)}
                                        >
                                            <option value="">Select your city</option>
                                            <option value="new-york">New York</option>
                                            <option value="los-angeles">Los Angeles</option>
                                            <option value="chicago">Chicago</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={rentalInfo.pickUpDate}
                                            onChange={(e) => handleRentalChange('pickUpDate', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                                        <input
                                            type="time"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={rentalInfo.pickUpTime}
                                            onChange={(e) => handleRentalChange('pickUpTime', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Drop-Off */}
                            <div>
                                <div className="flex items-center mb-4">
                                    <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
                                    <h3 className="text-lg font-semibold text-gray-900">Drop - Off</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Locations</label>
                                        <select
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={rentalInfo.dropOffLocation}
                                            onChange={(e) => handleRentalChange('dropOffLocation', e.target.value)}
                                        >
                                            <option value="">Select your city</option>
                                            <option value="new-york">New York</option>
                                            <option value="los-angeles">Los Angeles</option>
                                            <option value="chicago">Chicago</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={rentalInfo.dropOffDate}
                                            onChange={(e) => handleRentalChange('dropOffDate', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                                        <input
                                            type="time"
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            value={rentalInfo.dropOffTime}
                                            onChange={(e) => handleRentalChange('dropOffTime', e.target.value)}
                                        />
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

                            {/* Credit Card */}
                            <div className="mb-6">
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
                            </div>

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

                            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors mb-4">
                                Rent Now
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
                                    src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=120&h=80&fit=crop"
                                    alt="Nissan GT-R"
                                    className="w-20 h-16 object-cover rounded-lg mr-4"
                                />
                                <div>
                                    <h4 className="font-bold text-gray-900">Nissan GT - R</h4>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <div className="flex items-center mr-2">
                                            <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            4.8
                                        </div>
                                        <span>(440+ Reviewer)</span>
                                    </div>
                                </div>
                            </div>

                            <hr className="my-6" />

                            {/* Price Breakdown */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">$80.00</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax</span>
                                    <span className="font-medium">$0</span>
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
                                <span className="text-2xl font-bold text-gray-900">$80.00</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;