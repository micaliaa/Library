import React, { useEffect, useState } from "react";
import SidebarAdmin from "../Sidebar/sidebarAdmin";
import axios from "axios";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer
} from "recharts";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminReports() {
  const [stats, setStats] = useState({
    totalBorrow: 0,
    totalReturn: 0,
    activeUsers: 0,
    topBook: "-",
  });

  const [borrowData, setBorrowData] = useState([]);
  const [topBooks, setTopBooks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [originalLogs, setOriginalLogs] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchReportData();
  }, []);

  async function fetchReportData() {
    try {
      const token = localStorage.getItem("token");
      const headers = { headers: { Authorization: `Bearer ${token}` } };

      const [pengembalianRes, pemRes] = await Promise.all([
        axios.get(`${API_URL}/pengembalian`, headers),
        axios.get(`${API_URL}/peminjaman`, headers),
      ]);

      const pengembalian = pengembalianRes.data || [];
      const peminjaman = pemRes.data || [];

      const now = new Date();
      const bulanSekarang = now.getMonth();
      const tahunSekarang = now.getFullYear();

      // Total borrowed this month
      const totalBorrow = peminjaman.filter(p => {
        if (!p.TanggalPeminjaman) return false;
        const tgl = new Date(p.TanggalPeminjaman);
        return tgl.getMonth() === bulanSekarang && tgl.getFullYear() === tahunSekarang;
      }).length;

      // Total returned this month
      const totalReturn = pengembalian.filter(p => {
        if (!p.TanggalPengembalian) return false;
        const tgl = new Date(p.TanggalPengembalian);
        return tgl.getMonth() === bulanSekarang && tgl.getFullYear() === tahunSekarang;
      }).length;

      const activeUsers = new Set(peminjaman.map(p => p.UserID)).size;

      // Top books
      const countBooks = {};
      peminjaman.forEach(p => {
        const title = p.buku?.Judul;
        if (title) countBooks[title] = (countBooks[title] || 0) + 1;
      });
      const sortedBooks = Object.entries(countBooks).sort((a,b) => b[1] - a[1]);
      const topBook = sortedBooks.length > 0 ? sortedBooks[0][0] : "-";

      setStats({ totalBorrow, totalReturn, activeUsers, topBook });

      // Monthly data
      const monthly = Array.from({ length: 12 }, (_, i) => {
        const borrowed = peminjaman.filter(p => {
          if (!p.TanggalPeminjaman) return false;
          const tgl = new Date(p.TanggalPeminjaman);
          return tgl.getMonth() === i && tgl.getFullYear() === tahunSekarang;
        }).length;

        const returned = pengembalian.filter(p => {
          if (!p.TanggalPengembalian) return false;
          const tgl = new Date(p.TanggalPengembalian);
          return tgl.getMonth() === i && tgl.getFullYear() === tahunSekarang;
        }).length;

        return { month: i, borrowed, returned };
      });

      const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      const borrowDataMapped = monthly.map(m => ({
        month: monthNames[m.month],
        borrow: m.borrowed,
        return: m.returned
      }));
      setBorrowData(borrowDataMapped);

      const topBooksMapped = sortedBooks.slice(0,5).map(([title,count]) => ({ title, count }));
      setTopBooks(topBooksMapped);

      // Logs
  const logsFormatted = peminjaman.map(p => {
  const matchReturn = pengembalian.find(r => r.PeminjamanID == p.PeminjamanID); // pakai == supaya cocok
  const returnDate = matchReturn?.TanggalPengembalian
    ? matchReturn.TanggalPengembalian.split("T")[0]
    : "-";

  return {
    id: p.PeminjamanID,
    user: p.User?.NamaLengkap || "-",
    book: p.buku?.Judul || "-",
    borrow: p.TanggalPeminjaman ? p.TanggalPeminjaman.split("T")[0] : "-",
    return: returnDate
  };
});


      setLogs(logsFormatted);
      setOriginalLogs(logsFormatted);

    } catch (err) {
      console.error(err);
    }
  }

  function handleFilter() {
  const filtered = originalLogs.filter(l => {
    if (l.borrow === "-") return false;
    const d = new Date(l.borrow);
    
    if (startDate && endDate) {
      return d >= new Date(startDate) && d <= new Date(endDate);
    } else if (startDate) {
      return d >= new Date(startDate);
    } else if (endDate) {
      return d <= new Date(endDate);
    }
    return true;
  });

  setLogs(filtered);
  setCurrentPage(1);
}


  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentLogs = logs.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(logs.length / itemsPerPage);

  // CSV Export
  const handleExportCSV = () => {
    const header = ["No","User","Book","Borrow Date","Return Date"];
    const rows = logs.map((row, idx) => [
      idx + 1, row.user, row.book, row.borrow, row.return
    ]);

    const csvContent = [header, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "borrowing_history.csv";
    link.click();
  };

  return (
    <div className="bg-[#F5E6D3] min-h-screen flex">
      <SidebarAdmin />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-[#7B3F00] mb-6">Library Report</h1>

        {/* Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Borrowed This Month" value={stats.totalBorrow} />
          <StatCard label="Total Returned This Month" value={stats.totalReturn} />
          <StatCard label="Active Borrowers" value={stats.activeUsers} />
          <StatCard label="Popular Book" value={stats.topBook} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold mb-2">Borrowing/Return Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={borrowData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="borrow" stroke="#1f77b4" name="Borrowed" />
                <Line type="monotone" dataKey="return" stroke="#2ca02c" name="Returned" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h2 className="font-bold mb-2">Most Popular Book</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topBooks}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="title"
                  interval={0}
                  angle={0}
                  textAnchor="middle"
                  style={{ fontSize: 12, fontFamily: "Noto Sans JP, sans-serif" }}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#d89441" name="Borrowed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Table + Filter + Export */}
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="font-bold mb-3">Borrowing History</h2>

          {/* Filter + Export CSV */}
          <div className="bg-gray-100 p-3 rounded mb-4 flex gap-4 items-center">
            <div>
              <label className="block font-medium mb-1">Start Date</label>
              <input type="date" className="border rounded px-3 py-2" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div>
              <label className="block font-medium mb-1">End Date</label>
              <input type="date" className="border rounded px-3 py-2" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </div>
            <button className="bg-[#7B3F00] text-white px-4 py-2 rounded hover:bg-[#633200]" onClick={handleFilter}>
              Filter
            </button>
            <button className="bg-[#D29D6A] text-white px-4 py-2 rounded hover:bg-[#b37a56]" onClick={handleExportCSV}>
              Export CSV
            </button>
          </div>

          {/* Table */}
          <table className="min-w-full bg-white">
            <thead className="bg-[#D29D6A] text-white">
              <tr>
                <th className="p-2 text-left">No</th>
                <th className="p-2 text-left">User</th>
                <th className="p-2 text-left">Book</th>
                <th className="p-2 text-left">Borrow Date</th>
                <th className="p-2 text-left">Return Date</th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.map((row, idx) => (
                <tr key={row.id} className="border-b">
                  <td className="p-2">{indexOfFirst + idx + 1}</td>
                  <td className="p-2">{row.user}</td>
                  <td className="p-2">{row.book}</td>
                  <td className="p-2">{row.borrow}</td>
                  <td className="p-2">{row.return}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex gap-2 justify-center mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-3 py-1 bg-[#7B3F00] text-white rounded disabled:opacity-50"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-[#D29D6A] text-white" : "bg-gray-200"}`}
              >
                {i + 1}
              </button>
            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-3 py-1 bg-[#7B3F00] text-white rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow text-center">
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-2xl font-bold text-[#7B3F00]">{value}</p>
    </div>
  );
}
