import { useTranslation } from 'react-i18next';
import { useCarRegisDocs } from '../hooks/useCarRegisDocs';
import FilterTabs from './FilterTabs';
import EmptyState from './EmptyState';
import CarCard from './CarCard';
import Pagination from '../../../../../shared/components/Pagination';
import { animations } from '../utils/animations';

const CarRegisDocs = () => {
  const { t } = useTranslation();
  const {
    cars,
    loading,
    error,
    filter,
    currentPage,
    showTooltip,
    uploadingCarId,
    uploadSuccessCarId,
    filteredCars,
    currentCars,
    carsPerPage,
    setFilter,
    setCurrentPage,
    setShowTooltip,
    handleFileUpload
  } = useCarRegisDocs();

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
      <style>{animations}</style>
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('carRegisDocs.title')}</h1>
        <p className="text-gray-600">{t('carRegisDocs.subtitle')}</p>
      </div>

      <FilterTabs filter={filter} setFilter={setFilter} cars={cars} />

      {currentCars.length === 0 ? (
        <EmptyState filter={filter} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            {currentCars.map((car) => (
              <CarCard
                key={car.id}
                car={car}
                showTooltip={showTooltip}
                setShowTooltip={setShowTooltip}
                uploadingCarId={uploadingCarId}
                uploadSuccessCarId={uploadSuccessCarId}
                handleFileUpload={handleFileUpload}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalItems={filteredCars.length}
            itemsPerPage={carsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default CarRegisDocs;
