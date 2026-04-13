import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import axios from 'axios';

// --- THE UNIVERSAL AXIOS CONFIG ---
// 1. Ensure the URL is clean (no trailing slash)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_BASE_URL;

// 2. This is the key for Cookies (JWT) to work between Vercel and Render
axios.defaults.withCredentials = true;

// 3. Add a "Request Interceptor" to force headers on every single click
axios.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
)