import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  getProfile as getProfileService,
  updateProfile as updateProfileService,
} from "../../../Control/Service/Profile";
// Import icons
import {
  FaUser,
  FaPhone,
  FaKey,
  FaHashtag,
  FaSave,
  FaSpinner,
  FaExclamationCircle,
  FaInfoCircle,
} from "react-icons/fa";

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

  const validatePhone = (phone) => {
    const cleanPhone = phone.replace(/[\s-]/g, "");
    if (!/^0\d{9}$/.test(cleanPhone)) {
      return false;
    }
    return true;
  };

  const validateForm = (data) => {
    const cleanPhone = data.phone.replace(/[\s-]/g, "");

    if (!data.name || !cleanPhone || !data.api_id || !data.api_hash) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return false;
    }

    if (!validatePhone(cleanPhone)) {
      toast.error(
        "เบอร์โทรศัพท์ไม่ถูกต้อง (ต้องขึ้นต้นด้วย 0 ตามด้วยตัวเลข 9 หลัก)"
      );
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

  const handlePhoneChange = (e) => {
    let value = e.target.value;

    if (!/^[0-9\s-]*$/.test(value)) {
      return;
    }

    const cleanValue = value.replace(/[\s-]/g, "");
    if (cleanValue.length <= 10) {
      setFormData((prev) => ({
        ...prev,
        phone: value,
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center space-x-4 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
            <FaUser className="text-2xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">ข้อมูลโปรไฟล์</h2>
            <p className="text-gray-500">จัดการข้อมูลส่วนตัวของคุณ</p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Form Header */}
          <div className="px-8 py-6 bg-gradient-to-r from-purple-500 to-pink-500">
            <h3 className="text-xl font-semibold text-white">แก้ไขข้อมูล</h3>
            <p className="text-purple-100 mt-1">กรุณากรอกข้อมูลให้ครบถ้วน</p>
          </div>

          {/* Form Fields */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* ชื่อ */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <FaUser className="text-purple-500 mr-2" />
                  ชื่อ
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="กรอกชื่อ"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="text-gray-400 text-lg" />
                  </div>
                </div>
              </div>

              {/* เบอร์โทรศัพท์ */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <FaPhone className="text-purple-500 mr-2" />
                  เบอร์โทรศัพท์
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="0xxxxxxxxx"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaPhone className="text-gray-400 text-lg" />
                  </div>
                </div>
                <p className="flex items-center text-sm text-gray-500 mt-1">
                  <FaInfoCircle className="mr-2 text-purple-400" />
                  ตัวอย่าง: 0812345678
                </p>
              </div>

              {/* API ID */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <FaKey className="text-purple-500 mr-2" />
                  API ID
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <input
                    type="text"
                    name="api_id"
                    value={formData.api_id}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter API ID"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaKey className="text-gray-400 text-lg" />
                  </div>
                </div>
              </div>

              {/* API Hash */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <FaHashtag className="text-purple-500 mr-2" />
                  API Hash
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <input
                    type="text"
                    name="api_hash"
                    value={formData.api_hash}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="Enter API Hash"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaHashtag className="text-gray-400 text-lg" />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={`
                  px-6 py-3 rounded-lg text-white font-medium 
                  flex items-center justify-center transition-all
                  transform hover:scale-105 active:scale-95
                  ${loading 
                    ? "bg-gray-400 cursor-not-allowed" 
                    : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl"
                  }
                `}
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    กำลังบันทึก...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    บันทึกข้อมูล
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-purple-900/50 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white p-8 rounded-2xl shadow-2xl flex items-center space-x-4">
              <FaSpinner className="animate-spin text-purple-500 text-3xl" />
              <p className="text-lg font-medium">กำลังดำเนินการ...</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mt-6">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <FaExclamationCircle className="text-red-500 text-xl flex-shrink-0" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appconfig;
