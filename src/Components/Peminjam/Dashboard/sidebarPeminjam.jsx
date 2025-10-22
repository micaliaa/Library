import React from 'react';
import logo from '../../../assets/logo.png';
import { FiHome } from "react-icons/fi";
import { PiBooksDuotone } from "react-icons/pi";
import { FiTag } from "react-icons/fi";
import { MdOutlineCollectionsBookmark } from "react-icons/md";
import { FiClock } from "react-icons/fi";

const SidebarPeminjam = () =>{
    return(
    <div className='flex min-h-screen bg-[#FFF9F3] '>
     <aside className='w-64 bg-[#7B3F00] text-[#F5E6D3] flex flex-col p-6 '>

         <div className='flex items-center space-x-0'>
                <img src={logo} 
                className="w-18 h-18 rounded-full" />
               
              <h1 className='text-2xl font-bold text-[#F5E6D3]'>M-Libry</h1>
              </div>

              <nav className='flex flex-col space-y-4 text-center text-sm px-6 mt-5 border-t-5 border-[#B67438] '>
             
               <div className='mt-6 space-y-10'>
                    <a href="/dashboard"className="flex items-center  hover:text-[#D29D6A] font-medium"> <FiHome className="w-5 h-5 mr-5" />  Dashboard   </a>
                    <a href="/books"className="flex items-center  hover:text-[#D29D6A] font-medium"> <PiBooksDuotone className="w-5 h-5 mr-5" />  Books </a>
                    <a href="/categori"className="flex items-center  hover:text-[#D29D6A] font-medium"> <FiTag className="w-5 h-5 mr-5" />  Cateories </a>
                    <a href="/collection"className="flex items-center  hover:text-[#D29D6A] font-medium"> <MdOutlineCollectionsBookmark className="w-5 h-5 mr-5" />  Collection </a>
                    <a href="/peminjaman"className="flex items-center  hover:text-[#D29D6A] font-medium">   <FiClock className="w-5 h-5 mr-5" /> Borrowings </a>
                </div>
              </nav>
              <div className='mt-auto pt-6 border-t-5 border-[#B67438] text-sm'>
                <p className='text-[#D29D6A]'>© 2025 M-Libry</p>
              </div>

     </aside>
     </div>
    ) }

    export default SidebarPeminjam;