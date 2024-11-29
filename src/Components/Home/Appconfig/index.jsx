import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";

const Appconfig = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    api_id: "",
    api_hash: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // เปลี่ยนจาก mock data เป็นการดึงข้อมูลจริงจาก API
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/v1/profile");

      if (response.data?.user) {
        const { user } = response.data;
        setFormData({
          name: user.name || "",
          phone: user.phone || "",
          api_id: user.api_id || "",
          api_hash: user.api_hash || "",
        });
      }
    } catch (error) {
      console.error("Fetch profile error:", error);
      const errorMessage =
        error.response?.data?.message || "ไม่สามารถดึงข้��มูลได้";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data before submitting
    if (!validateForm(formData)) {
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put("/api/v1/profile", formData);

      // Update local storage with new user data if needed
      const currentUser = JSON.parse(localStorage.getItem("user"));
      const updatedUser = { ...currentUser, ...response.data.user };
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("อัพเดทข้อมูลสำเร็จ", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Update profile error:", error);
      const errorMessage =
        error.response?.data?.message || "เกิดข้อผิดพลาดในการอัพเดทข้อมูล";

      // Handle validation errors
      if (error.response?.status === 400 && error.response?.data?.errors) {
        Object.values(error.response.data.errors)
          .filter((error) => error)
          .forEach((error) => toast.error(error));
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log("Input changed:", name, value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (data) => {
    if (!data.name || !data.api_id || !data.api_hash || !data.phone) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return false;
    }

    // Validate phone format
    if (!/^[0-9]{10}$/.test(data.phone)) {
      toast.error("เบอร์โทรศัพท์ไม่ถูกต้อง (ต้องเป็นตัวเลข 10 หลัก)");
      return false;
    }

    // Validate API Hash format
    if (!/^[a-f0-9]{32}$/i.test(data.api_hash)) {
      toast.error("API Hash ไม่ถูกต้อง (ต้องเป็น hexadecimal 32 ตัวอักษร)");
      return false;
    }

    return true;
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">ข้อมูลโปรไฟล์</h2>

      {loading ? (
        <div className="text-center">กำลังโหลด...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="mb-8 bg-white p-6 rounded-lg shadow"
        >
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
                Phone
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
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            บันทึกข้อมูล
          </button>
        </form>
      )}
    </div>
  );
};

export default Appconfig;
