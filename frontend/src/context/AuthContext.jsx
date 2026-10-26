import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('cinebook_token');
      if (token) {
        try {
          const res = await API.get('/auth/me');
          if (res && res.success) {
            setUser(res.data);
          } else {
            localStorage.removeItem('cinebook_token');
            setUser(null);
          }
        } catch (error) {
          console.error('Auth verification failed:', error.message);
          localStorage.removeItem('cinebook_token');
          setUser(null);
          setSessionExpiredMessage('Your session has expired. Please login again.');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    setSessionExpiredMessage('');
    const res = await API.post('/auth/login', { email, password });
    if (res && res.success && res.data.token) {
      localStorage.setItem('cinebook_token', res.data.token);
      const userData = {
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role
      };
      setUser(userData);
      return userData;
    } else {
      throw new Error(res?.message || 'Invalid email or password');
    }
  };

  const adminLogin = async (email, password) => {
    setSessionExpiredMessage('');
    const res = await API.post('/auth/login', { email, password });
    if (res && res.success && res.data.token) {
      if (res.data.role !== 'admin') {
        throw new Error('Access denied. Administrator account required.');
      }
      localStorage.setItem('cinebook_token', res.data.token);
      const userData = {
        _id: res.data._id,
        name: res.data.name,
        email: res.data.email,
        role: res.data.role
      };
      setUser(userData);
      return userData;
    } else {
      throw new Error(res?.message || 'Invalid email or password');
    }
  };

  const register = async (name, email, password) => {
    setSessionExpiredMessage('');
    const res = await API.post('/auth/register', { name, email, password });
    if (res && res.success) {
      // Return response data so registration page can handle success state
      return res.data;
    } else {
      throw new Error(res?.message || 'Registration failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('cinebook_token');
    setUser(null);
    setSessionExpiredMessage('');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        sessionExpiredMessage,
        setSessionExpiredMessage,
        login,
        adminLogin,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};


