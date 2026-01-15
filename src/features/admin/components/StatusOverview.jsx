import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchAllAdminData } from '../adminapi/adminAPI';
import Pagination from '../../../shared/components/Pagination';

const StatusOverview = () => {
  const { t } = useTranslation();
  const [statusData, setStatusData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const { cars, bookings, invoices } = await fetchAllAdminData();

        // Combine data from all three endpoints
        const combinedData = bookings.map(booking => {
          const car = cars.find(c => c.id === booking.carId);

          // Determine which invoice item to look for based on booking status
          let targetItem = '';
          if (booking.status === 'Confirmed') {
            targetItem = 'Booking Fee';
          } else if (booking.status === 'Completed') {
            targetItem = 'Rental Fee';
          } else if (booking.status === 'Cancelled') {
            targetItem = 'Booking Fee';
          } else if (booking.status === 'Canceled') {
            targetItem = 'Booking Fee';
          }

          // Find invoice that matches both invoiceId from booking and the target item
          // Comparing booking.invoiceId with invoice.invoiceId
          const invoice = invoices.find(inv =>
            inv.invoiceId === booking.invoiceId && inv.item === targetItem
          );

          return {
            id: booking.id,
            carId: booking.carId,
            carName: car ? `${car.manufacturer} ${car.model}` : 'Unknown',
            carManufactures: car.manufacturer,
            carStatus: car?.status || 'Unknown',
            bookingStatus: booking.status,
            invoiceStatus: invoice?.status || 'Unknown',
            invoiceItem: invoice?.item || 'N/A',
            pickUp: booking.pickupTime ? new Date(booking.pickupTime).toLocaleString() : '-----',
            dropOff: booking.dropoffTime ? new Date(booking.dropoffTime).toLocaleString() : '-----',
          };
        });
        // console.log("combinedData", combinedData);
        setStatusData(combinedData);
        setError(null);
      } catch (err) {
        console.error('Error loading status overview:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const getStatusBadge = (bookingStatus, carStatus) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";

    // Determine display status based on booking and car status
    if (bookingStatus === 'Confirmed' && carStatus === 'Reserved') {
      return `${baseClasses} bg-blue-100 text-blue-800`;
    } else if (bookingStatus === 'Completed') {
      return `${baseClasses} bg-green-100 text-green-800`;
    } else if (bookingStatus === 'Cancelled') {
      return `${baseClasses} bg-red-100 text-red-800`;
    } else if (carStatus === 'Active') {
      return `${baseClasses} bg-gray-100 text-gray-800`;
    } else if (carStatus === 'Inactive') {
      return `${baseClasses} bg-yellow-100 text-yellow-800`;
    } else if (bookingStatus === 'Canceled') {
      return `${baseClasses} bg-red-100 text-red-800`;
    }
    else if (bookingStatus === 'Confirmed') {
      return `${baseClasses} bg-blue-100 text-blue-800`;
    } else if (carStatus === 'Reserved') {
      return `${baseClasses} bg-green-100 text-green-800`;
    }
    return `${baseClasses} bg-gray-100 text-gray-800`;
  };

  const getPaidStatus = (invoiceStatus) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";

    switch (invoiceStatus) {
      case 'Paid':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            {t('paid')}
          </span>
        );
      case 'Success':
        return (
          <span className={`${baseClasses} bg-green-100 text-green-800`}>
            {t('paid')}
          </span>
        );
      case 'Pending':
        return (
          <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>
            {t('pending')}
          </span>
        );
      case 'Expired':
        return (
          <span className={`${baseClasses} bg-orange-100 text-orange-800`}>
            {t('expired')}
          </span>
        );
      case 'Cancelled':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            {t('cancelled')}
          </span>
        );
      case 'Canceled':
        return (
          <span className={`${baseClasses} bg-red-100 text-red-800`}>
            {t('cancelled')}
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-100 text-gray-800`}>
            {invoiceStatus || t('unknown')}
          </span>
        );
    }
  };

  const getTranslatedStatus = (bookingStatus, carStatus) => {
    if (bookingStatus === 'Confirmed') return t('confirmed');
    if (bookingStatus === 'Completed') return t('completed');
    if (bookingStatus === 'Cancelled') return t('cancelled');
    if (bookingStatus === 'Canceled') return t('cancelled');
    if (carStatus === 'Active') return t('active');
    if (carStatus === 'Inactive') return t('inactive');
    if (carStatus === 'Reserved') return t('reserved');
    return bookingStatus || carStatus;
  };

  // Calculate pagination
  const totalItems = statusData.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = statusData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-500">{t('loading')}...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center py-12">
          <div className="text-red-500">{t('error')}: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{t('statusOverview')}</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-4 px-2 font-semibold text-gray-900 text-sm">{t('car')}</th>
              <th className="text-left py-4 px-2 font-semibold text-gray-900 text-sm">{t('status')}</th>
              <th className="text-left py-4 px-2 font-semibold text-gray-900 text-sm">{t('status')}</th>
              <th className="text-left py-4 px-2 font-semibold text-gray-900 text-sm">{t('pickUp')}</th>
              <th className="text-left py-4 px-2 font-semibold text-gray-900 text-sm">{t('dropOff')}</th>
              {/* <th className="text-left py-4 px-2 font-semibold text-gray-900 text-sm">{t('paid')}</th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500">
                  {t('noData')}
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-4 px-2">
                    <div className="font-medium text-gray-900 text-sm">{item.carName}</div>
                  </td>
                  <td className="py-4 px-2">
                    <span className={getStatusBadge(item.bookingStatus)}>
                      {getTranslatedStatus(item.bookingStatus)}
                    </span>
                  </td>
                  <td className="py-4 px-2">
                    <span className={getStatusBadge(item.carStatus)}>
                      {getTranslatedStatus(item.carStatus)}
                    </span>
                  </td>
                  <td className="py-4 px-2 text-gray-600 text-sm">{item.pickUp}</td>
                  <td className="py-4 px-2 text-gray-600 text-sm">{item.dropOff}</td>
                  {/* <td className="py-4 px-2">
                    {getPaidStatus(item.invoiceStatus)}
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default StatusOverview;