import React, { useState } from "react";
import registerImage from "../../../assets/tampilan login.png"; 
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Register = () => {
  const [formData, setFormData] = useState({
    Username: '',
    Password: '',
    Email: '',
    NamaLengkap: '',
    Alamat: ''  
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Register
      const response = await axios.post(`${API_URL}/akun/register`, formData);
      alert(response.data.message);

      // Login otomatis setelah register
      const loginRes = await axios.post(`${API_URL}/akun/login`, {
        Email: formData.Email,
        Password: formData.Password
      });

      const { accessToken, Role, UserID } = loginRes.data.data;

      // Simpan token dan user id di localStorage
      localStorage.setItem("token", accessToken);
      localStorage.setItem("UserID", UserID);
      console.log("user yang disimpan:", UserID);

      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Registrasi gagal!');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FFF9F3]">
      <div className="flex flex-col justify-center w-full md:w-1/2 px-10 md:px-20">
        <h1 className="text-3xl font-bold text-[#7B3F00] mb-2">Create an Account</h1>
        <p className="text-[#5A4A42] mb-8">
          Join us and start your digital library experience today.
        </p>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            <label className="block text-[#5A4A42] text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              id="Username"
              value={formData.Username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#F5E6D3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-[#5A4A42] text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              id="Password"
              value={formData.Password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#F5E6D3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[#5A4A42] text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              id="Email"
              value={formData.Email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#F5E6D3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-[#5A4A42] text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              id="NamaLengkap"
              value={formData.NamaLengkap}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#F5E6D3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-[#5A4A42] text-sm font-medium mb-2">Address</label>
            <input
              type="text"
              placeholder="Enter your address"
              id="Alamat"
              value={formData.Alamat}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#F5E6D3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#7B3F00] text-white py-2 rounded-lg font-semibold hover:bg-[#D29D6A] transition-all duration-300"
          >
            Register  
          </button>

          <p className="text-center text-sm text-[#5A4A42] mt-4">
            Already have an account?{" "}
            <a href="/login" className="text-[#B67438] font-medium hover:underline">
              Login here
            </a>
          </p>
        </form>
      </div>

      <div className="hidden md:flex w-1/2 bg-[#F5E6D3] items-center justify-center relative">
        <img src={registerImage} className="w-4/5" />
        <div className="absolute bottom-4 text-[#7B3F00] text-sm opacity-75">© 2025 Libry App</div>
      </div>
    </div>
  );
};

export default Register;
