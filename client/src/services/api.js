import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    let message = error.response?.data?.message || error.message || 'Something went wrong';
    if (!error.response) {
      message = 'Cannot reach the server. Run npm run dev in the project root and ensure MongoDB is running (npm run db:up).';
    }
    if (error.response?.status === 401 && !window.location.pathname.includes('/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject({ message, status: error.response?.status, errors: error.response?.data?.errors });
  }
);

export default api;
