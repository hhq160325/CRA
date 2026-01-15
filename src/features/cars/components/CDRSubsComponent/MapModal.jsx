import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import trackasiagl from 'trackasia-gl';
import 'trackasia-gl/dist/trackasia-gl.css';
import Modal from '../../../../shared/components/Modal';

const MapModal = ({ isOpen, onClose, locationName, locationAddress, locationCity, coordinates }) => {
  const { t } = useTranslation();
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (!isOpen || !mapContainer.current) return;


    const defaultCoordinates = [106.6297, 10.8231];
    const mapCoordinates = coordinates && coordinates.length === 2 ? coordinates : defaultCoordinates;
    
    // console.log('MapModal coordinates:', coordinates);
    // console.log('Using map coordinates:', mapCoordinates);


    map.current = new trackasiagl.Map({
      container: mapContainer.current,
      style: 'https://maps.track-asia.com/styles/v2/streets.json?key=471b2d9cb08af55e44917643393061dc12',
      center: mapCoordinates,
      zoom: 18,
      attributionControl: true
    });

    map.current.on('load', () => {
      // console.log('Map loaded successfully in modal at coordinates:', mapCoordinates);
      
      // Add marker
      new trackasiagl.Marker({
        color: '#3B82F6' 
      })
        .setLngLat(mapCoordinates)
        .setPopup(
          new trackasiagl.Popup({ offset: 25 })
            .setHTML(`
              <div class="p-2">
                <h3 class="font-semibold text-sm">${locationName}</h3>
                <p class="text-xs text-gray-600">${locationAddress}, ${locationCity}</p>
                <p class="text-xs text-gray-500 mt-1">Coordinates: ${mapCoordinates[1].toFixed(6)}, ${mapCoordinates[0].toFixed(6)}</p>
              </div>
            `)
        )
        .addTo(map.current);
    });


    map.current.on('error', (e) => {
      console.error('Map error:', e);
    });


    map.current.addControl(new trackasiagl.NavigationControl(), 'top-right');


    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isOpen, locationName, locationAddress, locationCity, coordinates]);

  if (!isOpen) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      className="max-w-4xl w-full max-h-[80vh]"
    >
      <div className="p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {t('vehicleLocation') || 'Vehicle Location'}
          </h2>
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <div>
              <p className="font-semibold text-gray-900">{locationName}</p>
              <p className="text-sm text-gray-600">{locationAddress}, {locationCity}</p>
            </div>
          </div>
        </div>
        
        <div 
          ref={mapContainer} 
          className="w-full h-96 rounded-lg border border-gray-200"
          style={{ minHeight: '400px' }}
        />
        
        {/* <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-yellow-800">
              {t('specificAddressAfterBooking') || 'Specific address will be provided after booking confirmation'}
            </p>
          </div>
        </div> */}
      </div>
    </Modal>
  );
};

export default MapModal;