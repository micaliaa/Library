import React from 'react';
import logo from '../../../assets/logo.png';
import { FiHome, FiUsers, FiClipboard } from "react-icons/fi";
import { PiBooksDuotone } from "react-icons/pi";
import { MdOutlineReport } from "react-icons/md";

const SidebarAdmin = () => {
  return (
    <aside className="w-64 bg-[#4A1E00] text-[#F5E6D3] flex flex-col p-6">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <img src={logo} className="w-12 h-12 rounded-full" alt="logo" />
        <h1 className="text-2xl font-bold">M-Libry</h1>
      </div>

      {/* Menu */}
      <nav className="flex flex-col space-y-5 mt-8 text-sm border-t-5 border-[#B67438] py-8 ">
        <a
          href="/admin/dashboard"
          className="flex items-center py-2 hover:text-[#D29D6A] font-medium"
        >
          <FiHome className="w-5 h-5 mr-4" /> Dashboard
        </a>

        <a
          href="/admin/users"
          className="flex items-center py-2 hover:text-[#D29D6A] font-medium"
        >
          <FiUsers className="w-5 h-5 mr-4" /> Manage Users
        </a>

        <a
          href="/admin/books"
          className="flex items-center py-2 hover:text-[#D29D6A] font-medium"
        >
          <PiBooksDuotone className="w-5 h-5 mr-4" /> Manage Books
        </a>

        <a
          href="/admin/borrowings"
          className="flex items-center py-2 hover:text-[#D29D6A] font-medium"
        >
          <FiClipboard className="w-5 h-5 mr-4" /> Borrowings & Returns
        </a>

        <a
          href="/admin/reports"
          className="flex items-center py-2 hover:text-[#D29D6A] font-medium"
        >
          <MdOutlineReport className="w-5 h-5 mr-4" /> Reports
        </a>
      </nav>

      {/* Footer */}
      <div className="mt-auto pt-6 border-t border-[#B67438] text-sm">
        <p className="text-[#D29D6A]">© 2025 M-Libry Admin</p>
      </div>
    </aside>
  );
};

export default SidebarAdmin;
