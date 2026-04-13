import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { CartProvider } from './context/CartContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
// --- THIS LINE WAS LIKELY MISSING OR MISSPELLED ---
import axios from 'axios'; 

// --- THE UNIVERSAL AXIOS CONFIG ---
// Fallback to your Render URL if the environment variable is missing
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://nexa-full-stack-1.onrender.com';
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

// Interceptor to force cookies (JWT) on every single request
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
  </React.StrictMode>,
)