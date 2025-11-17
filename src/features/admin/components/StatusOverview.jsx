import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const StatusOverview = () => {
  const { t } = useTranslation();
  const cars = useSelector(state => state.admin?.cars || []);

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'Rented':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'Overdue':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'Available':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'Returned':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getPaidStatus = (paid) => {
    return paid ? (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        {t('paid')}
      </span>
    ) : (
      <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        {t('unpaid')}
      </span>
    );
  };

  const getTranslatedStatus = (status) => {
    const statusMap = {
      'Rented': t('rented'),
      'Overdue': t('overdue'),
      'Available': t('available'),
      'Returned': t('returned')
    };
    return statusMap[status] || status;
  };

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
              <th className="text-left py-4 px-2 font-semibold text-gray-900 text-sm">{t('pickUp')}</th>
              <th className="text-left py-4 px-2 font-semibold text-gray-900 text-sm">{t('dropOff')}</th>
              <th className="text-left py-4 px-2 font-semibold text-gray-900 text-sm">{t('paid')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {cars.map((car) => (
              <tr key={car.id} className="hover:bg-gray-50">
                <td className="py-4 px-2">
                  <div className="font-medium text-gray-900 text-sm">{car.name}</div>
                </td>
                <td className="py-4 px-2">
                  <span className={getStatusBadge(car.status)}>
                    {getTranslatedStatus(car.status)}
                  </span>
                </td>
                <td className="py-4 px-2 text-gray-600 text-sm">{car.pickUp}</td>
                <td className="py-4 px-2 text-gray-600 text-sm">{car.dropOff}</td>
                <td className="py-4 px-2">
                  {car.status === 'Available' || car.status === 'Returned' ? (
                    <span className="text-gray-400 text-sm">-----</span>
                  ) : (
                    getPaidStatus(car.paid)
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-center mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">{t('previous')}</button>
          <div className="flex space-x-1">
            <button className="w-8 h-8 text-sm bg-blue-600 text-white rounded">1</button>
            <button className="w-8 h-8 text-sm text-gray-600 hover:bg-gray-100 rounded">2</button>
            <button className="w-8 h-8 text-sm text-gray-600 hover:bg-gray-100 rounded">3</button>
            <button className="w-8 h-8 text-sm text-gray-600 hover:bg-gray-100 rounded">4</button>
            <button className="w-8 h-8 text-sm text-gray-600 hover:bg-gray-100 rounded">5</button>
          </div>
          <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">{t('next')}</button>
        </div>
      </div>
    </div>
  );
};

export default StatusOverview;