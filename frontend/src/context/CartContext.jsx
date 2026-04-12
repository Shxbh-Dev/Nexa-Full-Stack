// frontend/src/context/CartContext.jsx

import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [paymentMethod, setPaymentMethod] = useState(() => {
    const savedMethod = localStorage.getItem('paymentMethod');
    return savedMethod ? JSON.parse(savedMethod) : 'BHIM UPI';
  });

  const [shippingAddress, setShippingAddress] = useState(() => {
    const savedAddress = localStorage.getItem('shippingAddress');
    return savedAddress ? JSON.parse(savedAddress) : { name: '', email: '', phone: '', address: '' };
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // FIXED: Handles quantities and object spreading correctly
  const addToCart = (product, qty = 1) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    if (existItem) {
      setCartItems(cartItems.map((x) => 
        x._id === existItem._id ? { ...product, qty: existItem.qty + qty } : x
      ));
    } else {
      setCartItems([...cartItems, { ...product, qty }]);
    }
  };

  const removeFromCart = (id) => setCartItems(cartItems.filter((x) => x._id !== id));
  
  const clearCartItems = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems');
  };

  const savePaymentMethod = (method) => {
    setPaymentMethod(method);
    localStorage.setItem('paymentMethod', JSON.stringify(method));
  };

  const saveShippingAddress = (data) => {
    setShippingAddress(data);
    localStorage.setItem('shippingAddress', JSON.stringify(data));
  };

  return (
    <CartContext.Provider value={{ 
      cartItems, addToCart, removeFromCart, clearCartItems, 
      paymentMethod, savePaymentMethod,
      shippingAddress, saveShippingAddress 
    }}>
      {children}
    </CartContext.Provider>
  );
};