import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { axiosInstance } from '../../../../shared/utils/axiosInstance';
import { BOOKING_ENDPOINTS, CAR_ENDPOINTS, PAYMENT_ENDPOINTS } from '../../../../config/api';
import { decodeJWT } from '../../../auth/utils';
import RHFeedbackModal from './MyProfileModal/RHFeedbackModal';
import SendInquiry from '../../../cars/components/CDRSubsComponent/SendInquiry';

const RentalHistoryPage = () => {
  const { t } = useTranslation();
  const [rentalHistory, setRentalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedCarOwner, setSelectedCarOwner] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchRentalHistory = async () => {
      try {
        setLoading(true);

        // Get userId from JWT token
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          setError('User not logged in');
          setLoading(false);
          return;
        }

        const decoded = decodeJWT(token);
        const userId = decoded ? (decoded.sub || decoded.userId || decoded.id || decoded.nameid) : null;

        if (!userId) {
          setError('Unable to get user information');
          setLoading(false);
          return;
        }

        setCurrentUserId(userId);

        // Fetch bookings for current customer
        let userBookings = [];
        try {
          const bookingsResponse = await axiosInstance.get(BOOKING_ENDPOINTS.GET_CUSTOMER_BOOKINGS(userId));
          userBookings = bookingsResponse.data;
          console.log(userBookings);
        } catch (bookingError) {
          // If 404, it means no bookings exist for this user
          if (bookingError.response?.status === 404) {
            console.log('No bookings found for user');
            setRentalHistory([]);
            setError(null);
            setLoading(false);
            return;
          }
          // For other errors, throw to be caught by outer catch
          throw bookingError;
        }

        // Fetch all cars
        const carsResponse = await axiosInstance.get(CAR_ENDPOINTS.GET_ALL_CARS);
        const allCars = carsResponse.data;

        // Fetch all payments from PayOS
        let paymentsData = [];
        try {
          const paymentsResponse = await axiosInstance.get(PAYMENT_ENDPOINTS.GET_ALL_PAYMENTS);
          paymentsData = Array.isArray(paymentsResponse.data) ? paymentsResponse.data : [];
          console.log('RentalHistory - Fetched payments:', paymentsData.length);
        } catch (paymentError) {
          console.warn('Failed to fetch payments:', paymentError.message);
        }

        // Create a map of cars for quick lookup
        const carsMap = {};
        allCars.forEach(car => {
          carsMap[car.id] = car;
        });

        // Create a map of payments by invoiceId for quick lookup
        const paymentsMap = {};
        paymentsData.forEach(payment => {
          const invoiceId = payment.invoiceId || payment.orderCode;
          if (invoiceId) {
            paymentsMap[invoiceId] = payment;
          }
        });

        // console.log('RentalHistory - Bookings invoiceIds:', userBookings.map(b => b.invoiceId));
        // console.log('RentalHistory - Payments map keys:', Object.keys(paymentsMap));

        // Combine booking, car, and payment data
        const history = userBookings
          .map((booking) => {
            const car = carsMap[booking.carId];
            const pickupDate = new Date(booking.pickupTime);

            // Get payment date from PayOS if available
            let paymentDate = 'No Payment';
            if (booking.invoiceId && paymentsMap[booking.invoiceId]) {
              const payment = paymentsMap[booking.invoiceId];
              const paymentStatus = payment.status ? String(payment.status).toLowerCase() : '';

              // console.log(`RentalHistory - Booking ${booking.id} matched payment:`, {
              //   invoiceId: booking.invoiceId,
              //   paymentStatus,
              //   createdAt: payment.createDate
              // });

              // Only show payment date if payment was successful
              if (paymentStatus === 'paid' || paymentStatus === 'success' || paymentStatus === 'completed') {
                const paidDate = payment.createDate ? new Date(payment.createDate) : null;
                if (paidDate) {
                  paymentDate = paidDate.toISOString().split('T')[0];
                }
              }
            } else {
              // console.log(`RentalHistory - Booking ${booking.id} has no matching payment. InvoiceId: ${booking.invoiceId}`);
            }

            // Use the most recent date for sorting: updateDate if newer, otherwise createDate
            const createDate = booking.createDate || booking.pickupTime;
            const updateDate = booking.updateDate;
            const sortDate = updateDate && new Date(updateDate) > new Date(createDate)
              ? updateDate
              : createDate;

            return {
              bookingId: booking.id,
              bookingNumber: booking.bookingNumber,
              carId: booking.carId,
              carOwnerId: car?.owner?.id || null,
              carName: car?.model || 'Unknown Car',
              // type: car?.model || 'N/A',
              brand: car?.manufacturer || 'N/A',
              plateNo: car?.licensePlate || 'N/A',
              rentDay: pickupDate.toISOString().split('T')[0],
              status: booking.status,
              paymentDate: paymentDate,
              sortDate: sortDate, // For sorting - most recent activity
              pickupTime: booking.pickupTime
            };
          })
          .sort((a, b) => {
            // Sort by most recent activity descending (latest first)
            const dateA = new Date(a.sortDate);
            const dateB = new Date(b.sortDate);
            return dateB - dateA;
          })
          .map((item, index) => ({
            ...item,
            id: index + 1 // Assign sequential ID after sorting
          }));

        setRentalHistory(history);
        setError(null);
      } catch (err) {
        console.error('Error fetching rental history:', err);
        setError('Failed to load rental history');
      } finally {
        setLoading(false);
      }
    };

    fetchRentalHistory();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">{t('loading') || 'Loading...'}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  // Pagination calculations
  const totalPages = Math.ceil(rentalHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = rentalHistory.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenFeedback = (rental) => {
    setSelectedBooking({
      id: rental.bookingId,
      carId: rental.carId,
      carName: rental.carName,
      brand: rental.brand,
      plateNo: rental.plateNo,
      rentDay: rental.rentDay
    });
    setIsFeedbackModalOpen(true);
  };

  const handleCloseFeedback = () => {
    setIsFeedbackModalOpen(false);
    setSelectedBooking(null);
  };

  const handleFeedbackSuccess = () => {
    // Optionally refresh the rental history or show a success message
    console.log('Feedback submitted successfully');
  };

  const handleOpenContact = (rental) => {
    if (!rental.carOwnerId) {
      console.error('Car owner ID not available');
      return;
    }
    setSelectedCarOwner({
      ownerId: rental.carOwnerId,
      bookingNumber: rental.bookingNumber,
      plateNo: rental.plateNo,
      carName: rental.carName,
      brand: rental.brand
    });
    setIsContactModalOpen(true);
  };

  const handleCloseContact = () => {
    setIsContactModalOpen(false);
    setSelectedCarOwner(null);
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h1 className="hidden lg:block text-xl font-semibold text-gray-900">{t('Rental History')}</h1>
          <h1 className="lg:hidden text-lg font-semibold text-gray-900">{t('Rental History')}</h1>
        </div>

        {rentalHistory.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {t('noRentalHistory') || 'No rental history found'}
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="lg:hidden">
              {currentItems.map((rental) => (
                <div key={rental.id} className="border-b border-gray-200 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{rental.carName}</h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      rental.status === 'Confirmed' || rental.status === 'Paid'
                        ? 'bg-green-100 text-green-800'
                        : rental.status === 'Completed'
                        ? 'bg-blue-100 text-blue-800'
                        : rental.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {rental.status === 'Confirmed' 
                        ? t('confirmed') 
                        : rental.status === 'Completed' 
                        ? t('completed') 
                        : rental.status === 'Pending'
                        ? t('pending')
                        : t('cancelled')
                      }
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    {/* <div className="flex justify-between">
                  <span>{t('type')}:</span>
                  <span>{rental.type}</span>
                </div> */}
                    <div className="flex justify-between">
                      <span>{t('brand')}:</span>
                      <span>{rental.brand}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('plateNo')}:</span>
                      <span>{rental.plateNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('rentDay')}:</span>
                      <span>{rental.rentDay}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('paymentDate')}:</span>
                      <span>{rental.paymentDate === 'No Payment' ? t('noPayment') : rental.paymentDate}</span>
                    </div>
                  </div>
                  {(rental.status === 'Confirmed' || rental.status === 'Paid') && (
                    <div className="mt-3 space-y-2">
                      <button
                        onClick={() => handleOpenFeedback(rental)}
                        className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        {t('leaveFeedback') || 'Leave Feedback'}
                      </button>
                      <button
                        onClick={() => handleOpenContact(rental)}
                        className="w-full px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {t('contact') || 'Contact'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('no')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('carName')}</th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('type')}</th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('brand')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('plateNo')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('rentDay')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('paymentDate')}</th> */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('actions') || 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((rental) => (
                    <tr key={rental.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rental.bookingNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rental.carName}</td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rental.type}</td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rental.brand}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rental.plateNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rental.rentDay}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          rental.status === 'Confirmed' || rental.status === 'Paid'
                            ? 'bg-green-100 text-green-800'
                            : rental.status === 'Completed'
                            ? 'bg-blue-100 text-blue-800'
                            : rental.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {rental.status === 'Confirmed' 
                            ? t('confirmed') 
                            : rental.status === 'Completed' 
                            ? t('completed') 
                            : rental.status === 'Pending'
                            ? t('pending')
                            : t('cancelled')
                          }
                        </span>
                      </td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{rental.paymentDate === 'No Payment' ? t('noPayment') : rental.paymentDate}</td> */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {(rental.status === 'Confirmed' || rental.status === 'Completed' || rental.status === 'Paid') && (
                          <div className="flex gap-2 grid grid-cols-1 align-center justify-items-center">
                            <button
                              onClick={() => handleOpenFeedback(rental)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                              {t('feedback') || 'Feedback'}
                            </button>
                            <button
                              onClick={() => handleOpenContact(rental)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              {t('contact') || 'Contact'}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {rentalHistory.length > 0 && (
              <div className="px-4 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {t('previous') || 'Previous'}
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                  >
                    {t('next') || 'Next'}
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      {t('showing') || 'Showing'} <span className="font-medium">{startIndex + 1}</span> {t('to') || 'to'}{' '}
                      <span className="font-medium">{Math.min(endIndex, rentalHistory.length)}</span> {t('of') || 'of'}{' '}
                      <span className="font-medium">{rentalHistory.length}</span> {t('results') || 'results'}
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${currentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        <span className="sr-only">{t('previous') || 'Previous'}</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
                              onClick={() => handlePageChange(pageNumber)}
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
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-white text-gray-500 hover:bg-gray-50'
                          }`}
                      >
                        <span className="sr-only">{t('next') || 'Next'}</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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

      {/* Feedback Modal */}
      <RHFeedbackModal
        isOpen={isFeedbackModalOpen}
        onClose={handleCloseFeedback}
        booking={selectedBooking}
        onSuccess={handleFeedbackSuccess}
      />

      {/* Contact Modal */}
      <SendInquiry
        isOpen={isContactModalOpen}
        onClose={handleCloseContact}
        carOwnerId={selectedCarOwner?.ownerId}
        currentUserId={currentUserId}
        bookingInfo={selectedCarOwner}
      />
    </div>
  );
};

export default RentalHistoryPage;