import { useTranslation } from 'react-i18next';
import StatusBadge from './StatusBadge';
import { triggerFileInput } from '../utils/statusUtils';

const CarCard = ({ 
  car, 
  showTooltip, 
  setShowTooltip, 
  uploadingCarId, 
  uploadSuccessCarId, 
  handleFileUpload 
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-900 mr-3">
              {car.manufacturer} {car.model}
            </h3>
            <div className="flex items-center gap-2">
              <StatusBadge status={car.status} />
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
                        {t('carRegisDocs.documentsPendingApproval')}
                      </div>
                    )}
                  </div>

                  {uploadSuccessCarId === car.id && (
                    <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-1 animate-slide-in">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-xs font-medium text-green-800">{t('carRegisDocs.uploadSuccess')}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <div className="grid grid-cols-3 md:grid-cols-7 gap-4 flex-1">
              <div>
                <p className="text-xs text-gray-500 mb-1">{t('carRegisDocs.licensePlate')}</p>
                <p className="text-sm font-medium text-gray-900">{car.licensePlate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">{t('carRegisDocs.seats')}</p>
                <p className="text-sm font-medium text-gray-900">{car.seats}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">{t('carRegisDocs.yearOfManufacture')}</p>
                <p className="text-sm font-medium text-gray-900">{car.yearofManufacture}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">{t('carRegisDocs.transmission')}</p>
                <p className="text-sm font-medium text-gray-900">{car.transmission}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">{t('carRegisDocs.fuelType')}</p>
                <p className="text-sm font-medium text-gray-900">{car.fuelType}</p>
              </div>
              {car.preferredLot && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('carRegisDocs.preferredLot')}</p>
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
                  title={t('carRegisDocs.uploadDocuments')}
                >
                  {uploadingCarId === car.id ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t('carRegisDocs.uploading')}
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      {t('carRegisDocs.uploadDocuments')}
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;