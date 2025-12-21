import React, { useState, useEffect } from 'react';
import { getCurrentLocationWithAddress } from '../../../location/locationService';
import { TRACKASIA_ENDPOINTS, TRACKASIA_API_CONFIG, PARKLOT_ENDPOINTS, PARKLOT_API_CONFIG } from '../../../../config/api';
import DropdownTemplate from '../../../../shared/components/DropdownTemplate';
import { useTranslation } from 'react-i18next';
const DELIVERY_LOCATION_KEY = 'deliveryLocation';
const DELIVERY_AIRPORT_KEY = 'deliveryAirport';

// Airport addresses
const AIRPORT_ADDRESSES = {
  TSN: 'Sân bay Tân Sơn Nhất, Đường Trường Sa, phường Tân Sơn Hòa, thành phố Hồ Chí Minh',
  T3: 'Nhà ga T3 Sân bay Tân Sơn Nhất,Phường Tân Sơn , Thành phố Hồ Chí Minh'
};

const DeliveryLocationModal = ({
  isOpen,
  onClose,
  locationAddress,
  locationCity,
  selectedAirport,
  setSelectedAirport,
  onLocationUpdate,
  showParkLotOptions = false // New prop to show park lot options
}) => {
  const { t } = useTranslation();
  const [showAddressDropdown, setShowAddressDropdown] = useState(true);
  const [showDeliveryDropdown, setShowDeliveryDropdown] = useState(true);
  const [customAddress, setCustomAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [airportLoading, setAirportLoading] = useState(false);
  const [parkLots, setParkLots] = useState([]);
  const [selectedParkLot, setSelectedParkLot] = useState(null);
  useEffect(() => {
    // Load saved airport selection first
    const savedAirport = localStorage.getItem(DELIVERY_AIRPORT_KEY);
    const savedLocation = localStorage.getItem(DELIVERY_LOCATION_KEY);

    if (savedAirport && AIRPORT_ADDRESSES[savedAirport]) {
      setSelectedAirport(savedAirport);
      setCustomAddress(AIRPORT_ADDRESSES[savedAirport]);
    } else if (savedLocation) {
      setCustomAddress(savedLocation);
    } else if (locationAddress && locationCity) {
      setCustomAddress(`${locationAddress}`);
    }
  }, [locationAddress, setSelectedAirport]);

  // Fetch park lots when modal opens and showParkLotOptions is true
  useEffect(() => {
    if (isOpen && showParkLotOptions) {
      fetchParkLots();
    }
  }, [isOpen, showParkLotOptions]);

  const fetchParkLots = async () => {
    try {
      const response = await fetch(PARKLOT_ENDPOINTS.GET_ALL, {
        method: 'GET',
        headers: PARKLOT_API_CONFIG.headers,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch park lots');
      }

      const data = await response.json();
      setParkLots(data || []);
      // Don't auto-select any park lot
      setSelectedParkLot(null);
    } catch (err) {
      console.error('Error fetching park lots:', err);
      setParkLots([]);
    }
  };

  const handleGetCurrentLocation = async () => {
    setLoading(true);

    try {
      const location = await getCurrentLocationWithAddress(true);

      if (location?.formattedAddress) {
        setCustomAddress(location.formattedAddress);
        // Save to localStorage
        localStorage.setItem(DELIVERY_LOCATION_KEY, location.formattedAddress);
      }
    } catch (err) {
      console.error('Location error:', err);
      alert('Không thể lấy vị trí hiện tại. Vui lòng kiểm tra quyền truy cập vị trí.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    setCustomAddress(newAddress);
    // Clear airport and park lot selection when manually editing address
    setSelectedAirport(null);
    setSelectedParkLot(null);
    // Save to localStorage on change
    if (newAddress.trim()) {
      localStorage.setItem(DELIVERY_LOCATION_KEY, newAddress);
      localStorage.removeItem(DELIVERY_AIRPORT_KEY);
    }
  };

  const handleAirportSelection = async (airportCode) => {
    setSelectedAirport(airportCode);
    setSelectedParkLot(null); // Clear park lot selection

    const address = AIRPORT_ADDRESSES[airportCode];
    if (!address) return;

    // Don't update customAddress - keep it separate
    // setCustomAddress(address);
    setAirportLoading(true);

    try {
      console.log('Calling API with address:', address);
      console.log('Endpoint:', TRACKASIA_ENDPOINTS.GET_COORDINATE_FROM_ADDRESS);

      const response = await fetch(TRACKASIA_ENDPOINTS.GET_COORDINATE_FROM_ADDRESS, {
        method: 'POST',
        headers: TRACKASIA_API_CONFIG.headers,
        body: JSON.stringify(address)
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', errorText);
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log('Airport coordinates response:', data);

    } catch (err) {
      console.error('Error getting airport coordinates:', err);
      // Don't show alert, just log the error - the address is still set
      console.warn('Failed to get coordinates, but address is still saved');
    } finally {
      setAirportLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* This is for Cardetail and Payment Part */}
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{t('vehiclePicDeliLocation')}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {/* Add option for Car ParkLot location if open modal in home page */}
        {/* Modal Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
            {/* Left: Map */} {/*TODO*/}
            {/* <div className="space-y-4">
              <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center relative overflow-hidden">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.6!2d106.69!3d10.76!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ1JzM2LjAiTiAxMDbCsDQxJzI0LjAiRQ!5e0!3m2!1sen!2s!4v1234567890`}
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  title="Delivery Location Map"
                ></iframe>
              </div>

              <div className="bg-white border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Giao xe nhận xe tận nơi</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Dịch vụ giao nhận xe tận nơi <span className="font-semibold">trong vòng 20km</span></p>
                  <p>Phí giao nhận xe (2 chiều) <span className="font-semibold float-right">30.000đ/km</span></p>
                </div>
              </div>
            </div> */}

            {/* Right: Address & Airport Selection */}
            <div className="space-y-4">
              {/* Park Lot Options - Dropdown */}
              {showParkLotOptions && parkLots.length > 0 && (
                <div onClick={(e) => e.stopPropagation()}>
                  <label className="text-sm font-semibold text-gray-700 block mb-3">Nhận xe tại bãi đỗ</label>
                  <DropdownTemplate
                    value={selectedParkLot?.name || ''}
                    onChange={(option) => {
                      const parkLot = parkLots.find(p => p.name === option.value);
                      if (parkLot) {
                        setSelectedParkLot(parkLot);
                        setSelectedAirport(null);
                      }
                    }}
                    options={parkLots.map(parkLot => ({
                      id: parkLot.name,
                      value: parkLot.name,
                      label: parkLot.name,
                      address: parkLot.address,
                      city: parkLot.city
                    }))}
                    placeholder="Chọn bãi đỗ xe"
                    searchable={true}
                    searchPlaceholder="Tìm kiếm bãi đỗ..."
                    renderOption={(option) => (
                      <div>
                        <div className="font-medium text-gray-900">{option.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{option.address || option.city}</div>
                      </div>
                    )}
                    renderSelected={(option) => (
                      <span className={option ? 'text-gray-900' : 'text-gray-400'}>
                        {option ? option.label : 'Chọn bãi đỗ xe'}
                      </span>
                    )}
                  />
                  {selectedParkLot && (
                    <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{selectedParkLot.name}</p>
                          <p className="text-xs text-gray-600 mt-1">{selectedParkLot.address}</p>
                          <p className="text-xs text-blue-600 font-semibold mt-2">Miễn phí giao nhận</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Delivery Group - Custom Address & Airport */}
              <div>
                <div className="flex items-center justify-between mb-3 cursor-pointer" onClick={(e) => {
                  e.stopPropagation();
                  setShowDeliveryDropdown(!showDeliveryDropdown);
                }}>
                  <label className="text-sm font-semibold text-gray-700 cursor-pointer">{t('deliveryCar')}</label>
                  <button
                    className="text-gray-600 hover:text-blue-600 transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeliveryDropdown(!showDeliveryDropdown);
                    }}
                  >
                    <svg
                      className={`w-5 h-5 transition-transform duration-300 ${showDeliveryDropdown ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
                <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showDeliveryDropdown ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="space-y-4 pb-2" onClick={(e) => e.stopPropagation()}>
                    {/* Current Address */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-gray-600">{t('customAddress')}</label>
                        <button
                          className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowAddressDropdown(!showAddressDropdown);
                          }}
                        >
                          {showAddressDropdown ? 'Đóng ×' : 'Thay đổi ›'}
                        </button>
                      </div>

                      {/* Address Dropdown */}
                      {showAddressDropdown && (
                        <div className="mb-3 p-4 border border-gray-200 rounded-lg bg-white animate-slideDown">
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Nhập địa chỉ giao xe..."
                              value={customAddress}
                              onChange={handleAddressChange}
                              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleGetCurrentLocation();
                              }}
                              disabled={loading}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              title="Lấy vị trí hiện tại"
                            >
                              {loading ? (
                                <svg
                                  className="w-5 h-5 animate-spin"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  />
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            {t('inputOrTapIcon')}
                          </p>
                        </div>
                      )}

                      {/* Summary display box - shows current address and opens dropdown when clicked */}
                      {/* Confirm Custom Address Button */}
                      {customAddress && (
                        <div className="mt-3">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Clear airport and park lot selections
                              setSelectedAirport(null);
                              setSelectedParkLot(null);
                              // Save custom address to localStorage
                              localStorage.setItem(DELIVERY_LOCATION_KEY, customAddress);
                              localStorage.removeItem(DELIVERY_AIRPORT_KEY);
                              // Close the address dropdown
                              setShowAddressDropdown(false);
                            }}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
                          >
                           {t('addressConfirmation')}
                          </button>
                          {!showAddressDropdown && (
                            <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                              <div className="flex items-start gap-2">
                                <svg
                                  className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5"
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                </svg>
                                <p className="text-xs text-gray-700 flex-1">{customAddress}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Airport Options */}
                    <div>
                      <label className="text-sm font-medium text-gray-600 block mb-3">{t('airportLocation')}</label>
                      <div className="space-y-3">
                        <div
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedAirport === 'TSN'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                            } ${airportLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!airportLoading) handleAirportSelection('TSN');
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="deliveryLocation"
                                checked={selectedAirport === 'TSN'}
                                onChange={() => { }}
                                disabled={airportLoading}
                                className="w-4 h-4 text-blue-600 accent-blue-600 pointer-events-none"
                              />
                              <span className="text-sm font-medium">Tân Sơn Nhất</span>
                            </div>
                            {/* <span className="text-sm font-semibold text-blue-600">180.000₫</span> */}
                          </div>
                        </div>
                        <div
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedAirport === 'T3'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                            } ${airportLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!airportLoading) handleAirportSelection('T3');
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="deliveryLocation"
                                checked={selectedAirport === 'T3'}
                                onChange={() => { }}
                                disabled={airportLoading}
                                className="w-4 h-4 text-blue-600 accent-blue-600 pointer-events-none"
                              />
                              <span className="text-sm font-medium">Ga T3 (TSN)</span>
                            </div>
                            {/* <span className="text-sm font-semibold text-blue-600">180.000₫</span> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Note about fee calculation */}
              <div className="pt-4 border-t">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{t('deliveryFees')}</p>
                      <p className="text-xs text-gray-600 mt-1">{t('minimum')}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={() => {
                  // Save based on selection priority: park lot > airport > custom address
                  if (selectedParkLot) {
                    // Save park lot selection
                    const parkLotAddress = selectedParkLot.address || selectedParkLot.name;
                    localStorage.setItem(DELIVERY_LOCATION_KEY, parkLotAddress);
                    localStorage.removeItem(DELIVERY_AIRPORT_KEY);
                    if (onLocationUpdate) {
                      onLocationUpdate(parkLotAddress);
                    }
                  } else if (selectedAirport) {
                    // Save airport selection
                    localStorage.setItem(DELIVERY_AIRPORT_KEY, selectedAirport);
                    localStorage.setItem(DELIVERY_LOCATION_KEY, AIRPORT_ADDRESSES[selectedAirport]);
                    if (onLocationUpdate) {
                      onLocationUpdate(AIRPORT_ADDRESSES[selectedAirport]);
                    }
                  } else if (customAddress) {
                    // Save custom address
                    localStorage.setItem(DELIVERY_LOCATION_KEY, customAddress);
                    localStorage.removeItem(DELIVERY_AIRPORT_KEY);
                    if (onLocationUpdate) {
                      onLocationUpdate(customAddress);
                    }
                  }
                  onClose();
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                {t('changeAddress')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryLocationModal;
