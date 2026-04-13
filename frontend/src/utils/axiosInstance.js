import axios from 'axios';

const axiosInstance = axios.create({
  // This VITE_API_URL comes from the environment variable you set in Vercel
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true
});

export default axiosInstance;