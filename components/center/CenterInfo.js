import React from 'react';
import PropTypes from 'prop-types';
import styles from './CenterInfo.module.css';
import { FaMapMarkerAlt, FaPhone, FaClock, FaParking, FaWheelchair, FaClinicMedical } from 'react-icons/fa';

const CenterInfo = ({ info, workingHours }) => {
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
      <div className={styles.mapContainer}>
        <iframe
          src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodeURIComponent(info.map_location)}`}
          width="100%"
          height="300"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className={styles.map}
          title="Center Location"
        />
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