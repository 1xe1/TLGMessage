import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { getProfile as getProfileService, updateProfile as updateProfileService } from "../../../Control/Service/Profile";

const Appconfig = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    api_id: "",
    api_hash: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await getProfileService();
      if (data?.user) {
        setFormData({
          name: data.user.name || "",
          phone: data.user.phone || "",
          api_id: data.user.api_id || "",
          api_hash: data.user.api_hash || "",
        });
      }
    } catch (error) {
      console.error("Fetch profile error:", error);
      setError(error.message);
      toast.error(error.message);

      if (error.message === "กรุณาเข้าสู่ระบบใหม่") {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (data) => {
    if (!data.name || !data.api_id || !data.api_hash || !data.phone) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return false;
    }

    if (!/^[0-9]{10}$/.test(data.phone)) {
      toast.error("เบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็นตัวเลข 10 หลัก)");
      return false;
    }

    if (!/^[a-f0-9]{32}$/i.test(data.api_hash)) {
      toast.error("API Hash ไม่ถูกต้อง (ต้องเป็น hexadecimal 32 ตัวอักษร)");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm(formData)) {
      return;
    }

    try {
      setLoading(true);
      const data = await updateProfileService(formData);
      toast.success(data.message || "อัพเดทข้อมูลสำเร็จ");
      await fetchProfile(); // รีโหลดข้อมูลหลังอัพเดท
    } catch (error) {
      console.error("Update profile error:", error);
      toast.error(error.message);

      if (error.message === "กรุณาเข้าสู่ระบบใหม่") {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">เกิดข้อผิดพลาด! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">ข้อมูลโปรไฟล์</h2>
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ชื่อ
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="กรอกชื่อ"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API ID
            </label>
            <input
              type="text"
              name="api_id"
              value={formData.api_id}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter API ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Hash
            </label>
            <input
              type="text"
              name="api_hash"
              value={formData.api_hash}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter API Hash"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              เบอร์โทรศัพท์
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter Phone Number"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`mt-4 px-4 py-2 rounded text-white ${
            loading 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
        </button>
      </form>
    </div>
  );
};

export default Appconfig;
