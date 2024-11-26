// CartContext.js
import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Initialize cart state
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        console.log('Initial cart loaded:', parsedCart);
        setCart(parsedCart);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
      console.log('Cart saved to localStorage:', cart);
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  // Add item to cart
  const addToCart = (item) => {
    if (!item || !item.route) {
      console.error('Invalid item or missing route:', item);
      return;
    }

    setCart((prevCart) => {
      console.log('Current cart:', prevCart);
      console.log('Adding item:', item);

      // Check if item already exists in cart
      const existingItem = prevCart.find((cartItem) => cartItem.route === item.route);
      
      if (existingItem) {
        console.log('Item already exists in cart');
        return prevCart;
      }

      // Add new item to cart
      const newCart = [...prevCart, item];
      console.log('New cart:', newCart);
      return newCart;
    });
  };

  // Remove item from cart
  const removeFromCart = (route) => {
    if (!route) {
      console.error('No route provided for removal');
      return;
    }

    setCart((prevCart) => {
      console.log('Removing item with route:', route);
      console.log('Current cart:', prevCart);

      // Filter out the item with matching route
      const newCart = prevCart.filter((item) => item.route !== route);
      
      console.log('New cart after removal:', newCart);
      return newCart;
    });
  };

  // Update item quantity in cart
  const updateQuantity = (route, quantity) => {
    if (!route) {
      console.error('No route provided for quantity update');
      return;
    }

    setCart((prevCart) => {
      return prevCart.map((item) =>
        item.route === route
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      );
    });
  };

  // Calculate cart totals
  const getCartTotals = () => {
    return cart.reduce(
      (totals, item) => {
        const itemTotal = parseFloat(item.discountedPrice) * item.quantity;
        const itemOriginalTotal = parseFloat(item.price) * item.quantity;
        
        return {
          total: totals.total + itemTotal,
          originalTotal: totals.originalTotal + itemOriginalTotal,
          savings: totals.savings + (itemOriginalTotal - itemTotal),
          itemCount: totals.itemCount + item.quantity
        };
      },
      { total: 0, originalTotal: 0, savings: 0, itemCount: 0 }
    );
  };

  // Clear entire cart
  const clearCart = () => {
    console.log('Clearing cart');
    setCart([]);
    localStorage.removeItem('cart');
  };

  // Check if item exists in cart
  const isInCart = (route) => {
    return cart.some((item) => item.route === route);
  };

  // Get cart item count
  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  // Context value
  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getCartCount,
    getCartTotals
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook for using cart context
export const useCart = () => {
  const context = React.useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Helper function to format price
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
};
