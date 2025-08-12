import React, { createContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import { setAuthToken, removeAuthToken } from '../services/api';
import jwtDecode from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Check if user is already logged in (token in localStorage)
  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          // Verify token expiration
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp < currentTime) {
            // Token expired
            logout();
            return;
          }
          
          setAuthToken(token);
          
          // Get current user data
          const response = await api.get('/auth/me');
          
          if (response.data.status === 'success') {
            setCurrentUser(response.data.data.user);
            setIsAuthenticated(true);
          } else {
            logout();
          }
        } catch (error) {
          console.error('Authentication check error:', error);
          logout();
        }
      }
      
      setLoading(false);
    };
    
    checkUserLoggedIn();
  }, []);

  // Register a new user
  const register = async (name, email, password) => {
    try {
      setLoading(true);
      setAuthError(null);
      
      const response = await api.post('/auth/register', {
        name,
        email,
        password
      });
      
      if (response.data.status === 'success') {
        const { accessToken } = response.data.data;
        
        // Save token to localStorage
        localStorage.setItem('token', accessToken);
        
        // Set token for API requests
        setAuthToken(accessToken);
        
        // Set user data
        setCurrentUser(response.data.data.user);
        setIsAuthenticated(true);
        
        toast.success('Registration successful!');
        return true;
      } else {
        setAuthError(response.data.message || 'Registration failed');
        toast.error(response.data.message || 'Registration failed');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setAuthError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setLoading(true);
      setAuthError(null);
      
      const response = await api.post('/auth/login', {
        email,
        password
      });
      
      if (response.data.status === 'success') {
        const { accessToken } = response.data.data;
        
        // Save token to localStorage
        localStorage.setItem('token', accessToken);
        
        // Set token for API requests
        setAuthToken(accessToken);
        
        // Set user data
        setCurrentUser(response.data.data.user);
        setIsAuthenticated(true);
        
        toast.success('Login successful!');
        return true;
      } else {
        setAuthError(response.data.message || 'Login failed');
        toast.error(response.data.message || 'Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Login failed';
      setAuthError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Remove token from localStorage
      localStorage.removeItem('token');
      
      // Remove token from API headers
      removeAuthToken();
      
      // Reset state
      setCurrentUser(null);
      setIsAuthenticated(false);
      
      toast.info('Logged out successfully');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        loading,
        authError,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
