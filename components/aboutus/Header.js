import React from 'react';
import styles from './Header.module.css';

const Header = () => {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <h1>About Cadabams</h1>
        <p>Cadabams has been a pioneer in the field of mental healthcare for over three decades. Cadabams Diagnostics marks our foray into radiology, diagnostics, and interventional services.</p>
      </div>
    </div>
  );
};

export default Header;