import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import styles from './CenterInfo.module.css';
import { FaMapMarkerAlt, FaPhone, FaClock, FaParking, FaWheelchair, FaClinicMedical } from 'react-icons/fa';

const CenterInfo = ({ info, workingHours }) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const GOOGLE_MAPS_API_KEY = 'AIzaSyBEqywddlcncqAxAqO7pkw76CKEIHPx0f8';

  const centerFeatures = [
    {
      icon: <FaParking />,
      title: "Parking Available",
      description: "Free parking space for patients"
    },
    {
      icon: <FaWheelchair />,
      title: "Wheelchair Access",
      description: "Accessible facility for all patients"
    },
    {
      icon: <FaClinicMedical />,
      title: "Modern Facilities",
      description: "State-of-the-art medical equipment"
    }
  ];

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const handleGetDirections = () => {
    if (info.map_location) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(info.map_location)}`, '_blank');
    }
  };

  const handleCall = () => {
    window.location.href = `tel:${info.phone}`;
  };

  // Load Google Maps Script
  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (window.google && window.google.maps) {
        setMapLoaded(true);
        return;
      }

      // Block geolocation before loading maps
      if (navigator.geolocation) {
        const originalGetCurrentPosition = navigator.geolocation.getCurrentPosition;
        navigator.geolocation.getCurrentPosition = function() {
          console.log('Geolocation blocked for Maps');
        };
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
      script.async = true;
      script.onload = () => setMapLoaded(true);
      script.onerror = () => console.error('Error loading Google Maps API');
      
      // Add callback to window
      window.initMap = () => {
        console.log('Google Maps API loaded');
        setMapLoaded(true);
      };
      
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, []);

  // Initialize Map with Marker
  useEffect(() => {
    if (mapLoaded && mapRef.current && info.address && !map) {
      console.log('=== GEOCODING DEBUG ===');
      console.log('Address to geocode:', info.address);
      console.log('Address type:', typeof info.address);
      console.log('Address length:', info.address.length);
      
      const geocoder = new window.google.maps.Geocoder();
      
      // Disable geolocation to prevent using user's location
      const geocodeRequest = {
        address: info.address.trim(), // Remove any extra whitespace
        region: 'IN', // Specify India as region for better results
        // Explicitly disable location bias
        bounds: null,
        location: null
      };
      
      console.log('Geocoding request:', geocodeRequest);
      
      // Geocode the address to get coordinates
      geocoder.geocode(geocodeRequest, (results, status) => {
        console.log('=== GEOCODING RESPONSE ===');
        console.log('Geocoding status:', status);
        console.log('Number of results:', results ? results.length : 0);
        
        if (results && results.length > 0) {
          console.log('First result:', results[0]);
          console.log('Formatted address:', results[0].formatted_address);
          console.log('Address components:', results[0].address_components);
        }
        
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          const lat = location.lat();
          const lng = location.lng();
          
          console.log('=== FINAL COORDINATES ===');
          console.log('Latitude:', lat);
          console.log('Longitude:', lng);
          console.log('Google Maps URL:', `https://www.google.com/maps?q=${lat},${lng}`);
          
          // Create map centered exactly on the geocoded address
          const googleMap = new window.google.maps.Map(mapRef.current, {
            zoom: 17, // Higher zoom for more precision
            center: { lat: lat, lng: lng }, // Explicit coordinates
            mapTypeId: window.google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: false,
            zoomControl: true,
            streetViewControl: true,
            styles: [
              {
                featureType: 'poi.business',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ]
          });

          // Create info window with the exact address
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 12px; max-width: 280px; font-family: Arial, sans-serif;">
                <h3 style="margin: 0 0 8px 0; color: #dc3545; font-size: 16px; font-weight: 600;">🏥 Medical Center</h3>
                <p style="margin: 0 0 8px 0; color: #333; font-size: 13px; line-height: 1.4;"><strong>📍 Address:</strong><br/>${info.address}</p>
                <p style="margin: 0 0 8px 0; color: #666; font-size: 12px;"><strong>Google Address:</strong><br/>${results[0].formatted_address}</p>
                <div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #eee;">
                  <p style="margin: 0 0 4px 0;"><a href="tel:${info.phone}" style="color: #dc3545; text-decoration: none; font-weight: 500;">📞 ${info.phone}</a></p>
                  <p style="margin: 0;"><a href="https://wa.me/${info.whatsapp}" target="_blank" style="color: #25d366; text-decoration: none; font-weight: 500;">📱 WhatsApp</a></p>
                </div>
              </div>
            `
          });

          // Create marker at the EXACT geocoded location
          const marker = new window.google.maps.Marker({
            position: { lat: lat, lng: lng }, // Use explicit coordinates
            map: googleMap,
            title: `Medical Center - ${info.address}`,
            animation: window.google.maps.Animation.DROP,
            optimized: false, // Prevent marker clustering/optimization
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="32" height="48" viewBox="0 0 32 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 0C7.164 0 0 7.164 0 16c0 16 16 32 16 32s16-16 16-32C32 7.164 24.836 0 16 0z" fill="#dc3545"/>
                  <circle cx="16" cy="16" r="12" fill="#ffffff"/>
                  <path d="M16 6l-2 2v6h-6l-2 2 2 2h6v6l2 2 2-2v-6h6l2-2-2-2h-6v-6z" fill="#dc3545"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(32, 48),
              anchor: new window.google.maps.Point(16, 48)
            }
          });

          console.log('=== MARKER CREATED ===');
          console.log('Marker position:', marker.getPosition().lat(), marker.getPosition().lng());

          // Show info window by default
          setTimeout(() => {
            infoWindow.open(googleMap, marker);
          }, 1000);

          // Add click event to marker
          marker.addListener('click', () => {
            infoWindow.open(googleMap, marker);
          });

          // Add click event to map to close info window
          googleMap.addListener('click', () => {
            infoWindow.close();
          });

          // Force map to center on marker after everything loads
          setTimeout(() => {
            googleMap.setCenter({ lat: lat, lng: lng });
            googleMap.setZoom(17);
          }, 2000);

          setMap(googleMap);
        } else {
          console.error('Geocoding failed:', status);
          console.log('Trying with map_location as fallback...');
          
          // Try with map_location if available
          if (info.map_location && info.map_location !== info.address) {
            geocoder.geocode({ 
              address: info.map_location,
              region: 'IN'
            }, (fallbackResults, fallbackStatus) => {
              if (fallbackStatus === 'OK' && fallbackResults[0]) {
                const location = fallbackResults[0].geometry.location;
                console.log('Fallback location found:', location.lat(), location.lng());
                
                const googleMap = new window.google.maps.Map(mapRef.current, {
                  zoom: 16,
                  center: location,
                  mapTypeId: window.google.maps.MapTypeId.ROADMAP
                });

                const marker = new window.google.maps.Marker({
                  position: location,
                  map: googleMap,
                  title: 'Medical Center',
                  animation: window.google.maps.Animation.DROP,
                  icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                      <svg width="32" height="48" viewBox="0 0 32 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 0C7.164 0 0 7.164 0 16c0 16 16 32 16 32s16-16 16-32C32 7.164 24.836 0 16 0z" fill="#dc3545"/>
                        <circle cx="16" cy="16" r="12" fill="#ffffff"/>
                        <path d="M16 6l-2 2v6h-6l-2 2 2 2h6v6l2 2 2-2v-6h6l2-2-2-2h-6v-6z" fill="#dc3545"/>
                      </svg>
                    `),
                    scaledSize: new window.google.maps.Size(32, 48),
                    anchor: new window.google.maps.Point(16, 48)
                  }
                });

                setMap(googleMap);
              } else {
                // Final fallback to default location
                console.log('All geocoding attempts failed, using default location');
                const defaultLocation = { lat: 28.4595, lng: 77.0266 }; // Gurugram default
                
                const googleMap = new window.google.maps.Map(mapRef.current, {
                  zoom: 12,
                  center: defaultLocation,
                  mapTypeId: window.google.maps.MapTypeId.ROADMAP
                });

                // Still show a marker at default location
                new window.google.maps.Marker({
                  position: defaultLocation,
                  map: googleMap,
                  title: 'Approximate Location - Please contact for exact address',
                  icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                      <svg width="32" height="48" viewBox="0 0 32 48" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 0C7.164 0 0 7.164 0 16c0 16 16 32 16 32s16-16 16-32C32 7.164 24.836 0 16 0z" fill="#ffc107"/>
                        <circle cx="16" cy="16" r="12" fill="#ffffff"/>
                        <text x="16" y="20" text-anchor="middle" font-size="16" fill="#ffc107">?</text>
                      </svg>
                    `),
                    scaledSize: new window.google.maps.Size(32, 48),
                    anchor: new window.google.maps.Point(16, 48)
                  }
                });

                setMap(googleMap);
              }
            });
          } else {
            // Final fallback to default location
            console.log('No map_location available, using default location');
            const defaultLocation = { lat: 28.4595, lng: 77.0266 }; // Gurugram default
            
            const googleMap = new window.google.maps.Map(mapRef.current, {
              zoom: 12,
              center: defaultLocation,
              mapTypeId: window.google.maps.MapTypeId.ROADMAP
            });

            setMap(googleMap);
          }
        }
      });
    }
  }, [mapLoaded, info.address, info.map_location, map]);

  return (
    <div className={styles.infoSection}>
      <h2 className={styles.sectionTitle}>Center Information</h2>

      <div className={styles.infoGrid}>
        {/* Address Section */}
        <div className={styles.addressCard}>
          <div className={styles.iconWrapper}>
            <FaMapMarkerAlt />
          </div>
          <h3>Location</h3>
          <p>{info.address}</p>
          <button 
            onClick={handleGetDirections}
            className={styles.directionsButton}
          >
            Get Directions
          </button>
        </div>

        {/* Contact Section */}
        <div className={styles.contactCard}>
          <div className={styles.iconWrapper}>
            <FaPhone />
          </div>
          <h3>Contact Us</h3>
          <p>Call: {info.phone}</p>
          <p>WhatsApp: {info.whatsapp}</p>
          <button 
            onClick={handleCall}
            className={styles.callButton}
          >
            Call Now
          </button>
        </div>

        {/* Timings Section */}
        <div className={styles.timingsCard}>
          <div className={styles.iconWrapper}>
            <FaClock />
          </div>
          <h3>Working Hours</h3>
          <div className={styles.timingGrid}>
            <div>
              <p className={styles.dayLabel}>Mon - Sat:</p>
              <p>{formatTime(workingHours.weekdays.start)} - {formatTime(workingHours.weekdays.end)}</p>
            </div>
            <div>
              <p className={styles.dayLabel}>Sunday:</p>
              <p>{formatTime(workingHours.sunday.start)} - {formatTime(workingHours.sunday.end)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Center Features */}
      <div className={styles.featuresGrid}>
        {centerFeatures.map((feature, index) => (
          <div key={index} className={styles.featureCard}>
            <div className={styles.featureIcon}>
              {feature.icon}
            </div>
            <h4>{feature.title}</h4>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Map Section */}
      <div className={styles.mapSection}>
        <h2>Find Us</h2>
        <div className={styles.mapContainer}>
          {mapLoaded ? (
            <div 
              ref={mapRef}
              style={{ 
                width: '100%', 
                height: '450px',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
              }}
            />
          ) : (
            <div 
              style={{ 
                width: '100%', 
                height: '450px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                color: '#6c757d'
              }}
            >
              Loading map...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

CenterInfo.propTypes = {
  info: PropTypes.shape({
    address: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    whatsapp: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    map_location: PropTypes.string.isRequired
  }).isRequired,
  workingHours: PropTypes.shape({
    weekdays: PropTypes.shape({
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired
    }).isRequired,
    sunday: PropTypes.shape({
      start: PropTypes.string.isRequired,
      end: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default React.memo(CenterInfo);
