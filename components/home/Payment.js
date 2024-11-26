import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { CartContext } from '../../contexts/CartContext';
import styles from '../../styles/Payment.module.css';

const Payment = () => {
  const { cart, clearCart } = useContext(CartContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalPrice = cart.reduce((total, item) => total + parseInt(item.discountedPrice), 0);

  useEffect(() => {
    if (cart.length === 0) {
      router.push('/');
    }
  }, [cart, router]);

  const initiatePhonePePayment = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // This is a mock API call. Replace with your actual PhonePe API integration.
      const response = await fetch('/api/initiate-phonepe-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalPrice,
          orderId: 'ORDER_' + Date.now(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate payment');
      }

      const data = await response.json();
      
      // Redirect to PhonePe payment page
      window.location.href = data.paymentUrl;
    } catch (err) {
      setError('Failed to initiate payment. Please try again.');
      console.error('Payment initiation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.paymentContainer}>
      <h2>Payment</h2>
      <div className={styles.orderSummary}>
        <h3>Order Summary</h3>
        {cart.map((item) => (
          <div key={item.id} className={styles.orderItem}>
            <span>{item.title}</span>
            <span>₹{item.discountedPrice}</span>
          </div>
        ))}
        <div className={styles.orderTotal}>
          <strong>Total:</strong> ₹{totalPrice}
        </div>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      <button 
        onClick={initiatePhonePePayment} 
        className={styles.paymentButton}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Pay with PhonePe'}
      </button>
    </div>
  );
};

export default Payment;
