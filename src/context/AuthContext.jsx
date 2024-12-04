import {jwtDecode} from 'jwt-decode';
import React, { createContext, useState, useEffect } from 'react';
import { api, setAuthToken } from '../api/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) throw new Error('Token expired');

        setUser(decoded);
        setAuthToken(token);
      } catch (error) {
        console.error('Token issue:', error);
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (userData) => {
    try {
      const { token } = userData;
      if (!token) throw new Error('Token missing from response');

      localStorage.setItem('token', token);
      setAuthToken(token);

      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (error) {
      console.error('Login failed:', error.message || error);
      throw new Error('Login failed, please try again.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="loader"></div> {/* Replace with a spinner component */}
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
