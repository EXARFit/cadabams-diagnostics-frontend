import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronRight, FaUserMd } from 'react-icons/fa';
import { useRouter } from 'next/router';
import styles from './MostBooked.module.css';

// Category ID to route mapping
const CATEGORY_ID_MAP = {
  '671b5102ad9bf8d210384d1e': 'pregnancy-scan',
  '671b5102ad9bf8d210384d1d': 'preventive-health',
  '671b5102ad9bf8d210384d1f': 'msk-scan',
  '671b5102ad9bf8d210384d1b': 'ct-scan',
  '671b5102ad9bf8d210384d1a': 'mri-scan',
  '671b5102ad9bf8d210384d19': 'xray-scan',
  '671b5102ad9bf8d210384d1c': 'ultrasound-scan'
};

const backgroundImages = [
  'https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/image-1732506598235-412479478.png',
  'https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/image-1732506711722-29739745.png',
  'https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/image-1732506768205-315056070.png',
  'https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/image-1732506792016-518174806.png',
  'https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/image-1732506819136-683046439.png',
  'https://cadabams-diagnostics-assets.s3.ap-south-1.amazonaws.com/cadabam_assets/image-1732506846479-855597516.png'
];

const BackgroundCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.carouselContainer}>
      <AnimatePresence initial={false}>
        <motion.img
          key={currentIndex}
          src={backgroundImages[currentIndex]}
          alt="Background"
          className={styles.carouselImage}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 0.8, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 1 }}
        />
      </AnimatePresence>
    </div>
  );
};

const CheckupCard = ({ title, iconUrl, color, size, onClick }) => (
  <motion.div
    className={`${styles.card} ${styles[color]} ${styles[size]}`}
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300 }}
    onClick={onClick}
    role="button"
    tabIndex={0}
  >
    <div className={styles.cardContent}>
      {iconUrl ? (
        <img 
          src={iconUrl} 
          alt={title}
          className={styles.icon}
          width={24}
          height={24}
        />
      ) : (
        <FaUserMd className={styles.icon} />
      )}
      <h3>{title}</h3>
    </div>
    <FaChevronRight className={styles.arrow} />
  </motion.div>
);

export default function MostBooked({ mostBookedData }) {
  const router = useRouter();

  if (!mostBookedData) return null;

  const { title, description, checkups } = mostBookedData;

  const getCategoryBasedRoute = (categoryId, testRoute) => {
    // Remove any leading/trailing slashes from testRoute
    const cleanTestRoute = testRoute?.replace(/^\/+|\/+$/g, '') || '';
    
    // Get category type from mapping
    const categoryType = CATEGORY_ID_MAP[categoryId];
    
    if (!categoryType) {
      console.error('Invalid category ID:', categoryId);
      return '';
    }

    // Construct the full route
    return `/bangalore/${categoryType}/${cleanTestRoute}`;
  };

  const handleCardClick = (checkup) => {
    try {
      if (checkup?.catid && checkup?.href) {
        // Get the full route using category ID
        const fullRoute = getCategoryBasedRoute(checkup.catid, checkup.href);
        if (fullRoute) {
          router.push(fullRoute);
        }
      } else {
        console.error('Missing required checkup data:', checkup);
      }
    } catch (error) {
      console.error('Error handling card click:', error);
    }
  };

  const handleViewAllClick = () => {
    router.push('/bangalore/xray-scan');
  };

  return (
    <section className={styles.mostBooked}>
      <div className={styles.content}>
        <BackgroundCarousel />
        <h2>{title}</h2>
        <p>{description}</p>
        <motion.button
          className={styles.viewAllBtn}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleViewAllClick}
        >
          View all Radiology
        </motion.button>
      </div>
      <div className={styles.cardsContainer}>
        {checkups?.map((checkup, index) => (
          <CheckupCard
            key={checkup._id}
            title={checkup.title}
            iconUrl={checkup.icon}
            color={index % 2 === 0 ? "red" : "blue"}
            size={index === 0 ? "large" : index === 3 ? "medium" : "small"}
            onClick={() => handleCardClick(checkup)}
          />
        ))}
      </div>
    </section>
  );
}
