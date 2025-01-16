// components/Cart/Cart.js
import React, { useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CartContext } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useAnalytics } from '../../hooks/useAnalytics';
import { Trash2, ShoppingBag, ArrowRight, TestTube, Clipboard, Activity } from 'lucide-react';
import { AddressManager } from './AddressManager';
import AuthModal from './AuthModal';
import styles from '../../styles/Cart.module.css';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const analytics = useAnalytics();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const totalPrice = cart.reduce((total, item) => {
    const price = parseFloat(item.discountedPrice) || 0;
    const quantity = parseInt(item.quantity) || 1;
    return total + (price * quantity);
  }, 0);
  
  const totalItems = cart.length;

  // Track view_cart event when component mounts
  useEffect(() => {
    if (cart.length > 0) {
      analytics.trackViewCart(
        cart.map((item, index) => ({
          _id: item.route,
          testName: item.title,
          basicInfo: {
            price: item.price,
            discountedPrice: item.discountedPrice,
            parameters: item.parameters,
            reportsWithin: item.reportsWithin,
            category: item.templateName === 'non-labtest' ? 'Center Visit' : 'Lab Test'
          },
          quantity: item.quantity || 1,
          index
        })),
        totalPrice
      );
    }
  }, [cart, totalPrice]);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    // Track begin_checkout event
    analytics.trackBeginCheckout(
      cart.map((item, index) => ({
        _id: item.route,
        testName: item.title,
        basicInfo: {
          price: item.price,
          discountedPrice: item.discountedPrice,
          parameters: item.parameters,
          reportsWithin: item.reportsWithin,
          category: item.templateName === 'non-labtest' ? 'Center Visit' : 'Lab Test'
        },
        quantity: item.quantity || 1,
        index
      })),
      totalPrice
    );

    // If authenticated, navigate to checkout with selected address
    if (selectedAddress) {
      router.push({
        pathname: '/checkout',
        query: { selectedAddressId: selectedAddress._id }
      });
    } else {
      router.push('/checkout');
    }
  };

  const handleContinueShopping = () => {
    router.push('/');
  };

  const handleRemoveFromCart = (item) => {
    if (item.route) {
      // Track remove_from_cart event
      analytics.trackRemoveFromCart({
        _id: item.route,
        testName: item.title,
        basicInfo: {
          price: item.price,
          discountedPrice: item.discountedPrice,
          parameters: item.parameters,
          reportsWithin: item.reportsWithin,
          category: item.templateName === 'non-labtest' ? 'Center Visit' : 'Lab Test'
        },
        quantity: item.quantity || 1
      });

      removeFromCart(item.route);
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

  if (!cart.length) {
    return (
      <div className={styles.cartContainer}>
        <h1 className={styles.cartTitle}>Your Cart</h1>
        <div className={styles.emptyCart}>
          <ShoppingBag size={48} />
          <p>Your cart is empty</p>
          <button onClick={handleContinueShopping} className={styles.continueShoppingBtn}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.cartTitle}>Your Cart</h1>
      <div className={styles.cartContent}>
        <div className={styles.cartItems}>
          {cart.map((item) => (
            <div key={item.route} className={styles.cartItem}>
              <div className={styles.itemIcon}>
                {getItemIcon(item.title)}
              </div>
              <div className={styles.itemDetails}>
                <h3>{item.title}</h3>
                <div className={styles.priceContainer}>
                  <p className={styles.itemPrice}>
                    ₹{parseFloat(item.discountedPrice).toLocaleString()}
                  </p>
                  {item.price !== item.discountedPrice && (
                    <p className={styles.originalPrice}>
                      ₹{parseFloat(item.price).toLocaleString()}
                    </p>
                  )}
                </div>
                {item.parameters && (
                  <p className={styles.itemParameters}>{item.parameters}</p>
                )}
                {item.reportsWithin && (
                  <p className={styles.itemDelivery}>Reports within {item.reportsWithin}</p>
                )}
                {item.quantity > 1 && (
                  <p className={styles.itemQuantity}>Quantity: {item.quantity}</p>
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

          {/* Address Manager Section */}
          {isAuthenticated && (
            <div className={styles.addressSection}>
              <AddressManager
                selectedAddress={selectedAddress}
                onAddressSelect={setSelectedAddress}
                editable={true}
                className={styles.cartAddressManager}
              />
            </div>
          )}
        </div>

        {/* Order Summary */}
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
          <button 
            onClick={() => {
              // Clear GTM ecommerce data before clearing cart
              if (typeof window !== 'undefined' && window.dataLayer) {
                window.dataLayer.push({ ecommerce: null });
              }
              clearCart();
            }} 
            className={styles.clearCartBtn}
          >
            Clear Cart
          </button>
        </div>
      </div>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default Cart;