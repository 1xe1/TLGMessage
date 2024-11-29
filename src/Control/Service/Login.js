import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3123';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptor to add token to all requests
api.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const { token } = JSON.parse(storedUser);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = async (username, password) => {
  try {
    console.log('Attempting login to:', API_URL);
    const response = await api.post('/api/v1/login', {
      username,
      password,
    });
    console.log('Login response:', response);
    
    // Store user data with token from cookie
    const userData = {
      ...response.data.user,
      token: document.cookie.split('token=')[1]?.split(';')[0] // Extract token from cookie
    };
    
    return userData;
  } catch (error) {
    console.error('Detailed login error:', error);
    if (error.code === 'ERR_NETWORK') {
      throw new Error('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาตรวจสอบการเชื่อมต่อ');
    }
    if (error.response?.status === 401) {
      throw new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
    throw new Error(error.response?.data?.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
  }
};

// Add new auth check function
export const checkAuth = async () => {
  try {
    const response = await api.get('/api/v1/check-auth');
    return response.data.user;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    await api.post('/api/v1/logout');
    return true;
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
};
