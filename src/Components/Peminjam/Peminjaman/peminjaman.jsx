import React, { useEffect, useState } from "react";
import SidebarPeminjam from "../Dashboard/sidebarPeminjam";
import { api, authHeaders } from "../../../../src/api";
import Hero3 from "../../../Components/Peminjam/Hero/heroPeminjaman";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const API_URL = import.meta.env.VITE_API_URL;

const MyBorrowings = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua"); 
  const userID = localStorage.getItem("UserID");

  // 🔹 Ambil data peminjaman dari server
  const fetchBorrowings = async () => {
    try {
      const res = await api.get(`/peminjaman/user/${userID}`, {
        headers: authHeaders(),
      });

      // Ambil data lokal (hanya buku yang sudah dikembalikan)
      const saved = JSON.parse(localStorage.getItem("borrowings") || "[]");

      // Merge server + localStorage (hanya status Selesai)
      const merged = res.data.map(item => {
        const localItem = saved.find(b => b.PeminjamanID === item.PeminjamanID);
        return localItem && localItem.StatusPeminjaman === "Selesai"
          ? { ...item, ...localItem }
          : item;
      });

      setBorrowings(merged);

    } catch (err) {
      console.error("Server error:", err.response?.data || err.message);
      setError("Gagal mengambil data peminjaman.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowings();
  }, [userID]);

  // 🔹 Fungsi kembalikan buku
  const handleReturn = async (peminjamanID, bukuID) => {
    const confirmReturn = window.confirm("Apakah kamu yakin ingin mengembalikan buku ini?");
    if (!confirmReturn) return;

    try {
      await api.post(
        `/pengembalian`,
        {
          PeminjamanID: peminjamanID,
          UserID: userID,
          BukuID: bukuID,
          TanggalPengembalian: new Date().toISOString(),
        },
        { headers: authHeaders() }
      );

      toast.success("📚 Buku berhasil dikembalikan!", { position: "top-center" });

      // Update state + simpan status Selesai di localStorage
      setBorrowings(prev => {
        const updated = prev.map(item =>
          item.PeminjamanID === peminjamanID
            ? {
                ...item,
                StatusPeminjaman: "Selesai",
                pengembalian: { TanggalPengembalian: new Date().toISOString() },
              }
            : item
        );

        const completed = updated.filter(b => b.StatusPeminjaman === "Selesai");
        localStorage.setItem("borrowings", JSON.stringify(completed));

        return updated;
      });

    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("❌ Gagal mengembalikan buku!", { position: "top-right" });
    }
  };

  // 🔹 Hitung countdown pengembalian
  const getCountdown = (tanggalPengembalian, status) => {
    if (!tanggalPengembalian || status === "Selesai") return null;

    const batas = new Date(tanggalPengembalian);
    const now = new Date();
    const diff = batas - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days} hari lagi`;
    if (days === 0) return "Hari terakhir!";
    return `Terlambat ${Math.abs(days)} hari`;
  };

  const activeBorrowings = borrowings.filter(b => b.StatusPeminjaman === "Dipinjam").length;

  // 🔹 Filter dan search
  const filteredBorrowings = borrowings
    .filter(b => filterStatus === "Semua" || b.StatusPeminjaman === filterStatus)
    .filter(b => {
      const book = b.buku || {};
      const query = searchQuery.toLowerCase();
      return (book.Judul || "").toLowerCase().includes(query)
          || (book.Penulis || "").toLowerCase().includes(query)
          || (book.Penerbit || "").toLowerCase().includes(query);
    });

  useEffect(() => {
    setVisibleCount(6);
  }, [searchQuery, filterStatus]);

  const booksPerRow = 3;
  const rows = [];
  for (let i = 0; i < filteredBorrowings.length; i += booksPerRow) {
    rows.push(filteredBorrowings.slice(i, i + booksPerRow));
  }
  const visibleRows = rows.slice(0, Math.ceil(visibleCount / booksPerRow));

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (borrowings.length === 0)
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-gray-700">
        <img src="/empty-state.png" alt="No borrowings" className="w-64 mb-4" />
        <p className="text-xl font-semibold">Belum ada peminjaman</p>
        <p className="text-center text-gray-500 mt-2">
          Jelajahi katalog buku dan mulai meminjam!
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F5E6D3] flex text-gray-800">
      <SidebarPeminjam />
      <ToastContainer />
      <div className="flex-1 mt-10 px-6">
        <Hero3 />

        {/* 🔹 Search Section */}
        <div className="flex justify-center gap-2 mb-10">
          <input
            type="text"
            placeholder="Search for book..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className=" w-full max-w-[400px] px-4 py-2 rounded-lg border-2 border-[#7B3F00] text-[#7B3F00] focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"
          />
          <button
            onClick={() => setVisibleCount(6)}
            className="px-4 py-2 bg-[#7B3F00] text-white rounded hover:bg-[#9C5A1F]"
          >
            Cari
          </button>
        </div>

        {/* 🔹 Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#7B3F00]">My Borrowed Books</h2>

          <div className="flex items-center gap-4">
            <div className="bg-white border border-[#B67438] rounded-lg shadow px-4 py-2">
              <p className="text-xs text-gray-600">Active Book</p>
              <p className="text-lg font-bold text-[#7B3F00]">📚{activeBorrowings}/3</p>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-[#B67438] text-[#7B3F00] bg-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B67438]"
            >
              <option value="Semua">All Statuses</option>
              <option value="Dipinjam">Borrowed</option>
              <option value="Selesai">Selesai</option>
              <option value="Terlambat">Terlambat</option>
            </select>
          </div>
        </div>

        {/* 🔹 Daftar buku */}
        <div className="flex flex-col gap-8 border-t-8 border-[#B67438] pt-4">
          {visibleRows.map((row, rowIndex) => (
            <motion.div
              key={rowIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className={`flex justify-center gap-6 pb-4 ${
                rowIndex !== visibleRows.length - 1 ? "border-b-8 border-[#B67438]" : ""
              }`}
            >
              {row.map((item) => {
                const book = item.buku || {};
                const alreadyReturned = !!item.pengembalian;
                const returnedDate = item.pengembalian?.TanggalPengembalian;
                const status = item.StatusPeminjaman || "Dipinjam";
                const countdown = getCountdown(item.TanggalPengembalian, status);

                let statusColor = "bg-blue-100 text-blue-800";
                if (status === "Terlambat") statusColor = "bg-red-100 text-red-800";
                if (status === "Selesai") statusColor = "bg-green-100 text-green-800";

                return (
                  <div
                    key={item.PeminjamanID}
                    className="flex bg-white border border-[#B67438] shadow-md hover:shadow-lg transition flex-shrink-0 rounded-lg overflow-hidden"
                    style={{ width: "300px", height: "200px" }}
                  >
                    <img
                      src={book.Gambar ? `${API_URL}/${book.Gambar}` : "/placeholder.png"}
                      alt={book.Judul || "No Title"}
                      className="w-[110px] h-full object-cover"
                    />
                    <div className="flex flex-col justify-between p-3 flex-1">
                      <div>
                        <h3 className="text-base font-bold text-gray-900 truncate">{book.Judul || "Judul Tidak Ada"}</h3>
                        <p className="text-xs text-gray-700 mt-1"><strong>Author:</strong> {book.Penulis || "-"}</p>
                        <p className="text-xs text-gray-700"><strong>Publisher:</strong> {book.Penerbit || "-"}</p>
                        <p className={`text-xs mt-1 px-2 py-[2px] rounded-full inline-block ${statusColor}`}>{status}</p>
                      </div>
                      <div className="text-[10px] text-gray-600 mt-1">
                        <p><strong>Peminjaman:</strong> {new Date(item.TanggalPeminjaman).toLocaleDateString()}</p>
                        <p><strong>Batas Kembali:</strong> {item.TanggalPengembalian ? new Date(item.TanggalPengembalian).toLocaleDateString() : "-"}</p>
                        {countdown && <p className="text-[10px] text-yellow-700 font-semibold">⏳ {countdown}</p>}
                        {alreadyReturned && <p><strong>Dikembalikan:</strong> {new Date(returnedDate).toLocaleDateString()}</p>}
                      </div>
                      {!alreadyReturned && status === "Dipinjam" && (
                        <button
                          onClick={() => handleReturn(item.PeminjamanID, book.BukuID)}
                          className="mt-2 w-full px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          Kembalikan
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          ))}
        </div>

        {/* 🔹 Tombol tampilkan lebih */}
        <div className="flex justify-center mt-8">
          {visibleCount < filteredBorrowings.length ? (
            <button
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="px-4 py-2 bg-[#7B3F00] text-white rounded hover:bg-[#9C5A1F]"
            >
              Tampilkan Lebih Banyak
            </button>
          ) : (
            <button
              onClick={() => setVisibleCount(6)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Tampilkan Lebih Sedikit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBorrowings;
