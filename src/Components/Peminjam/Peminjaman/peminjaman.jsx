import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // 
import SidebarPeminjam from "../Dashboard/sidebarPeminjam";
import { api, authHeaders } from "../../../../src/api";
import Hero3 from "../../../Components/Peminjam/Hero/heroPeminjaman";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
import SearchBuku from "../Buku/search";
import { normalizeStatuses } from "../../../../src/Components/utils/translateStatus";
import Swal from "sweetalert2";


const API_URL = import.meta.env.VITE_API_URL;

const MyBorrowings = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [filteredBorrowings, setFilteredBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [filterStatus, setFilterStatus] = useState("All");
  const userID = localStorage.getItem("UserID");

  // Ambil data peminjaman
  const fetchBorrowings = async () => {
    try {
      const res = await api.get(`/peminjaman/user/${userID}`, {
        headers: authHeaders(),
      });

      const normalized = normalizeStatuses(res.data, "en");
      const saved = JSON.parse(localStorage.getItem("borrowings") || "[]");
      const merged = normalized.map((item) => {
        const localItem = saved.find(
          (b) => b.PeminjamanID === item.PeminjamanID
        );
        return localItem && localItem.StatusPeminjaman === "Finished"
          ? { ...item, ...localItem }
          : item;
      });

      setBorrowings(merged);
      setFilteredBorrowings(merged);
    } catch (err) {
      console.error("Server error:", err.response?.data || err.message);
      setError("Failed to fetch borrowed books.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowings();
  }, [userID]);

  // Efek untuk munculkan warning otomatis
  useEffect(() => {
    if (borrowings.length === 0) return;

    const today = new Date();

    borrowings.forEach((b) => {
      if (b.StatusPeminjaman !== "Borrowed") return;

      const batas = new Date(b.TanggalPengembalian);
      const diff = Math.ceil((batas - today) / (1000 * 60 * 60 * 24));

      if (diff === 0) {
        toast.warning(`⏰ "${b.buku?.Judul}" is due today!`, { position: "top-center" });
      } else if (diff < 0) {
        toast.error(`⚠️ "${b.buku?.Judul}" is overdue by ${Math.abs(diff)} day(s)!`, { position: "top-center" });
      } else if (diff <= 3) {
        toast.info(`📚 "${b.buku?.Judul}" is due in ${diff} day(s)!`, { position: "top-center" });
      }
    });
  }, [borrowings]);

  // Fungsi kembalikan buku
  
  const handleReturn = async (peminjamanID, bukuID) => {
    console.log("RETURN DATA:", { 
  peminjamanID, 
  bukuID, 
  userID 
});
    const Toast = Swal.mixin({
        toast: true,
        position: "top-center",
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        confirmButtonColor: "#7B3F00",
        cancelButtonColor: "#d3bfa6",
        background: "#FFF9F3",
        color: "#3B2F2F",
        width: "320px",
        customClass: {
          popup: "rounded-xl shadow-lg border border-[#d3bfa6]",
        },
      });
    
        const result = await Toast.fire({
        title: "Return this book?",
        text: "Are you sure you want to return this book now?",
        icon: "warning",
      });
    

if (!result.isConfirmed) return;
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

      toast.success("📚 The book was successfully returned!", {
        position: "top-center",
      });

      setBorrowings((prev) => {
        const updated = prev.map((item) =>
          item.PeminjamanID === peminjamanID
            ? {
                ...item,
                StatusPeminjaman: "Finished",
                pengembalian: { TanggalPengembalian: new Date().toISOString() },
              }
            : item
        );

        const completed = updated.filter(
          (b) => b.StatusPeminjaman === "Finished"
        );
        localStorage.setItem("borrowings", JSON.stringify(completed));
        setFilteredBorrowings(updated);

        return updated;
      });
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("❌ Failed to return the book!", { position: "top-right" });
    }
  };

  // Hitung countdown pengembalian
  const getCountdown = (tanggalPengembalian, status) => {
    if (!tanggalPengembalian || status === "Finished") return null;
    const batas = new Date(tanggalPengembalian);
    const now = new Date();
    const diff = batas - now;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days > 0) return `${days} Days left`;
    if (days === 0) return "Last day!";
    return `${Math.abs(days)} Days late!`;
  };

  const activeBorrowings = borrowings.filter(
    (b) => b.StatusPeminjaman === "Borrowed"
  ).length;

  const statusFiltered = filteredBorrowings.filter(
    (b) => filterStatus === "All" || b.StatusPeminjaman === filterStatus
  );

  const booksPerRow = 3;
  const rows = [];
  for (let i = 0; i < statusFiltered.length; i += booksPerRow) {
    rows.push(statusFiltered.slice(i, i + booksPerRow));
  }
  const visibleRows = rows.slice(0, Math.ceil(visibleCount / booksPerRow));

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;
  if (borrowings.length === 0)
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-gray-700">
        <img src="/empty-state.png" alt="No borrowings" className="w-64 mb-4" />
        <p className="text-xl font-semibold">No borrowed books yet</p>
        <p className="text-center text-gray-500 mt-2">
          Browse the book catalog and start borrowing!
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F5E6D3] flex text-gray-800">
      <SidebarPeminjam />
      <ToastContainer />
      <div className="flex-1 mt-10 px-6">
        <Hero3 />

        {/* Search */}
        <div className="flex justify-end mb-6">
          <SearchBuku
            booksData={borrowings}
            setFilteredBooks={setFilteredBorrowings}
          />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-[#7B3F00]">
            My Borrowed Books
          </h2>

          <div className="flex items-center gap-4">
            <div className="bg-white border border-[#B67438] rounded-lg shadow px-4 py-2">
              <p className="text-xs text-gray-600">Active Books</p>
              <p className="text-lg font-bold text-[#7B3F00]">
                📚 {activeBorrowings}/3
              </p>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-[#B67438] text-[#7B3F00] bg-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#B67438]"
            >
              <option value="All">All Statuses</option>
              <option value="Borrowed">Borrowed</option>
              <option value="Finished">Finished</option>
              <option value="Late">Late</option>
            </select>
          </div>
        </div>

        {/* List buku */}
        <div className="flex flex-col gap-8 border-t-8 border-[#B67438]  pt-4">
          {visibleRows.map((row, rowIndex) => (
            <motion.div
              key={rowIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`flex justify-center gap-6 pb-4 ${
                rowIndex !== visibleRows.length - 1
                  ? "border-b-8 border-[#B67438]"
                  : ""
              }`}
            >
              {row.map((item) => {
                const book = item.buku || {};
                const alreadyReturned = !!item.pengembalian;
                const returnedDate = item.pengembalian?.TanggalPengembalian;

                // Set status otomatis
                const status =
                  item.StatusPeminjaman === "Borrowed" &&
                  new Date(item.TanggalPengembalian) < new Date()
                    ? "Late"
                    : item.StatusPeminjaman || "Borrowed";

                const countdown = getCountdown(item.TanggalPengembalian, status);

                let statusColor = "bg-blue-100 text-blue-800";
                if (status === "Late") statusColor = "bg-red-100 text-red-800";
                if (status === "Finished") statusColor = "bg-green-100 text-green-800";

                return (
                  <div
                    key={item.PeminjamanID}
                    className="flex flex-col w-[300px] h-[200px] border border-[#B67438] shadow-md hover:shadow-lg"
                  >
                    {/* Konten buku */}
                    <Link to={`/detail/${book.BukuID}`} className="flex flex-1 overflow-hidden bg-white">
                      <img
                        src={book.Gambar ? `${API_URL}/${book.Gambar}` : "/placeholder.png"}
                        alt={book.Judul || "No Title"}
                        className="w-[110px] h-full object-cover"
                      />
                      <div className="flex flex-col justify-between p-3 flex-1">
                        <div>
                          <h3 className="text-base font-bold text-gray-900 truncate">
                            {book.Judul || "Untitled"}
                          </h3>
                          <p className="text-xs text-gray-700 mt-1">
                            <strong>Author:</strong> {book.Penulis || "-"}
                          </p>
                          <p className="text-xs text-gray-700">
                            <strong>Publisher:</strong> {book.Penerbit || "-"}
                          </p>
                          <p
                            className={`text-xs mt-1 px-2 py-[2px] rounded-full inline-block ${statusColor}`}
                          >
                            {status}
                          </p>
                        </div>
                        <div className="text-[10px] text-gray-600 mt-1">
                          <p>
                            <strong>Borrowing:</strong>{" "}
                            {new Date(item.TanggalPeminjaman).toLocaleDateString()}
                          </p>
                          <p>
                            <strong>Return Limit:</strong>{" "}
                            {item.TanggalPengembalian
                              ? new Date(item.TanggalPengembalian).toLocaleDateString()
                              : "-"}
                          </p>
                          {countdown && (
                            <p className="text-[10px] text-yellow-700 font-semibold">
                              ⏳ {countdown}
                            </p>
                          )}
                          {alreadyReturned && (
                            <p>
                              <strong>Returned:</strong>{" "}
                              {new Date(returnedDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        </div>
                      </Link>

                      {!alreadyReturned && status === "Borrowed" && (
                        <button
                          onClick={() =>
                            handleReturn(item.PeminjamanID, book.BukuID)
                          }
                          className="mt-2 w-full px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          Return
                        </button>
                      )}
                      </div>
                );
              })}
            </motion.div>
          ))}
        </div>

        {/* Tombol tampilkan lebih */}
        <div className="flex justify-center mt-8">
          {visibleCount < statusFiltered.length ? (
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-4 py-2 bg-[#7B3F00] text-white rounded hover:bg-[#9C5A1F]"
            >
              Show more
            </button>
          ) : (
            <button
              onClick={() => setVisibleCount(6)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Show less
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyBorrowings;
