import axios from 'axios';
import { store } from '../store/store';
import { logout } from '../store/slices/authSlice';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    // You can get the token from Redux state or localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      store.dispatch(logout());
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async register(data: any) {
    const response = await axiosInstance.post('/auth/register', data);
    return response.data;
  },

  async login(data: any) {
    const response = await axiosInstance.post('/auth/login', data);
    return response.data;
  },

  async getProfile() {
    const response = await axiosInstance.get('/auth/profile');
    return response.data;
  },
};
