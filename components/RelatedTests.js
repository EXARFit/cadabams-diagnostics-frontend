import React, { useContext, useState } from 'react';
import { useRouter } from 'next/router';
import DOMPurify from 'dompurify';
import { CartContext } from '../contexts/CartContext';
import { FaFlask, FaClock, FaCheck } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './RelatedTests.module.css';

const TestCard = ({ test, currentCategory }) => {  // Added currentCategory prop here
  const router = useRouter();
  const { addToCart, cart } = useContext(CartContext);
  const [isAdded, setIsAdded] = useState(false);
  
  const basicInfo = test.alldata?.[0]?.basic_info || {};
  const aboutTest = test.alldata?.find(item => item.about_test)?.about_test || {};

  // Check if item is already in cart
  const isInCart = cart?.some(item => item.id === test._id);

  const getDiscountedPrice = (price, discount) => {
    if (!price || !discount) return price;
    const discounted = price - (price * (parseFloat(discount) / 100));
    return discounted.toFixed(2);
  };

  const handleViewDetails = () => {
    router.push(`/bangalore/${currentCategory}${basicInfo?.route}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const cartItem = {
      id: test._id,
      title: basicInfo?.name,
      discountedPrice: basicInfo?.discountedPrice || getDiscountedPrice(basicInfo?.price, basicInfo?.discount),
      price: basicInfo?.price,
      quantity: 1,
      templateName: test.templateName || 'non-labtest'
    };
    addToCart(cartItem);
    setIsAdded(true);
  };

  return (
    <motion.div
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {aboutTest?.imageSrc && (
        <div className={styles.imageContainer}>
          <img
            src={aboutTest.imageSrc}
            alt={basicInfo.name || 'Test image'}
            className={styles.image}
          />
        </div>
      )}

      <div className={styles.cardContent}>
        <h3 className={styles.testName}>{basicInfo.name}</h3>

        {aboutTest?.desc && (
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(aboutTest.desc).slice(0, 100) + '...'
            }}
          />
        )}

        <div className={styles.infoContainer}>
          {basicInfo.parametersCount && (
            <div className={styles.infoItem}>
              <FaFlask className={styles.icon} />
              <span>{basicInfo.parametersCount} parameters included</span>
            </div>
          )}
          {basicInfo.reportsWithin && (
            <div className={styles.infoItem}>
              <FaClock className={styles.icon} />
              <span>Reports within {basicInfo.reportsWithin}</span>
            </div>
          )}
          <div className={styles.infoItem}>
            <span className={`${styles.testType} ${test.templateName === 'labtest' ? styles.labTest : styles.nonLabTest}`}>
              {test.templateName === 'labtest' ? 'Lab Test' : 'Center Visit Only'}
            </span>
          </div>
        </div>

        <div className={styles.priceSection}>
          {basicInfo.price && (
            <div className={styles.prices}>
              <span className={styles.discountedPrice}>
                ₹{basicInfo.discountedPrice || getDiscountedPrice(basicInfo.price, basicInfo.discount)}
              </span>
              <span className={styles.originalPrice}>
                ₹{basicInfo.price}
              </span>
              {basicInfo.discount && (
                <span className={styles.discount}>{basicInfo.discount}% OFF</span>
              )}
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <motion.button
            className={styles.viewButton}
            onClick={handleViewDetails}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Details
          </motion.button>
          <motion.button
            className={`${styles.cartButton} ${(isAdded || isInCart) ? styles.added : ''}`}
            onClick={handleAddToCart}
            disabled={isAdded || isInCart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {(isAdded || isInCart) ? (
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
  if (!tests || tests.length === 0) return null;

  return (
    <div className={styles.container}>
      <motion.h2
        className={styles.heading}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Related Tests
      </motion.h2>
      <div className={styles.grid}>
        <AnimatePresence>
          {tests.map((test) => (
            <TestCard 
              key={test._id} 
              test={test}
              currentCategory={currentCategory}  // Passing the prop here
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RelatedTests;