import { useTranslation } from 'react-i18next';
import { useBookingData } from '../hooks/useBookingData';
import { useBookingFilters } from '../hooks/useBookingFilters';
import LoadingState from './LoadingState';
import ErrorState from './ErrorState';
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
              <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
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

          {/* Bookings Table */}
          <BookingTable bookings={paginatedBookings} />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalItems={filteredBookings.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default BookingManagement;

