import React from "react";
import LogoLogin from "../../../assets/tampilan login.png" 
import axios from 'axios'
import { useState } from "react";
import {useNavigate} from 'react-router-dom'

const Login = () => {
  const [Email, setEmail] = useState("");
  const [Password,setPassword]=useState("");
  const navigate = useNavigate()
  const [succes,setSucces]=useState("");
  const [error,setError]=useState("");
  const handleLogin= async (e) => {
    e.preventDefault();
    console.log("login diklik");
    setSucces("");

try{
    //login untuk peminjam biasa
    const response =await axios.post("http://localhost:3000/akun/login",{Email,Password});
    console.log("Response:",response.data);
    const {accessToken,Role,UserID}=response.data.data;

    //simpan token dan user id di localstroage
    localStorage.setItem("token",accessToken);
    localStorage.setItem("UserID",UserID);
    console.log("user yang disimpan:",UserID)

    setSucces("Login Berhasil.")

    //sesuai role
    if(Role==="Peminjam"){
      navigate("/dashboard")
    }else{
      setError("Role Tidak Dikenali");  
    }
  }catch(err){
   setError(err.response?.data?.message|| "Login gagal.coba lagi");
  }}
   
  return (
    <div className="flex min-h-screen bg-white">
     
      <div className="flex flex-col justify-center w-full md:w-1/2 px-10 md:px-20">
        <h1 className="text-3xl font-bold mb-2 text-[#7B3F00]">Welcome back</h1>
        <p className="text-[#5A4A42] mb-8">
          Welcome back! Please enter your details
        </p>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={Email}
              onChange={(e) => setEmail( e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              placeholder="********"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"
            />

            <div className="flex justify-between text-sm mt-2">
              <label className="flex items-center space-x-2">
            
              
              </label>
              <a href="#" className="text-black hover:underline">
                Forgot password?
              </a>  
            </div>
          </div>

          {/* button login */}
          <button
            type="submit"
            className="w-full bg-[#7B3F00] text-white py-2 rounded-lg font-semibold hover:bg-[#D29D6A] transition"
          >
            Login
          </button>
        </form>

        {/* Sign Up link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <a href="/register" className="text-[#7B3F00] font-semibold hover:underline">
            Sign up
          </a>
        </p>
      </div>

   
      <div className="hidden md:flex w-1/2 bg-[#F5E6D3] items-center justify-center relative">
       <img src={LogoLogin} />
        <div className="absolute bottom-4 text-[#7B3F00] text-sm opacity-75">
          © 2025 Libry App
        </div>
      </div>
    </div>
  );
};

export default Login;
