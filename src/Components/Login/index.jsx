import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthProvider';
import { login as loginService } from '../../Control/Service/Login';
import { toast } from 'react-toastify';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // เพิ่ม state สำหรับ loading
  const navigate = useNavigate();
  const { login } = useAuth();

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
      return;
    }

    setLoading(true); // เปิดสถานะกำลังโหลด
    try {
      const userData = await loginService(username, password);
      if (!userData) {
        throw new Error('ไม่พบข้อมูลผู้ใช้');
      }
      login(userData);
      toast.success('เข้าสู่ระบบสำเร็จ!', {
        position: 'top-right',
        autoClose: 3000,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);

      let errorMessage = 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง';
      if (error.response?.status) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
            break;
          case 404:
            errorMessage = 'ไม่พบผู้ใช้งานในระบบ';
            break;
          case 500:
            errorMessage = 'เกิดข้อผิดพลาดจากระบบ กรุณาลองใหม่ภายหลัง';
            break;
          default:
            errorMessage = `เกิดข้อผิดพลาด: ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้';
      }

      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'light',
      });
    } finally {
      setLoading(false); // ปิดสถานะกำลังโหลด
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">เข้าสู่ระบบ</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              ชื่อผู้ใช้
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              รหัสผ่าน
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading} // ปิดการคลิกปุ่มเมื่อกำลังโหลด
            className={`w-full text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <a
            href="/forgot-password"
            className="text-blue-500 hover:underline text-sm"
          >
            ลืมรหัสผ่าน?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
