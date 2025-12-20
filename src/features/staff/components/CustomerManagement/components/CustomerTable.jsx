import { useTranslation } from 'react-i18next';
import Pagination from '../../../../../shared/components/Pagination';

const CustomerTable = ({
  customers,
  currentPage,
  itemsPerPage,
  onPageChange,
  onViewCustomer,
  onEditCustomer,
  onSuspendCustomer,
  onActivateCustomer,
  getStatusBadge,
  getVerificationBadge
}) => {
  const { t } = useTranslation();

  // Pagination calculations
  const totalPages = Math.ceil(customers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = customers.slice(startIndex, endIndex);

  if (customers.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('noCustomersFound') || 'No customers found'}
          </h3>
          <p className="text-gray-600">
            {t('tryAdjustingFilters') || 'Try adjusting your search or filters'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('customer')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('status')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('verification')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('bookingStats')}</th>
              {/* <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('totalSpent')}</th>
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('lastBooking')}</th> */}
              <th className="text-left py-4 px-6 font-semibold text-gray-900 text-sm">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentItems.map((customer) => (
              <tr key={customer.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{customer.name}</div>
                    <div className="text-sm text-gray-500">{customer.email}</div>
                    <div className="text-xs text-gray-400">{customer.phone}</div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={getStatusBadge(customer.status)}>
                    {customer.status}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className={getVerificationBadge(customer.verificationStatus)}>
                    {customer.verificationStatus}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      {customer.totalBookings} {t('bookings') || 'bookings'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {customer.totalBookings > 0 ? t('activeCustomer') || 'Active customer' : t('noBookings') || 'No bookings yet'}
                    </div>
                  </div>
                </td>
                {/* <td className="py-4 px-6">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">
                      ${customer.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                    <div className="text-xs text-gray-500">
                      {customer.totalBookings > 0 
                        ? `${t('avgPerBooking') || 'Avg per booking'}: $${(customer.totalSpent / customer.totalBookings).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : t('noSpending') || 'No spending'
                      }
                    </div>
                  </div>
                </td> */}
                {/* <td className="py-4 px-6">
                  <div className="text-sm">
                    {customer.lastBooking ? (
                      <>
                        <div className="font-medium text-gray-900">{customer.lastBooking}</div>
                        <div className="text-xs text-gray-500">
                          {(() => {
                            const daysSince = Math.floor((new Date() - new Date(customer.lastBooking)) / (1000 * 60 * 60 * 24));
                            if (daysSince === 0) return t('today') || 'Today';
                            if (daysSince === 1) return t('yesterday') || 'Yesterday';
                            if (daysSince < 7) return `${daysSince} ${t('daysAgo') || 'days ago'}`;
                            if (daysSince < 30) return `${Math.floor(daysSince / 7)} ${t('weeksAgo') || 'weeks ago'}`;
                            return `${Math.floor(daysSince / 30)} ${t('monthsAgo') || 'months ago'}`;
                          })()}
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-500 text-sm">{t('neverBooked') || 'Never booked'}</div>
                    )}
                  </div>
                </td> */}
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onViewCustomer(customer)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      {t('view')}
                    </button>
                    <button
                      onClick={() => onEditCustomer(customer)}
                      className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                    >
                      {t('edit')}
                    </button>
                    {customer.status === 'active' ? (
                      <button
                        onClick={() => onSuspendCustomer(customer)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        {t('suspend')}
                      </button>
                    ) : customer.status === 'suspended' ? (
                      <button
                        onClick={() => onActivateCustomer(customer)}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        {t('activate')}
                      </button>
                    ) : (
                      <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                        {t('message')}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {customers.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalItems={customers.length}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default CustomerTable;