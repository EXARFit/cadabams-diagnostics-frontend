// components/labtest/MultiTestSection.js
import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { CartContext } from '@/contexts/CartContext';
import styles from './MultiTestSection.module.css';

const getLocationFromPath = (path) => {
  if (!path) return { name: 'near me', value: 'near-me' };
  
  const parts = path.split('/').filter(Boolean);
  
  // If path includes bangalore as the first part
  if (parts[0] === 'bangalore') {
    return { name: 'Bangalore', value: 'bangalore' };
  }
  
  // For non-bangalore paths
  return { name: 'near me', value: 'near-me' };
};

const TestCard = ({ test, onViewDetails }) => {
  const router = useRouter();
  const { cart, addToCart } = useContext(CartContext);
  const basicInfo = test?.alldata?.[0]?.basic_info;
  const [isAdded, setIsAdded] = useState(false);
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
    addToCart(cartItem);
    setIsAdded(true);
  };

  return (
    <motion.div
      className={styles.cardWrapper}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className={styles.card}>
        <h3 className={styles.testName}>{basicInfo?.name}</h3>
        <div className={styles.priceSection}>
          <div className={styles.priceInfo}>
            {showDiscount && (
              <span className={styles.originalPrice}>₹{basicInfo?.price}</span>
            )}
            <span className={styles.discountedPrice}>₹{basicInfo?.discountedPrice}</span>
          </div>
          {showDiscount && (
            <span className={styles.discount}>{basicInfo?.discount}% Off</span>
          )}
        </div>
        <div className={styles.parameters}></div>
        <div className={styles.reportTime}>
          <Clock className={styles.icon} />
          <span>Reports {basicInfo?.reportsWithin}</span>
        </div>
        <div className={styles.testType}>
          <span>{test.templateName === 'non-labtest' ? 'Center Visit Only' : 'Lab Test'}</span>
        </div>
        <div className={styles.actions}>
          <motion.button
            className={styles.viewButton}
            onClick={() => onViewDetails(basicInfo?.route)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Details
          </motion.button>
          <motion.button
            className={`${styles.cartButton} ${isAdded ? styles.added : ''}`}
            onClick={handleAddToCart}
            disabled={isAdded}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isAdded ? (
              <>
                <Check className={styles.checkIcon} />
                Added
              </>
            ) : 'Add to Cart'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const TestSection = ({ section }) => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const cardsPerSlide = isMobile ? 1 : 3;
  const totalSlides = Math.ceil(section.tests.length / cardsPerSlide);
  const currentLocation = getLocationFromPath(router.asPath);

  const locationAwareTitle = useMemo(() => {
    let title = section.title;
    const locationText = currentLocation.value === 'near-me' ? 'near me' : `in ${currentLocation.name}`;
    
    // Replace existing location references
    if (title.includes('in Bangalore')) {
      title = title.replace('in Bangalore', locationText);
    } else if (title.includes('Bangalore')) {
      title = title.replace('Bangalore', currentLocation.name);
    } else {
      title = `${title} ${locationText}`;
    }
    return title;
  }, [section.title, currentLocation]);

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (Math.abs(distance) < minSwipeDistance) return;

    if (distance > 0 && currentSlide < totalSlides - 1) {
      handleNext();
    } else if (distance < 0 && currentSlide > 0) {
      handlePrev();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleViewDetails = (route) => {
    if (route) {
      let targetRoute;
      
      // Handle routing based on current location
      if (currentLocation.value === 'near-me') {
        // For non-bangalore paths, use root path
        targetRoute = `/lab-test${route}`;
      } else if (currentLocation.value === 'bangalore') {
        // For main bangalore path
        targetRoute = `/bangalore/lab-test${route}`;
      } else {
        // For specific bangalore locations
        targetRoute = `/bangalore/${currentLocation.value}/lab-test${route}`;
      }

      router.push(targetRoute);
    }
  };

  const visibleTests = section.tests.slice(
    currentSlide * cardsPerSlide,
    (currentSlide * cardsPerSlide) + cardsPerSlide
  );

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>{locationAwareTitle}</h2>
      <div className={styles.sliderWrapper}>
        {totalSlides > 1 && !isMobile && (
          <motion.button
            className={`${styles.navButton} ${styles.prevButton}`}
            onClick={handlePrev}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={currentSlide === 0}
          >
            <ChevronLeft className={styles.icon} />
          </motion.button>
        )}

        <div 
          className={styles.cardsContainer}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              className={styles.cardsTrack}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              style={{
                '--current-slide': currentSlide,
                '--total-slides': totalSlides,
                '--cards-per-slide': cardsPerSlide
              }}
            >
              {visibleTests.map((test) => (
                <TestCard
                  key={test._id}
                  test={test}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {totalSlides > 1 && !isMobile && (
          <motion.button
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={handleNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={currentSlide === totalSlides - 1}
          >
            <ChevronRight className={styles.icon} />
          </motion.button>
        )}
      </div>

      {totalSlides > 1 && (
        <div className={styles.paginationDots}>
          {[...Array(totalSlides)].map((_, idx) => (
            <motion.button
              key={idx}
              className={`${styles.dot} ${currentSlide === idx ? styles.activeDot : ''}`}
              onClick={() => setCurrentSlide(idx)}
              initial={{ scale: 1 }}
              animate={{
                scale: currentSlide === idx ? 1.2 : 1,
                backgroundColor: currentSlide === idx ? '#0047ab' : '#E5E7EB'
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function MultiTestSection({ sections }) {
  if (!sections || sections.length === 0) return null;

  return (
    <section className={styles.multiTestSection}>
      <div className={styles.container}>
        {sections.map((section) => (
          <TestSection
            key={section._id}
            section={section}
          />
        ))}
      </div>
    </section>
  );
}