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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleReturn = () => {
        // TODO: Navigate back to step 1
        console.log('Return to step 1');
    };

    const handleNext = () => {
        // TODO: Navigate to step 3
        console.log('Next to step 3');
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
                        Return
                    </button>
                    <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-gray-900">Register Car</h1>
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
                            Default rental price
                        </label>
                        <p className="text-xs text-gray-500 mb-6">
                            Set the price for renting out your car to help customers easily
                            choose the right car. You can change the price later.
                        </p>
                        
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    name="dailyPrice"
                                    value={formData.dailyPrice}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                            </div>
                        </div>
                    </div>

                    {/* Vehicle Address */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
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
                        </div>
                    </div>

                    {/* Rental Terms */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            Rental Terms
                        </label>
                        <p className="text-xs text-gray-500 mb-3">
                            State the requirements for the customer to rent the car
                        </p>
                        <textarea
                            name="rentalTerms"
                            value={formData.rentalTerms}
                            onChange={handleInputChange}
                            rows={6}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="Enter rental terms and conditions..."
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleReturn}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                        >
                            Return
                        </button>
                        <button
                            onClick={handleNext}
                            className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterCarStep2;