import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const RegisterCar = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        licensePlate: '',
        brand: 'Honda',
        model: 'Unspecified',
        numberOfSeats: '4',
        yearOfManufacture: '2024',
        transmission: 'Automatic',
        fuelType: 'Gasoline',
        fuelConsumption: '',
        description: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleReturn = () => {
        // TODO: Implement navigation to previous page
        console.log('Return button clicked - implement later');
    };

    const handleNext = () => {
        navigate('/register-car/step-2');
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
                        {t('return')}
                    </button>
                    <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-gray-900">{t('registerCar')}</h1>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-12">
                    <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-medium">
                            1
                        </div>
                        <div className="w-8 h-0.5 bg-gray-300 mx-2"></div>
                        <div className="w-10 h-10 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-medium">
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
                    {/* License Plate Number */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            {t('licensePlateNumber')}
                        </label>
                        <p className="text-xs text-red-500 mb-3">
                            {t('licensePlateRequired')}
                        </p>
                        <input
                            type="text"
                            name="licensePlate"
                            value={formData.licensePlate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={t('enterLicensePlate')}
                        />
                    </div>

                    {/* Basic Information */}
                    <div className="mb-8">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">{t('basicInformation')}</h3>
                        <p className="text-xs text-red-500 mb-6">
                            {t('basicInfoRequired')}
                        </p>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            {/* Brand */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t('brand')}</label>
                                <select
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Honda">{t('honda')}</option>
                                    <option value="Toyota">{t('toyota')}</option>
                                    <option value="BMW">{t('bmw')}</option>
                                    <option value="Mercedes">{t('mercedes')}</option>
                                    <option value="Audi">{t('audi')}</option>
                                </select>
                            </div>

                            {/* Model */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t('model')}</label>
                                <select
                                    name="model"
                                    value={formData.model}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Unspecified">{t('unspecified')}</option>
                                    <option value="Civic">{t('civic')}</option>
                                    <option value="Accord">{t('accord')}</option>
                                    <option value="CR-V">{t('crv')}</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            {/* Number of Seats */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t('numberOfSeat')}</label>
                                <select
                                    name="numberOfSeats"
                                    value={formData.numberOfSeats}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="2">2</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="7">7</option>
                                    <option value="8">8</option>
                                </select>
                            </div>

                            {/* Year of Manufacture */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t('yearOfManufacture')}</label>
                                <select
                                    name="yearOfManufacture"
                                    value={formData.yearOfManufacture}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                    <option value="2022">2022</option>
                                    <option value="2021">2021</option>
                                    <option value="2020">2020</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {/* Transmission */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t('transmission')}</label>
                                <select
                                    name="transmission"
                                    value={formData.transmission}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Automatic">{t('automatic')}</option>
                                    <option value="Manual">{t('manual')}</option>
                                </select>
                            </div>

                            {/* Fuel Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t('fuelType')}</label>
                                <select
                                    name="fuelType"
                                    value={formData.fuelType}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="Gasoline">{t('gasoline')}</option>
                                    <option value="Diesel">{t('diesel')}</option>
                                    <option value="Electric">{t('electric')}</option>
                                    <option value="Hybrid">{t('hybrid')}</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Fuel Consumption */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            {t('fuelConsumption')}
                        </label>
                        <p className="text-xs text-gray-500 mb-3">
                            {t('fuelConsumptionDescription')}
                        </p>
                        <input
                            type="number"
                            name="fuelConsumption"
                            value={formData.fuelConsumption}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={t('enterFuelConsumption')}
                            step="0.1"
                        />
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-900 mb-2">
                            {t('describe')}
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows={6}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder={t('describeYourCar')}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleReturn}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                        >
                            {t('return')}
                        </button>
                        <button
                            onClick={handleNext}
                            className="flex-1 px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium"
                        >
                            {t('next')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterCar;