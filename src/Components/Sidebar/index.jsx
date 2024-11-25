import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  HiOutlineHome,
  HiOutlineMail,
  HiOutlineShare,
  HiOutlinePlus,
  HiOutlineCog,
  HiOutlineLogout,
} from "react-icons/hi";
import { useAuth } from "../AuthProvider";

const Sidebar = () => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    navigate("/login");
    setShowLogoutConfirm(false);
  };

  return (
    <div className="h-screen w-64 bg-gray-900 text-gray-300 flex flex-col relative">
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-green-500">TLGMTeam</h1>
      </div>

      {/* Menu Items */}
      <div className="p-4">
        <div className="space-y-4">
          {/* Main Menu Section */}
          <div>
            <p className="text-xs text-gray-500 mb-2">MESSAGING</p>
            <ul className="space-y-2">
              <Link to="/send-message">
                <li className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                  <HiOutlineMail className="text-xl" />
                  <span>ส่งข้อความ</span>
                </li>
              </Link>
              <Link to="/forward-message">
                <li className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                  <HiOutlineShare className="text-xl" />
                  <span>ส่งต่อข้อความ</span>
                </li>
              </Link>
              <Link to="/chanel">
                <li className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                  <HiOutlinePlus className="text-xl" />
                  <span>เพิ่ม Channel</span>
                </li>
              </Link>
            </ul>
          </div>

          {/* Account Section */}
          <div>
            <p className="text-xs text-gray-500 mb-2">ACCOUNT</p>
            <ul className="space-y-2">
              <li className="flex items-center space-x-3 p-2 hover:bg-gray-800 rounded-lg cursor-pointer">
                <HiOutlineHome className="text-xl" />
                <span>Dashboard</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="mt-auto p-4 border-t border-gray-800">
        <div className="flex justify-between items-center">
          <button className="p-2 hover:bg-gray-800 rounded-lg">
            <HiOutlineCog className="text-xl" />
          </button>
          <button
            className="p-2 hover:bg-gray-800 rounded-lg"
            onClick={handleLogout}
          >
            <HiOutlineLogout className="text-xl" />
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              ยืนยันการออกจากระบบ
            </h3>
            <p className="text-gray-500 mb-4">
              คุณต้องการออกจากระบบใช่หรือไม่?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowLogoutConfirm(false)}
              >
                ยกเลิก
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={confirmLogout}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
