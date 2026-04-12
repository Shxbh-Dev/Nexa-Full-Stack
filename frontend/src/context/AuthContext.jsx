// frontend/src/context/AuthContext.jsx

import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Check local storage for existing user data so they stay logged in after a refresh
  const [userInfo, setUserInfo] = useState(() => {
    const savedUser = localStorage.getItem('userInfo');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Save to local storage whenever userInfo changes
  useEffect(() => {
    if (userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo));
    } else {
      localStorage.removeItem('userInfo');
    }
  }, [userInfo]);

  const setCredentials = (data) => {
    setUserInfo(data);
  };

  const logout = () => {
    setUserInfo(null);
    // In a full app, you would also make an API call here to destroy the HTTP-Only cookie
  };

  return (
    <AuthContext.Provider value={{ userInfo, setCredentials, logout }}>
      {children}
    </AuthContext.Provider>
  );
};