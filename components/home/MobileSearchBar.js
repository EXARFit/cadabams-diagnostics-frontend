import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './MobileSearchBar.module.css';
import layoutStyles from '../Layout.module.css';

const MobileSearchBar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const controlSearchBar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;

        // Hide when at the very top
        if (currentScrollY < 50) {
          setIsVisible(false);
        }
        // Show when scrolled down and scrolling down
        else if (currentScrollY > 50) {
          setIsVisible(true);
        }

        setLastScrollY(currentScrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlSearchBar);
      
      // Initial check
      controlSearchBar();

      return () => {
        window.removeEventListener('scroll', controlSearchBar);
      };
    }
  }, [lastScrollY]);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchTerm);
  };

  return (
    <motion.div 
      className={`${styles.mobileSearchContainer} ${isVisible ? styles.visible : ''} ${layoutStyles.zIndexSearch}`}
      initial={false}
      animate={{ 
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
      transition={{ duration: 0.2 }}
    >
      <form onSubmit={handleSearch} className={styles.searchForm}>
        <div className={styles.searchInputWrapper}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search for tests or checkups"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </form>
      <div className={styles.discountBanner}>
        Get <span className={styles.highlight}>15% OFF*</span> | Use code: <span className={styles.highlight}>CADABAM15</span>
      </div>
    </motion.div>
  );
};

export default MobileSearchBar;