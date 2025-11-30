import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { axiosInstance } from '../../../../shared/utils/axiosInstance';
import { PAYMENT_ENDPOINTS } from '../../../../config/api';
import { decodeJWT } from '../../../auth/utils';

const PaymentHistoryPage = () => {
  const { t } = useTranslation();
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPaymentHistory = async () => {
      try {
        setLoading(true);
        
        // Get userId from JWT token
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setError('User not logged in');
          setLoading(false);
          return;
        }

        const decoded = decodeJWT(token);
        const currentUserId = decoded ? (decoded.sub || decoded.userId || decoded.id || decoded.nameid) : null;

        if (!currentUserId) {
          setError('Unable to get user information');
          setLoading(false);
          return;
        }

        // Fetch payments for current customer
        let allPayments = [];
        try {
          const paymentsResponse = await axiosInstance.get(PAYMENT_ENDPOINTS.GET_ALL_PAYMENTS);
          allPayments = paymentsResponse.data;
        } catch (paymentError) {
          // If 404, it means no payments exist
          if (paymentError.response?.status === 404) {
            console.log('No payments found');
            setPaymentHistory([]);
            setError(null);
            setLoading(false);
            return;
          }
          // Handle timeout errors
          if (paymentError.code === 'ECONNABORTED' || paymentError.message?.includes('timeout')) {
            console.warn('Payment API timeout - treating as no payments');
            setPaymentHistory([]);
            setError(null);
            setLoading(false);
            return;
          }
          // For other errors, throw to be caught by outer catch
          throw paymentError;
        }

        // Filter payments for current user by comparing userId
        const userPayments = Array.isArray(allPayments) 
          ? allPayments.filter(payment => {
              const paymentUserId = payment.userId || payment.customerId || payment.user_id;
              return paymentUserId && String(paymentUserId) === String(currentUserId);
            })
          : [];

        // Transform API data to match component structure
        const history = userPayments
          .map((payment) => {
            const paymentDate = payment.createdAt ? new Date(payment.createdAt) : new Date();
            const paymentStatus = payment.status ? String(payment.status).toLowerCase() : 'pending';
            
            // Use the most recent date for sorting: updatedAt if newer, otherwise createdAt
            const createdAt = payment.createdAt || payment.createDate;
            const updatedAt = payment.updatedAt || payment.updateDate;
            const sortDate = updatedAt && new Date(updatedAt) > new Date(createdAt)
              ? updatedAt
              : createdAt;
            
            return {
              paymentId: payment.id,
              orderCode: payment.orderCode || payment.invoiceId || 'N/A',
              amount: payment.amount || payment.totalAmount || payment.paidAmount || 0,
              paymentDate: paymentDate.toISOString().split('T')[0],
              paymentTime: paymentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              status: paymentStatus,
              paymentMethod: payment.paymentMethod || 'N/A',
              sortDate: sortDate, // For sorting - most recent activity
              // transactionId: payment.transactionId || 'N/A'
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

        setPaymentHistory(history);
        setError(null);
      } catch (err) {
        console.error('Error fetching payment history:', err);
        setError('Failed to load payment history');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentHistory();
  }, []);

  // Format amount to Vietnamese currency format
  const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    return `${Number(amount).toLocaleString('vi-VN')} đ`;
  };

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex px-2 py-1 text-xs font-semibold rounded-full";
    switch (status) {
      case 'paid':
      case 'success':
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
      case 'processing':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'failed':
      case 'cancelled':
      case 'canceled':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'refunded':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'paid':
      case 'success':
      case 'completed':
        return t('paid');
      case 'pending':
      case 'processing':
        return t('pending');
      case 'failed':
        return t('failed');
      case 'cancelled':
      case 'canceled':
        return t('cancelled');
      case 'refunded':
        return t('refunded');
      default:
        return status;
    }
  };

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
  const totalPages = Math.ceil(paymentHistory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = paymentHistory.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h1 className="hidden lg:block text-xl font-semibold text-gray-900">{t('Payment History')}</h1>
          <h1 className="lg:hidden text-lg font-semibold text-gray-900">{t('Payment History')}</h1>
        </div>

        {paymentHistory.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {t('noPaymentHistory') || 'No payment history found'}
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="lg:hidden">
              {currentItems.map((payment) => (
                <div key={payment.id} className="border-b border-gray-200 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{payment.orderCode}</h3>
                    <span className={getStatusBadge(payment.status)}>
                      {getStatusText(payment.status)}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>{t('amount')}:</span>
                      <span className="font-medium text-gray-900">{formatCurrency(payment.amount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('paymentDate')}:</span>
                      <span>{payment.paymentDate} {payment.paymentTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('paymentMethod')}:</span>
                      <span>{payment.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('transactionId')}:</span>
                      <span className="text-xs">{payment.transactionId}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('orderCode')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('amount')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('paymentDate')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('paymentMethod')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('status')}</th>
                    {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('transactionId')}</th> */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.orderCode}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div>{payment.paymentDate}</div>
                        <div className="text-xs text-gray-500">{payment.paymentTime}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.paymentMethod}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(payment.status)}>
                          {getStatusText(payment.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.transactionId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {paymentHistory.length > 0 && (
              <div className="px-4 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {t('previous') || 'Previous'}
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                      currentPage === totalPages
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
                      <span className="font-medium">{Math.min(endIndex, paymentHistory.length)}</span> {t('of') || 'of'}{' '}
                      <span className="font-medium">{paymentHistory.length}</span> {t('results') || 'results'}
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                          currentPage === 1
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
                        if (
                          pageNumber === 1 ||
                          pageNumber === totalPages ||
                          (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                              className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                currentPage === pageNumber
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
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                          currentPage === totalPages
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
    </div>
  );
};

export default PaymentHistoryPage;
