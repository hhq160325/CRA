import { useEffect, useRef, useState } from 'react';
import trackasiagl from 'trackasia-gl';
import 'trackasia-gl/dist/trackasia-gl.css';
import { parkLotService } from '../services/parkLotService';

const Maps = () => {
  const [mapError, setMapError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [parkLots, setParkLots] = useState([]);
  const [loadingParkLots, setLoadingParkLots] = useState(false);
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);

  // Fetch parking lots data
  const fetchParkLots = async () => {
    try {
      setLoadingParkLots(true);
      const transformedData = await parkLotService.getParkLotsWithManagers();
      setParkLots(transformedData);
      // console.log('Fetched parking lots with managers:', transformedData);
    } catch (error) {
      // console.error('Failed to fetch parking lots:', error);
    } finally {
      setLoadingParkLots(false);
    }
  };

  // Add parking lot markers to map
  const addParkLotMarkers = (map, parkLots) => {
    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    parkLots.forEach(parkLot => {
      // Create custom marker element
      const markerElement = document.createElement('div');
      markerElement.className = 'parking-lot-marker';
      markerElement.innerHTML = `
        <div style="
          background-color: #3B82F6;
          color: white;
          padding: 8px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          cursor: pointer;
          white-space: nowrap;
          border: 2px solid white;
        ">
          ${parkLot.name}
        </div>
      `;

      // Create popup content
      const popupContent = `
        <div style="padding: 12px; max-width: 280px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #1F2937;">
            ${parkLot.name}
          </h3>
          <div style="margin-bottom: 8px;">
            <strong style="color: #374151;">Address:</strong>
            <p style="margin: 2px 0; color: #6B7280; font-size: 14px;">${parkLot.fullAddress}</p>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <div>
              <strong style="color: #374151;">Capacity:</strong>
              <span style="color: #6B7280; margin-left: 4px;">${parkLot.capacity}</span>
            </div>
            <div>
              <strong style="color: #374151;">Status:</strong>
              <span style="color: ${parkLot.status === 'Active' ? '#10B981' : '#EF4444'}; margin-left: 4px;">
                ${parkLot.status}
              </span>
            </div>
          </div>
          ${parkLot.manager ? `
            <div style="margin-bottom: 8px; padding: 8px; background-color: #F3F4F6; border-radius: 6px;">
              <strong style="color: #374151;">Manager:</strong>
              <p style="margin: 2px 0; color: #1F2937; font-weight: 500;">${parkLot.manager.fullName}</p>
              ${parkLot.manager.email ? `
                <p style="margin: 1px 0; color: #6B7280; font-size: 13px;">${parkLot.manager.email}</p>
              ` : ''}
              ${parkLot.manager.phoneNumber ? `
                <p style="margin: 1px 0; color: #6B7280; font-size: 13px;">${parkLot.manager.phoneNumber}</p>
              ` : ''}
            </div>
          ` : ''}
          ${parkLot.contactNum ? `
            <div style="margin-bottom: 8px;">
              <strong style="color: #374151;">Contact:</strong>
              <span style="color: #6B7280; margin-left: 4px;">${parkLot.contactNum}</span>
            </div>
          ` : ''}
        </div>
      `;

      // Create popup
      const popup = new trackasiagl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false
      }).setHTML(popupContent);

      // Create marker
      const marker = new trackasiagl.Marker(markerElement)
        .setLngLat([parkLot.longitude, parkLot.latitude])
        .setPopup(popup)
        .addTo(map);

      markersRef.current.push(marker);
    });
  };
  useEffect(() => {
    // Prevent double initialization
    if (mapInstance.current) return;

    const initializeMap = async () => {
      try {
        setIsLoading(true);
        // console.log('Initializing TrackAsia map...');
        
        const timeoutId = setTimeout(() => {
          if (isLoading) {
            setMapError('Map initialization timeout');
            setIsLoading(false);
          }
        }, 15000);

        const map = new trackasiagl.Map({
          container: mapContainer.current,
          style: 'https://maps.track-asia.com/styles/v2/streets.json?key=public',
          center: [106.694945, 10.769034],
          zoom: 11
        });

        mapInstance.current = map;

        map.on('load', async () => {
          // console.log('Map loaded successfully');
          clearTimeout(timeoutId);
          setIsLoading(false);
          setMapError(null); // Clear any errors
          
          // Force resize to ensure proper rendering
          setTimeout(() => {
            map.resize();
          }, 100);

          // Fetch and add parking lot markers
          await fetchParkLots();
        });

        // Only set error for critical errors, not warnings
        map.on('error', (e) => {
          console.error('Map error:', e);
          // Only trigger fallback for critical failures (404, network errors)
          if (e.error && (e.error.status === 404 || e.error.message?.includes('Failed to fetch'))) {
            clearTimeout(timeoutId);
            setMapError('Failed to load map resources');
            setIsLoading(false);
          }
          // Ignore style warnings and non-critical errors
        });

      } catch (error) {
        console.error('Error initializing map:', error);
        setMapError(`Initialization error: ${error.message}`);
        setIsLoading(false);
      }
    };

    setTimeout(initializeMap, 100);

    // Cleanup
    return () => {
      // Clear markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];
      
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Effect to add markers when parkLots data is available
  useEffect(() => {
    if (mapInstance.current && parkLots.length > 0) {
      addParkLotMarkers(mapInstance.current, parkLots);
    }
  }, [parkLots]);

  // if (mapError) {
  //   return (
  //     <div className="p-6">
  //       <h1 className="text-2xl font-bold mb-4">Maps</h1>
  //       <div className="bg-red-50 border border-red-200 rounded-lg p-4">
  //         <p className="text-red-800">Error: {mapError}</p>
  //         <button 
  //           onClick={() => window.location.reload()} 
  //           className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
  //         >
  //           Retry
  //         </button>
  //       </div>
  //       <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
  //         <h3 className="font-semibold mb-2">Fallback: Static Map View</h3>
  //         <iframe
  //           src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4326!2d106.6947!3d10.7690!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzA4LjQiTiAxMDbCsDQxJzQxLjAiRQ!5e0!3m2!1sen!2s!4v1234567890"
  //           width="100%"
  //           height="500"
  //           style={{ border: 0 }}
  //           allowFullScreen=""
  //           loading="lazy"
  //           referrerPolicy="no-referrer-when-downgrade"
  //           title="Ho Chi Minh City Map"
  //         />
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col h-screen">
      <div className="p-6 flex-shrink-0">
        <h1 className="text-2xl font-bold mb-4">Maps</h1>
        {isLoading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
              <p className="text-blue-800">Loading interactive map...</p>
            </div>
          </div>
        )}
        {loadingParkLots && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600 mr-3"></div>
              <p className="text-green-800">Loading parking lots and manager information...</p>
            </div>
          </div>
        )}
        {/* {parkLots.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-green-800">
                Found {parkLots.length} active parking lot{parkLots.length !== 1 ? 's' : ''} with manager details - Click markers for information
              </p>
            </div>
          </div>
        )} */}
      </div>
      <div className="flex-1 px-6 pb-6">
        <div 
          ref={mapContainer} 
          style={{ 
            width: '100%', 
            height: '100%',
            minHeight: '400px',
            backgroundColor: '#e5e7eb',
            opacity: isLoading ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out'
          }}
          className="border border-gray-300 rounded-lg shadow-sm"
        />
      </div>
    </div>
  );
};

export default Maps;