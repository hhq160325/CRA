import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { getAllBookings } from '../../api/bookingApi';
import { formatPriceWithCurrency } from '../../../../shared/utils/priceFormatter';
import { INVOICE_ENDPOINTS } from '../../../../config/api';

const DashboardMetrics = () => {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    canceledBookings: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        
        // Fetch bookings for booking metrics
        const bookings = await getAllBookings();
        
        // Calculate booking metrics
        const totalBookings = bookings.length;
        const confirmedBookings = bookings.filter(b => 
          String(b.status).toLowerCase() === 'confirmed'
        ).length;
        const completedBookings = bookings.filter(b => 
          String(b.status).toLowerCase() === 'completed'
        ).length;
        const canceledBookings = bookings.filter(b => 
          String(b.status).toLowerCase() === 'cancelled'
        ).length;

        // Fetch invoices for revenue calculation
        let totalRevenue = 0;
        try {
          const token = localStorage.getItem("jwtToken");
          const invoiceResponse = await axios.get(INVOICE_ENDPOINTS.GET_ALL, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          const invoices = invoiceResponse.data;
          
          // Calculate total revenue from invoices with Success or Paid status
          totalRevenue = invoices
            .filter(invoice => {
              const status = String(invoice.status || '').toLowerCase();
              return status === 'success' || status === 'paid';
            })
            .reduce((sum, invoice) => sum + (invoice.paidAmount || invoice.amount || 0), 0);
        } catch (invoiceError) {
          console.error('Failed to fetch invoices for revenue calculation:', invoiceError);
          // Fallback to booking-based revenue calculation
          totalRevenue = bookings
            .filter(b => String(b.status).toLowerCase() !== 'cancelled')
            .reduce((sum, b) => sum + (b.totalPrice || b.totalAmount || 0), 0);
        }

        setMetrics({
          totalBookings,
          confirmedBookings,
          completedBookings,
          canceledBookings,
          totalRevenue
        });
      } catch (error) {
        console.error('Failed to fetch dashboard metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const metricCards = [
    {
      title: t('totalBookings'),
      value: loading ? '...' : (metrics.totalBookings || 0).toLocaleString(),
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      title: t('confirmedBookings'),
      value: loading ? '...' : (metrics.confirmedBookings || 0).toLocaleString(),
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>,
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    {
      title: t('completedBookings'),
      value: loading ? '...' : (metrics.completedBookings || 0).toLocaleString(),
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    {
      title: t('canceledBookings'),
      value: loading ? '...' : (metrics.canceledBookings || 0).toLocaleString(),
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>,
      bgColor: 'bg-red-50',
      textColor: 'text-red-600'
    },
    {
      title: t('totalRevenue'),
      value: loading ? '...' : formatPriceWithCurrency(metrics.totalRevenue || 0),
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>,
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{t('platformOverview')}</h2>
        <button className="text-gray-400 hover:text-gray-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metricCards.map((metric, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 ${metric.bgColor} rounded-lg ${metric.textColor}`}>
                {metric.icon}
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</p>
              <p className="text-sm text-gray-600">{metric.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardMetrics;