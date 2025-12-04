import { useState, useEffect, useMemo } from 'react';
import { axiosInstance } from '../../../shared/utils/axiosInstance';
import { BOOKING_ENDPOINTS, CAR_ENDPOINTS, USER_ENDPOINTS, INVOICE_ENDPOINTS, PAYMENT_ENDPOINTS, FEEDBACK_ENDPOINTS } from '../../../config/api';
import RentalDetailsModal from './modal/RentalDetailsModal';
import { getUserIdFromToken } from '../../user/api';
import DropdownTemplate from '../../../shared/components/DropdownTemplate';
import Pagination from '../../../shared/components/Pagination';
import { getStatusBadge, getPaymentBadge } from '../owner-utils/ownerStatusBadge';
import { getCarOptions, statusOptions, bookingFeeStatusOptions, rentalFeeStatusOptions } from '../owner-utils/dropdownOptions';
import { filterRentalData } from '../utils/filterUtils';

const RentalHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [carFilter, setCarFilter] = useState('all');
  const [bookingFeeStatusFilter, setBookingFeeStatusFilter] = useState('all');
  const [rentalFeeStatusFilter, setRentalFeeStatusFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedRental, setSelectedRental] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rentalHistory, setRentalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchRentalHistory();
  }, []);

  const fetchRentalHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all invoices, cars, users, and payments
      const [invoicesResponse, carsResponse, usersResponse, paymentsResponse] = await Promise.all([
        axiosInstance.get(INVOICE_ENDPOINTS.GET_ALL_INVOICES),
        axiosInstance.get(CAR_ENDPOINTS.GET_ALL_CARS),
        axiosInstance.get(USER_ENDPOINTS.GET_ALL_USERS),
        axiosInstance.get(INVOICE_ENDPOINTS.GET_ALL)
      ]);

      const allInvoices = invoicesResponse.data || [];
      const cars = carsResponse.data || [];
      const users = usersResponse.data || [];
      const payments = paymentsResponse.data || [];

      // Get logged-in user's ID (vendorId)
      const currentUserId = getUserIdFromToken();

      // Filter invoices to show only those where the current user is the vendor
      const invoices = allInvoices.filter(invoice => invoice.vendorId === currentUserId);

      // Create lookup maps
      const carMap = cars.reduce((acc, car) => {
        acc[car.id] = car;
        return acc;
      }, {});

      const userMap = users.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {});

      // Create payment lookup map by invoiceId
      // Store as array because multiple payments can exist per invoice (Booking Fee + Rental Fee)
      const paymentMap = payments.reduce((acc, payment) => {
        if (!acc[payment.invoiceId]) {
          acc[payment.invoiceId] = [];
        }
        acc[payment.invoiceId].push(payment);
        return acc;
      }, {});

      // Fetch bookings for each unique customer to get booking status
      const uniqueCustomerIds = [...new Set(invoices.map(inv => inv.customerId))];
      const bookingsResponses = await Promise.all(
        uniqueCustomerIds.map(customerId =>
          axiosInstance.get(BOOKING_ENDPOINTS.GET_CUSTOMER_BOOKINGS(customerId))
            .catch(err => {
              console.error(`Error fetching bookings for customer ${customerId}:`, err);
              return { data: [] };
            })
        )
      );

      // Create booking lookup map by invoiceId
      const bookingMap = {};
      bookingsResponses.forEach(response => {
        const bookings = response.data || [];
        bookings.forEach(booking => {
          if (booking.invoiceId) {
            bookingMap[booking.invoiceId] = booking;
          }
        });
      });

      // Helper function to extract car ID from invoice
      const extractCarIdFromInvoice = (invoice) => {
        const carRentalItem = invoice.invoiceItems?.find(item =>
          item.description?.includes('Car ID:')
        );
        const carIdMatch = carRentalItem?.description?.match(/Car ID: ([a-f0-9-]+)/i);
        return carIdMatch ? carIdMatch[1] : null;
      };

      // Process invoices to create rental history
      const enrichedBookings = invoices.map((invoice, index) => {
        const user = userMap[invoice.customerId] || {};
        const paymentsForInvoice = paymentMap[invoice.id] || [];
        const booking = bookingMap[invoice.id] || null;

        // Separate booking fee and rental fee payments
        const rentalFeePayment = paymentsForInvoice.find(p => p.item?.toLowerCase().includes('rental fee'));
        const bookingFeePayment = paymentsForInvoice.find(p => p.item?.toLowerCase().includes('booking fee'));

        // Calculate total paid amount from all payments
        const totalPaidAmount = paymentsForInvoice.reduce((sum, p) => sum + (p.paidAmount || 0), 0);
        
        // Get payment methods for each payment type
        const bookingFeePaymentMethod = bookingFeePayment?.paymentMethod || 'No Payment Method';
        const rentalFeePaymentMethod = rentalFeePayment?.paymentMethod || 'No Payment Method';

        // Check booking status for invoice item selection
        const bookingStatusRaw = booking?.status?.toLowerCase();
        const isConfirmed = bookingStatusRaw === 'confirmed';
        const isCompleted = bookingStatusRaw === 'completed';

        // Extract car ID from invoice items using helper function
        const carId = extractCarIdFromInvoice(invoice);

        // Find the appropriate invoice item based on booking status
        let carRentalItem;
        if (isCompleted) {
          carRentalItem = invoice.invoiceItems?.find(item => item.item === 'Car Rental After returned');
        } else if (isConfirmed) {
          carRentalItem = invoice.invoiceItems?.find(item => item.item === 'Booking Fees');
        } else {
          carRentalItem = invoice.invoiceItems?.find(item => item.description?.includes('Car ID:'));
        }

        // Always get daily rate from "Car Rental After returned" item
        const carRentalAfterReturnedItem = invoice.invoiceItems?.find(item => item.item === 'Car Rental After returned');
        const dailyRate = carRentalAfterReturnedItem?.unitPrice || 0;
        // Get remaining after return cars
        const remainingPayment = carRentalAfterReturnedItem?.total || 0;

        const car = carId ? (carMap[carId] || {}) : {};
        // const carFeedback = carId ? (feedbackMap[carId] || null) : null;

        // Use booking dates if available, otherwise fall back to invoice dates
        const pickupTime = booking?.pickupTime ? new Date(booking.pickupTime) : new Date(invoice.issueDate);
        const dropoffTime = booking?.dropoffTime ? new Date(booking.dropoffTime) : new Date(invoice.dueDate);
        const calculatedDuration = Math.ceil((dropoffTime - pickupTime) / (1000 * 60 * 60 * 24));

        // Get rental duration - prioritize "Car Rental After returned" quantity, then calculated duration
        const rentalDays = carRentalAfterReturnedItem?.quantity || calculatedDuration;
        
        // Determine separate payment statuses for booking fee and rental fee
        const bookingFeeStatus = bookingFeePayment?.status ? bookingFeePayment.status.toLowerCase() : 'pending';
        const rentalFeeStatus = rentalFeePayment?.status ? rentalFeePayment.status.toLowerCase() : 'pending';
        
        // Determine booking status
        const bookingStatus = booking?.status ? booking.status.toLowerCase() : 'pending';

        return {
          id: index + 1,
          bookingId: invoice.invoiceNo || invoice.id.substring(0, 8).toUpperCase(),
          carName: car.model || 'Unknown Car',
          carId: carId || 'N/A',
          licensePlate: car.licensePlate || 'N/A',
          customer: user.fullname || user.fullName || 'Unknown Customer',
          customerEmail: user.email || 'N/A',
          customerPhone: user.phoneNumber || 'N/A',
          startDate: pickupTime.toISOString().split('T')[0],
          endDate: dropoffTime.toISOString().split('T')[0],
          pickupDate: pickupTime.toLocaleString(),
          returnDate: dropoffTime.toLocaleString(),
          duration: rentalDays,
          totalAmount: invoice.grandTotal || invoice.subTotal || 0,
          dailyRate: dailyRate,
          remainingPayment: remainingPayment,
          bookingFeeStatus: bookingFeeStatus,
          rentalFeeStatus: rentalFeeStatus,
          status: bookingStatus,
          // Payment details from PayOS
          bookingFeePaid: bookingFeePayment?.paidAmount || 0,
          rentalFeePaid: rentalFeePayment?.paidAmount || 0,
          totalPaidAmount: totalPaidAmount,
          bookingFeePaymentMethod: bookingFeePaymentMethod,
          rentalFeePaymentMethod: rentalFeePaymentMethod,
          paymentMethod: bookingFeePaymentMethod || rentalFeePaymentMethod || 'No Payment Method',
          invoiceId: invoice.id,
          invoiceItems: invoice.invoiceItems || [],
          notes: invoice.note || '',
        };
      });

      setRentalHistory(enrichedBookings);
    } catch (err) {
      console.error('Error fetching rental history:', err);
      setError('Failed to load rental history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Get unique car names for filter
  const uniqueCars = [...new Set(rentalHistory.map(rental => rental.carName))].sort();

  // Prepare dropdown options
  const carOptions = getCarOptions(uniqueCars);

  const openModal = (rental) => {
    setSelectedRental(rental);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRental(null);
  };

  const filteredRentals = useMemo(() => {
    return rentalHistory.filter(rental => 
      filterRentalData(rental, {
        searchTerm,
        statusFilter,
        carFilter,
        bookingFeeStatusFilter,
        rentalFeeStatusFilter,
        startDate,
        endDate,
      })
    );
  }, [rentalHistory, searchTerm, statusFilter, carFilter, bookingFeeStatusFilter, rentalFeeStatusFilter, startDate, endDate]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredRentals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRentals = filteredRentals.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, carFilter, bookingFeeStatusFilter, rentalFeeStatusFilter, startDate, endDate]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // console.log("FilterRentals",filteredRentals);
  // Calculate statistics
  const totalRevenue = rentalHistory
    .filter(rental => rental.status === 'confirmed' || rental.status === 'completed')
    .reduce((sum, rental) => sum + rental.paidAmount, 0);
  const totalRentals = rentalHistory.length;
  const averageRating = (rentalHistory.reduce((sum, rental) => sum + rental.rating, 0) / totalRentals).toFixed(1);
  const totalMileage = rentalHistory.reduce((sum, rental) => sum + rental.mileageUsed, 0);

  // Format currency to VND
  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-full bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading rental history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 min-h-full bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-800 font-medium">{error}</p>
          <button
            onClick={fetchRentalHistory}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-8 space-y-6 min-h-full bg-gray-50">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Rental History</h1>
            <p className="text-gray-600">Browse historical rentals, filter by car and date</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Export Report
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by customer, or car"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  />
                </div>
                
                <div className="w-full sm:w-auto sm:min-w-[180px]">
                  <DropdownTemplate
                    value={carFilter}
                    onChange={(option) => setCarFilter(option.value)}
                    options={carOptions}
                    placeholder="All Cars"
                    searchable={true}
                    searchPlaceholder="Search cars..."
                  />
                </div>
                
                <div className="w-full sm:w-auto sm:min-w-[140px]">
                  <DropdownTemplate
                    value={statusFilter}
                    onChange={(option) => setStatusFilter(option.value)}
                    options={statusOptions}
                    placeholder="All Status"
                    searchable={false}
                  />
                </div>
                
                <div className="w-full sm:w-auto sm:min-w-[180px]">
                  <DropdownTemplate
                    value={bookingFeeStatusFilter}
                    onChange={(option) => setBookingFeeStatusFilter(option.value)}
                    options={bookingFeeStatusOptions}
                    placeholder="Booking Fee Status"
                    searchable={false}
                  />
                </div>
                
                <div className="w-full sm:w-auto sm:min-w-[180px]">
                  <DropdownTemplate
                    value={rentalFeeStatusFilter}
                    onChange={(option) => setRentalFeeStatusFilter(option.value)}
                    options={rentalFeeStatusOptions}
                    placeholder="Rental Fee Status"
                    searchable={false}
                  />
                </div>
              </div>
              
              <div className="text-sm text-gray-600 whitespace-nowrap">
                Showing {filteredRentals.length} of {rentalHistory.length} rentals
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center pt-2 border-t border-gray-100">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Date Range:</label>
              <div className="flex flex-col sm:flex-row gap-3 flex-1">
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 whitespace-nowrap">From:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600 whitespace-nowrap">To:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                {(startDate || endDate) && (
                  <button
                    onClick={() => {
                      setStartDate('');
                      setEndDate('');
                    }}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Clear Dates
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Rental History Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Invoice ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Car Information</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Customer</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Rental Period</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Duration</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Amount</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Booking Fee Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Rental Fee Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Booking Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedRentals.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="py-8 text-center text-gray-500">
                      No rental history found
                    </td>
                  </tr>
                ) : (
                  paginatedRentals.map((rental) => (
                    <tr key={rental.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900 text-sm">{rental.bookingId}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900 text-sm">{rental.carName}</div>
                        <div className="text-xs text-gray-500">{rental.licensePlate}</div>
                        <div className="text-xs text-gray-400">{rental.carId}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900 text-sm">{rental.customer}</div>
                        <div className="text-xs text-gray-500">{rental.customerEmail}</div>
                        <div className="text-xs text-gray-400">{rental.customerPhone}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">{rental.startDate}</div>
                        <div className="text-xs text-gray-500">to {rental.endDate}</div>
                        <div className="text-xs text-gray-400">{rental.pickupDate.split(' ')[1]}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">{rental.duration} days</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900 text-sm">{formatVND(rental.totalPaidAmount)}</div>
                        <div className="text-xs text-gray-500">Booking: {formatVND(rental.bookingFeePaid)}</div>
                        <div className="text-xs text-gray-500">Rental: {formatVND(rental.rentalFeePaid)}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={getPaymentBadge(rental.bookingFeeStatus)}>
                          {rental.bookingFeeStatus}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">{formatVND(rental.bookingFeePaid)}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{rental.bookingFeePaymentMethod}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={getPaymentBadge(rental.rentalFeeStatus)}>
                          {rental.rentalFeeStatus}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">{formatVND(rental.rentalFeePaid)}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{rental.rentalFeePaymentMethod}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={getStatusBadge(rental.status)}>
                          {rental.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => openModal(rental)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalItems={filteredRentals.length}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Modal for detailed rental view */}
      <RentalDetailsModal
        isOpen={isModalOpen}
        rental={selectedRental}
        onClose={closeModal}
        getStatusBadge={getStatusBadge}
        getPaymentBadge={getPaymentBadge}
      />
    </>
  );
};

export default RentalHistory;

