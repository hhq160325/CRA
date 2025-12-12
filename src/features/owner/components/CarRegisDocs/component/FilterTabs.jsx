import { useTranslation } from 'react-i18next';

const FilterTabs = ({ filter, setFilter, cars }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-6 flex space-x-2 border-b">
      <button
        onClick={() => setFilter('all')}
        className={`px-4 py-2 font-medium transition-colors ${filter === 'all'
          ? 'text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-600 hover:text-gray-900'
          }`}
      >
        {t('carRegisDocs.allCars', { count: cars.length })}
      </button>
      <button
        onClick={() => setFilter('pending')}
        className={`px-4 py-2 font-medium transition-colors ${filter === 'pending'
          ? 'text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-600 hover:text-gray-900'
          }`}
      >
        {t('carRegisDocs.pendingApproval', { count: cars.filter(c => c.status === 'Pending').length })}
      </button>
      <button
        onClick={() => setFilter('approved')}
        className={`px-4 py-2 font-medium transition-colors ${filter === 'approved'
          ? 'text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-600 hover:text-gray-900'
          }`}
      >
        {t('carRegisDocs.approved', { count: cars.filter(c => c.status === 'Active' || c.status === 'Inactive').length })}
      </button>
    </div>
  );
};

export default FilterTabs;