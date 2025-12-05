import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectFavoriteCars } from '../../../favorites/favoritesSlice';
import CarCard from '../../../cars/CarCard';

const FavouriteCarPage = () => {
  const { t } = useTranslation();
  const favouriteCars = useSelector(selectFavoriteCars);

  return (
    <div>
      <div className="mb-4 sm:mb-6">
        <h1 className="hidden lg:block text-2xl font-semibold text-gray-900">{t('favouriteCar')}</h1>
        <h1 className="lg:hidden text-xl font-semibold text-gray-900">{t('favouriteCar')}</h1>
      </div>

      {favouriteCars.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noFavouriteCars')}</h3>
          <p className="text-gray-500 mb-4">{t('noFavouriteCarsMessage')}</p>
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t('browseCars')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {favouriteCars.map((car) => (
            <CarCard key={car.id} car={car} isApiData={false} />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavouriteCarPage;