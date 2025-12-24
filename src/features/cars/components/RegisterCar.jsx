import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { validateLicensePlate, formatLicensePlate } from '../../../shared/utils/LicensePlateFormat';
import { DropdownTemplate } from '../../../shared';
import { getAllManufacturers, getModelsByManufacturerId } from '../carApi';

const RegisterCar = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        licensePlate: '',
        manufacturer: '',
        manufacturerId: '',
        model: '',
        modelId: '',
        numberOfSeats: '',
        yearOfManufacture: '',
        transmission: '',
        fuelType: '',
        fuelConsumption: 0.1,
        description: ''
    });
    const [licensePlateError, setLicensePlateError] = useState('');
    const [manufacturers, setManufacturers] = useState([]);
    const [models, setModels] = useState([]);
    const [loadingManufacturers, setLoadingManufacturers] = useState(true);
    const [loadingModels, setLoadingModels] = useState(false);

    // Load manufacturers on mount
    useEffect(() => {
        const fetchManufacturers = async () => {
            try {
                setLoadingManufacturers(true);
                const data = await getAllManufacturers();
                setManufacturers(data);
            } catch (error) {
                console.error('Failed to fetch manufacturers:', error);
            } finally {
                setLoadingManufacturers(false);
            }
        };

        fetchManufacturers();
    }, []);

    // Load saved data from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem('carRegistrationStep1');
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setFormData(parsed);
            
            // If manufacturer was saved, fetch its models
            if (parsed.manufacturerId) {
                fetchModels(parsed.manufacturerId);
            }
        }
    }, []);

    // Fetch models when manufacturer changes
    const fetchModels = async (manufacturerId) => {
        try {
            setLoadingModels(true);
            const data = await getModelsByManufacturerId(manufacturerId);
            setModels(data);
        } catch (error) {
            console.error('Failed to fetch models:', error);
            setModels([]);
        } finally {
            setLoadingModels(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Validate license plate on change
        if (name === 'licensePlate') {
            if (value.trim()) {
                const validation = validateLicensePlate(value);
                if (!validation.isValid) {
                    setLicensePlateError(validation.message);
                } else {
                    setLicensePlateError('');
                }
            } else {
                setLicensePlateError('');
            }
        }
    };

    const handleLicensePlateBlur = () => {
        // Format license plate on blur
        if (formData.licensePlate.trim()) {
            const formatted = formatLicensePlate(formData.licensePlate);
            setFormData(prev => ({
                ...prev,
                licensePlate: formatted
            }));
        }
    };

    const handleReturn = () => {
        // TODO: Implement navigation to previous page
        console.log('Return button clicked - implement later');
    };

    const handleNext = () => {
        // Validate license plate before proceeding
        if (!formData.licensePlate.trim()) {
            setLicensePlateError('License plate is required');
            return;
        }

        const validation = validateLicensePlate(formData.licensePlate);
        if (!validation.isValid) {
            setLicensePlateError(validation.message);
            return;
        }

        // Validate required fields
        const requiredFields = [
            { field: 'manufacturer', message: t('manufacturerRequired') },
            { field: 'model', message: t('modelRequired') },
            { field: 'numberOfSeats', message: t('numberOfSeatsRequired') },
            { field: 'yearOfManufacture', message: t('yearOfManufactureRequired') },
            { field: 'transmission', message: t('transmissionRequired') },
            { field: 'fuelType', message: t('fuelTypeRequired') }
        ];

        for (const { field, message } of requiredFields) {
            if (!formData[field] || !formData[field].toString().trim()) {
                toast.error(message);
                return;
            }
        }

        // Additional validation for numberOfSeats (should be a positive number)
        if (formData.numberOfSeats && (isNaN(formData.numberOfSeats) || parseInt(formData.numberOfSeats) <= 0)) {
            toast.error(t('invalidNumberOfSeats'));
            return;
        }

        // Additional validation for yearOfManufacture (should be a valid year)
        const currentYear = new Date().getFullYear();
        if (formData.yearOfManufacture && (isNaN(formData.yearOfManufacture) || parseInt(formData.yearOfManufacture) < 1900 || parseInt(formData.yearOfManufacture) > currentYear)) {
            toast.error(t('invalidYearOfManufacture', { currentYear }));
            return;
        }

        // Save form data to localStorage before navigating
        localStorage.setItem('carRegistrationStep1', JSON.stringify(formData));
        navigate('/owner/register_car/step2');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-xl font-semibold text-gray-900">{t('registerCar')}</h1>
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
                            onBlur={handleLicensePlateBlur}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                                licensePlateError ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder={t('enterLicensePlate')}
                        />
                        {licensePlateError && (
                            <p className="text-xs text-red-500 mt-2">{licensePlateError}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                            Format: 29A-12345 or 29A-123.45
                        </p>
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('brand')} <span className="text-red-500">*</span>
                                </label>
                                <DropdownTemplate
                                    value={formData.manufacturer}
                                    onChange={(option) => {
                                        setFormData(prev => ({ 
                                            ...prev, 
                                            manufacturer: option.label,
                                            manufacturerId: option.id,
                                            model: '',
                                            modelId: ''
                                        }));
                                        fetchModels(option.id);
                                    }}
                                    options={manufacturers.map(m => ({
                                        id: m.id,
                                        value: m.manufacturer,
                                        label: m.manufacturer
                                    }))}
                                    placeholder={loadingManufacturers ? t('loading') || 'Loading...' : t('brand')}
                                    disabled={loadingManufacturers}
                                />
                            </div>

                            {/* Model */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('model')} <span className="text-red-500">*</span>
                                </label>
                                <DropdownTemplate
                                    value={formData.model}
                                    onChange={(option) => {
                                        const selectedModel = models.find(m => m.id === option.id);
                                        setFormData(prev => ({ 
                                            ...prev, 
                                            model: option.label,
                                            modelId: option.id,
                                            yearOfManufacture: selectedModel?.yearOfManufacture?.toString() || prev.yearOfManufacture
                                        }));
                                    }}
                                    options={models.map(m => ({
                                        id: m.id,
                                        value: m.model,
                                        label: m.model
                                    }))}
                                    placeholder={loadingModels ? t('loading') || 'Loading...' : t('model')}
                                    disabled={!formData.manufacturerId || loadingModels}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            {/* Number of Seats */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('numberOfSeat')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="numberOfSeats"
                                    value={formData.numberOfSeats}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={t('numberOfSeat')}
                                />
                            </div>

                            {/* Year of Manufacture */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    {t('yearOfManufacture')} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="yearOfManufacture"
                                    value={formData.yearOfManufacture}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder={t('yearOfManufacture')}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {/* Transmission */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t('transmission')}</label>
                                <DropdownTemplate
                                    value={formData.transmission}
                                    onChange={(option) => setFormData(prev => ({ ...prev, transmission: option.value }))}
                                    options={[
                                        { id: 1, value: 'Automatic', label: t('automatic') },
                                        { id: 2, value: 'Manual', label: t('manual') }
                                    ]}
                                    placeholder={t('transmission')}
                                />
                            </div>

                            {/* Fuel Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">{t('fuelType')}</label>
                                <DropdownTemplate
                                    value={formData.fuelType}
                                    onChange={(option) => setFormData(prev => ({ ...prev, fuelType: option.value }))}
                                    options={[
                                        { id: 1, value: 'Gasoline', label: t('gasoline') },
                                        { id: 2, value: 'Diesel', label: t('diesel') },
                                        { id: 3, value: 'Electric', label: t('electric') },
                                        { id: 4, value: 'Hybrid', label: t('hybrid') }
                                    ]}
                                    placeholder={t('fuelType')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Fuel Consumption */}
                    {/* <div className="mb-8">
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
                    </div> */}

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
                        {/* <button
                            onClick={handleReturn}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                        >
                            {t('return')}
                        </button> */}
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