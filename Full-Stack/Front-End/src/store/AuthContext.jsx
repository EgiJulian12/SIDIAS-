import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('sidias_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('sidias_token') || null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('sidias_login') === 'true';
  });

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    setIsAuthenticated(true);
    localStorage.setItem('sidias_user', JSON.stringify(userData));
    localStorage.setItem('sidias_token', userToken);
    localStorage.setItem('sidias_login', 'true');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('sidias_user');
    localStorage.removeItem('sidias_token');
    localStorage.removeItem('sidias_login');
  };

  // Sync state if localStorage changes in another tab
  useEffect(() => {
    const handleStorageChange = () => {
      const isLogin = localStorage.getItem('sidias_login') === 'true';
      setIsAuthenticated(isLogin);
      try {
        const stored = localStorage.getItem('sidias_user');
        setUser(stored ? JSON.parse(stored) : null);
      } catch {
        setUser(null);
      }
      setToken(localStorage.getItem('sidias_token'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

