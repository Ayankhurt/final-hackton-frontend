// AuthContext for HealthMate Frontend
// Global authentication state management with JWT token handling

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

// Create AuthContext
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  // State for authentication
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get stored token and user data
        const storedToken = localStorage.getItem('healthmate_token');
        const storedUser = localStorage.getItem('healthmate_user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Verify token is still valid by fetching user profile
          try {
            const profileResponse = await authAPI.getProfile();
            if (profileResponse.success) {
              setUser(profileResponse.data.user);
            } else {
              // Token is invalid, clear storage
              logout();
            }
          } catch (error) {
            // Token is invalid, clear storage
            logout();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.login(credentials);
      
      if (response.success) {
        const { token: newToken, user: userData } = response.data;
        
        // Store token and user data in localStorage
        // Note: In production, this should be replaced with httpOnly cookies for better security
        localStorage.setItem('healthmate_token', newToken);
        localStorage.setItem('healthmate_user', JSON.stringify(userData));
        
        setToken(newToken);
        setUser(userData);
        
        return { success: true };
      } else {
        setError(response.message || 'Login failed');
        return { success: false, error: response.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.register(userData);
      
      if (response.success) {
        const { token: newToken, user: newUser } = response.data;
        
        // Store token and user data in localStorage
        // Note: In production, this should be replaced with httpOnly cookies for better security
        localStorage.setItem('healthmate_token', newToken);
        localStorage.setItem('healthmate_user', JSON.stringify(newUser));
        
        setToken(newToken);
        setUser(newUser);
        
        return { success: true };
      } else {
        setError(response.message || 'Registration failed');
        return { success: false, error: response.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('healthmate_token');
    localStorage.removeItem('healthmate_user');
    
    // Clear state
    setToken(null);
    setUser(null);
    setError(null);
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await authAPI.updateProfile(profileData);
      
      if (response.success) {
        const updatedUser = response.data.user;
        
        // Update localStorage
        localStorage.setItem('healthmate_user', JSON.stringify(updatedUser));
        
        setUser(updatedUser);
        return { success: true };
      } else {
        setError(response.message || 'Profile update failed');
        return { success: false, error: response.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Profile update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!(token && user);
  };

  // Context value
  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    clearError,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;


