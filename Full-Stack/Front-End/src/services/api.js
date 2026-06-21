import axios from 'axios';

const api = axios.create({
  baseURL: 'https://sidias-api.vercel.app/api',
});

// Interceptor untuk menyisipkan token JWT secara otomatis
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sidias_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;