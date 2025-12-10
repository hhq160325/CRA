import { useState, useEffect, useCallback } from 'react';
import { getUserIdFromToken } from '../../user/api';
import { getAllCars, uploadCarRegistrationDocuments } from '../ownerApi';

const CarRegisDocs = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, approved
  const [currentPage, setCurrentPage] = useState(1);
  const [showTooltip, setShowTooltip] = useState(null); // Track which car's tooltip is shown
  const [uploadingCarId, setUploadingCarId] = useState(null); // Track which car is being uploaded
  const [uploadSuccessCarId, setUploadSuccessCarId] = useState(null); // Track successful upload
  const carsPerPage = 5;
  const currentUserId = getUserIdFromToken();

  const fetchCars = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const allCars = await getAllCars();

      // Filter cars that belong to the current user
      const userCars = allCars.filter(car => car.owner?.id === currentUserId);
      setCars(userCars);
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError('Failed to load cars. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchCars();
  }, [fetchCars]);

  const handleFileUpload = async (carId, files) => {
    if (!files || files.length === 0) return;

    try {
      setUploadingCarId(carId);
      setUploadSuccessCarId(null);
      await uploadCarRegistrationDocuments(carId, currentUserId, files);
      setUploadSuccessCarId(carId);
      // Refresh the cars list after successful upload
      await fetchCars();
      setTimeout(() => {
        setUploadSuccessCarId(null);
      }, 3000);
    } catch (err) {
      console.error('Error uploading documents:', err);
      alert('Failed to upload documents. Please try again.');
    } finally {
      setUploadingCarId(null);
    }
  };

  const triggerFileInput = (carId) => {
    const fileInput = document.getElementById(`file-upload-${carId}`);
    if (fileInput) {
      fileInput.click();
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Pending': {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'Chờ phê duyệt'
      },
      'Active': {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Đã phê duyệt'
      },
      'Inactive': {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Đã phê duyệt'
      },
      'Reserved': {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Chờ phê duyệt'
      }
    };

    const config = statusConfig[status] || {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: status
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const filteredCars = cars.filter(car => {
    if (filter === 'all') return true;
    if (filter === 'pending') return car.status === 'Pending';
    if (filter === 'approved') return car.status === 'Active' || car.status === 'Inactive';
    return true;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6">
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Giấy tờ đăng ký xe</h1>
        <p className="text-gray-600">Quản lý và theo dõi việc phê duyệt tài liệu đăng ký xe </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex space-x-2 border-b">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 font-medium transition-colors ${filter === 'all'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          Tất cả xe ({cars.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 font-medium transition-colors ${filter === 'pending'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          Chờ duyệt ({cars.filter(c => c.status === 'Pending').length})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-4 py-2 font-medium transition-colors ${filter === 'approved'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-600 hover:text-gray-900'
            }`}
        >
          Đã duyệt ({cars.filter(c => c.status === 'Active' || c.status === 'Inactive').length})
        </button>
      </div>

      {/* Cars List */}
      {currentCars.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy xe nào</h3>
          <p className="text-gray-600">
            {filter === 'all'
              ? 'Bạn chưa đăng ký xe nào.'
              : `Không tìm thấy xe ${filter === 'pending' ? 'chờ duyệt' : 'đã duyệt'} nào.`}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            {currentCars.map((car) => (
              <div key={car.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 mr-3">
                        {car.manufacturer} {car.model}
                      </h3>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(car.status)}
                        {car.status === 'Pending' && (
                          <>
                            <div className="relative">
                              <button
                                onClick={() => setShowTooltip(showTooltip === car.id ? null : car.id)}
                                onMouseEnter={() => setShowTooltip(car.id)}
                                onMouseLeave={() => setShowTooltip(null)}
                                className="text-yellow-600 hover:text-yellow-700 focus:outline-none"
                                aria-label="More information"
                              >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                              </button>
                              {showTooltip === car.id && (
                                <div className="absolute left-0 top-full mt-2 w-64 bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg z-10 animate-fade-in">
                                  <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 transform rotate-45"></div>
                                  Hồ sơ đang được phê duyệt
                                </div>
                              )}
                            </div>

                            {uploadSuccessCarId === car.id && (
                              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1 animate-slide-in">
                                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-xs font-medium text-green-800">Tải lên thành công!</span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-4 mt-4">
                      <div className="grid grid-cols-3 md:grid-cols-7 gap-4 flex-1">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Biển số xe</p>
                          <p className="text-sm font-medium text-gray-900">{car.licensePlate}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Số ghế</p>
                          <p className="text-sm font-medium text-gray-900">{car.seats}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Năm sản xuất</p>
                          <p className="text-sm font-medium text-gray-900">{car.yearofManufacture}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Mức tiêu thụ nhiên liệu</p>
                          <p className="text-sm font-medium text-gray-900">{car.fuelConsumption} L/100km</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Hộp số</p>
                          <p className="text-sm font-medium text-gray-900">{car.transmission}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Loại nhiên liệu</p>
                          <p className="text-sm font-medium text-gray-900">{car.fuelType}</p>
                        </div>
                        {car.preferredLot && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Bãi xe ưu tiên</p>
                            <p className="text-sm font-medium text-gray-900">{car.preferredLot.name}</p>
                            <p className="text-xs text-gray-500">{car.preferredLot.address}</p>
                          </div>
                        )}
                      </div>

                      {car.status === 'Pending' && (
                        <div className="flex items-center">
                          <input
                            type="file"
                            id={`file-upload-${car.id}`}
                            multiple
                            accept="image/*,.pdf"
                            onChange={(e) => handleFileUpload(car.id, e.target.files)}
                            className="hidden"
                          />
                          <button
                            onClick={() => triggerFileInput(car.id)}
                            disabled={uploadingCarId === car.id}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-medium transition-colors"
                            title="Tải lên giấy tờ đăng ký"
                          >
                            {uploadingCarId === car.id ? (
                              <>
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang tải lên...
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                Tải lên tài liệu
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>


                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  Trước
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                >
                  Tiếp
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Hiển thị <span className="font-medium">{indexOfFirstCar + 1}</span> đến{' '}
                    <span className="font-medium">{Math.min(indexOfLastCar, filteredCars.length)}</span> trong tổng số{' '}
                    <span className="font-medium">{filteredCars.length}</span> kết quả
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                      <span className="sr-only">Trước</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {[...Array(totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      // Show first page, last page, current page, and pages around current
                      if (
                        pageNumber === 1 ||
                        pageNumber === totalPages ||
                        (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === pageNumber
                              ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                              }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (
                        pageNumber === currentPage - 2 ||
                        pageNumber === currentPage + 2
                      ) {
                        return (
                          <span
                            key={pageNumber}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                      <span className="sr-only">Tiếp</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CarRegisDocs;
