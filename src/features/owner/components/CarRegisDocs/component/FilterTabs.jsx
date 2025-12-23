import { useTranslation } from 'react-i18next';

const FilterTabs = ({ filter, setFilter, cars }) => {
  const { t } = useTranslation();

  return (
    <div className="mb-6 flex space-x-2 border-b">
      {/* <button
        onClick={() => setFilter('all')}
        className={`px-4 py-2 font-medium transition-colors ${filter === 'all'
          ? 'text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-600 hover:text-gray-900'
          }`}
      >
        {t('carRegisDocs.allCars', { count: cars.length })}
      </button> */}
      <button
        onClick={() => setFilter('no-upload')}
        className={`px-4 py-2 font-medium transition-colors ${filter === 'no-upload'
          ? 'text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-600 hover:text-gray-900'
          }`}
      >
        {t('carRegisDocs.noUpload', { count: cars.filter(c => c.status === 'No Upload').length })}
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
        {t('carRegisDocs.approved', { count: cars.filter(c => c.status === 'Approved').length })}
      </button>
      <button
        onClick={() => setFilter('denied')}
        className={`px-4 py-2 font-medium transition-colors ${filter === 'denied'
          ? 'text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-600 hover:text-gray-900'
          }`}
      >
        {t('carRegisDocs.denied', { count: cars.filter(c => c.status === 'Denied').length })}
      </button>
    </div>
  );
};

export default FilterTabs;