import { useState } from 'react';

const RentalHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [carFilter, setCarFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedRental, setSelectedRental] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data for rental history
  const rentalHistory = [
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
  ];

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
    switch (status) {
      case 'paid':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'refunded':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getConditionBadge = (condition) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (condition) {
      case 'excellent':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'good':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'fair':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'poor':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

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

  // Calculate statistics
  const totalRevenue = rentalHistory.reduce((sum, rental) => sum + rental.totalAmount, 0);
  const totalRentals = rentalHistory.length;
  const averageRating = (rentalHistory.reduce((sum, rental) => sum + rental.rating, 0) / totalRentals).toFixed(1);
  const totalMileage = rentalHistory.reduce((sum, rental) => sum + rental.mileageUsed, 0);

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
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Mileage</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Rating</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRentals.map((rental) => (
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
                    <div className="text-xs text-gray-500">${rental.dailyRate}/day</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900 text-sm">${rental.totalAmount}</div>
                    <span className={getPaymentBadge(rental.paymentStatus)}>
                      {rental.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{rental.mileageUsed} km</div>
                    <div className="text-xs text-gray-500">
                      {rental.mileageAtPickup.toLocaleString()} → {rental.mileageAtReturn.toLocaleString()}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-medium text-gray-900">{rental.rating}</span>
                      <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    </div>
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center py-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">Previous</button>
            <div className="flex space-x-1">
              <button className="w-8 h-8 text-sm bg-blue-600 text-white rounded">1</button>
              <button className="w-8 h-8 text-sm text-gray-600 hover:bg-gray-100 rounded">2</button>
              <button className="w-8 h-8 text-sm text-gray-600 hover:bg-gray-100 rounded">3</button>
            </div>
            <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">Next</button>
          </div>
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
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Total Amount</p>
                    <p className="text-xl font-bold text-green-600">${selectedRental.totalAmount}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Status</p>
                    <span className={getPaymentBadge(selectedRental.paymentStatus)}>
                      {selectedRental.paymentStatus}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <span className={getStatusBadge(selectedRental.status)}>
                      {selectedRental.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mileage Info */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Mileage Information</h3>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Mileage at Pickup</p>
                    <p className="font-medium text-gray-900">{selectedRental.mileageAtPickup.toLocaleString()} km</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Mileage at Return</p>
                    <p className="font-medium text-gray-900">{selectedRental.mileageAtReturn.toLocaleString()} km</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Mileage Used</p>
                    <p className="font-medium text-gray-900">{selectedRental.mileageUsed} km</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Avg. Daily Mileage</p>
                    <p className="font-medium text-gray-900">{(selectedRental.mileageUsed / selectedRental.duration).toFixed(1)} km/day</p>
                  </div>
                </div>
              </div>

              {/* Condition & Rating */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Car Condition</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <p className="text-gray-600">At Pickup</p>
                      <span className={getConditionBadge(selectedRental.conditionAtPickup)}>
                        {selectedRental.conditionAtPickup}
                      </span>
                    </div>
                    <div>
                      <p className="text-gray-600">At Return</p>
                      <span className={getConditionBadge(selectedRental.conditionAtReturn)}>
                        {selectedRental.conditionAtReturn}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Customer Rating & Feedback</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-gray-900">{selectedRental.rating}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-5 h-5 ${i < selectedRental.rating ? 'text-yellow-400' : 'text-gray-300'} fill-current`} viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    {selectedRental.feedback && (
                      <div>
                        <p className="text-gray-600">Feedback</p>
                        <p className="text-gray-900 italic">"{selectedRental.feedback}"</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedRental.notes && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                  <p className="text-sm text-gray-700">{selectedRental.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RentalHistory;

