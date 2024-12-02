import axios from 'axios';

const API_URL = import.meta.env.API_URL || 'http://localhost:3123';

// สร้าง axios instance สำหรับ profile service
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ดึงข้อมูลโปรไฟล์
export const getProfile = async () => {
  try {
    const response = await api.get('/api/v1/profile');
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    if (error.response?.status === 401) {
      throw new Error('กรุณาเข้าสู่ระบบใหม่');
    }
    throw new Error(error.response?.data?.message || 'ไม่สามารถดึงข้อมูลได้');
  }
};

// อัพเดทข้อมูลโปรไฟล์
export const updateProfile = async (profileData) => {
  try {
    // ตรวจสอบข้อมูลก่อนส่งไป API
    const { name, phone, api_id, api_hash } = profileData;
    
    // Validation
    if (!name || !phone || !api_id || !api_hash) {
      throw new Error('กรุณากรอกข้อมูลให้ครบถ้วน');
    }

    // ตรวจสอบรูปแบบเบอร์โทรศัพท์
    if (!/^[0-9]{10}$/.test(phone)) {
      throw new Error('เบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็นตัวเลข 10 หลัก)');
    }

    // ตรวจสอบรูปแบบ API Hash
    if (!/^[a-f0-9]{32}$/i.test(api_hash)) {
      throw new Error('API Hash ไม่ถูกต้อง (ต้องเป็น hexadecimal 32 ตัวอักษร)');
    }

    const response = await api.put('/api/v1/profile', profileData);
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    
    // จัดการ error cases ต่างๆ
    if (error.response?.status === 401) {
      throw new Error('กรุณาเข้าสู่ระบบใหม่');
    }
    
    if (error.response?.status === 400 && error.response?.data?.errors) {
      // ส่งต่อ validation errors จาก backend
      const errorMessages = Object.values(error.response.data.errors)
        .filter(err => err)
        .join(', ');
      throw new Error(errorMessages);
    }
    
    // ส่งต่อ error message จาก backend หรือ default message
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'เกิดข้อผิดพลาดในการอัพเดทข้อมูล'
    );
  }
};

// Add response interceptor for handling token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default {
  getProfile,
  updateProfile
}; 