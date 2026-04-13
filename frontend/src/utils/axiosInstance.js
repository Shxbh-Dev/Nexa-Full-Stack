import axios from 'axios'; // <--- THIS LINE IS MANDATORY

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://nexa-full-stack-1.onrender.com',
  withCredentials: true,
});

// This ensures that even if you use this instance, cookies are forced
axiosInstance.interceptors.request.use(
  (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;