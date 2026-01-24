import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import axios from 'axios';
import { CAR_ENDPOINTS } from '../../../../../config/api';

const ReportDetailsModal = ({ 
  isOpen, 
  onClose, 
  selectedReport, 
  onRecallCar 
}) => {
  const { t } = useTranslation();
  const [isRecalling, setIsRecalling] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Log selectedReport to see its structure
  console.log('selectedReport in ReportDetailsModal:', selectedReport);
  console.log('URLs available:', selectedReport?.urls);

  if (!isOpen || !selectedReport) return null;

  const openLightbox = (index) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === selectedReport.urls.length - 1 ? 0 : prev + 1
    );
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? selectedReport.urls.length - 1 : prev - 1
    );
  };

  const handleKeyDown = (e) => {
    if (!lightboxOpen) return;
    if (e.key === 'ArrowRight') goToNextImage();
    if (e.key === 'ArrowLeft') goToPrevImage();
    if (e.key === 'Escape') closeLightbox();
  };

  const handleRecallCar = async () => {
    if (!selectedReport?.reportedCarId || !selectedReport?.carLicensePlate) {
      alert('Missing car information');
      return;
    }

    try {
      setIsRecalling(true);
      const token = localStorage.getItem('jwtToken');
      
      const requestBody = {
        carId: selectedReport.reportedCarId,
        licensePlate: selectedReport.carLicensePlate,
        isActive: false
      };

      // console.log('Recalling car with request:', requestBody);

      await axios.patch(CAR_ENDPOINTS.PATCH_CAR_ACTIVE_STATUS, requestBody, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Car has been recalled successfully');
      onClose();
      
      // Call the original onRecallCar if it exists for additional handling
      if (onRecallCar) {
        onRecallCar(selectedReport.id, selectedReport.reportedCarId);
      }
    } catch (error) {
      console.error('Error recalling car:', error);
      alert('Failed to recall car. Please try again.');
    } finally {
      setIsRecalling(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Active': {
        bg: 'bg-red-100',
        text: 'text-red-800',
        label: 'Active'
      },
      'Resolved': {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Resolved'
      },
      'In Progress': {
        bg: 'bg-yellow-100',
        text: 'text-yellow-800',
        label: 'In Progress'
      }
    };

    const config = statusConfig[status] || {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      label: status
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Report Details - {selectedReport.reportNo}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Report Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Report Information</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Report Number</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedReport.reportNo}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedReport.status)}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Created Date</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedReport.createDateFormatted}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Reporter Information</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Reporter Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedReport.reporterName}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedReport.reporterEmail}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedReport.reporterPhone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Car Information */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Car Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Car Name</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedReport.carName}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedReport.carManufacturer}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Model</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedReport.carModel}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">License Plate</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedReport.carLicensePlate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Report Details */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Report Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <p className="mt-1 text-sm text-gray-900 font-medium">{selectedReport.title}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedReport.content}</p>
                </div>
              </div>

              {/* Report Images */}
              {selectedReport.urls && selectedReport.urls.length > 0 ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Evidence Images ({selectedReport.urls.length})
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedReport.urls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Report evidence ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-75 transition-opacity"
                          onClick={() => openLightbox(index)}
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                          }}
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center pointer-events-none">
                          <svg 
                            className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Click on any image to view in full size
                  </p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Evidence Images
                  </label>
                  <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                    <p className="text-sm text-gray-500 italic">No images attached to this report</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
          
          {/* {selectedReport.status === 'Active' && (
            <button
              onClick={handleRecallCar}
              disabled={isRecalling}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRecalling ? 'Recalling...' : 'Recall Car'}
            </button>
          )} */}
        </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && selectedReport.urls && selectedReport.urls.length > 0 && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[60]"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-sm bg-black bg-opacity-50 px-3 py-1 rounded-full">
            {currentImageIndex + 1} / {selectedReport.urls.length}
          </div>

          {/* Previous button */}
          {selectedReport.urls.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevImage();
              }}
              className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}

          {/* Image */}
          <div className="max-w-7xl max-h-[90vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedReport.urls[currentImageIndex]}
              alt={`Evidence ${currentImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found';
              }}
            />
          </div>

          {/* Next button */}
          {selectedReport.urls.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNextImage();
              }}
              className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}

          {/* Download button */}
          <a
            href={selectedReport.urls[currentImageIndex]}
            download
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-4 right-4 text-white hover:text-gray-300 transition-colors bg-black bg-opacity-50 p-2 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>
        </div>
      )}
    </>
  );
};

export default ReportDetailsModal;