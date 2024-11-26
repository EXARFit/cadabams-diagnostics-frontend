// components/CartModal.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './CartModal.module.css';

const CartModal = ({ isOpen, onClose }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen && user) {
      fetchCartItems();
    }
  }, [isOpen, user]);

  const fetchCartItems = async () => {
    try {
      const response = await fetch(`https://cadabamsapi.exar.ai/api/v1/user/cart/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      const data = await response.json();
      setCartItems(data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const updateCartItem = async (cartItemId, quantity) => {
    try {
      const response = await fetch('https://cadabamsapi.exar.ai/api/v1/user/cart/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ cartItemId, quantity }),
      });
      if (response.ok) {
        fetchCartItems();
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const removeCartItem = async (cartItemId) => {
    try {
      const response = await fetch('https://cadabamsapi.exar.ai/api/v1/user/cart/remove', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({ cartItemId }),
      });
      if (response.ok) {
        fetchCartItems();
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Your Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty</p>
        ) : (
          <ul className={styles.cartList}>
            {cartItems.map((item) => (
              <li key={item._id} className={styles.cartItem}>
                <span>{item.templateName}</span>
                <span>Quantity: {item.quantity}</span>
                <button onClick={() => updateCartItem(item._id, item.quantity + 1)}>+</button>
                <button onClick={() => updateCartItem(item._id, Math.max(1, item.quantity - 1))}>-</button>
                <button onClick={() => removeCartItem(item._id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
        <button onClick={onClose} className={styles.closeButton}>Close</button>
      </div>
    </div>
  );
};

export default CartModal;