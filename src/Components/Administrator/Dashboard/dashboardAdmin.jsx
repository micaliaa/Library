import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import SidebarAdmin from "../Sidebar/sidebarAdmin";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { toast } from "react-toastify";
import {
  FaBook,
  FaUsers,
  FaClipboardList,
  FaUserCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [activeLoans, setActiveLoans] = useState(0);
  const [roleData, setRoleData] = useState([]);
  const [monthlyLoans, setMonthlyLoans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentActivities, setRecentActivities] = useState([]);

  const [openProfile, setOpenProfile] = useState(false);
  const [user, setUser] = useState({ Username: "", Role: "" });
  const dropdownRef = useRef(null);

  const token = localStorage.getItem("token");
  const userID = localStorage.getItem("UserID");
  const role = localStorage.getItem("Role");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!userID) return;
        const res = await axios.get(`${API_URL}/users/${userID}`, headers);
        setUser({
          Username: res.data.Username,
          Role: role || res.data.Role,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  // Translate role
  const roleTranslate = (role) => {
    const map = {
      Petugas: "Staff",
      Admin: "Admin",
      Peminjam: "Borrower",
    };
    return map[role] || role;
  };

  //  Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("UserID");
    localStorage.removeItem("Role");
    navigate("/login");
  };

  //  Close dropdown click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //  Fetch dashboard data
useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const [booksRes, usersRes, loansRes, returnsRes] = await Promise.all([
        axios.get(`${API_URL}/buku`, headers),
        axios.get(`${API_URL}/users`, headers),
        axios.get(`${API_URL}/peminjaman`, headers),
        axios.get(`${API_URL}/pengembalian`, headers),
      ]);

      const totalBooksData = booksRes.data.length;
      const totalUsersData = usersRes.data.length;

      //  Hitung jumlah active loans yg belum dikembalikan
     const returnedLoanIds = new Set(
  returnsRes.data.map(r => r.PeminjamanID)
);

//  Hitung peminjaman yang BELUM dikembalikan
const activeBorrowings = loansRes.data.filter(
  loan => !returnedLoanIds.has(loan.PeminjamanID)
).length;
      setTotalBooks(totalBooksData);
      setTotalUsers(totalUsersData);
      setActiveLoans(activeBorrowings);

      // Hitung user per role
      const roleCount = usersRes.data.reduce((acc, user) => {
        const r = user.Role || "Unknown";
        acc[r] = (acc[r] || 0) + 1;
        return acc;
      }, {}); 

      const roleDataArr = Object.keys(roleCount).map((r) => ({
        name: r,
        value: roleCount[r],
      }));

      setRoleData(roleDataArr);

      // Hitung peminjaman per bulan
      const monthlyCount = {};
      loansRes.data.forEach((loan) => {
        const month = new Date(loan.TanggalPeminjaman).toLocaleString("default", { month: "short" });
        monthlyCount[month] = (monthlyCount[month] || 0) + 1;
      });

      const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      const monthlyData = monthOrder.map((m) => ({
        month: m,
        value: monthlyCount[m] || 0,
      }));

      setMonthlyLoans(monthlyData);

      // Recent activities
      const activities = [];

      loansRes.data.slice(-3).forEach((loan) => {
        activities.push({
          type: "borrow",
          message: `Book borrowed: ${loan.buku?.Judul || "Unknown"}`,
          time: new Date(loan.TanggalPeminjaman).toLocaleString(),
        });
      });

      returnsRes.data.slice(-3).forEach((ret) => {
        activities.push({
          type: "return",
          message: `Book returned: ${ret.buku?.Judul || "Unknown"}`,
          time: new Date(ret.TanggalPengembalian).toLocaleString(),
        });
      });

      usersRes.data.slice(-3).forEach((user) => {
        activities.push({
          type: "user",
          message: `New user registered: ${user.NamaLengkap || user.Username}`,
          time: new Date(user.createdAt || Date.now()).toLocaleString(),
        });
      });

      const sorted = activities.sort((a, b) => new Date(b.time) - new Date(a.time));
      setRecentActivities(sorted.slice(0, 6));

    } catch (err) {
      console.error("Gagal ambil data dashboard:", err);
      toast.error("Gagal load dashboard!");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);



  const COLORS = ["#7B3F00", "#D29D6A", "#F5E6D3"];

  return (
    <div className="flex min-h-screen">
      <SidebarAdmin />
      <main className="flex-1 ml-64 bg-[#F5E6D3] p-8 relative">
        {/*  Header */}
        <div
          className="w-full flex justify-between items-center mb-6 relative"
          ref={dropdownRef}
        >
          <div>
            <h1 className="text-3xl font-bold text-[#7B3F00]">
              Admin Dashboard
            </h1>
            <p className="text-[#5A4A42]">
              Welcome back, {roleTranslate(user?.Role)} 👋
            </p>
          </div>

          {/* Profile */}
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

         {/* Statistik  */}
        {loading ? (
          <p>Loading dashboard...</p>
        ) : (
          <>
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-100 rounded-2xl shadow p-6 flex items-center gap-4">
                <FaBook size={40} className="text-blue-600" />
                <div>
                  <h2 className="text-[#7B3F00] font-semibold">Total Books</h2>
                  <p className="text-2xl font-bold mt-1">{totalBooks}</p>
                </div>
              </div>
              <div className="bg-green-100 rounded-2xl shadow p-6 flex items-center gap-4">
                <FaUsers size={40} className="text-green-600" />
                <div>
                  <h2 className="text-[#7B3F00] font-semibold">Total Users</h2>
                  <p className="text-2xl font-bold mt-1">{totalUsers}</p>
                </div>
              </div>
              <div className="bg-yellow-100 rounded-2xl shadow p-6 flex items-center gap-4">
                <FaClipboardList size={40} className="text-yellow-600" />
                <div>
                  <h2 className="text-[#7B3F00] font-semibold">
                    Active Borrowings
                  </h2>
                  <p className="text-2xl font-bold mt-1">{activeLoans}</p>
                </div>
              </div>
            </div>

            {/*  Users by Role */}
            <div className="bg-white rounded-2xl shadow p-6 mt-8">
              <h2 className="text-[#7B3F00] font-semibold mb-4">
                Users by Role
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={roleData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="value"
                    fill="#A86A3D"
                    barSize={40}
                    animationDuration={1500}
                  >
                    {roleData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={["#A86A3D", "#D29D6A", "#F5E6D3"][index]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/*  Monthly Borrowings */}
            <div className="bg-white rounded-2xl shadow p-6 mt-8">
              <h2 className="text-[#7B3F00] font-semibold mb-4">
                Monthly Borrowings
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={monthlyLoans}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#7B3F00"
                    strokeWidth={3}
                    dot={{ fill: "#D29D6A", r: 5 }}
                    activeDot={{ r: 8 }}
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Recent Activities tabel */}
            <div className="bg-white rounded-2xl shadow p-6 mt-8">
              <h2 className="text-[#7B3F00] font-semibold mb-4">
                Recent Activities
              </h2>

              {recentActivities.length === 0 ? (
                <p className="text-gray-500">No recent activities.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 text-sm">
                    <thead className="bg-[#7B3F00] text-white">
                      <tr>
                        <th className="py-3 px-4 text-left">Date</th>
                        <th className="py-3 px-4 text-left">Type</th>
                        <th className="py-3 px-4 text-left">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentActivities.map((act, idx) => (
                        <tr
                          key={idx}
                          className="border-b hover:bg-[#F9F4EF] transition-colors"
                        >
                          <td className="py-2 px-4 text-gray-700">{act.time}</td>
                          <td className="py-2 px-4">
                            {act.type === "borrow" && (
                              <span className="text-blue-600 font-medium flex items-center gap-1">
                                📘 Borrow
                              </span>
                            )}
                            {act.type === "return" && (
                              <span className="text-green-600 font-medium flex items-center gap-1">
                                🔁 Return
                              </span>
                            )}
                            {act.type === "user" && (
                              <span className="text-yellow-600 font-medium flex items-center gap-1">
                                🧑‍💻 New User
                              </span>
                            )}
                          </td>
                          <td className="py-2 px-4 text-gray-800">
                            {act.message}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default DashboardAdmin;
