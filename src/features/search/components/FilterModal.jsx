import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import Modal from '../../../shared/components/Modal';
import { getAllManufacturers, getModelsByManufacturerId } from '../../cars/carApi';

const FilterModal = ({ 
  isOpen, 
  onClose, 
  searchQuery = '', 
  filterName = '', 
  setFilterName, 
  filterFuel = '', 
  setFilterFuel, 
  filterSeats = '', 
  setFilterSeats 
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // State for manufacturer and model
  const [manufacturers, setManufacturers] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [loadingManufacturers, setLoadingManufacturers] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  // Fetch manufacturers on component mount
  useEffect(() => {
    const fetchManufacturers = async () => {
      if (!isOpen) return;
      
      setLoadingManufacturers(true);
      try {
        const data = await getAllManufacturers();
            // console.log("data",data);
        setManufacturers(data || []);
      } catch (error) {
        console.error('Error fetching manufacturers:', error);
        setManufacturers([]);
      } finally {
        setLoadingManufacturers(false);
      }
    };
    fetchManufacturers();
  }, [isOpen]);

  // Fetch models when manufacturer changes
  useEffect(() => {
    const fetchModels = async () => {
      if (!selectedManufacturer) {
        setModels([]);
        setSelectedModel('');
        return;
      }

      setLoadingModels(true);
      try {
        const data = await getModelsByManufacturerId(selectedManufacturer);
        setModels(data || []);
        setSelectedModel(''); // Reset model selection when manufacturer changes
      } catch (error) {
        console.error('Error fetching models:', error);
        setModels([]);
      } finally {
        setLoadingModels(false);
      }
    };

    fetchModels();
  }, [selectedManufacturer]);

  // Handle seats input formatting
  const handleSeatsChange = (e) => {
    let value = e.target.value;
    
    // Remove any existing spaces and dashes for processing
    const cleanValue = value.replace(/[\s-]/g, '');
    
    // If it's exactly 2 digits, format as "X - Y"
    if (/^\d{2}$/.test(cleanValue)) {
      const formatted = `${cleanValue[0]} - ${cleanValue[1]}`;
      setFilterSeats(formatted);
    } 
    // If it's already in "X - Y" format or single digit, keep as is
    else if (/^\d(\s-\s\d)?$/.test(value) || /^\d$/.test(cleanValue)) {
      setFilterSeats(value);
    }
    // If it's in "X-Y" format (without spaces), add spaces
    else if (/^\d-\d$/.test(cleanValue)) {
      const formatted = cleanValue.replace('-', ' - ');
      setFilterSeats(formatted);
    }
    // For other cases, allow the input but don't format
    else {
      setFilterSeats(value);
    }
  };

  const handleApply = () => {
    const params = new URLSearchParams();
    const q = (filterName || searchQuery).trim();
    if (q) params.set('q', q);
    if (filterFuel) params.set('fuel', filterFuel);
    if (filterSeats) params.set('seats', filterSeats);
    
    // Find manufacturer name by ID
    if (selectedManufacturer) {
      const manufacturer = manufacturers.find(m => m.id === parseInt(selectedManufacturer));
      if (manufacturer) {
        params.set('manufacturer', manufacturer.manufacturer);
      }
    }
    
    // Find model name by ID
    if (selectedModel) {
      const model = models.find(m => m.id === parseInt(selectedModel));
      if (model) {
        params.set('model', model.model);
      }
    }
    
    onClose();
    navigate(`/search?${params.toString()}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('filters')}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('carName')}</label>
            <input
              type="text"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder={t('carNamePlaceholder')}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          {/* Manufacturer and Model Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('brand') || 'Brand'}</label>
              <select
                value={selectedManufacturer}
                onChange={(e) => setSelectedManufacturer(e.target.value)}
                disabled={loadingManufacturers}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">{loadingManufacturers ? t('loading') || 'Loading...' : t('any')}</option>
                {manufacturers.map((manufacturer) => (
                  <option key={manufacturer.id} value={manufacturer.id}>
                    {manufacturer.manufacturer}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('model') || 'Model'}</label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={!selectedManufacturer || loadingModels}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">
                  {!selectedManufacturer 
                    ? t('any')
                    : loadingModels 
                    ? t('loading') || 'Loading...'
                    : t('any')
                  }
                </option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.model}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('minPrice')}</label>
              <input type="number" placeholder="$0" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('maxPrice')}</label>
              <input type="number" placeholder="$500" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('fuelType')}</label>
              <select
                value={filterFuel}
                onChange={(e) => setFilterFuel(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">{t('any')}</option>
                <option value="gasoline">{t('gasoline') || 'Gasoline'}</option>
                <option value="diesel">{t('diesel') || 'Diesel'}</option>
                <option value="electric">{t('electric') || 'Electric'}</option>
                <option value="hybrid">{t('hybrid') || 'Hybrid'}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('seats')}</label>
              <input
                type="text"
                value={filterSeats}
                onChange={handleSeatsChange}
                placeholder={t('seatsRangePlaceholder') || 'e.g. 34 or 3 - 4'}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {/* <p className="text-xs text-gray-500 mt-1">
                {t('seatsRangeHelp') || 'Type 34 (auto-formats to 3 - 4) or single digit like 5'}
              </p> */}
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            {t('apply')}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FilterModal;