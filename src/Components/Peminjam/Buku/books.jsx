import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero2 from "../../../Components/Peminjam/Hero/heroBooks";
import { api, authHeaders } from "../../../../src/api";
import SidebarPeminjam from "../Dashboard/sidebarPeminjam";
import { TbChecklist, TbBooks, TbFolder } from "react-icons/tb";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_API_URL;

const Book = () => {
  const [booksData, setBooksData] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowingIds, setBorrowingIds] = useState([]);
  const [borrowed, setBorrowed] = useState([]);
  const [collection, setCollection] = useState([]);
  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchUserCounts = async () => {
      const UserID = localStorage.getItem("UserID");
      if (!UserID) return;
      try {
        const [userRes, peminjamanRes, koleksiRes] = await Promise.all([
          api.get(`/users/${UserID}`, { headers: authHeaders() }),
          api.get(`/peminjaman/user/${UserID}`, { headers: authHeaders() }),
          api.get(`/koleksi/user/${UserID}`, { headers: authHeaders() }),
        ]);

        setUser({
          ...userRes.data,
          ActiveBorrowCount: peminjamanRes.data.filter(
            (b) => b.StatusPeminjaman === "Dipinjam"
          ).length,
          CollectionCount: koleksiRes.data.length,
        });

        setCollection(koleksiRes.data.map((b) => b.BukuID));
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserCounts();
  }, []);

  const handleAddToCollection = async (BukuID) => {
    const UserID = localStorage.getItem("UserID");
    if (!UserID) {
      toast.warning("User belum login! Silakan login terlebih dahulu.");
      return;
    }
    if (collection.includes(BukuID)) {
      toast.info("Buku sudah ada di koleksi!");
      return;
    }
    try {
      await api.post("/koleksi", { UserID, BukuID }, { headers: authHeaders() });
      setCollection((prev) => [...prev, BukuID]);
      toast.success("📚 Buku berhasil ditambahkan ke koleksi!");
      setUser((prev) => ({
        ...prev,
        CollectionCount: (prev?.CollectionCount || 0) + 1,
      }));
    } catch (err) {
      console.error(err);
      toast.error("Gagal menambahkan buku ke koleksi!");
    }
  };

  const handlePinjamBuku = async (BukuID) => {
    const UserID = localStorage.getItem("UserID");
    if (!UserID) {
      toast.warning("User belum login! Silakan login terlebih dahulu.");
      return;
    }
    try {
      const response = await api.get(`/peminjaman/user/${UserID}`, { headers: authHeaders() });
      const activeCount = response.data.filter((item) => item.StatusPeminjaman === "Dipinjam").length;
      if (activeCount >= 3) {
        toast.error("❌ Kamu sudah mencapai batas maksimal 3 buku aktif. Kembalikan salah satu buku dulu.");
        return;
      }
      setBorrowingIds((prev) => [...prev, BukuID]);
      const res = await api.post("/peminjaman", { UserID, BukuID }, { headers: authHeaders() });
      const { PeminjamanID, TanggalPengembalian } = res.data;
      toast.success(`📚 Buku berhasil dipinjam!\nID: ${PeminjamanID}\nTanggal Pengembalian: ${TanggalPengembalian || "Belum ditentukan"}`);
      setBorrowed((prev) => [...prev, BukuID]);
      setUser((prev) => ({
        ...prev,
        ActiveBorrowCount: (prev?.ActiveBorrowCount || 0) + 1,
      }));
    } catch (err) {
      console.error(err);
      toast.error("Gagal meminjam buku! Silakan coba lagi.");
    } finally {
      setBorrowingIds((prev) => prev.filter((id) => id !== BukuID));
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get("/buku", { headers: authHeaders() });
        setBooksData(response.data);
        setFilteredBooks(response.data); // awalnya semua buku tampil
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data buku. Silakan login terlebih dahulu.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  // ===== Real-time search mirip Categories =====
  useEffect(() => {
    const keywordLower = search.trim().toLowerCase();
    if (!keywordLower) {
      setFilteredBooks(booksData); // reset semua buku
    } else {
      const filtered = booksData.filter((b) => b.Judul.toLowerCase().includes(keywordLower));
      setFilteredBooks(filtered);
    }
  }, [search, booksData]);

  if (loading) return <p className="text-center mt-6">Loading data buku...</p>;
  if (error) return <p className="text-center text-red-600 mt-6">{error}</p>;
  if (filteredBooks.length === 0) return <p className="text-center mt-6">Buku tidak ditemukan.</p>;

  const booksPerRow = 3;
  const rows = [];
  for (let i = 0; i < filteredBooks.length; i += booksPerRow) {
    rows.push(filteredBooks.slice(i, i + booksPerRow));
  }

  return (
    <div className="min-h-screen bg-[#F5E6D3] text-white flex flex-col md:flex-row">
      <SidebarPeminjam className="hidden md:flex" />
      <div className="flex-1 mt-10 px-4">
        <Hero2 />

       <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
             {user && (
           <div className="flex gap-4 text-white font-semibold">
             <div className="flex items-center gap-1 bg-[#7B3F00] rounded px-6 py-4">
               <TbBooks /> <span>{user.ActiveBorrowCount} Active Borrows</span>
             </div>
             <div className="flex items-center gap-1 bg-[#7B3F00] rounded px-7 py-4">
               <TbFolder /> <span>{user.CollectionCount} Collection</span>
             </div>
           </div>
         )}
       

        <form className="flex flex-col sm:flex-row justify-center gap-2 w-full sm:w-auto">
    <input
      type="text"
      placeholder="Search for books..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full sm:w-[300px] px-5 py-2 rounded-lg border-2 border-[#7B3F00] text-[#7B3F00] focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"
    />
        <button
      type="submit"
      className="px-4 py-2 bg-[#7B3F00] text-white rounded-lg hover:bg-[#9C5A1F] mt-2 sm:mt-0"
    >
      Search
    </button>
     </form>
  </div>

        <div className="space-y-6 border-t-10 border-[#B67438] pt-4">
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-wrap justify-center gap-6 pb-4 border-b-10 border-[#B67438]">
              {row.map((book) => {
                const isBorrowing = borrowingIds.includes(book.BukuID);
                const isBorrowed = borrowed.includes(book.BukuID);

                return (
                  <div key={book.BukuID} className="flex bg-white border border-[#B67438] shadow-md hover:shadow-lg transition flex-shrink-0 w-full sm:w-[300px] h-[160px] overflow-hidden">
                    <img src={`${API_URL}/${book.Gambar}`} alt={book.Judul} className="w-[110px] h-full object-cover"/>
                    <div className="flex flex-col justify-between p-3 flex-1">
                      <div>
                        <h3 className="text-base font-bold text-gray-900 truncate" title={book.Judul}>{book.Judul}</h3>
                        <p className="text-xs text-gray-700 mt-1"><strong>Author:</strong> {book.Penulis}</p>
                        <p className="text-xs text-gray-700"><strong>Publisher:</strong> {book.Penerbit}</p>
                        <p className="text-xs text-yellow-600 mt-1" title={`Rating: ${book.RataRataRating ? Number(book.RataRataRating).toFixed(1) : "4.5"}`}>⭐ {book.RataRataRating ? Number(book.RataRataRating).toFixed(1) : "4.5"}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Link to={`/detail/${book.BukuID}`} className="px-3 py-1 text-xs bg-[#D29D6A] text-white hover:bg-[#B67438] transition">View</Link>
                        <button onClick={() => handlePinjamBuku(book.BukuID)} disabled={isBorrowing || isBorrowed} className={`px-3 py-1 text-xs transition ${isBorrowed ? "bg-green-500 text-white" : isBorrowing ? "bg-gray-300 text-gray-700 cursor-not-allowed" : "bg-[#7B3F00] text-white hover:bg-[#A15C2D]"}`}>
                          {isBorrowed ? "✅ Borrowed" : isBorrowing ? "⏳..." : "Borrow"}
                        </button>
                        <button onClick={() => handleAddToCollection(book.BukuID)} disabled={collection.includes(book.BukuID)} className={`px-3 py-1 text-xs transition ${collection.includes(book.BukuID) ? "bg-[#ad6826] text-white text-xl" : "bg-[#D29D6A] text-white hover:bg-[#ad6826]"}`}>
                          {collection.includes(book.BukuID) ? <TbChecklist /> : "+"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <ToastContainer position="top-right" autoClose={2500} hideProgressBar />
      </div>
    </div>
  );
};

export default Book;
