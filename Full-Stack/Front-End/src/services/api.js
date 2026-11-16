import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Interceptor: sisipkan token JWT secara otomatis di setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sidias_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: tangani 401 token tidak valid / expired → auto logout & redirect login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const msg = error.response.data?.message || '';
      // Jika token tidak valid atau expired, bersihkan sesi dan arahkan ke login
      if (
        msg.includes('Token tidak valid') ||
        msg.includes('token') ||
        msg.includes('Token') ||
        msg.includes('Akses ditolak') ||
        msg.includes('tidak disediakan')
      ) {
        localStorage.removeItem('sidias_token');
        localStorage.removeItem('sidias_user');
        localStorage.removeItem('sidias_login');
        // Redirect ke login — replace agar tidak bisa back ke halaman protected
        window.location.replace('/login');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
