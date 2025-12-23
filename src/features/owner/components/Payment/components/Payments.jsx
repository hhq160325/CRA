import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getUserIdFromToken } from '../../../../user/api';
import { filterPaymentData } from '../../../utils/filterUtils';
import DropdownTemplate from '../../../../../shared/components/DropdownTemplate';
import Pagination from '../../../../../shared/components/Pagination';
import { paymentTypeOptions, getPaymentMethodOptions, paymentStatusOptions } from '../../../ownerUtils/dropdownOptions';
import { fetchOwnerPaymentsData } from '../../../api/ownerApi';
import { sortByLatest } from '../../../../../shared/utils/SortByLatest';
import { convertToVietnamTime } from '../../../../../shared/utils/CheckUTC';

const Payments = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all'); // all, booking_fee, rental_fee
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [createDateFilter, setCreateDateFilter] = useState('');
  const [updateDateFilter, setUpdateDateFilter] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      setError(null);

      const currentUserId = getUserIdFromToken();

      // Fetch all data using centralized API function
      const { invoices: allInvoices, payments: allPayments, users: allUsers, cars: allCars } = await fetchOwnerPaymentsData();

      // console.log('Current User ID:', currentUserId);
      // console.log('All Invoices:', allInvoices);
      // console.log('All Payments:', allPayments);
      // console.log('All Users:', allUsers);
      // console.log('All Cars:', allCars);

      // Create a map of user IDs to full names for quick lookup
      const userMap = new Map(
        allUsers.map(user => [user.id, user.fullname || user.userName || 'N/A'])
      );

      // Create a map of car IDs to car details for quick lookup
      const carMap = new Map(
        allCars.map(car => [car.id, {
          name: `${car.brand || ''} ${car.model || ''}`.trim() || 'N/A',
          licensePlate: car.licensePlate || ''
        }])
      );

      // Helper function to extract car ID from invoice items
      const extractCarIdFromInvoice = (invoice) => {
        if (!invoice?.invoiceItems || invoice.invoiceItems.length === 0) return null;

        // Look for car rental item with Car ID in description
        const rentalItem = invoice.invoiceItems.find(item =>
          item.description?.includes('Car ID:')
        );

        if (rentalItem) {
          const match = rentalItem.description.match(/Car ID:\s*([a-f0-9-]+)/i);
          if (match && match[1]) {
            return match[1];
          }
        }

        return null;
      };

      // Filter invoices for current vendor
      const vendorInvoices = allInvoices.filter(invoice => invoice.vendorId === currentUserId);
      console.log('Vendor Invoices:', vendorInvoices);

      // Create a map of invoice IDs for quick lookup
      const vendorInvoiceMap = new Map(
        vendorInvoices.map(invoice => [invoice.id, invoice])
      );

      // Filter and transform payments that belong to vendor's invoices
      const vendorPayments = allPayments
        .filter(payment => vendorInvoiceMap.has(payment.invoiceId))
        .map((payment) => {
          const invoice = vendorInvoiceMap.get(payment.invoiceId);
          const customerId = invoice?.customerId;
          const customerName = customerId ? userMap.get(customerId) || 'N/A' : 'N/A';

          // Extract car ID from invoice items and get car details
          const carId = extractCarIdFromInvoice(invoice);
          const carDetails = carId ? carMap.get(carId) : null;

          // Keep original dates for sorting and convert to Vietnam time
          const createDate = payment.createDate;
          const updateDate = payment.updateDate;
          
          // Convert dates to Vietnam time for display
          const vietnamCreateDate = createDate ? convertToVietnamTime(createDate) : null;
          const vietnamUpdateDate = updateDate ? convertToVietnamTime(updateDate) : null;
          
          return {
            id: payment.id,
            transactionId: payment.orderCode || payment.id.substring(0, 8).toUpperCase(),
            type: payment.item?.toLowerCase().includes('booking') ? 'booking_fee' : 'rental_fee',
            invoiceId: payment.invoiceId,
            bookingId: invoice?.invoiceNo || payment.invoiceNo || 'N/A',
            customerId: customerId,
            customerName: customerName,
            vendorId: invoice?.vendorId,
            carId: carId,
            carName: carDetails?.name || 'N/A',
            licensePlate: carDetails?.licensePlate || '',
            amount: payment.paidAmount || 0,
            createDate: createDate, // Keep original for sorting
            updateDate: updateDate, // Keep original for sorting
            dateCreate: vietnamCreateDate ? vietnamCreateDate.toISOString().split('T')[0] : 'N/A',
            dateUpdate: vietnamUpdateDate ? vietnamUpdateDate.toISOString().split('T')[0] : 'N/A',
            status: payment.status?.toLowerCase() || 'pending',
            paymentMethod: payment.paymentMethod || 'N/A',
            description: payment.item || 'Payment',
            notes: payment.note || ''
          };
        });

      // Sort payments by latest createDate, but use createDate if updateDate equals createDate
      const sortedVendorPayments = sortByLatest(vendorPayments.map(payment => {
        // If updateDate equals createDate, prioritize createDate for sorting
        const sortDate = payment.updateDate === payment.createDate ? payment.createDate : payment.updateDate;
        return {
          ...payment,
          sortDate: sortDate
        };
      }), 'sortDate');

      console.log('Filtered and Sorted Vendor Payments:', sortedVendorPayments);
      setPayments(sortedVendorPayments);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError(t('payments.errorLoadingPayments'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'completed':
      case 'paid':
      case 'success':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'failed':
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getTypeBadge = (type) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (type) {
      case 'booking_fee':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'rental_fee':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatTypeName = (type) => {
    switch (type) {
      case 'booking_fee':
        return t('payments.bookingFeeType');
      case 'rental_fee':
        return t('payments.rentalFeeType');
      default:
        return type;
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

  const handleExportReceipt = (payment) => {
    // Generate receipt data
    const receiptData = {
      transactionId: payment.transactionId,
      dateCreate: payment.dateCreate,
      dateUpdate: payment.dateUpdate,
      type: formatTypeName(payment.type),
      customerName: payment.customerName,
      carName: payment.carName,
      licensePlate: payment.licensePlate,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      status: payment.status,
      description: payment.description
    };

    // Create downloadable receipt (simple text format)
    const receiptText = `
${t('payments.receipt')}
${t('payments.receiptSeparator')}
${t('payments.receiptTransactionId', { transactionId: receiptData.transactionId })}
${t('payments.receiptCreateDate', { date: receiptData.dateCreate })}
${t('payments.receiptUpdateDate', { date: receiptData.dateUpdate })}
${t('payments.receiptType', { type: receiptData.type })}
${t('payments.receiptCustomer', { customerName: receiptData.customerName })}
${t('payments.receiptCar', { carName: receiptData.carName })}${receiptData.licensePlate ? ` (${receiptData.licensePlate})` : ''}
${t('payments.receiptAmount', { amount: formatVND(receiptData.amount) })}
${t('payments.receiptPaymentMethod', { paymentMethod: receiptData.paymentMethod })}
${t('payments.receiptStatus', { status: receiptData.status.toUpperCase() })}
${t('payments.receiptDescription', { description: receiptData.description })}
${t('payments.receiptSeparator')}
    `.trim();

    const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${receiptData.transactionId}_${receiptData.dateCreate}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleExportAllReceipts = () => {
    const csvContent = [
      [t('payments.transactionId'), t('payments.createDate'), t('payments.updateDate'), t('payments.type'), t('customer'), t('car'), 'Biển số', 'Số tiền (VND)', t('payments.paymentMethod'), t('payments.status'), t('payments.description')].join(','),
      ...filteredPayments.map(p => [
        p.transactionId,
        p.dateCreate,
        p.dateUpdate,
        formatTypeName(p.type),
        `"${p.customerName}"`,
        `"${p.carName}"`,
        p.licensePlate || '',
        `"${formatVND(p.amount)}"`,
        p.paymentMethod,
        p.status.toUpperCase(),
        `"${p.description}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments_report_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Get unique payment methods for filter dropdown
  const uniquePaymentMethods = useMemo(() => {
    const methodsMap = new Map();
    
    payments.forEach(payment => {
      if (payment.paymentMethod) {
        const normalizedMethod = payment.paymentMethod.trim();
        const lowerCaseKey = normalizedMethod.toLowerCase();
        
        // Keep the first occurrence of each payment method (case-insensitive)
        if (!methodsMap.has(lowerCaseKey)) {
          methodsMap.set(lowerCaseKey, normalizedMethod);
        }
      }
    });
    
    return Array.from(methodsMap.values()).sort();
  }, [payments]);

  // Generate payment method options from unique methods
  const paymentMethodOptions = useMemo(() =>
    getPaymentMethodOptions(uniquePaymentMethods),
    [uniquePaymentMethods]
  );

  // Apply filters using utility function
  const filteredPayments = useMemo(() => {
    return payments.filter(payment =>
      filterPaymentData(payment, {
        searchTerm,
        searchFields: ['transactionId'],
        statusFilter,
        typeFilter,
        paymentMethodFilter,
        createDateFilter,
        updateDateFilter,
      })
    );
  }, [payments, searchTerm, statusFilter, typeFilter, paymentMethodFilter, createDateFilter, updateDateFilter]);

  // Paginate filtered payments
  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredPayments.slice(startIndex, endIndex);
  }, [filteredPayments, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, typeFilter, paymentMethodFilter, createDateFilter, updateDateFilter]);

  // Calculate statistics
  // const totalReceived = payments.filter(p => p.status === 'paid' || p.status === 'completed' || p.status === 'success').reduce((sum, p) => sum + p.amount, 0);
  // const pendingPayments = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  // const bookingFeeTotal = payments.filter(p => p.type === 'booking_fee' && (p.status === 'paid' || p.status === 'completed' || p.status === 'success')).reduce((sum, p) => sum + p.amount, 0);
  // const rentalFeeTotal = payments.filter(p => p.type === 'rental_fee' && (p.status === 'paid' || p.status === 'completed' || p.status === 'success')).reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-full bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('payments.loadingPayments')}</p>
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
            onClick={fetchPayments}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            {t('payments.tryAgain')}
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
            <h1 className="text-2xl font-bold text-gray-900">{t('payments.title')}</h1>
            <p className="text-gray-600">{t('payments.subtitle')}</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleExportAllReceipts}
              disabled={filteredPayments.length === 0}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {t('payments.exportAllReceipts')}
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('payments.totalReceived')}</p>
              <p className="text-2xl font-bold text-green-600">{formatVND(totalReceived)}</p>
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
              <p className="text-sm text-gray-600">{t('payments.paymentsPending')}</p>
              <p className="text-2xl font-bold text-yellow-600">{formatVND(pendingPayments)}</p>
            </div>
            <div className="bg-yellow-100 rounded-full p-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('payments.bookingFee')}</p>
              <p className="text-2xl font-bold text-blue-600">{formatVND(bookingFeeTotal)}</p>
            </div>
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t('payments.rentalFee')}</p>
              <p className="text-2xl font-bold text-purple-600">{formatVND(rentalFeeTotal)}</p>
            </div>
            <div className="bg-purple-100 rounded-full p-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div> */}

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
                  placeholder={t('payments.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
              </div>
              <DropdownTemplate
                value={typeFilter}
                onChange={(option) => setTypeFilter(option.value)}
                options={paymentTypeOptions}
                placeholder={t('payments.allTypes')}
                className="min-w-[160px]"
              />
              <DropdownTemplate
                value={paymentMethodFilter}
                onChange={(option) => setPaymentMethodFilter(option.value)}
                options={paymentMethodOptions}
                placeholder={t('payments.allPaymentMethods')}
                // searchable={paymentMethodOptions.length > 5}
                // searchPlaceholder="Tìm phương thức thanh toán..."
                className="min-w-[200px]"
              />
              <DropdownTemplate
                value={statusFilter}
                onChange={(option) => setStatusFilter(option.value)}
                options={paymentStatusOptions}
                placeholder={t('payments.allStatuses')}
                // searchable
                // searchPlaceholder="Tìm trạng thái..."
                className="min-w-[160px]"
              />
              <div className="relative min-w-[160px] flex items-center">
                <label className="block text-xs text-gray-600 mb-1">{t('payments.createDate')}</label>
                <input
                  type="date"
                  value={createDateFilter}
                  onChange={(e) => setCreateDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="relative min-w-[160px] flex items-center">
                <label className="block text-xs text-gray-600 mb-1">{t('payments.updateDate')}</label>
                <input
                  type="date"
                  value={updateDateFilter}
                  onChange={(e) => setUpdateDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {t('payments.showingResults', { filtered: filteredPayments.length, total: payments.length })}
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('payments.transactionId')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('payments.type')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('payments.description')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('payments.customerAndCar')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('payments.amount')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('payments.paymentMethod')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('payments.createDate')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('payments.updateDate')}</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('payments.status')}</th>
                  <th className="text-center py-4 px-6 font-semibold text-gray-900 text-sm">{t('payments.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedPayments.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="py-8 text-center text-gray-500">
                      {t('payments.noPaymentsFound')}
                    </td>
                  </tr>
                ) : (
                  paginatedPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="font-medium text-gray-900 text-sm">{payment.transactionId}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={getTypeBadge(payment.type)}>
                          {formatTypeName(payment.type)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">{payment.description}</div>
                        <div className="text-xs text-gray-500">{t('payments.invoice')}: {payment.bookingId}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900 font-medium">{payment.customerName}</div>
                        <div className="text-xs text-gray-500">
                          {payment.carName}
                          {payment.licensePlate && ` • ${payment.licensePlate}`}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm font-bold text-green-600">{formatVND(payment.amount)}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">{payment.paymentMethod}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">{payment.dateCreate}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-sm text-gray-900">{payment.dateUpdate}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={getStatusBadge(payment.status)}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col items-center space-y-1">
                          <button
                            onClick={() => openModal(payment)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            {t('payments.viewDetails')}
                          </button>
                          <button
                            onClick={() => handleExportReceipt(payment)}
                            className="text-green-600 hover:text-green-700 text-sm font-medium"
                          >
                            {t('payments.exportReceipt')}
                          </button>
                        </div>
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
            totalItems={filteredPayments.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
      {/* Modal for payment details */}
      {isModalOpen && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">{t('payments.transactionDetails', { transactionId: selectedPayment.transactionId })}</h2>
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
              {/* Payment Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">{t('payments.paymentInfo')}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">{t('payments.transactionId')}</p>
                    <p className="font-medium text-gray-900">{selectedPayment.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('payments.invoiceCode')}</p>
                    <p className="font-medium text-gray-900">{selectedPayment.bookingId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('payments.customerName')}</p>
                    <p className="font-medium text-gray-900">{selectedPayment.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('payments.rentalCar')}</p>
                    <p className="font-medium text-gray-900">
                      {selectedPayment.carName}
                      {selectedPayment.licensePlate && ` (${selectedPayment.licensePlate})`}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('payments.type')}</p>
                    <span className={getTypeBadge(selectedPayment.type)}>
                      {formatTypeName(selectedPayment.type)}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('payments.status')}</p>
                    <span className={getStatusBadge(selectedPayment.status)}>
                      {selectedPayment.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('payments.createDate')}</p>
                    <p className="font-medium text-gray-900">{selectedPayment.dateCreate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('payments.updateDate')}</p>
                    <p className="font-medium text-gray-900">{selectedPayment.dateUpdate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">{t('payments.paymentMethod')}</p>
                    <p className="font-medium text-gray-900">{selectedPayment.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Amount Details */}
              <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                <h3 className="font-semibold text-gray-900 mb-3">{t('payments.amountDetails')}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">{t('payments.description')}</span>
                    <span className="font-medium text-gray-900">{selectedPayment.description}</span>
                  </div>
                  <div className="border-t border-green-300 pt-3 flex justify-between items-center">
                    <span className="font-semibold text-gray-900">{t('payments.amountReceived')}</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatVND(selectedPayment.amount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedPayment.notes && (
                <div className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-500">
                  <h3 className="font-semibold text-gray-900 mb-2">{t('payments.notes')}</h3>
                  <p className="text-sm text-gray-700">{selectedPayment.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {t('payments.close')}
                </button>
                <button
                  onClick={() => {
                    handleExportReceipt(selectedPayment);
                    closeModal();
                  }}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  {t('payments.exportReceipt')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Payments;

