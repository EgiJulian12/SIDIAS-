import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

// Decode JWT payload tanpa library (tidak verifikasi signature — hanya cek expiry)
const decodeJwt = (token) => {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch {
    return null;
  }
};

// Cek apakah token masih valid (belum expired)
const isTokenValid = (token) => {
  if (!token) return false;
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return false;
  // exp dalam detik, Date.now() dalam ms
  return decoded.exp * 1000 > Date.now();
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem('sidias_token');
      // Jika token expired/tidak valid, bersihkan localStorage
      if (!isTokenValid(token)) {
        localStorage.removeItem('sidias_user');
        localStorage.removeItem('sidias_token');
        localStorage.removeItem('sidias_login');
        return null;
      }
      const stored = localStorage.getItem('sidias_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    const t = localStorage.getItem('sidias_token');
    return isTokenValid(t) ? t : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const t = localStorage.getItem('sidias_token');
    return isTokenValid(t) && localStorage.getItem('sidias_login') === 'true';
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

  // Cek token expiry secara periodik (setiap 60 detik)
  useEffect(() => {
    const checkToken = () => {
      const t = localStorage.getItem('sidias_token');
      if (t && !isTokenValid(t)) {
        logout();
        window.location.replace('/login');
      }
    };

    const interval = setInterval(checkToken, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync state jika localStorage berubah di tab lain
  useEffect(() => {
    const handleStorageChange = () => {
      const t = localStorage.getItem('sidias_token');
      const valid = isTokenValid(t);
      setIsAuthenticated(valid && localStorage.getItem('sidias_login') === 'true');
      try {
        const stored = localStorage.getItem('sidias_user');
        setUser(stored && valid ? JSON.parse(stored) : null);
      } catch {
        setUser(null);
      }
      setToken(valid ? t : null);
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
