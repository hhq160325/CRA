import { useState, useEffect } from 'react';
import { axiosInstance } from '../../../shared/utils/axiosInstance';
import { BOOKING_ENDPOINTS, CAR_ENDPOINTS, USER_ENDPOINTS, INVOICE_ENDPOINTS, PAYMENT_ENDPOINTS } from '../../../config/api';

const RentalHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [carFilter, setCarFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
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

      // Fetch all bookings
      const bookingsResponse = await axiosInstance.get(BOOKING_ENDPOINTS.GET_ALL_BOOKINGS);
      const bookings = bookingsResponse.data || [];

      // Fetch all cars, users, and payments to enrich booking data
      const [carsResponse, usersResponse, paymentsResponse] = await Promise.all([
        axiosInstance.get(CAR_ENDPOINTS.GET_ALL_CARS),
        axiosInstance.get(USER_ENDPOINTS.GET_ALL_USERS),
        axiosInstance.get(PAYMENT_ENDPOINTS.GET_ALL_PAYMENTS)
      ]);

      const cars = carsResponse.data || [];
      const users = usersResponse.data || [];
      const payments = paymentsResponse.data || [];

      // Debug: Log all users data
      // console.log('All Users Response:', users);
      // console.log('All Bookings Response:', bookings);

      // Create lookup maps
      const carMap = cars.reduce((acc, car) => {
        acc[car.id] = car;
        return acc;
      }, {});

      const userMap = users.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {});
      console.log("UserMaps",userMap);
      
      // Create payment lookup map by invoiceId
      const paymentMap = payments.reduce((acc, payment) => {
        acc[payment.invoiceId] = payment;
        return acc;
      }, {});

      // Fetch invoice details for each booking
      const enrichedBookings = await Promise.all(
        bookings.map(async (booking, index) => {
          const car = carMap[booking.carId] || {};
          // Try to find user by userId or customerId
          const user = userMap[booking.userId] || userMap[booking.customerId] || {};
          console.log("CompareUser",userMap[booking.userId] );
          
          // Debug logging
          if (!user.fullName && booking.userId) {
            console.log('User not found for booking:', {
              bookingId: booking.id,
              userId: booking.userId,
              customerId: booking.customerId,
              availableUserIds: Object.keys(userMap),
              bookingData: booking
            });
          }
          
          const payment = paymentMap[booking.invoiceId] || null;
          
          let invoiceData = null;
          if (booking.invoiceId) {
            try {
              const invoiceResponse = await axiosInstance.get(INVOICE_ENDPOINTS.GET_INVOICE_BY_ID(booking.invoiceId));
              invoiceData = invoiceResponse.data;
            } catch (err) {
              console.error(`Error fetching invoice ${booking.invoiceId}:`, err);
            }
          }

          // Calculate duration in days
          const pickupDate = new Date(booking.pickupTime);
          const dropoffDate = new Date(booking.dropoffTime);
          const duration = Math.ceil((dropoffDate - pickupDate) / (1000 * 60 * 60 * 24));

          return {
            id: index + 1,
            bookingId: booking.id.substring(0, 8).toUpperCase(),
            carName: car.model || 'Unknown Car',
            carId: booking.carId,
            licensePlate: car.licensePlate || 'N/A',
            customer: user.fullname || booking.customerName || booking.fullName || 'Unknown Customer',
            customerEmail: user.email || booking.customerEmail || 'N/A',
            customerPhone: user.phoneNumber || booking.customerPhone || 'N/A',
            startDate: pickupDate.toISOString().split('T')[0],
            endDate: dropoffDate.toISOString().split('T')[0],
            pickupDate: pickupDate.toLocaleString(),
            returnDate: dropoffDate.toLocaleString(),
            duration: duration,
            totalAmount: invoiceData?.totalAmount || 0,
            dailyRate: invoiceData?.totalAmount ? Math.round(invoiceData.totalAmount / duration) : 0,
            paymentStatus: payment?.status?.toLowerCase() || 'pending',
            status: booking.status.toLowerCase(),
            // Payment details from PayOS
            paidAmount: payment?.paidAmount || 0,
            paymentMethod: payment?.paymentMethod || 'N/A',
            paymentItem: payment?.item || 'N/A',
            invoiceId: booking.invoiceId,
            mileageAtPickup: 0,
            mileageAtReturn: 0,
            mileageUsed: 0,
            conditionAtPickup: 'N/A',
            conditionAtReturn: 'N/A',
            notes: '',
            rating: 0,
            feedback: ''
          };
        })
      );

      setRentalHistory(enrichedBookings);
    } catch (err) {
      console.error('Error fetching rental history:', err);
      setError('Failed to load rental history. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Mock data for rental history (keeping as fallback)
  /* const mockRentalHistory = [
    {
      id: 1,
      bookingId: 'BK001',
      carName: 'Tesla Model 3',
      carId: 'C001',
      licensePlate: 'ABC-1234',
      customer: 'Alice Cooper',
      customerEmail: 'alice.cooper@email.com',
      customerPhone: '+1 (555) 111-2222',
      startDate: '2024-10-01',
      endDate: '2024-10-05',
      pickupDate: '2024-10-01 10:00',
      returnDate: '2024-10-05 14:30',
      duration: 4,
      totalAmount: 396,
      dailyRate: 99,
      paymentStatus: 'paid',
      status: 'completed',
      mileageAtPickup: 17500,
      mileageAtReturn: 18200,
      mileageUsed: 700,
      conditionAtPickup: 'excellent',
      conditionAtReturn: 'excellent',
      notes: 'Customer was very careful with the car. No issues reported.',
      rating: 5,
      feedback: 'Great experience, very satisfied'
    },
    {
      id: 2,
      bookingId: 'BK002',
      carName: 'BMW X5',
      carId: 'C002',
      licensePlate: 'XYZ-5678',
      customer: 'Bob Johnson',
      customerEmail: 'bob.johnson@email.com',
      customerPhone: '+1 (555) 222-3333',
      startDate: '2024-09-25',
      endDate: '2024-09-30',
      pickupDate: '2024-09-25 09:00',
      returnDate: '2024-09-30 16:00',
      duration: 5,
      totalAmount: 775,
      dailyRate: 155,
      paymentStatus: 'paid',
      status: 'completed',
      mileageAtPickup: 28200,
      mileageAtReturn: 28950,
      mileageUsed: 750,
      conditionAtPickup: 'excellent',
      conditionAtReturn: 'good',
      notes: 'Minor scratch on rear bumper. Customer reported and accepted responsibility.',
      rating: 4,
      feedback: 'Nice car, had a great trip'
    },
    {
      id: 3,
      bookingId: 'BK003',
      carName: 'Honda Civic',
      carId: 'C003',
      licensePlate: 'DEF-9012',
      customer: 'Carol Smith',
      customerEmail: 'carol.smith@email.com',
      customerPhone: '+1 (555) 333-4444',
      startDate: '2024-09-20',
      endDate: '2024-09-23',
      pickupDate: '2024-09-20 11:00',
      returnDate: '2024-09-23 13:00',
      duration: 3,
      totalAmount: 216,
      dailyRate: 72,
      paymentStatus: 'paid',
      status: 'completed',
      mileageAtPickup: 8500,
      mileageAtReturn: 8900,
      mileageUsed: 400,
      conditionAtPickup: 'excellent',
      conditionAtReturn: 'excellent',
      notes: 'Perfect condition, no issues.',
      rating: 5,
      feedback: 'Clean and fuel efficient car'
    },
    {
      id: 4,
      bookingId: 'BK004',
      carName: 'Mercedes C-Class',
      carId: 'C004',
      licensePlate: 'GHI-3456',
      customer: 'David Wilson',
      customerEmail: 'david.wilson@email.com',
      customerPhone: '+1 (555) 444-5555',
      startDate: '2024-09-15',
      endDate: '2024-09-18',
      pickupDate: '2024-09-15 08:30',
      returnDate: '2024-09-18 17:00',
      duration: 3,
      totalAmount: 435,
      dailyRate: 145,
      paymentStatus: 'paid',
      status: 'completed',
      mileageAtPickup: 30800,
      mileageAtReturn: 31200,
      mileageUsed: 400,
      conditionAtPickup: 'excellent',
      conditionAtReturn: 'excellent',
      notes: 'Excellent customer, very professional.',
      rating: 5,
      feedback: 'Luxury car experience, highly recommend'
    },
    {
      id: 5,
      bookingId: 'BK005',
      carName: 'Toyota Camry',
      carId: 'C005',
      licensePlate: 'JKL-7890',
      customer: 'Eva Brown',
      customerEmail: 'eva.brown@email.com',
      customerPhone: '+1 (555) 555-6666',
      startDate: '2024-09-10',
      endDate: '2024-09-12',
      pickupDate: '2024-09-10 10:00',
      returnDate: '2024-09-12 15:30',
      duration: 2,
      totalAmount: 160,
      dailyRate: 80,
      paymentStatus: 'paid',
      status: 'completed',
      mileageAtPickup: 14200,
      mileageAtReturn: 14500,
      mileageUsed: 300,
      conditionAtPickup: 'excellent',
      conditionAtReturn: 'excellent',
      notes: 'Car returned in perfect condition.',
      rating: 5,
      feedback: 'Reliable and comfortable car'
    },
    {
      id: 6,
      bookingId: 'BK006',
      carName: 'Tesla Model 3',
      carId: 'C001',
      licensePlate: 'ABC-1234',
      customer: 'Frank Miller',
      customerEmail: 'frank.miller@email.com',
      customerPhone: '+1 (555) 666-7777',
      startDate: '2024-08-28',
      endDate: '2024-09-02',
      pickupDate: '2024-08-28 12:00',
      returnDate: '2024-09-02 18:00',
      duration: 5,
      totalAmount: 495,
      dailyRate: 99,
      paymentStatus: 'paid',
      status: 'completed',
      mileageAtPickup: 16800,
      mileageAtReturn: 17500,
      mileageUsed: 700,
      conditionAtPickup: 'excellent',
      conditionAtReturn: 'excellent',
      notes: 'Long trip, car handled well.',
      rating: 5,
      feedback: 'Electric car saves a lot on fuel'
    },
    {
      id: 7,
      bookingId: 'BK007',
      carName: 'BMW X5',
      carId: 'C002',
      licensePlate: 'XYZ-5678',
      customer: 'Grace Lee',
      customerEmail: 'grace.lee@email.com',
      customerPhone: '+1 (555) 777-8888',
      startDate: '2024-08-20',
      endDate: '2024-08-24',
      pickupDate: '2024-08-20 09:00',
      returnDate: '2024-08-24 14:00',
      duration: 4,
      totalAmount: 620,
      dailyRate: 155,
      paymentStatus: 'paid',
      status: 'completed',
      mileageAtPickup: 27600,
      mileageAtReturn: 28200,
      mileageUsed: 600,
      conditionAtPickup: 'excellent',
      conditionAtReturn: 'excellent',
      notes: 'Customer was very satisfied.',
      rating: 5,
      feedback: 'Spacious and comfortable SUV'
    }
  ]; */

  // Get unique car names for filter
  const uniqueCars = [...new Set(rentalHistory.map(rental => rental.carName))];

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'active':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'cancelled':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'overdue':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getPaymentBadge = (status) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'paid':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'refunded':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'failed':
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // const getConditionBadge = (condition) => {
  //   const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
  //   switch (condition) {
  //     case 'excellent':
  //       return `${baseClasses} bg-green-100 text-green-800`;
  //     case 'good':
  //       return `${baseClasses} bg-blue-100 text-blue-800`;
  //     case 'fair':
  //       return `${baseClasses} bg-yellow-100 text-yellow-800`;
  //     case 'poor':
  //       return `${baseClasses} bg-red-100 text-red-800`;
  //     default:
  //       return `${baseClasses} bg-gray-100 text-gray-800`;
  //   }
  // };

  const openModal = (rental) => {
    setSelectedRental(rental);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRental(null);
  };

  const filteredRentals = rentalHistory.filter(rental => {
    const matchesSearch = rental.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rental.licensePlate.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rental.status === statusFilter;
    const matchesCar = carFilter === 'all' || rental.carName === carFilter;
    
    
    // Date filter logic
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const rentalDate = new Date(rental.startDate);
      const now = new Date();
      switch (dateFilter) {
        case 'week':
          matchesDate = rentalDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          matchesDate = rentalDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'quarter':
          matchesDate = rentalDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case 'year':
          matchesDate = rentalDate >= new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
        default:
          matchesDate = true;
      }
    }
    
    return matchesSearch && matchesStatus && matchesCar && matchesDate;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredRentals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedRentals = filteredRentals.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, carFilter, dateFilter]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  // console.log("FilterRentals",filteredRentals);
  // Calculate statistics
  const totalRevenue = rentalHistory.reduce((sum, rental) => sum + rental.totalAmount, 0);
  const totalRentals = rentalHistory.length;
  const averageRating = (rentalHistory.reduce((sum, rental) => sum + rental.rating, 0) / totalRentals).toFixed(1);
  const totalMileage = rentalHistory.reduce((sum, rental) => sum + rental.mileageUsed, 0);

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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Rentals</p>
              <p className="text-2xl font-bold text-blue-600">{totalRentals}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-yellow-600">{averageRating} ⭐</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Mileage</p>
              <p className="text-2xl font-bold text-purple-600">{(totalMileage / 1000).toFixed(1)}k km</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by booking ID, customer, or car"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>
            <select
              value={carFilter}
              onChange={(e) => setCarFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Cars</option>
              {uniqueCars.map((car) => (
                <option key={car} value={car}>{car}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="active">Active</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Dates</option>
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredRentals.length} of {rentalHistory.length} rentals
          </div>
        </div>
      </div>

      {/* Rental History Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Booking ID</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Car Information</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Customer</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Rental Period</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Duration</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Amount</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Payment Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedRentals.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-8 text-center text-gray-500">
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
                    {/* <div className="text-xs text-gray-500">${rental.dailyRate}/day</div> */} {/* TODO */}
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900 text-sm">${rental.paidAmount.toLocaleString()}</div>
                    {/* <div className="text-xs text-gray-500">Paid: ${rental.paidAmount.toLocaleString()}</div> */}
                  </td>
                  <td className="py-4 px-6">
                    <span className={getPaymentBadge(rental.paymentStatus)}>
                      {rental.paymentStatus}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">Payment Method: {rental.paymentMethod}</div>
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
        <div className="flex items-center justify-between py-4 px-6 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {filteredRentals.length > 0 ? (
              <>Showing {startIndex + 1} to {Math.min(endIndex, filteredRentals.length)} of {filteredRentals.length} results</>
            ) : (
              <>No results</>
            )}
          </div>
          {totalPages > 0 && (
            <div className="flex items-center space-x-2">
              <button 
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === 1 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Previous
              </button>
              <div className="flex space-x-1">
                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="w-8 h-8 flex items-center justify-center text-gray-500">
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`w-8 h-8 text-sm rounded ${
                        currentPage === page
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  )
                ))}
              </div>
              <button 
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === totalPages 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal for detailed rental view */}
      {isModalOpen && selectedRental && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Rental Details - {selectedRental.bookingId}</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Car & Customer Info */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Car Information</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600">Car Name</p>
                      <p className="font-medium text-gray-900">{selectedRental.carName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">License Plate</p>
                      <p className="font-medium text-gray-900">{selectedRental.licensePlate}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Car ID</p>
                      <p className="font-medium text-gray-900">{selectedRental.carId}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600">Name</p>
                      <p className="font-medium text-gray-900">{selectedRental.customer}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Email</p>
                      <p className="font-medium text-gray-900">{selectedRental.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Phone</p>
                      <p className="font-medium text-gray-900">{selectedRental.customerPhone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Rental Period */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Rental Period</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Start Date</p>
                    <p className="font-medium text-gray-900">{selectedRental.startDate}</p>
                    <p className="text-xs text-gray-500">Pickup: {selectedRental.pickupDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">End Date</p>
                    <p className="font-medium text-gray-900">{selectedRental.endDate}</p>
                    <p className="text-xs text-gray-500">Return: {selectedRental.returnDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Duration</p>
                    <p className="font-medium text-gray-900">{selectedRental.duration} days</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Daily Rate</p>
                    <p className="font-medium text-gray-900">${selectedRental.dailyRate}/day</p>
                  </div>
                </div>
              </div>

              {/* Financial Info */}
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Financial Information</h3>
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-600">Total Amount</p>
                      <p className="text-xl font-bold text-green-600">${selectedRental.paidAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Paid Amount</p>
                      <p className="text-lg font-semibold text-green-700">${selectedRental.paidAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-gray-600">Payment Status</p>
                      <span className={getPaymentBadge(selectedRental.paymentStatus)}>
                        {selectedRental.paymentStatus}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-600">Payment Method</p>
                      <p className="font-medium text-gray-900">{selectedRental.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Payment Item</p>
                      <p className="font-medium text-gray-900">{selectedRental.paymentItem}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Status */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Booking Status</h3>
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-gray-600 text-sm">Status</p>
                    <span className={getStatusBadge(selectedRental.status)}>
                      {selectedRental.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Additional Information</h3>
                <div className="text-sm text-gray-600">
                  <p>Booking created: {new Date(selectedRental.pickupDate).toLocaleDateString()}</p>
                  <p className="mt-2 text-gray-500 italic">Note: Mileage, condition, and rating data will be available after the rental is completed.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalHistory;

