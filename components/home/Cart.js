import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { CartContext } from '../../contexts/CartContext';
import { Trash2, ShoppingBag, ArrowRight, TestTube, Clipboard, Activity } from 'lucide-react';
import styles from '../../styles/Cart.module.css';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const router = useRouter();

  const totalPrice = cart.reduce((total, item) => total + parseFloat(item.discountedPrice), 0);
  const totalItems = cart.length;

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const handleContinueShopping = () => {
    router.push('/');
  };

  const handleRemoveFromCart = (item) => {
    console.log('Removing item:', item);
    if (item.route) {
      removeFromCart(item.route);
    } else {
      console.error('No route found for item:', item);
    }
  };

  const getItemIcon = (itemTitle) => {
    const title = itemTitle.toLowerCase();
    if (title.includes('test') || title.includes('sample')) {
      return <TestTube size={24} />;
    } else if (title.includes('checkup') || title.includes('screening')) {
      return <Clipboard size={24} />;
    } else {
      return <Activity size={24} />;
    }
  };

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.cartTitle}>Your Cart</h1>
      {cart.length === 0 ? (
        <div className={styles.emptyCart}>
          <ShoppingBag size={48} />
          <p>Your cart is empty</p>
          <button onClick={handleContinueShopping} className={styles.continueShoppingBtn}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className={styles.cartItems}>
            {cart.map((item) => (
              <div key={item.route} className={styles.cartItem}>
                <div className={styles.itemIcon}>
                  {getItemIcon(item.title)}
                </div>
                <div className={styles.itemDetails}>
                  <h3>{item.title}</h3>
                  <div className={styles.priceContainer}>
                    <p className={styles.itemPrice}>₹{parseFloat(item.discountedPrice).toLocaleString()}</p>
                    {item.price !== item.discountedPrice && (
                      <p className={styles.originalPrice}>₹{parseFloat(item.price).toLocaleString()}</p>
                    )}
                  </div>
                  {item.parameters && (
                    <p className={styles.itemParameters}>{item.parameters}</p>
                  )}
                  {item.reportsWithin && (
                    <p className={styles.itemDelivery}>Reports within {item.reportsWithin}</p>
                  )}
                </div>
                <button 
                  onClick={() => handleRemoveFromCart(item)} 
                  className={styles.removeBtn}
                  aria-label="Remove item"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
          <div className={styles.cartSummary}>
            <div className={styles.summaryRow}>
              <span>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'items'})</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.total}`}>
              <span>Total</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
            <button onClick={handleCheckout} className={styles.checkoutBtn}>
              Proceed to Checkout <ArrowRight size={16} />
            </button>
            <button onClick={clearCart} className={styles.clearCartBtn}>
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;