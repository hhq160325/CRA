import { useTranslation } from 'react-i18next';

const TopManufacturers = ({ topManufacturers }) => {
  const { t } = useTranslation();

  // Calculate percentages for top manufacturers
  const totalManufacturerBookings = Object.values(topManufacturers).reduce((sum, count) => sum + count, 0);
  const manufacturerPercentages = Object.entries(topManufacturers)
    .sort(([,a], [,b]) => b - a) // Sort by count descending
    .map(([manufacturer, count]) => ({
      manufacturer,
      count,
      percentage: totalManufacturerBookings > 0 ? Math.round((count / totalManufacturerBookings) * 100) : 0
    }));

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('topManufacturersConfirmedCompleted')}</h2>
      <div className="space-y-4">
        {manufacturerPercentages.slice(0, 4).map((item, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">{item.manufacturer}</span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">({item.count} {t('bookingsText')})</span>
                <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gray-900 h-2 rounded-full transition-all duration-300"
                style={{ width: `${item.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
        {manufacturerPercentages.length === 0 && (
          <div className="text-center text-gray-500 py-4">
            {t('noConfirmedCompletedBookings')}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopManufacturers;