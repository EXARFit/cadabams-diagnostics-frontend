import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaFlask, FaClock, FaCheck } from 'react-icons/fa';
import { CartContext } from '@/contexts/CartContext';
import DOMPurify from 'dompurify';
import styles from './RelatedTests.module.css';

const TestCard = ({ test, currentCategory }) => {
  const router = useRouter();
  const { cart, addToCart } = useContext(CartContext);
  const [isAdded, setIsAdded] = useState(false);
  
  const basicInfo = test.alldata?.[0]?.basic_info || {};
  const aboutTest = test.alldata?.find(item => item.about_test)?.about_test || {};

  useEffect(() => {
    const isInCart = cart?.some(item => item.route === basicInfo?.route);
    setIsAdded(isInCart);
  }, [cart, basicInfo?.route]);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const cartItem = {
      route: basicInfo?.route,
      title: basicInfo?.name,
      discountedPrice: basicInfo?.discountedPrice,
      price: basicInfo?.price,
      quantity: 1,
      templateName: test.templateName || 'non-labtest',
      basicInfo: {
        ...basicInfo,
        route: basicInfo?.route
      }
    };
    addToCart(cartItem);
    setIsAdded(true);
  };

  const handleViewDetails = () => {
    router.push(`/bangalore/${currentCategory}${basicInfo?.route}`);
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
            <span className={styles.originalPrice}>₹{basicInfo?.price}</span>
            <span className={styles.discountedPrice}>₹{basicInfo?.discountedPrice}</span>
          </div>
          <span className={styles.discount}>{basicInfo?.discount}% Off</span>
        </div>

        <div className={styles.cardBody}>
          {aboutTest?.desc && (
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(aboutTest.desc).slice(0, 100) + '...'
              }}
            />
          )}

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
            onClick={handleAddToCart}
            disabled={isAdded}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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

const RelatedTests = ({ tests, currentCategory }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const cardsPerSlide = isMobile ? 1 : 3;
  const totalSlides = Math.ceil(tests?.length / cardsPerSlide);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!tests || tests.length === 0) return null;

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
        Related Tests
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
              <TestCard 
                key={test._id} 
                test={test}
                currentCategory={currentCategory}
              />
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
              backgroundColor: index === currentSlide ? '#0047ab' : '#ccc'
            }}
            transition={{ duration: 0.3 }}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
};

export default RelatedTests;