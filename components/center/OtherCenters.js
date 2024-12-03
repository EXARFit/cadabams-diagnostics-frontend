import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Image from 'next/image';
import { FaMapMarkerAlt, FaPhone, FaClock, FaArrowRight } from 'react-icons/fa';
import styles from './OtherCenters.module.css';
import ImageWrapper from './ImageWrapper';

const OtherCenters = ({ centers = [] }) => {
  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    return `${hour % 12 || 12}:${minutes || '00'} ${hour >= 12 ? 'PM' : 'AM'}`;
  };

  const generateUrl = (city, area) => {
    if (!city || !area) return '#';
    return `/${city.toLowerCase()}/center/${area.toLowerCase()}`;
  };

  if (!centers || centers.length === 0) {
    return null;
  }

  return (
    <div className={styles.centerSection}>
      <h2 className={styles.sectionTitle}>Other Centers in Bangalore</h2>
      <p className={styles.sectionDescription}>
        Visit our other diagnostic centers across Bangalore for the same quality service
      </p>

      <div className={styles.centerGrid}>
        {centers.map((center, index) => {
          if (!center?.basic_info) return null;
          
          const { basic_info, center_info, working_hours } = center;

          return (
            <div 
              key={center._id || index} 
              className={styles.centerCard}
            >
              <div className={styles.imageWrapper}>
              {basic_info.center_image && (
  <ImageWrapper
    src={basic_info.center_image}
    alt={basic_info.center_name || 'Diagnostic Center'}
    width={400}
    height={250}
    className={styles.centerImage}
    defaultImage="/images/default-center.jpg"
  />
)}
              </div>

              <div className={styles.centerInfo}>
                <h3 className={styles.centerName}>
                  {basic_info.center_name}
                </h3>

                {center_info?.address && (
                  <div className={styles.infoItem}>
                    <FaMapMarkerAlt className={styles.icon} />
                    <p>{center_info.address}</p>
                  </div>
                )}

                {center_info?.phone && (
                  <div className={styles.infoItem}>
                    <FaPhone className={styles.icon} />
                    <p>{center_info.phone}</p>
                  </div>
                )}

                {working_hours?.weekdays && (
                  <div className={styles.infoItem}>
                    <FaClock className={styles.icon} />
                    <p>
                      {formatTime(working_hours.weekdays.start)} - {formatTime(working_hours.weekdays.end)}
                    </p>
                  </div>
                )}

                {basic_info.city && basic_info.area && (
                  <Link 
                    href={generateUrl(basic_info.city, basic_info.area)}
                    className={styles.viewButton}
                  >
                    View Center <FaArrowRight className={styles.arrowIcon} />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

OtherCenters.propTypes = {
  centers: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      basic_info: PropTypes.shape({
        center_name: PropTypes.string,
        center_image: PropTypes.string,
        city: PropTypes.string,
        area: PropTypes.string
      }),
      center_info: PropTypes.shape({
        address: PropTypes.string,
        phone: PropTypes.string
      }),
      working_hours: PropTypes.shape({
        weekdays: PropTypes.shape({
          start: PropTypes.string,
          end: PropTypes.string
        })
      })
    })
  )
};

OtherCenters.defaultProps = {
  centers: []
};

export default React.memo(OtherCenters);