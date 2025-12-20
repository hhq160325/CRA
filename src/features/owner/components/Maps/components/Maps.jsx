// import { useEffect, useRef, useState } from 'react';
// import trackasiagl from 'trackasia-gl';
// import 'trackasia-gl/dist/trackasia-gl.css';

// const Maps = () => {
//   const [mapError, setMapError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const mapContainer = useRef(null);

//   useEffect(() => {
//     const initializeMap = async () => {
//       try {
//         setIsLoading(true);
//         console.log('Attempting to load trackasia-gl...');

//         console.log('trackasia-gl loaded, creating map...');

//         // Add timeout to prevent infinite loading
//         const timeoutId = setTimeout(() => {
//           setMapError('Map initialization timeout');
//           setIsLoading(false);
//         }, 10000);

//         const map = new trackasiagl.Map({
//           container: mapContainer.current,
//           style: 'https://maps.track-asia.com/styles/v2/streets.json?key=471b2d9cb08af55e44917643393061dc12',
//           center: [106.694945, 10.769034],
//           zoom: 9
//         });

//         map.on('load', () => {
//           console.log('Map loaded successfully');
//           clearTimeout(timeoutId);
//           map.resize();
//           setIsLoading(false);
//         });

//         map.on('error', (e) => {
//           console.error('Map error:', e);
//           clearTimeout(timeoutId);
//           setMapError('Failed to load map style or tiles');
//           setIsLoading(false);
//         });

//       } catch (error) {
//         console.error('Error loading trackasia-gl:', error);
//         setMapError(`Library loading error: ${error.message}`);
//         setIsLoading(false);
//       }
//     };

//     // Add delay to ensure DOM is ready
//     setTimeout(initializeMap, 100);
//   }, []);

//   if (mapError) {
//     return (
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-4">Maps</h1>
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <p className="text-red-800">Error: {mapError}</p>
//           <button 
//             onClick={() => window.location.reload()} 
//             className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//           >
//             Retry
//           </button>
//         </div>
//         <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//           <h3 className="font-semibold mb-2">Fallback: Static Map View</h3>
//           <iframe
//             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4326!2d106.6947!3d10.7690!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzA4LjQiTiAxMDbCsDQxJzQxLjAiRQ!5e0!3m2!1sen!2s!4v1234567890"
//             width="100%"
//             height="h-full-screen"
//             style={{ border: 0 }}
//             allowFullScreen=""
//             loading="lazy"
//             referrerPolicy="no-referrer-when-downgrade"
//             title="Ho Chi Minh City Map"
//           />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Maps</h1>
//       {isLoading && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
//           <div className="flex items-center">
//             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
//             <p className="text-blue-800">Loading interactive map...</p>
//           </div>
//         </div>
//       )}
//       <div 
//         ref={mapContainer} 
//         style={{ 
//           width: '100%', 
//           height: '600px',
//           backgroundColor: '#e5e7eb',
//           visibility: isLoading ? 'hidden' : 'visible'
//         }}
//         className="border border-gray-300 rounded-lg shadow-sm"
//       />
//     </div>
//   );
// };

// export default Maps;

// import { useEffect, useRef, useState } from 'react';

// const Maps = () => {
//   const [mapError, setMapError] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const mapContainer = useRef(null);
//   const mapInstance = useRef(null);

//   useEffect(() => {
//     // Prevent double initialization
//     if (mapInstance.current) return;

//     const initializeMap = async () => {
//       try {
//         setIsLoading(true);
//         console.log('Initializing TrackAsia map...');

//         // Dynamically load TrackAsia GL
//         const script = document.createElement('script');
//         script.src = 'https://cdn.jsdelivr.net/npm/trackasia-gl@2.0.0/dist/trackasia-gl.js';
//         script.async = true;

//         const link = document.createElement('link');
//         link.rel = 'stylesheet';
//         link.href = 'https://cdn.jsdelivr.net/npm/trackasia-gl@2.0.0/dist/trackasia-gl.css';

//         document.head.appendChild(link);
//         document.head.appendChild(script);

//         script.onload = () => {
//           console.log('TrackAsia GL loaded');

//           const timeoutId = setTimeout(() => {
//             if (isLoading) {
//               setMapError('Map initialization timeout');
//               setIsLoading(false);
//             }
//           }, 15000);

//           try {
//             const map = new window.trackasiagl.Map({
//               container: mapContainer.current,
//               style: 'https://maps.track-asia.com/styles/v2/streets.json?key=471b2d9cb08af55e44917643393061dc12',
//               center: [106.694945, 10.769034],
//               zoom: 11
//             });

//             mapInstance.current = map;

//             map.on('load', () => {
//               console.log('Map loaded successfully');
//               clearTimeout(timeoutId);
//               setIsLoading(false);
//               setMapError(null); // Clear any errors

//               // Force resize to ensure proper rendering
//               setTimeout(() => {
//                 map.resize();
//               }, 100);
//             });

//             // Only set error for critical errors
//             map.on('error', (e) => {
//               console.error('Map error:', e);
//               // Don't set error for style warnings, only for critical failures
//               if (e.error && e.error.status === 404) {
//                 clearTimeout(timeoutId);
//                 setMapError('Failed to load map resources');
//                 setIsLoading(false);
//               }
//             });

//           } catch (error) {
//             console.error('Error creating map:', error);
//             clearTimeout(timeoutId);
//             setMapError(`Map creation error: ${error.message}`);
//             setIsLoading(false);
//           }
//         };

//         script.onerror = () => {
//           setMapError('Failed to load TrackAsia GL library');
//           setIsLoading(false);
//         };

//       } catch (error) {
//         console.error('Error initializing map:', error);
//         setMapError(`Initialization error: ${error.message}`);
//         setIsLoading(false);
//       }
//     };

//     setTimeout(initializeMap, 100);

//     // Cleanup
//     return () => {
//       if (mapInstance.current) {
//         mapInstance.current.remove();
//         mapInstance.current = null;
//       }
//     };
//   }, []);

//   if (mapError) {
//     return (
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-4">Maps</h1>
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <p className="text-red-800">Error: {mapError}</p>
//           <button
//             onClick={() => window.location.reload()}
//             className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
//           >
//             Retry
//           </button>
//         </div>
//         <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//           <h3 className="font-semibold mb-2">Fallback: Static Map View</h3>
//           <iframe
//             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4326!2d106.6947!3d10.7690!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzA4LjQiTiAxMDbCsDQxJzQxLjAiRQ!5e0!3m2!1sen!2s!4v1234567890"
//             width="100%"
//             height="500"
//             style={{ border: 0 }}
//             allowFullScreen=""
//             loading="lazy"
//             referrerPolicy="no-referrer-when-downgrade"
//             title="Ho Chi Minh City Map"
//           />
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-screen">
//       {/* <div className="p-6 flex-shrink-0">
//         <h1 className="text-2xl font-bold mb-4">Maps</h1>
//         {isLoading && (
//           <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
//             <div className="flex items-center">
//               <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
//               <p className="text-blue-800">Loading interactive map...</p>
//             </div>
//           </div>
//         )}
//       </div> */}
//       <div className="flex-1 px-6 pb-6">
//         <div
//           ref={mapContainer}
//           style={{
//             width: '100%',
//             height: '100%',
//             minHeight: '400px',
//             backgroundColor: '#e5e7eb',
//             opacity: isLoading ? 0 : 1,
//             transition: 'opacity 0.3s ease-in-out'
//           }}
//           className="border border-gray-300 rounded-lg shadow-sm"
//         />
//       </div>
//     </div>
//   );
// };

// export default Maps;

import { useEffect, useRef, useState } from 'react';
import trackasiagl from 'trackasia-gl';
import 'trackasia-gl/dist/trackasia-gl.css';

const Maps = () => {
  const [mapError, setMapError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    // Prevent double initialization
    if (mapInstance.current) return;

    const initializeMap = async () => {
      try {
        setIsLoading(true);
        console.log('Initializing TrackAsia map...');
        
        const timeoutId = setTimeout(() => {
          if (isLoading) {
            setMapError('Map initialization timeout');
            setIsLoading(false);
          }
        }, 15000);

        const map = new trackasiagl.Map({
          container: mapContainer.current,
          style: 'https://maps.track-asia.com/styles/v2/streets.json?key=471b2d9cb08af55e44917643393061dc12',
          center: [106.694945, 10.769034],
          zoom: 11
        });

        mapInstance.current = map;

        map.on('load', () => {
          console.log('Map loaded successfully');
          clearTimeout(timeoutId);
          setIsLoading(false);
          setMapError(null); // Clear any errors
          
          // Force resize to ensure proper rendering
          setTimeout(() => {
            map.resize();
          }, 100);
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
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  if (mapError) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Maps</h1>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">Error: {mapError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold mb-2">Fallback: Static Map View</h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4326!2d106.6947!3d10.7690!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzA4LjQiTiAxMDbCsDQxJzQxLjAiRQ!5e0!3m2!1sen!2s!4v1234567890"
            width="100%"
            height="500"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ho Chi Minh City Map"
          />
        </div>
      </div>
    );
  }

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