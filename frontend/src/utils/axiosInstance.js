import axios from 'axios';

const axiosInstance = axios.create({
  // Use VITE_ prefix for Vite projects
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true
});

export default axiosInstance;