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

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.onload = () => setMapLoaded(true);
      script.onerror = () => console.error('Error loading Google Maps API');
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, []);

  // Initialize Map with Marker
  useEffect(() => {
    if (mapLoaded && mapRef.current && info.address && !map) {
      const geocoder = new window.google.maps.Geocoder();
      
      // Geocode the address to get coordinates
      geocoder.geocode({ address: info.address }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const location = results[0].geometry.location;
          
          // Create map
          const googleMap = new window.google.maps.Map(mapRef.current, {
            zoom: 15,
            center: location,
            mapTypeId: window.google.maps.MapTypeId.ROADMAP,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ]
          });

          // Create marker
          new window.google.maps.Marker({
            position: location,
            map: googleMap,
            title: 'Medical Center Location',
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="#dc3545" stroke="#fff" stroke-width="2"/>
                  <path d="M20 8l-2 2v8h-8l-2 2 2 2h8v8l2 2 2-2v-8h8l2-2-2-2h-8v-8z" fill="#fff"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 40)
            }
          });

          // Create info window
          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 10px; max-width: 250px;">
                <h3 style="margin: 0 0 8px 0; color: #333; font-size: 16px;">Medical Center</h3>
                <p style="margin: 0 0 8px 0; color: #666; font-size: 14px; line-height: 1.4;">${info.address}</p>
                <div style="margin-top: 10px;">
                  <a href="tel:${info.phone}" style="color: #dc3545; text-decoration: none; font-weight: 500;">📞 ${info.phone}</a>
                </div>
              </div>
            `
          });

          // Add click event to marker
          const marker = new window.google.maps.Marker({
            position: location,
            map: googleMap,
            title: 'Medical Center Location',
            icon: {
              url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="#dc3545" stroke="#fff" stroke-width="2"/>
                  <path d="M20 8l-2 2v8h-8l-2 2 2 2h8v8l2 2 2-2v-8h8l2-2-2-2h-8v-8z" fill="#fff"/>
                </svg>
              `),
              scaledSize: new window.google.maps.Size(40, 40),
              anchor: new window.google.maps.Point(20, 40)
            }
          });

          marker.addListener('click', () => {
            infoWindow.open(googleMap, marker);
          });

          setMap(googleMap);
        } else {
          console.error('Geocoding failed:', status);
          // Fallback to a default location if geocoding fails
          const defaultLocation = { lat: 28.4595, lng: 77.0266 }; // Gurugram default
          
          const googleMap = new window.google.maps.Map(mapRef.current, {
            zoom: 10,
            center: defaultLocation,
            mapTypeId: window.google.maps.MapTypeId.ROADMAP
          });

          setMap(googleMap);
        }
      });
    }
  }, [mapLoaded, info.address, map]);

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
