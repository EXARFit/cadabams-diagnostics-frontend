import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { CartContext } from '../../contexts/CartContext';
import styles from './MobileCartSummary.module.css';

const MobileCartSummary = () => {
  const { cart } = useContext(CartContext);
  const router = useRouter();
  const totalItems = cart.length;
  const totalPrice = cart.reduce((total, item) => total + parseInt(item.discountedPrice), 0);

  if (totalItems === 0) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className={styles.cartSummaryContainer}
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{ type: "spring", bounce: 0.3 }}
      >
        <div className={styles.cartSummaryContent} onClick={() => router.push('/cart')}>
          <div className={styles.cartInfo}>
            <div className={styles.iconContainer}>
              <ShoppingBag className={styles.cartIcon} />
              {totalItems > 0 && (
                <span className={styles.itemCount}>
                  {totalItems}
                </span>
              )}
            </div>
            <span className={styles.itemText}>
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </span>
          </div>
          
          <div className={styles.cartActions}>
            <span className={styles.totalPrice}>₹{totalPrice}</span>
            <button 
              className={styles.viewCartButton}
              onClick={(e) => {
                e.stopPropagation();
                router.push('/cart');
              }}
            >
              View Cart
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MobileCartSummary;