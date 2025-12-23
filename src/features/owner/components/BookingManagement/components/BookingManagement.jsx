import { useTranslation } from 'react-i18next';
import { useBookingData } from '../hooks/useBookingData';
import { useBookingFilters } from '../hooks/useBookingFilters';
import { exportBookingsToCSV } from '../utils/exportUtils';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
import NotFoundState from './NotFoundState';
import BookingFilters from './BookingFilters';
import BookingTable from './BookingTable';
import Pagination from '../../../../../shared/components/Pagination';

const BookingManagement = () => {
  const { t } = useTranslation();
  
  // Custom hooks for data management
  const { bookings, loading, error } = useBookingData();
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    currentPage,
    setCurrentPage,
    filteredBookings,
    paginatedBookings,
    itemsPerPage
  } = useBookingFilters(bookings);

  // Handle export functionality
  const handleExport = () => {
    if (filteredBookings.length === 0) {
      console.warn('No bookings to export');
      return;
    }

    const success = exportBookingsToCSV(filteredBookings, t);
    if (success) {
      // You could add a toast notification here if needed
      console.log(`Successfully exported ${filteredBookings.length} bookings`);
    } else {
      console.error('Failed to export bookings');
    }
  };
  
  return (
    <div className="p-8 space-y-6 min-h-full bg-gray-50">
      {/* Loading State */}
      {loading && <LoadingState />}

      {/* Error State */}
      {error && <ErrorState error={error} />}

      {/* Main Content */}
      {!loading && (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{t('bookingManagement.title')}</h1>
              <p className="text-gray-600">{t('bookingManagement.subtitle')}</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={handleExport}
                disabled={filteredBookings.length === 0}
                className={`px-4 py-2 rounded-lg transition-colors  ${
                  filteredBookings.length === 0
                    ? 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
                title={filteredBookings.length === 0 ? 'No bookings to export' : `Export ${filteredBookings.length} bookings`}
              >
                {t('bookingManagement.exportReport')}
              </button>
            </div>
          </div>

          {/* Filters */}
          <BookingFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            filteredCount={filteredBookings.length}
            totalCount={bookings.length}
          />

          {/* Bookings Table or Not Found State */}
          {filteredBookings.length === 0 && (searchTerm || statusFilter !== 'all') ? (
            <NotFoundState 
              message={t('bookingManagement.noBookingsFound')}
              description={t('bookingManagement.noBookingsMatchingFilters')}
            />
          ) : (
            <>
              <BookingTable bookings={paginatedBookings} />
              
              {/* Pagination */}
              {filteredBookings.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredBookings.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default BookingManagement;

