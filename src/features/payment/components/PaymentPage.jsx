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
                                    <div className="flex space-x-2">
                                        <img src="/api/placeholder/32/20" alt="Visa" className="h-5" />
                                        <img src="/api/placeholder/32/20" alt="Mastercard" className="h-5" />
                                    </div>
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

                            {/* PayPal */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="paypal"
                                            name="payment-method"
                                            value="paypal"
                                            checked={paymentMethod === 'paypal'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="mr-3"
                                        />
                                        <label htmlFor="paypal" className="font-medium text-gray-900">PayPal</label>
                                    </div>
                                    <img src="/api/placeholder/60/24" alt="PayPal" className="h-6" />
                                </div>
                            </div>

                            {/* Bitcoin */}
                            <div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="bitcoin"
                                            name="payment-method"
                                            value="bitcoin"
                                            checked={paymentMethod === 'bitcoin'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="mr-3"
                                        />
                                        <label htmlFor="bitcoin" className="font-medium text-gray-900">Bitcoin</label>
                                    </div>
                                    <img src="/api/placeholder/60/24" alt="Bitcoin" className="h-6" />
                                </div>
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
                                        I agree with sending an Marketing and newsletter emails. No spam, promised!
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
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
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
                                    src="/api/placeholder/120/80"
                                    alt="Nissan GT-R"
                                    className="w-20 h-16 object-cover rounded-lg mr-4"
                                />
                                <div>
                                    <h4 className="font-bold text-gray-900">Nissan GT - R</h4>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <span className="flex items-center mr-2">
                                            ⭐ 4.8
                                        </span>
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