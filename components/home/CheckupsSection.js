import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaFlask, FaClock, FaCheck } from 'react-icons/fa';
import { CartContext } from '@/contexts/CartContext';
import styles from './CheckupsSlider.module.css';

const CheckupCard = ({ test }) => {
  const router = useRouter();
  const { cart, addToCart } = useContext(CartContext);
  const [isAdded, setIsAdded] = useState(false);
  const basicInfo = test?.alldata?.[0]?.basic_info;

  useEffect(() => {
    const isInCart = cart?.some(item => item.route === basicInfo?.route);
    setIsAdded(isInCart);
  }, [cart, basicInfo?.route]);

  const handleAddToCart = () => {
    const currentPath = router.asPath;
    const locationMatch = currentPath.match(/\/bangalore\/([^\/]+)/);
    const specificLocation = locationMatch ? locationMatch[1] : null;

    const cartItem = {
      route: basicInfo?.route,
      title: basicInfo?.name,
      discountedPrice: basicInfo?.discountedPrice,
      price: basicInfo?.price,
      quantity: 1,
      templateName: test.templateName || 'labtest',
      test: test,
      location: specificLocation !== 'lab-test' ? specificLocation : null
    };

    addToCart(cartItem);
    setIsAdded(true);
  };

  const handleViewDetails = () => {
    if (basicInfo?.route) {
      const currentPath = router.asPath;
      const locationMatch = currentPath.match(/\/bangalore\/([^\/]+)/);
      const specificLocation = locationMatch ? locationMatch[1] : null;

      let targetRoute;
      if (specificLocation && specificLocation !== 'lab-test') {
        targetRoute = `/bangalore/${specificLocation}/lab-test${basicInfo.route}`;
      } else {
        targetRoute = `/bangalore/lab-test${basicInfo.route}`;
      }

      router.push(targetRoute);
    }
  };

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.cardHeader}>
        <h3>{basicInfo?.name}</h3>
        <div className={styles.priceContainer}>
          <span className={styles.originalPrice}>₹{basicInfo?.price}</span>
          <span className={styles.discountedPrice}>₹{basicInfo?.discountedPrice}</span>
        </div>
        <span className={styles.discount}>{basicInfo?.discount}% Off</span>
      </div>
      <div className={styles.cardBody}>
        <div className={styles.infoItem}>
          {/* <FaFlask className={styles.icon} /> */}
          {/* <span>91 parameters included</span> */}
        </div>
        <div className={styles.infoItem}>
          <FaClock className={styles.icon} />
          <span>Reports {basicInfo?.reportsWithin}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.testType}>
            {test.templateName === 'non-labtest' ? 'Center Visit Only' : 'Lab Test'}
          </span>
        </div>
      </div>
      <div className={styles.cardFooter}>
        <motion.button
          className={styles.viewDetailsBtn}
          onClick={handleViewDetails}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          View Details
        </motion.button>
        <motion.button 
          className={`${styles.addToCartBtn} ${isAdded ? styles.added : ''}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddToCart}
          disabled={isAdded}
        >
          {isAdded ? (
            <>
              <FaCheck className={styles.checkIcon} />
              Added
            </>
          ) : (
            'Add to Cart'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default function CheckupsSection({ test_card }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const tests = test_card?.tests || [];
  const cardsPerSlide = 3;
  const totalSlides = Math.ceil(tests.length / cardsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const visibleTests = tests.slice(
    currentSlide * cardsPerSlide,
    (currentSlide * cardsPerSlide) + cardsPerSlide
  );

  return (
    <section className={styles.checkupsSection}>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {test_card?.title || 'Vital Health Tests'}
      </motion.h2>
      <div className={styles.sliderContainer}>
        <motion.button
          className={`${styles.navButton} ${styles.prevButton}`}
          onClick={prevSlide}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={currentSlide === 0}
        >
          <FaChevronLeft />
        </motion.button>

        <div className={styles.cardsContainer}>
          <AnimatePresence mode="wait">
            {visibleTests.map((test) => (
              <CheckupCard key={test._id} test={test} />
            ))}
          </AnimatePresence>
        </div>

        <motion.button
          className={`${styles.navButton} ${styles.nextButton}`}
          onClick={nextSlide}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={currentSlide === totalSlides - 1}
        >
          <FaChevronRight />
        </motion.button>
      </div>

      <div className={styles.pagination}>
        {currentSlide + 1}/{totalSlides}
      </div>
      <div className={styles.dots}>
        {[...Array(totalSlides)].map((_, index) => (
          <motion.span
            key={index}
            className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
            initial={{ scale: 1 }}
            animate={{ 
              scale: index === currentSlide ? 1.2 : 1,
              backgroundColor: index === currentSlide ? '#2563EB' : '#E5E7EB'
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </section>
  );
}