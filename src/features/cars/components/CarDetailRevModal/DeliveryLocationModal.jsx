import React, { useState, useEffect } from 'react';
import { getCurrentLocationWithAddress } from '../../../location/locationService';

const DELIVERY_LOCATION_KEY = 'deliveryLocation';

const DeliveryLocationModal = ({ 
  isOpen, 
  onClose, 
  locationAddress, 
  locationCity,
  selectedAirport,
  setSelectedAirport,
  onLocationUpdate
}) => {
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [customAddress, setCustomAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load saved location from localStorage first
    const savedLocation = localStorage.getItem(DELIVERY_LOCATION_KEY);
    
    if (savedLocation) {
      setCustomAddress(savedLocation);
    } else if (locationAddress && locationCity) {
      setCustomAddress(`${locationAddress}, ${locationCity}`);
    }
  }, [locationAddress, locationCity]);

  const handleGetCurrentLocation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const location = await getCurrentLocationWithAddress(true);
      
      if (location?.formattedAddress) {
        setCustomAddress(location.formattedAddress);
        // Save to localStorage
        localStorage.setItem(DELIVERY_LOCATION_KEY, location.formattedAddress);
      }
    } catch (err) {
      console.error('Location error:', err);
      setError(err.message);
      alert('Không thể lấy vị trí hiện tại. Vui lòng kiểm tra quyền truy cập vị trí.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressChange = (e) => {
    const newAddress = e.target.value;
    setCustomAddress(newAddress);
    // Save to localStorage on change
    if (newAddress.trim()) {
      localStorage.setItem(DELIVERY_LOCATION_KEY, newAddress);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Modal Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Địa điểm giao nhận xe</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

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
              {/* Current Address */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-gray-700">Địa chỉ tùy chỉnh</label>
                  <button 
                    className="text-sm text-blue-600 font-semibold hover:text-blue-700 transition-colors"
                    onClick={() => setShowAddressDropdown(!showAddressDropdown)}
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
                        onClick={handleGetCurrentLocation}
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
                      Nhập địa chỉ cụ thể hoặc nhấn biểu tượng để lấy vị trí hiện tại
                    </p>
                  </div>
                )}

                <div className="p-4 border-2 border-blue-500 bg-blue-50 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center mt-0.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                    </div>
                    <p className="text-sm text-gray-700 flex-1">
                      {customAddress || `${locationAddress}, ${locationCity}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Airport Options */}
              {/* <div>
                <label className="text-sm font-semibold text-gray-700 block mb-3">Giao xe sân bay</label>
                <div className="space-y-3">
                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedAirport === 'TSN' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => setSelectedAirport('TSN')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="airport"
                          checked={selectedAirport === 'TSN'}
                          onChange={() => setSelectedAirport('TSN')}
                          className="w-4 h-4 text-green-600"
                        />
                        <span className="text-sm font-medium">Tân Sơn Nhất</span>
                      </div>
                      <span className="text-sm font-semibold text-green-600">180.000₫</span>
                    </div>
                  </div>
                  <div 
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedAirport === 'T3' 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                    onClick={() => setSelectedAirport('T3')}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="airport"
                          checked={selectedAirport === 'T3'}
                          onChange={() => setSelectedAirport('T3')}
                          className="w-4 h-4 text-green-600"
                        />
                        <span className="text-sm font-medium">Ga T3 (TSN)</span>
                      </div>
                      <span className="text-sm font-semibold text-green-600">180.000₫</span>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* Total Fee - TODO  */}
              {/* <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tổng phí:</span>
                  <span className="text-lg font-bold text-green-600">
                    {selectedAirport ? '180.000₫' : '60.000₫'} (2 km)
                  </span>
                </div>
              </div> */}

              {/* Confirm Button */}
              <button 
                onClick={() => {
                  if (onLocationUpdate && customAddress) {
                    onLocationUpdate(customAddress);
                    // Save to localStorage when confirming
                    localStorage.setItem(DELIVERY_LOCATION_KEY, customAddress);
                  }
                  onClose();
                }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Thay đổi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryLocationModal;
