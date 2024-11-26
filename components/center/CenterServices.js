import React from 'react';
import PropTypes from 'prop-types';
import { FaFlask, FaHeartbeat, FaUserMd, FaBaby, FaBrain, FaAllergies } from 'react-icons/fa';
import styles from './CenterServices.module.css';

const iconMap = {
  'routine': FaFlask,
  'cardiac': FaHeartbeat,
  'health': FaUserMd,
  'pregnancy': FaBaby,
  'specialized': FaBrain,
  'allergy': FaAllergies
};

const CenterServices = ({ services, animate }) => {
  return (
    <div className={`${styles.servicesSection} ${animate ? styles.animate : ''}`}>
      <h2 className={styles.sectionTitle}>Our Services</h2>
      <p className={styles.sectionDescription}>
        We offer a comprehensive range of diagnostic services with state-of-the-art technology
        and experienced healthcare professionals.
      </p>

      <div className={styles.servicesGrid}>
        {services.map((service, index) => {
          const IconComponent = iconMap[service.icon.toLowerCase()] || FaFlask;
          
          return (
            <div 
              key={index}
              className={styles.serviceCard}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={styles.serviceIcon}>
                <IconComponent />
              </div>
              
              <h3 className={styles.serviceTitle}>{service.title}</h3>
              <p className={styles.serviceDescription}>{service.description}</p>
              
              <ul className={styles.testList}>
                {service.tests.map((test, testIndex) => (
                  <li key={testIndex} className={styles.testItem}>{test}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

CenterServices.propTypes = {
  services: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      tests: PropTypes.arrayOf(PropTypes.string).isRequired
    })
  ).isRequired,
  animate: PropTypes.bool
};

CenterServices.defaultProps = {
  animate: false
};

export default React.memo(CenterServices);