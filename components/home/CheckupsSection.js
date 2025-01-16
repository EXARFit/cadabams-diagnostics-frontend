// components/CheckupsSlider.js
import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaFlask, FaClock, FaCheck } from 'react-icons/fa';
import { CartContext } from '@/contexts/CartContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import styles from './CheckupsSlider.module.css';

const CheckupCard = ({ test }) => {
  const router = useRouter();
  const { cart, addToCart } = useContext(CartContext);
  const [isAdded, setIsAdded] = useState(false);
  const analytics = useAnalytics();
  const basicInfo = test?.alldata?.[0]?.basic_info;
  const showDiscount = basicInfo?.price !== basicInfo?.discountedPrice;

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

    // Track GTM add_to_cart event
    analytics.trackAddToCart({
      _id: test._id,
      testName: basicInfo?.name,
      basicInfo: {
        ...basicInfo,
        category: test.templateName === 'non-labtest' ? 'Center Visit' : 'Lab Test'
      }
    });

    addToCart(cartItem);
    setIsAdded(true);
  };

  const handleViewDetails = () => {
    if (basicInfo?.route) {
      const currentPath = router.asPath;
      const locationMatch = currentPath.match(/\/bangalore\/([^\/]+)/);
      const specificLocation = locationMatch ? locationMatch[1] : null;

      // Track GTM select_item event
      analytics.trackSelectItem(
        {
          _id: test._id,
          testName: basicInfo?.name,
          basicInfo: {
            ...basicInfo,
            category: test.templateName === 'non-labtest' ? 'Center Visit' : 'Lab Test'
          }
        },
        'Health Checkups',
        test.index
      );

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
      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <h3>{basicInfo?.name}</h3>
          <div className={styles.priceContainer}>
            {showDiscount && (
              <span className={styles.originalPrice}>₹{basicInfo?.price}</span>
            )}
            <span className={styles.discountedPrice}>₹{basicInfo?.discountedPrice}</span>
          </div>
          {showDiscount && (
            <span className={styles.discount}>{basicInfo?.discount}% Off</span>
          )}
        </div>
        <div className={styles.cardBody}>
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
      </div>
    </motion.div>
  );
};

export default function CheckupsSection({ test_card }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const analytics = useAnalytics();
  const tests = test_card?.tests || [];
  const cardsPerSlide = isMobile ? 1 : 3;
  const totalSlides = Math.ceil(tests.length / cardsPerSlide);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Track view_item_list event when component mounts
    if (tests?.length > 0) {
      analytics.trackViewItemList(tests.map((test, index) => ({
        ...test,
        index
      })), test_card?.title || 'Health Checkups');
    }

    return () => window.removeEventListener('resize', handleResize);
  }, [tests, test_card?.title, analytics]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance > 0 && currentSlide < totalSlides - 1) {
      nextSlide();
    } else if (distance < 0 && currentSlide > 0) {
      prevSlide();
    }

    setTouchStart(null);
    setTouchEnd(null);
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
        {!isMobile && (
          <motion.button
            className={`${styles.navButton} ${styles.prevButton}`}
            onClick={prevSlide}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={currentSlide === 0}
          >
            <FaChevronLeft />
          </motion.button>
        )}

        <div 
          className={styles.cardsContainer}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            {visibleTests.map((test) => (
              <CheckupCard key={test._id} test={test} />
            ))}
          </AnimatePresence>
        </div>

        {!isMobile && (
          <motion.button
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={nextSlide}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={currentSlide === totalSlides - 1}
          >
            <FaChevronRight />
          </motion.button>
        )}
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
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}