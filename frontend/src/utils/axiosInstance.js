import axios from 'axios'; // <--- THIS MUST BE HERE

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://nexa-full-stack-1.onrender.com',
  withCredentials: true,
});

export default axiosInstance;