import { useState } from 'react';

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all'); // all, payout, payment
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data for payments and payouts
  const payments = [
    {
      id: 1,
      transactionId: 'TXN001',
      type: 'payout',
      bookingId: 'BK001',
      carName: 'Tesla Model 3',
      customer: 'Alice Cooper',
      amount: 356.40, // After 10% platform fee
      grossAmount: 396.00,
      fee: 39.60,
      feePercentage: 10,
      date: '2024-10-06',
      status: 'completed',
      paymentMethod: 'Bank Transfer',
      accountLast4: '1234',
      description: 'Payout for booking BK001',
      notes: 'Payment processed successfully'
    },
    {
      id: 2,
      transactionId: 'TXN002',
      type: 'payout',
      bookingId: 'BK002',
      carName: 'BMW X5',
      customer: 'Bob Johnson',
      amount: 279.00,
      grossAmount: 310.00,
      fee: 31.00,
      feePercentage: 10,
      date: '2024-10-05',
      status: 'completed',
      paymentMethod: 'Bank Transfer',
      accountLast4: '1234',
      description: 'Payout for booking BK002',
      notes: 'Payment processed successfully'
    },
    {
      id: 3,
      transactionId: 'TXN003',
      type: 'payout',
      bookingId: 'BK003',
      carName: 'Honda Civic',
      customer: 'Carol Smith',
      amount: 64.80,
      grossAmount: 72.00,
      fee: 7.20,
      feePercentage: 10,
      date: '2024-10-04',
      status: 'pending',
      paymentMethod: 'Bank Transfer',
      accountLast4: '1234',
      description: 'Payout for booking BK003',
      notes: 'Processing...'
    },
    {
      id: 4,
      transactionId: 'TXN004',
      type: 'payout',
      bookingId: 'BK004',
      carName: 'Mercedes C-Class',
      customer: 'David Wilson',
      amount: 652.50,
      grossAmount: 725.00,
      fee: 72.50,
      feePercentage: 10,
      date: '2024-10-03',
      status: 'completed',
      paymentMethod: 'Bank Transfer',
      accountLast4: '1234',
      description: 'Payout for booking BK004',
      notes: 'Payment processed successfully'
    },
    {
      id: 5,
      transactionId: 'TXN005',
      type: 'payment',
      bookingId: 'BK005',
      carName: 'Toyota Camry',
      customer: 'Eva Brown',
      amount: 160.00,
      grossAmount: 160.00,
      fee: 0.00,
      feePercentage: 0,
      date: '2024-10-02',
      status: 'completed',
      paymentMethod: 'Credit Card',
      accountLast4: '5678',
      description: 'Customer payment for booking BK005',
      notes: 'Payment received'
    },
    {
      id: 6,
      transactionId: 'TXN006',
      type: 'payout',
      bookingId: 'BK006',
      carName: 'Tesla Model 3',
      customer: 'Frank Miller',
      amount: 445.50,
      grossAmount: 495.00,
      fee: 49.50,
      feePercentage: 10,
      date: '2024-10-01',
      status: 'completed',
      paymentMethod: 'Bank Transfer',
      accountLast4: '1234',
      description: 'Payout for booking BK006',
      notes: 'Payment processed successfully'
    },
    {
      id: 7,
      transactionId: 'TXN007',
      type: 'payout',
      bookingId: 'BK007',
      carName: 'BMW X5',
      customer: 'Grace Lee',
      amount: 558.00,
      grossAmount: 620.00,
      fee: 62.00,
      feePercentage: 10,
      date: '2024-09-30',
      status: 'failed',
      paymentMethod: 'Bank Transfer',
      accountLast4: '1234',
      description: 'Payout for booking BK007',
      notes: 'Payment failed due to insufficient account details'
    }
  ];

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'processing':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getTypeBadge = (type) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (type) {
      case 'payout':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'payment':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const openModal = (payment) => {
    setSelectedPayment(payment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPayment(null);
  };

  const handleRequestPayout = () => {
    // Handle request payout logic
    console.log('Requesting payout...');
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.carName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesType = typeFilter === 'all' || payment.type === typeFilter;
    
    // Date filter logic
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const paymentDate = new Date(payment.date);
      const now = new Date();
      switch (dateFilter) {
        case 'week':
          matchesDate = paymentDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          matchesDate = paymentDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'quarter':
          matchesDate = paymentDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          matchesDate = true;
      }
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  // Calculate statistics
  const totalPayouts = payments.filter(p => p.type === 'payout' && p.status === 'completed').reduce((sum, p) => sum + p.amount, 0);
  const pendingPayouts = payments.filter(p => p.type === 'payout' && p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const totalFees = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.fee, 0);
  const thisMonthPayouts = payments.filter(p => {
    const paymentDate = new Date(p.date);
    const now = new Date();
    return p.type === 'payout' && p.status === 'completed' && paymentDate >= new Date(now.getFullYear(), now.getMonth(), 1);
  }).reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="p-8 space-y-6 min-h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600">View and manage payouts and payments</p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={handleRequestPayout}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Request Payout
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Payouts</p>
              <p className="text-2xl font-bold text-green-600">${totalPayouts.toLocaleString()}</p>
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
              <p className="text-sm text-gray-600">Pending Payouts</p>
              <p className="text-2xl font-bold text-yellow-600">${pendingPayouts.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Fees</p>
              <p className="text-2xl font-bold text-red-600">${totalFees.toLocaleString()}</p>
            </div>
            <div className="bg-red-100 rounded-full p-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2m3-4h-8m0 0l3-3m-3 3l3 3" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-blue-600">${thisMonthPayouts.toLocaleString()}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
                placeholder="Search by transaction ID, booking ID, or customer"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="payout">Payouts</option>
              <option value="payment">Payments</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
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
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredPayments.length} of {payments.length} transactions
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Transaction ID</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Type</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Booking</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Car & Customer</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Gross Amount</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Fee</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Net Amount</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Date</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900 text-sm">{payment.transactionId}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={getTypeBadge(payment.type)}>
                      {payment.type}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{payment.bookingId}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{payment.carName}</div>
                    <div className="text-xs text-gray-500">{payment.customer}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-medium text-gray-900">${payment.grossAmount.toFixed(2)}</div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-600">${payment.fee.toFixed(2)}</div>
                    {payment.feePercentage > 0 && (
                      <div className="text-xs text-gray-500">({payment.feePercentage}%)</div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className={`text-sm font-bold ${payment.type === 'payout' ? 'text-green-600' : 'text-purple-600'}`}>
                      ${payment.amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm text-gray-900">{payment.date}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={getStatusBadge(payment.status)}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => openModal(payment)}
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

      {/* Modal for payment details */}
      {isModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Transaction Details - {selectedPayment.transactionId}</h2>
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
              {/* Transaction Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Transaction Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Transaction ID</p>
                    <p className="font-medium text-gray-900">{selectedPayment.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Type</p>
                    <span className={getTypeBadge(selectedPayment.type)}>
                      {selectedPayment.type}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <span className={getStatusBadge(selectedPayment.status)}>
                      {selectedPayment.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-600">Date</p>
                    <p className="font-medium text-gray-900">{selectedPayment.date}</p>
                  </div>
                </div>
              </div>

              {/* Booking Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Booking Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Booking ID</p>
                    <p className="font-medium text-gray-900">{selectedPayment.bookingId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Car</p>
                    <p className="font-medium text-gray-900">{selectedPayment.carName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Customer</p>
                    <p className="font-medium text-gray-900">{selectedPayment.customer}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Description</p>
                    <p className="font-medium text-gray-900">{selectedPayment.description}</p>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                <h3 className="font-semibold text-gray-900 mb-3">Financial Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Gross Amount</span>
                    <span className="font-medium text-gray-900">${selectedPayment.grossAmount.toFixed(2)}</span>
                  </div>
                  {selectedPayment.fee > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        Platform Fee ({selectedPayment.feePercentage}%)
                      </span>
                      <span className="font-medium text-red-600">-${selectedPayment.fee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-green-300 pt-3 flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Net Amount</span>
                    <span className={`text-xl font-bold ${selectedPayment.type === 'payout' ? 'text-green-600' : 'text-purple-600'}`}>
                      ${selectedPayment.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Method</p>
                    <p className="font-medium text-gray-900">{selectedPayment.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Account</p>
                    <p className="font-medium text-gray-900">****{selectedPayment.accountLast4}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedPayment.notes && (
                <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                  <h3 className="font-semibold text-gray-900 mb-2">Notes</h3>
                  <p className="text-sm text-gray-700">{selectedPayment.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
                {selectedPayment.status === 'failed' && (
                  <button
                    onClick={() => console.log('Retry payment:', selectedPayment.id)}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Retry Payment
                  </button>
                )}
                <button
                  onClick={() => console.log('Download receipt:', selectedPayment.id)}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Download Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;

