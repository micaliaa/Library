import React from 'react';
import logo from '../../../assets/logo.png';
import { FiHome, FiTag, FiClock,} from "react-icons/fi";
import { AiOutlineLogout } from "react-icons/ai";
import { PiBooksDuotone } from "react-icons/pi";
import { MdOutlineCollectionsBookmark } from "react-icons/md";
import { NavLink, useNavigate } from "react-router-dom";

const SidebarPeminjam = ({ className = "", isOpen, onClose }) => {


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
   <aside
  className={`
   fixed top-0 left-0 h-screen w-64
 bg-[#7B3F00] text-[#F5E6D3]
    flex flex-col p-6 z-50 transform transition-transform duration-300
    overflow-hidden
    ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
    ${className}
  `}
>


      <div className='flex items-center space-x-2 mb-6'>
        <img src={logo} className="w-16 h-16 rounded-full" alt="Logo" />
        <h1 className='text-2xl font-bold text-[#F5E6D3]'>M-Libry</h1>
      </div>

      <nav className='flex flex-col  gap-5 text-sm px-1 border-t border-[#B67438] pt-4'>
        <NavLink to="/dashboard" className={({ isActive }) => linkClasses(isActive)}>
          <FiHome className="w-5 h-5 mr-3" /> Dashboard
        </NavLink>
        <NavLink to="/books" className={({ isActive }) => linkClasses(isActive)}>
          <PiBooksDuotone className="w-5 h-5 mr-3" /> Books
        </NavLink>
        <NavLink to="/categori" className={({ isActive }) => linkClasses(isActive)}>
          <FiTag className="w-5 h-5 mr-3" /> Categories
        </NavLink>
        <NavLink to="/collection" className={({ isActive }) => linkClasses(isActive)}>
          <MdOutlineCollectionsBookmark className="w-5 h-5 mr-3" /> Collection
        </NavLink>
        <NavLink to="/peminjaman" className={({ isActive }) => linkClasses(isActive)}>
          <FiClock className="w-5 h-5 mr-3" /> Borrowings
        </NavLink>

        
        <hr className="my-4 border-[#B67438]" />

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center p-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-[#ad6826] transition"
        >
          <AiOutlineLogout className="w-5 h-5" /> Logout
        </button>
      </nav>

      <div className='mt-auto pt-6  border-[#B67438] text-sm text-center'>
        <p className='text-[#D29D6A]'>© 2025 M-Libry</p>
      </div>
    </aside>
  )
}

export default SidebarPeminjam;
