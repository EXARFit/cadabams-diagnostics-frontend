// components/HealthCheckupSlider.js
import React, { useState, useContext, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaFlask, FaClock, FaShieldAlt, FaCheck } from 'react-icons/fa';
import { CartContext } from '@/contexts/CartContext';
import { useAnalytics } from '@/hooks/useAnalytics';
import styles from './HealthCheckupSlider.module.css';

const CheckupCard = ({ content, index }) => {
  const router = useRouter();
  const { cart, addToCart, removeFromCart } = useContext(CartContext);
  const [isAdded, setIsAdded] = useState(false);
  const analytics = useAnalytics();
  const basicInfo = content?.test?.alldata?.[0]?.basic_info;
  const showDiscount = basicInfo?.price !== basicInfo?.discountedPrice;

  useEffect(() => {
    if (basicInfo?.route) {
      const isInCart = cart?.some(item => item.route === basicInfo.route);
      setIsAdded(isInCart);
    }
  }, [cart, basicInfo?.route]);

  const handleAddToCart = () => {
    if (!basicInfo) return;

    const currentPath = router.asPath;
    const locationMatch = currentPath.match(/\/bangalore\/([^\/]+)/);
    const specificLocation = locationMatch ? locationMatch[1] : null;

    const cartItem = {
      route: basicInfo.route,
      title: basicInfo.name,
      discountedPrice: basicInfo.discountedPrice,
      price: basicInfo.price,
      quantity: 1,
      templateName: content?.test?.templateName || 'labtest',
      parameters: basicInfo.parameters || '107 parameters',
      reportsWithin: basicInfo.reportsWithin,
      test: content.test,
      location: specificLocation !== 'lab-test' ? specificLocation : null
    };

    // Track GTM add_to_cart event
    analytics.trackAddToCart({
      _id: content.test._id,
      testName: basicInfo.name,
      basicInfo: {
        ...basicInfo,
        category: content.test.templateName === 'non-labtest' ? 'Center Visit' : 'Lab Test'
      },
      index
    });

    addToCart(cartItem);
    setIsAdded(true);
  };

  const handleRemoveFromCart = () => {
    if (!basicInfo?.route) return;
    
    // Track GTM remove_from_cart event
    analytics.trackRemoveFromCart({
      _id: content.test._id,
      testName: basicInfo.name,
      basicInfo: {
        ...basicInfo,
        category: content.test.templateName === 'non-labtest' ? 'Center Visit' : 'Lab Test'
      },
      index
    });
    
    removeFromCart(basicInfo.route);
    setIsAdded(false);
  };

  const handleViewDetails = () => {
    if (basicInfo?.route) {
      // Track GTM select_item event
      analytics.trackSelectItem(
        {
          _id: content.test._id,
          testName: basicInfo.name,
          basicInfo: {
            ...basicInfo,
            category: content.test.templateName === 'non-labtest' ? 'Center Visit' : 'Lab Test'
          }
        },
        'Health Checkups',
        index
      );

      const currentPath = router.asPath;
      const locationMatch = currentPath.match(/\/bangalore\/([^\/]+)/);
      const specificLocation = locationMatch ? locationMatch[1] : null;

      let targetRoute;
      if (specificLocation && specificLocation !== 'lab-test') {
        targetRoute = `/bangalore/lab-test${basicInfo.route}`;
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
        <span className={styles.checkupLabel}>Premium Checkup</span>
        <h3>{basicInfo?.name}</h3>
        <div className={styles.priceContainer}>
          {showDiscount && (
            <span className={styles.originalPrice}>
              ₹{basicInfo?.price?.toLocaleString()}
            </span>
          )}
          <span className={styles.discountedPrice}>
            ₹{basicInfo?.discountedPrice?.toLocaleString()}
          </span>
          {showDiscount && basicInfo?.discount && (
            <span className={styles.discount}>
              {basicInfo.discount}% OFF
            </span>
          )}
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.infoItem}>
          <FaFlask className={styles.icon} />
        </div>
        <div className={styles.infoItem}>
          <FaClock className={styles.icon} />
          <span>Reports within {basicInfo?.reportsWithin || '24 hours'}</span>
        </div>
        <div className={styles.infoItem}>
          <span className={styles.testType}>
            {content?.test?.templateName === 'non-labtest' ? 'Center Visit Only' : 'Lab Test'}
          </span>
        </div>
      </div>

      <div className={styles.cardFooter}>
        <motion.button
          className={styles.viewDetailsBtn}
          onClick={handleViewDetails}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          View Details
        </motion.button>
        <motion.button
          className={`${styles.addToCartBtn} ${isAdded ? styles.added : ''}`}
          onClick={isAdded ? handleRemoveFromCart : handleAddToCart}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isAdded ? (
            <>
              <FaCheck className={styles.checkIcon} />
              Remove
            </>
          ) : (
            'Add to Cart'
          )}
        </motion.button>
      </div>
    </motion.div>
  );
};

const HealthCheckupSlider = ({ healthData }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const touchStart = useRef(null);
  const analytics = useAnalytics();
  const content = healthData?.content || [];
  const totalSlides = content.length;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    setIsLoading(false);
    window.addEventListener('resize', handleResize);
    
    // Track view_item_list event when component mounts
    if (content.length > 0) {
      analytics.trackViewItemList(
        content.map((item, index) => ({
          ...item.test,
          index
        })),
        'Health Checkups'
      );
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, [content, analytics]);

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    if (!touchStart.current) return;
    
    const touchEnd = e.touches[0].clientX;
    const diff = touchStart.current - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0 && currentSlide < totalSlides - 1) {
        nextSlide();
      } else if (diff < 0 && currentSlide > 0) {
        prevSlide();
      }
      touchStart.current = null;
    }
  };

  const handleTouchEnd = () => {
    touchStart.current = null;
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner} />
      </div>
    );
  }

  if (!content.length) {
    return null;
  }

  const currentContent = content[currentSlide];

  return (
    <section className={styles.healthCheckupSlider}>
      <div 
        className={styles.sliderSection}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.sliderContainer}>
          {!isMobile && currentSlide > 0 && (
            <motion.button
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={prevSlide}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaChevronLeft />
            </motion.button>
          )}

          <div className={styles.content}>
            <div className={styles.checkupCard}>
              <AnimatePresence mode="wait">
                <CheckupCard 
                  key={currentSlide} 
                  content={currentContent}
                  index={currentSlide}
                />
              </AnimatePresence>
            </div>

            <motion.div
              className={styles.description}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2>{currentContent.title}</h2>
              <p>{currentContent.description}</p>
              <div className={styles.trustedBy}>
                <FaShieldAlt className={styles.trustIcon} />
                <span>Trusted by {currentContent.trustedBy}</span>
              </div>
            </motion.div>

            <div className={styles.imageContainer}>
              {currentContent?.imageSrc && (
                <Image
                  src={currentContent.imageSrc}
                  alt="Health Checkup"
                  width={400}
                  height={400}
                  className={styles.image}
                  priority
                />
              )}
            </div>
          </div>

          {!isMobile && currentSlide < totalSlides - 1 && (
            <motion.button
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={nextSlide}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaChevronRight />
            </motion.button>
          )}
        </div>

        <div className={styles.dots}>
          {[...Array(totalSlides)].map((_, index) => (
            <motion.button
              key={index}
              className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
              onClick={() => setCurrentSlide(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              animate={{
                scale: index === currentSlide ? 1.2 : 1,
                backgroundColor: index === currentSlide ? '#0047ab' : '#cbd5e1'
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HealthCheckupSlider;