// components/NotFound.js
import React from 'react';
import styles from './NotFound.module.css';

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <div className={styles.message}>
        <h1 className={styles.title}>404</h1>
        <p className={styles.text}>Oops! The page you're looking for can't be found.</p>
        <a href="#" className={styles.homeLink}>Go back to Home</a>
      </div>
    </div>
  );
};

export default NotFound;
