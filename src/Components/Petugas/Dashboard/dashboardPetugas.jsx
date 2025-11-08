import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import SidebarPetugas from "../Sidebar/sidebarPetugas";


import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { toast } from "react-toastify";
import { FaBook, FaUser, FaClipboardList, FaUserCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const DashboardPetugas = () => {
  const navigate = useNavigate();
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeLoans, setActiveLoans] = useState(0);
  const [roleData, setRoleData] = useState([]);
  const [monthlyLoans, setMonthlyLoans] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openProfile, setOpenProfile] = useState(false);
  const [user, setUser] = useState({ Username: "", Role: "" });
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("token");
  const userID = localStorage.getItem("UserID");
  const role = localStorage.getItem("Role");
  const headers = { headers: { Authorization: `Bearer ${token}` } };



  
  // Ambil detail user
  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        if (!userID) return;
        const res = await axios.get(`${API_URL}/users/${userID}`, headers);
        setUser({
          Username: res.data.Username,
          Role: role || res.data.Role,
        });
      } catch (err) {
        console.error("Gagal ambil detail user:", err);
      }
    };
    fetchUserDetail();
  }, []);

  const roleTranslate = (role) => {
    const map = {
      Petugas: "Staff",
      Admin: "Admin",
      Peminjam: "Borrower",
    };
    return map[role] || role;
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("UserID");
    localStorage.removeItem("Role");
    navigate("/login");
  };

  // Tutup dropdown kalo click luar
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [booksRes, usersRes, loansRes, returnsRes, roleRes] = await Promise.all([
          axios.get(`${API_URL}/buku`, headers),
          axios.get(`${API_URL}/users`, headers),
          axios.get(`${API_URL}/peminjaman`, headers),
          axios.get(`${API_URL}/pengembalian`, headers),
          axios.get(`${API_URL}/users/count`, headers),
        ]);
        console.log("Loans data =", loansRes.data);
console.log("Returns data =", returnsRes.data);


        setTotalBooks(booksRes.data.length);
        setTotalUsers(usersRes.data.length);

      
       // Ambil semua ID peminjaman yg sudah dikembalikan
const returnedLoanIds = new Set(
  returnsRes.data.map(r => r.PeminjamanID)
);

// Hitung peminjaman yg belum ada di table pengembalian
const activeBorrowings = loansRes.data.filter(
  loan => !returnedLoanIds.has(loan.PeminjamanID)
).length;
console.log("Aktif dipinjam di DB:", activeBorrowings);
setActiveLoans(activeBorrowings);


        setActiveLoans(activeBorrowings);
   

        setRoleData([
          { name: "Peminjam", value: roleRes.data.totalPeminjam || 0 },
          { name: "Petugas", value: roleRes.data.totalPetugas || 0 },
          { name: "Administrator", value: roleRes.data.totalAdmin || 0 },
        ]);

        const monthly = Array(12).fill(0);
        loansRes.data.forEach((item) => {
          const month = new Date(item.TanggalPeminjaman).getMonth();
          monthly[month]++;
        });

        setMonthlyLoans(
          monthly.map((v, i) => ({
            month: new Date(0, i).toLocaleString("default", { month: "short" }),
            value: v,
          }))
        );
      } catch (err) {
        console.error("Gagal ambil data dashboard:", err);
        toast.error("Gagal load dashboard!");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  return (
    <div className="flex min-h-screen">
      <SidebarPetugas />
      <main className="flex-1 bg-[#F5E6D3] p-8 relative">
        <div className="w-full flex justify-between items-center mb-6 relative" ref={dropdownRef}>
          <div>
            <h1 className="text-3xl font-bold text-[#7B3F00]">Dashboard</h1>
            <p className="text-[#5A4A42]">Welcome back, {roleTranslate(user?.Role)} 👋</p>
          </div>

          <div className="flex items-center gap-3 relative">
            <span className="text-sm font-semibold text-[#7B3F00]">
              {roleTranslate(user?.Role)}
            </span>

            <FaUserCircle
              size={36}
              className="text-[#7B3F00] cursor-pointer"
              onClick={() => setOpenProfile(!openProfile)}
            />

            <AnimatePresence>
              {openProfile && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-12 bg-white rounded-xl shadow-lg p-3 w-44 z-10"
                >
                  <p className="text-sm font-medium text-gray-800 mb-2 border-b pb-1">
                    {user?.Username || "User"}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-700 text-sm w-full text-left"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <>
            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-100 rounded-2xl shadow p-6 flex items-center gap-4">
                <FaBook size={40} className="text-blue-600" />
                <div>
                  <h2 className="text-[#7B3F00] font-semibold">Total Books</h2>
                  <p className="text-2xl font-bold mt-1">{totalBooks}</p>
                </div>
              </div>

              <div className="bg-green-100 rounded-2xl shadow p-6 flex items-center gap-4">
                <FaUser size={40} className="text-green-600" />
                <div>
                  <h2 className="text-[#7B3F00] font-semibold">Total Borrowers</h2>
                  <p className="text-2xl font-bold mt-1">{totalUsers}</p>
                </div>
              </div>

              <div className="bg-yellow-100 rounded-2xl shadow p-6 flex items-center gap-4">
                <FaClipboardList size={40} className="text-yellow-600" />
                <div>
                  <h2 className="text-[#7B3F00] font-semibold">Active Borrowings</h2>
                  <p className="text-2xl font-bold mt-1">{activeLoans}</p>
                </div>
              </div>
            </div>

            {/* Role Chart */}
            <div className="bg-white rounded-2xl shadow p-6 mt-8">
              <h2 className="text-[#7B3F00] font-semibold mb-4">Users by Role</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={roleData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#D29D6A" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Borrowings Chart */}
            <div className="bg-white rounded-2xl shadow p-6 mt-8">
              <h2 className="text-[#7B3F00] font-semibold mb-4">Monthly Borrowings</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyLoans}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#7B3F00" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default DashboardPetugas;
