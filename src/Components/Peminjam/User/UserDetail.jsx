import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaUserShield, FaAddressCard } from "react-icons/fa";
import { MdMarkEmailUnread } from "react-icons/md";

const API_URL = import.meta.env.VITE_API_URL;

const UserDetail = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetailUser = async () => {
      try {
        const UserID = localStorage.getItem('UserID');
        const token = localStorage.getItem('token');
        if (!UserID || !token) {
          navigate('/login');
          return;
        }

        const res = await axios.get(`${API_URL}/users/${UserID}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setUser(res.data);
      } catch (error) {
        console.error('Gagal mengambil data pengguna', error);
      }
    };

    fetchDetailUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("UserID");
    localStorage.removeItem("Role");
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className='max-w-xl mx-auto mt-24 mb-10 p-6 bg-white dark:bg-[#7B3F00] shadow-md rounded-xl'>
      <h2 className='text-2xl font-bold text-center mb-6 text-[#7B3F00] dark:text-white'>User Details</h2>

      <div className='space-y-4 text-[#F5E6D3]'>
        <div className='flex items-center gap-3'>
          <FaUser className='text-pink-300'/>
          <span className='font-semibold'>Username:</span>
          <span>{user.Username}</span>
        </div>

        <div className='flex items-center gap-3'>
          <MdMarkEmailUnread className='text-fuchsia-300'/>
          <span className='font-semibold'>Email:</span>
          <span>{user.Email}</span>
        </div>

        <div className='flex items-center gap-3'>
          <FaAddressCard className='text-amber-300'/>
          <span className='font-semibold'>Address:</span>
          <span>{user.Alamat}</span>
        </div>

        <div className='flex items-center gap-3'>
          <FaUserShield className='text-rose-400'/>
          <span className='font-semibold'>Role:</span>
          <span>{user.Role}</span>
        </div>

        <button 
          onClick={handleLogout}
          className='w-full mt-6 py-2 bg-[#F5E6D3] text-[#7B3F00] rounded-md font-bold hover:bg-[#D29D6A]'
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserDetail;
