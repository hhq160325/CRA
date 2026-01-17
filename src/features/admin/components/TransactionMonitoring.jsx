import React, { useState, useEffect } from 'react';
import { fetchAllAdminData, getAllUsers } from '../adminapi/adminAPI';
import Pagination from '../../../shared/components/Pagination';
import { formatPriceWithCurrency } from '../../../shared/utils/priceFormatter';

const TransactionMonitoring = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adminData, setAdminData] = useState({
    cars: [],
    bookings: [],
    invoices: [],
    users: []
  });

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [data, users] = await Promise.all([
          fetchAllAdminData(),
          getAllUsers()
        ]);
        setAdminData({
          ...data,
          users: users || []
        });
        setError(null);
      } catch (err) {
        console.error('Error loading admin data:', err);
        setError('Failed to load transaction data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Calculate transaction stats from invoices
  const transactionStats = React.useMemo(() => {
    const invoices = adminData.invoices || [];
    const totalTransactions = invoices.length;
    const successfulTransactions = invoices.filter(inv => inv.status.toLowerCase() === 'paid' || inv.status === 'completed').length;
    const pendingTransactions = invoices.filter(inv => inv.status.toLowerCase() === 'pending').length;
    const expiredTransactions = invoices.filter(inv => inv.status.toLowerCase() === 'expired').length;
    const failedTransactions = invoices.filter(inv => inv.status.toLowerCase() === 'cancelled' || inv.status === 'cancelled').length;
    const totalAmount = invoices
      .filter(inv => inv.status.toLowerCase() === 'paid')
      .reduce((sum, inv) => sum + (parseFloat(inv.paidAmount) || 0), 0);
    const averageAmount = successfulTransactions > 0 ? totalAmount / successfulTransactions : 0;
    const complianceRate = totalTransactions > 0 ? (successfulTransactions / totalTransactions) * 100 : 0;

    return {
      totalTransactions,
      successfulTransactions,
      pendingTransactions,
      expiredTransactions,
      failedTransactions,
      totalAmount,
      averageAmount,
      complianceRate
    };
  }, [adminData.invoices]);

  // Transform invoices into transaction format
  const recentTransactions = React.useMemo(() => {
    return (adminData.invoices || []).map(invoice => {
      const booking = adminData.bookings?.find(b => b.bookingId === invoice.bookingId);
      const user = adminData.users?.find(u => u.id === invoice.userId);
      const amount = parseFloat(invoice.totalAmount) || 0;
      // console.log(user);

      // Determine risk score based on amount
      let riskScore = 'low';
      if (amount > 2000) riskScore = 'high';
      else if (amount > 1000) riskScore = 'medium';

      // Map invoice status to transaction status
      let status = 'pending';
      if (invoice.status === 'paid' || invoice.status === 'completed') status = 'completed';
      else if (invoice.status === 'failed' || invoice.status === 'cancelled') status = 'failed';
      else if (invoice.status === 'pending') status = 'pending';

      // Determine compliance status
      let complianceStatus = 'approved';
      if (status === 'failed') complianceStatus = 'flagged';
      else if (status === 'pending') complianceStatus = 'under_review';

      return {
        id: invoice.orderCode || `INV-${invoice.id}`,
        user: user?.fullname || invoice.customerName || booking?.customerName || 'Unknown User',
        email: user?.email || invoice.customerEmail || booking?.customerEmail || 'N/A',
        amount: invoice.paidAmount,
        userId: invoice.userId,
        type: 'Car Rental',
        status: invoice.status.toLowerCase(),
        items: invoice.item,
        method: invoice.paymentMethod || 'Credit Card',
        timestamp: invoice.createdAt || invoice.issueDate || new Date().toISOString(),
        riskScore: riskScore,
        complianceStatus: complianceStatus
      };
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }, [adminData.invoices, adminData.bookings, adminData.users]);

  // Generate compliance alerts from failed/flagged transactions
  const complianceAlerts = React.useMemo(() => {
    const alerts = [];
    const failedTransactions = recentTransactions.filter(t => t.status === 'failed');
    const highValueTransactions = recentTransactions.filter(t => t.amount > 2000);

    // Add alerts for failed transactions
    failedTransactions.slice(0, 2).forEach((transaction) => {
      alerts.push({
        id: alerts.length + 1,
        type: 'payment_failure',
        message: 'Payment processing failed',
        user: transaction.user,
        amount: transaction.amount,
        severity: 'medium',
        timestamp: transaction.timestamp
      });
    });

    // Add alerts for high-value transactions
    if (highValueTransactions.length > 0) {
      alerts.push({
        id: alerts.length + 1,
        type: 'high_value',
        message: 'High-value transaction detected',
        user: highValueTransactions[0].user,
        amount: highValueTransactions[0].amount,
        severity: 'high',
        timestamp: highValueTransactions[0].timestamp
      });
    }

    return alerts.slice(0, 3);
  }, [recentTransactions]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'expired': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getComplianceColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'under_review': return 'text-yellow-600 bg-yellow-100';
      case 'flagged': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50 text-red-800';
      case 'medium': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'low': return 'border-blue-200 bg-blue-50 text-blue-800';
      default: return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const filteredTransactions = recentTransactions.filter(transaction => {
    const matchesFilter = selectedFilter === 'all' || transaction.status === selectedFilter;
    const matchesSearch = transaction.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pagination logic
  const totalFilteredTransactions = filteredTransactions.length;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter, searchTerm]);

  if (loading) {
    return (
      <div className="p-8 min-h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading transaction data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 min-h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-900 font-semibold mb-2">Error Loading Data</p>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 min-h-full bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Giám sát giao dịch</h1>
          <p className="text-gray-600 mt-1">Giám sát các giao dịch tài chính và đảm bảo tuân thủ quy định</p>
        </div>
        <div className="flex space-x-4">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Export Report
          </button>
        </div>
      </div>

      {/* Transaction Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng số giao dịch</p>
              <p className="text-2xl font-bold text-blue-600">{transactionStats.totalTransactions.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Thành công</p>
              <p className="text-2xl font-bold text-green-600">{transactionStats.successfulTransactions.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đang chờ</p>
              <p className="text-2xl font-bold text-yellow-600">{transactionStats.pendingTransactions}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Đã hết hạn</p>
              <p className="text-2xl font-bold text-blue-600">{transactionStats.expiredTransactions}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Thất bại</p>
              <p className="text-2xl font-bold text-red-600">{transactionStats.failedTransactions}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tổng số tiền</p>
              <p className="text-2xl font-bold text-purple-600">{formatPriceWithCurrency(transactionStats.totalAmount)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Số tiền trung bình</p>
              <p className="text-2xl font-bold text-orange-600">{formatPriceWithCurrency(transactionStats.averageAmount)}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transaction List */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Giao dịch gần đây</h2>
                <div className="flex space-x-4">
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="completed">Đã hoàn thành</option>
                    <option value="pending">Đang chờ xử lý</option>
                    <option value="failed">Thất bại</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giao dịch</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số tiền</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rủi ro</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tuân thủ</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedTransactions.length > 0 ? (
                    paginatedTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{transaction.id}</div>
                            <div className="text-sm text-gray-500">{transaction.type}</div>
                            <div className="text-xs text-gray-400">{transaction.timestamp}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{transaction.user}</div>
                            <div className="text-sm text-gray-500">{transaction.email}</div>
                            <div className="text-xs text-gray-400">{transaction.items}{transaction.method}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{formatPriceWithCurrency(transaction.amount)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                            {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRiskColor(transaction.riskScore)}`}>
                            {transaction.riskScore.charAt(0).toUpperCase() + transaction.riskScore.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getComplianceColor(transaction.complianceStatus)}`}>
                            {transaction.complianceStatus.replace('_', ' ').charAt(0).toUpperCase() + transaction.complianceStatus.replace('_', ' ').slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                          <button className="text-gray-600 hover:text-gray-900">Details</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        No transactions found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalItems={totalFilteredTransactions}
              itemsPerPage={ITEMS_PER_PAGE}
              onPageChange={setCurrentPage}
            />
          </div>

          {/* Compliance Alerts */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Cảnh báo Tuân thủ</h2>
              <p className="text-gray-600 text-sm mt-1">Cảnh báo gần đây về tuân thủ và phát hiện gian lận</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {complianceAlerts.map((alert) => (
                  <div key={alert.id} className={`p-4 rounded-lg border ${getSeverityColor(alert.severity)}`}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{alert.type.replace('_', ' ').charAt(0).toUpperCase() + alert.type.replace('_', ' ').slice(1)}</h4>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${alert.severity === 'high' ? 'bg-red-200 text-red-800' :
                          alert.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-blue-200 text-blue-800'
                        }`}>
                        {alert.severity}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{alert.message}</p>
                    <div className="flex justify-between items-center text-xs opacity-75">
                      <span>{alert.user}</span>
                      <span>{formatPriceWithCurrency(alert.amount)}</span>
                    </div>
                    <div className="text-xs opacity-75 mt-1">{alert.timestamp}</div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                View All Alerts
              </button>
            </div>
          </div>
        </div>

        {/* Compliance Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Compliance Summary</h2>
            <p className="text-gray-600 text-sm mt-1">Overview of compliance metrics and regulatory requirements</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">KYC Compliance</h3>
                <p className="text-2xl font-bold text-green-600 mb-1">98.5%</p>
                <p className="text-xs text-gray-600">2,756 verified</p>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">AML Screening</h3>
                <p className="text-2xl font-bold text-blue-600 mb-1">99.2%</p>
                <p className="text-xs text-gray-600">2,824 screened</p>
              </div>

              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Risk Assessment</h3>
                <p className="text-2xl font-bold text-yellow-600 mb-1">23</p>
                <p className="text-xs text-gray-600">flagged transactions</p>
              </div>

              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">Audit Trail</h3>
                <p className="text-2xl font-bold text-purple-600 mb-1">100%</p>
                <p className="text-xs text-gray-600">complete records</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      );
};

export default TransactionMonitoring;