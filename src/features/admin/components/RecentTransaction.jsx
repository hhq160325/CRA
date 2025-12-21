import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchAllAdminData } from '../adminapi/adminAPI';
import { formatPrice } from '../../../shared/utils/priceFormatter';

const RecentTransaction = () => {
  const { t } = useTranslation();
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        const { cars, bookings, invoices } = await fetchAllAdminData();

        // Filter invoices with status "Paid"
        const paidInvoices = invoices.filter(invoice => invoice.status === 'Paid');

        // Map invoices to transactions with car and booking details
        const transactions = paidInvoices.map(invoice => {
          // Find the booking associated with this invoice
          const booking = bookings.find(b => b.invoiceId === invoice.invoiceId);
          
          // Find the car associated with this booking
          const car = booking ? cars.find(c => c.id === booking.carId) : null;

          // Determine the date to use
          const displayDate = invoice.createDate === invoice.updateDate 
            ? invoice.createDate 
            : invoice.createDate;
            
          return {
            id: invoice.invoiceId,
            car: car ? `${car.manufacturer} ${car.model}` : 'Unknown Car',
            carImages: car?.imageUrls?.[0],
            carId: car?.id,
            type: 'Rental',
            date: new Date(displayDate).toLocaleString(),
            price: invoice.paidAmount || 0,
            invoiceId: invoice.invoiceId
          };
        });

        // Sort by date (most recent first) and take the latest transactions
        const sortedTransactions = transactions.sort((a, b) => {
          const dateA = new Date(paidInvoices.find(inv => inv.invoiceId === a.invoiceId)?.createDate || 0);
          const dateB = new Date(paidInvoices.find(inv => inv.invoiceId === b.invoiceId)?.createDate || 0);
          return dateB - dateA;
        });

        setRecentTransactions(sortedTransactions.slice(0, 5)); // Show top 5 recent transactions
      } catch (error) {
        console.error('Error loading recent transactions:', error);
        setRecentTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">{t('loading') || 'Loading...'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">{t('recentTransaction')}</h2>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          {t('viewAll')}
        </button>
      </div>

      <div className="space-y-4">
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {t('noTransactions') || 'No recent transactions'}
          </div>
        ) : (
          recentTransactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="flex items-center space-x-4">
                {/* Car Image */}
                {transaction.carImages ? (
                  <img 
                    src={transaction.carImages} 
                    alt={transaction.car}
                    className="w-16 h-12 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-16 h-12 bg-gray-600 rounded-lg"></div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{transaction.car}</h3>
                  <p className="text-sm text-gray-500">{transaction.type}</p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-gray-500 mb-1">{transaction.date}</div>
                <div className="font-semibold text-gray-900">
                  {formatPrice(transaction.price)} ₫
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentTransaction;