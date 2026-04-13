import axios from 'axios'; // <--- MUST BE LINE 1
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { CartProvider } from './context/CartContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

// Configure Axios globally
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'https://nexa-full-stack-1.onrender.com';
axios.defaults.withCredentials = true;

// Force credentials on every request
axios.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);