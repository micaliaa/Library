import React from 'react';
import logo from '../../../assets/logo.png';
import { FiHome, FiUsers, FiClipboard } from "react-icons/fi";
import { PiBooksDuotone } from "react-icons/pi";
import { MdOutlineReport } from "react-icons/md";
import { AiOutlineLogout } from "react-icons/ai";
import { NavLink, useNavigate } from "react-router-dom";

const SidebarAdmin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("UserID");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkClasses = (isActive) =>
    `flex items-center font-medium px-3 py-2 rounded transition-colors duration-200 ${
      isActive
        ? "bg-[#9C5A1F] text-[#FFF9F3]" 
        : "text-[#F5E6D3] hover:bg-[#8B4F1F] hover:text-[#FFF9F3]"
    }`;

  return (
  <aside className="w-64 h-screen fixed top-0 left-0 bg-[#7B3F00] text-[#F5E6D3] flex flex-col p-6 overflow-hidden">

      {/* Logo */}
      <div className="flex items-center space-x-2 mb-6">
        <img src={logo} className="w-16 h-16 rounded-full" alt="logo" />
        <h1 className="text-2xl font-bold text-[#F5E6D3]">M-Libry</h1>
      </div>

      {/* Menu */}
      <nav className="flex flex-col space-y-4 text-sm px-1 border-t border-[#B67438] pt-4">
        <NavLink to="/admin/dashboard" className={({ isActive }) => linkClasses(isActive)}>
          <FiHome className="w-5 h-5 mr-3" /> Dashboard
        </NavLink>
        <NavLink to="/admin/users" className={({ isActive }) => linkClasses(isActive)}>
          <FiUsers className="w-5 h-5 mr-3" /> Manage Users
        </NavLink>
        <NavLink to="/admin/books" className={({ isActive }) => linkClasses(isActive)}>
          <PiBooksDuotone className="w-5 h-5 mr-3" /> Manage Books
        </NavLink>
        <NavLink to="/admin/borrowings" className={({ isActive }) => linkClasses(isActive)}>
          <FiClipboard className="w-5 h-5 mr-3" /> Borrowings & Returns
        </NavLink>
        <NavLink to="/admin/reports" className={({ isActive }) => linkClasses(isActive)}>
          <MdOutlineReport className="w-5 h-5 mr-3" /> Reports
        </NavLink>

        <hr className="my-4 border-[#B67438]" />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-red-600 text-white rounded hover:bg-[#ad6826] transition"
        >
          <AiOutlineLogout className="w-5 h-5" /> Logout
        </button>
      </nav>

      <div className="mt-auto pt-6  border-[#B67438] text-sm text-center">
        <p className="text-[#D29D6A]">© 2025 M-Libry </p>
      </div>
    </aside>
  );
};

export default SidebarAdmin;
