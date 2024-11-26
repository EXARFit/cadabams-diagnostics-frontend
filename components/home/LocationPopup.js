// components/home/LocationPopup.js
import React from 'react';
import styles from './LocationPopup.module.css';
import { BANGALORE_LOCATIONS } from '@/config/locations';

export default function LocationPopup({ onSelect }) {
  const handleLocationSelect = (location) => {
    localStorage.setItem('selectedLocation', location.value);
    onSelect(location.path);
  };

  const handleSkip = () => {
    localStorage.setItem('selectedLocation', 'skipped');
    onSelect('/');
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2 className={styles.title}>Select Your Location in Bangalore</h2>
        <div className={styles.areaGrid}>
          {BANGALORE_LOCATIONS.map((location) => (
            <button
              key={location.value}
              className={`${styles.areaButton} ${
                location.value === 'bangalore' ? styles.allAreas : ''
              }`}
              onClick={() => handleLocationSelect(location)}
            >
              <span className={styles.icon}>
                {location.value === 'bangalore' ? '🏙️' : '📍'}
              </span>
              {location.name}
            </button>
          ))}
          <button
            className={`${styles.areaButton} ${styles.skipButton}`}
            onClick={handleSkip}
          >
            <span className={styles.icon}>⏭️</span>
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}