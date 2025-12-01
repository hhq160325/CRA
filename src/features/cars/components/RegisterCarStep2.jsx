<<<<<<< HEAD
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterCarStep2 = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        dailyPrice: '400,000',
        currency: 'VND',
        address: '',
        rentalTerms: ''
    });
=======
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchParkLots } from '../carApi';

const RegisterCarStep2 = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        dailyPrice: '10.000',
        currency: 'VND',
        address: '',
        parkLotId: '',
        rentalTerms: ''
    });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isParkLotDropdownOpen, setIsParkLotDropdownOpen] = useState(false);
    const [parkLots, setParkLots] = useState([]);
    const [filteredParkLots, setFilteredParkLots] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const searchInputRef = useRef(null);

    // Load saved data from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem('carRegistrationStep2');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            // Convert dailyPrice from number to formatted string if needed
            if (typeof parsedData.dailyPrice === 'number') {
                parsedData.dailyPrice = parsedData.dailyPrice.toLocaleString('de-DE');
            }
            setFormData(parsedData);
        }
    }, []);

    const currencies = [
        { value: 'VND', label: 'VND' },
        { value: 'USD', label: 'USD' },
        { value: 'EUR', label: 'EUR' }
    ];

    useEffect(() => {
        loadParkLots();
    }, []);

    useEffect(() => {
        if (isParkLotDropdownOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isParkLotDropdownOpen]);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredParkLots(parkLots);
        } else {
            const filtered = parkLots.filter(lot =>
                lot.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredParkLots(filtered);
        }
    }, [searchQuery, parkLots]);

    const loadParkLots = async () => {
        setIsLoading(true);
        try {
            const data = await fetchParkLots();
            setParkLots(data);
            setFilteredParkLots(data);
        } catch (error) {
            console.error('Error loading park lots:', error);
        } finally {
            setIsLoading(false);
        }
    };
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

<<<<<<< HEAD
=======
    const handleCurrencySelect = (currency) => {
        setFormData(prev => ({
            ...prev,
            currency: currency
        }));
        setIsDropdownOpen(false);
    };

    const handleParkLotSelect = (parkLot) => {
        console.log('Selected parkLot:', parkLot);
        setFormData(prev => ({
            ...prev,
            address: parkLot.name,
            parkLotId: parkLot.managerId || parkLot.id // Use managerId if available, fallback to id
        }));
        setIsParkLotDropdownOpen(false);
        setSearchQuery('');
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
    const handleReturn = () => {
        navigate('/register-car');
    };

    const handleNext = () => {
<<<<<<< HEAD
=======
        // Save form data to localStorage before navigating
        // Convert dailyPrice from formatted string to number (e.g., "10.000" -> 10000)
        const dailyPriceValue = typeof formData.dailyPrice === 'string' 
            ? parseFloat(formData.dailyPrice.replace(/\./g, '')) || 0
            : formData.dailyPrice;
        
        const dataToSave = {
            ...formData,
            dailyPrice: dailyPriceValue
        };
        localStorage.setItem('carRegistrationStep2', JSON.stringify(dataToSave));
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
        navigate('/register-car/step-3');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="relative flex items-center mb-8">
                    <button
                        onClick={handleReturn}
                        className="flex items-center text-gray-600 hover:text-gray-800"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
<<<<<<< HEAD
                        Return
                    </button>
                    <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-gray-900">Register Car</h1>
=======
                        {t('return')}
                    </button>
                    <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-gray-900">{t('registerCar')}</h1>
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-12">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-medium">
                            1
                        </div>
                        <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-medium">
                            2
                        </div>
                        <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
                        <div className="w-10 h-10 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-medium">
                            3
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-sm p-8">
                    {/* Default Rental Price */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
<<<<<<< HEAD
                            Default rental price
                        </label>
                        <p className="text-xs text-gray-500 mb-6">
                            Set the price for renting out your car to help customers easily
                            choose the right car. You can change the price later.
=======
                            {t('defaultRentalPrice')}
                        </label>
                        <p className="text-xs text-gray-500 mb-6">
                            {t('defaultRentalPriceDescription')}
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
                        </p>
                        
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    name="dailyPrice"
                                    value={formData.dailyPrice}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
<<<<<<< HEAD
                                    placeholder="400,000"
                                />
                            </div>
                            <div className="w-24">
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="VND">VND</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                </select>
=======
                                    placeholder="10.000"
                                />
                            </div>
                            <div className="w-24 relative">
                                <button
                                    type="button"
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex items-center justify-between"
                                >
                                    <span className="text-gray-900">{formData.currency}</span>
                                    <svg 
                                        className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                
                                {isDropdownOpen && (
                                    <>
                                        <div 
                                            className="fixed inset-0 z-10" 
                                            onClick={() => setIsDropdownOpen(false)}
                                        />
                                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                                            {currencies.map((currency) => (
                                                <button
                                                    key={currency.value}
                                                    type="button"
                                                    onClick={() => handleCurrencySelect(currency.value)}
                                                    className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors ${
                                                        formData.currency === currency.value ? 'bg-gray-50 text-gray-900 font-medium' : 'text-gray-700'
                                                    }`}
                                                >
                                                    {currency.label}
                                                </button>
                                            ))}
                                        </div>
                                    </>
                                )}
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Address */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
<<<<<<< HEAD
                            Vehicle address
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter vehicle address"
                            />
                            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* Map placeholder */}
                        <div className="mt-4 h-48 bg-gray-200 rounded-lg overflow-hidden">
                            <img 
                                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 200'%3E%3Crect width='400' height='200' fill='%23e5e7eb'/%3E%3Cpath d='M50 150 Q100 50 150 100 T250 80 Q300 60 350 120' stroke='%236b7280' stroke-width='2' fill='none'/%3E%3Ccircle cx='200' cy='90' r='30' fill='%2310b981' opacity='0.3'/%3E%3Cpath d='M190 80 Q200 70 210 80 Q200 100 190 80' fill='%2310b981'/%3E%3C/svg%3E"
                                alt="Map placeholder"
                                className="w-full h-full object-cover"
                            />
=======
                            {t('vehicleAddress')}
                        </label>
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsParkLotDropdownOpen(!isParkLotDropdownOpen)}
                                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left"
                            >
                                <span className={formData.address ? 'text-gray-900' : 'text-gray-400'}>
                                    {formData.address || t('enterVehicleAddress')}
                                </span>
                            </button>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                                <svg 
                                    className={`w-4 h-4 transition-transform ${isParkLotDropdownOpen ? 'rotate-180' : ''}`} 
                                    fill="none" 
                                    stroke="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            {isParkLotDropdownOpen && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-10" 
                                        onClick={() => {
                                            setIsParkLotDropdownOpen(false);
                                            setSearchQuery('');
                                        }}
                                    />
                                    <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                                        {/* Search Box */}
                                        <div className="p-3 border-b border-gray-200">
                                            <div className="relative">
                                                <input
                                                    ref={searchInputRef}
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={handleSearchChange}
                                                    className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Search parking lots..."
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <svg 
                                                    className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                                    fill="none" 
                                                    stroke="currentColor" 
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Park Lot List */}
                                        <div className="max-h-60 overflow-y-auto">
                                            {isLoading ? (
                                                <div className="px-4 py-8 text-center text-gray-500">
                                                    Loading...
                                                </div>
                                            ) : filteredParkLots.length > 0 ? (
                                                filteredParkLots.map((parkLot) => (
                                                    <button
                                                        key={parkLot.id}
                                                        type="button"
                                                        onClick={() => handleParkLotSelect(parkLot)}
                                                        className={`w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors ${
                                                            formData.address === parkLot.name ? 'bg-gray-50 text-gray-900 font-medium' : 'text-gray-700'
                                                        }`}
                                                    >
                                                        <div className="flex items-center">
                                                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            {parkLot.name}
                                                        </div>
                                                    </button>
                                                ))
                                            ) : (
                                                <div className="px-4 py-8 text-center text-gray-500">
                                                    No parking lots found
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
                        </div>
                    </div>

                    {/* Rental Terms */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
<<<<<<< HEAD
                            Rental Terms
                        </label>
                        <p className="text-xs text-gray-500 mb-3">
                            State the requirements for the customer to rent the car
=======
                            {t('rentalTerms')}
                        </label>
                        <p className="text-xs text-gray-500 mb-3">
                            {t('rentalTermsDescription')}
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
                        </p>
                        <textarea
                            name="rentalTerms"
                            value={formData.rentalTerms}
                            onChange={handleInputChange}
                            rows={6}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
<<<<<<< HEAD
                            placeholder="Enter rental terms and conditions..."
=======
                            placeholder={t('enterRentalTerms')}
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleReturn}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                        >
<<<<<<< HEAD
                            Return
=======
                            {t('return')}
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
                        </button>
                        <button
                            onClick={handleNext}
                            className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium"
                        >
<<<<<<< HEAD
                            Next
=======
                            {t('next')}
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterCarStep2;