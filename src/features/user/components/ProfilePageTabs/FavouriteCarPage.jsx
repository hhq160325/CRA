<<<<<<< HEAD
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { removeFromFavorites, selectFavoriteCars } from '../../../favorites/favoritesSlice';

const FavouriteCarPage = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favouriteCars = useSelector(selectFavoriteCars);

  const toggleFavourite = (carId) => {
    dispatch(removeFromFavorites(carId));
  };

  const handleViewDetails = (carId) => {
    navigate(`/cars/${carId}`);
  };

=======
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { selectFavoriteCars } from '../../../favorites/favoritesSlice';
import CarCard from '../../../cars/CarCard';

const FavouriteCarPage = () => {
  const { t } = useTranslation();
  const favouriteCars = useSelector(selectFavoriteCars);

>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
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
<<<<<<< HEAD
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {favouriteCars.map((car) => (
            <div key={car.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => toggleFavourite(car.id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-red-500 hover:text-red-600"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                <div className="absolute top-3 left-3 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                  {car.type || t('car')}
                </div>
              </div>

              <div className="p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 truncate">{car.name}</h3>

                {(car.fuel || car.transmission || car.capacity) && (
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                    {car.fuel && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        </svg>
                        {car.fuel}
                      </div>
                    )}
                    {car.transmission && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                        </svg>
                        {car.transmission}
                      </div>
                    )}
                    {car.capacity && (
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {car.capacity}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className='flex items-center space-x-1'>
                      <div className="text-lg sm:text-xl font-bold text-gray-900">${typeof car.price === 'number' ? car.price.toFixed(2) : (parseFloat(car.price) || 0).toFixed(2)}</div>
                      <div className="text-xs sm:text-sm text-slate-400">{t('perDay')}</div>
                    </div>
                    {car.originalPrice && (
                      <div className="text-xs sm:text-sm text-gray-500 line-through">${typeof car.originalPrice === 'number' ? car.originalPrice.toFixed(2) : (parseFloat(car.originalPrice) || 0).toFixed(2)}</div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDetails(car.id)}
                      className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs sm:text-sm w-full sm:w-auto"
                    >
                      {t('rentNow')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
=======
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {favouriteCars.map((car) => (
            <CarCard key={car.id} car={car} isApiData={false} />
>>>>>>> b4dae4ad57ebf4aa5136a81faef04684f2a03328
          ))}
        </div>
      )}
    </div>
  );
};

export default FavouriteCarPage;