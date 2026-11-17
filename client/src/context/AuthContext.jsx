import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('truehire_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('truehire_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('truehire_token');
      if (storedToken) {
        try {
          const res = await authService.getCurrentUser();
          if (res && res.data) {
            setUser(res.data);
            localStorage.setItem('truehire_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error('Failed to restore session:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const response = await authService.login({ email, password });
    // API wraps payload in { success, message, data } — unwrap it
    const { token: receivedToken, user: receivedUser } = response.data || response;
    
    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('truehire_token', receivedToken);
    localStorage.setItem('truehire_user', JSON.stringify(receivedUser));

    return receivedUser;
  };

  const register = async (data) => {
    const response = await authService.register(data);
    // API wraps payload in { success, message, data } — unwrap it
    const { token: receivedToken, user: receivedUser } = response.data || response;

    setToken(receivedToken);
    setUser(receivedUser);
    localStorage.setItem('truehire_token', receivedToken);
    localStorage.setItem('truehire_user', JSON.stringify(receivedUser));

    return receivedUser;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('truehire_token');
    localStorage.removeItem('truehire_user');
  };

  const refreshUser = async () => {
    try {
      const res = await authService.getCurrentUser();
      if (res && res.data) {
        setUser(res.data);
        localStorage.setItem('truehire_user', JSON.stringify(res.data));
      }
    } catch (e) {
      console.error('Failed to refresh user', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        role: user?.role,
        loading,
        login,
        register,
        logout,
        refreshUser
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
