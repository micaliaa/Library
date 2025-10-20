import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Hero from "../Hero/heroCategories";
import { api, authHeaders } from "../../../../src/api";
import SidebarPeminjam from "../Dashboard/sidebarPeminjam";

const BookCard = ({ book, handlePinjamBuku, isBorrowing, isBorrowed }) => (
  <div
    className="flex bg-white border border-[#B67438] shadow-md hover:shadow-lg transition flex-shrink-0 mb-4"
    style={{ width: "280px", height: "160px", overflow: "hidden" }}
  >
    <img
      src={`${api.defaults.baseURL}/${book.Gambar}`}
      alt={book.Judul}
      className="w-[110px] h-full object-cover"
    />
    <div className="flex flex-col justify-between p-3 flex-1">
      <div>
        <h3 className="text-base font-bold text-gray-900 truncate">{book.Judul}</h3>
        <p className="text-xs text-gray-700 mt-1"><strong>Author:</strong> {book.Penulis}</p>
        <p className="text-xs text-gray-700"><strong>Publisher:</strong> {book.Penerbit}</p>
        <p className="text-xs text-yellow-600 mt-1">
          ⭐ {book.RataRataRating ? Number(book.RataRataRating).toFixed(1) : "4.5"}
        </p>
      </div>
      <div className="flex items-center gap-2 mt-2">
        <Link
          to={`/buku/${book.BukuID}`}
          className="px-3 py-1 text-xs bg-[#D29D6A] text-white hover:bg-[#B67438] transition"
        >
          View
        </Link>
        <button
          onClick={() => handlePinjamBuku(book.BukuID)}
          disabled={isBorrowing || isBorrowed}
          className={`px-3 py-1 text-xs transition ${
            isBorrowed
              ? "bg-green-500 text-white"
              : isBorrowing
              ? "bg-gray-300 text-gray-700 cursor-not-allowed"
              : "bg-[#7B3F00] text-white hover:bg-[#A15C2D]"
          }`}
        >
          {isBorrowed ? "✅ Borrowed" : isBorrowing ? "⏳..." : "Borrow"}
        </button>
      </div>
    </div>
  </div>
);

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [kategoriRelasi, setKategoriRelasi] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borrowingIds, setBorrowingIds] = useState([]);
  const [borrowed, setBorrowed] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User belum login");

        const [bookRes, categoryRes, relasiRes] = await Promise.all([
          axios.get("http://localhost:3000/buku", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:3000/kategori", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:3000/kategoriRelasi", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setBooks(bookRes.data);
        setCategories(categoryRes.data);
        setKategoriRelasi(relasiRes.data);
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredBooks = selectedCategory
    ? books.filter((b) =>
        kategoriRelasi.some((rel) => rel.BukuID === b.BukuID && rel.KategoriID === selectedCategory)
      )
    : books;

  const handlePinjamBuku = async (BukuID) => {
    const UserID = localStorage.getItem("UserID");
    if (!UserID) {
      alert("User belum login! Silakan login terlebih dahulu.");
      return;
    }

    setBorrowingIds((prev) => [...prev, BukuID]);
    try {
      const response = await api.post("/peminjaman", { UserID, BukuID }, { headers: authHeaders() });
      const { PeminjamanID, TanggalPengembalian } = response.data;
      if (!PeminjamanID) {
        alert("Terjadi kesalahan, data peminjaman tidak lengkap.");
        return;
      }

      alert(`Buku berhasil dipinjam!\nID Peminjaman: ${PeminjamanID}\nTanggal Pengembalian: ${TanggalPengembalian || "Belum ditentukan"}`);
      setBorrowed((prev) => [...prev, BukuID]);
    } catch (err) {
      console.error(err);
      alert("Gagal meminjam buku! Silakan coba lagi.");
    } finally {
      setBorrowingIds((prev) => prev.filter((id) => id !== BukuID));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Bisa pakai navigate(`/search/${search}`) jika ada route search
    console.log("Search:", search);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (filteredBooks.length === 0) return <p className="text-center mt-6">Tidak ada buku di kategori ini.</p>;

  return (
    <div className="min-h-screen bg-[#F5E6D3] text-white flex">
      {/* Sidebar */}
      <SidebarPeminjam />

      {/* Konten utama */}
      <div className="flex-1 mt-10 px-4">
        <Hero />

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex justify-center mb-6 gap-2">
          <input
            type="text"
            placeholder="Search for books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-[400px] px-4 py-2 border rounded-lg border-[#7B3F00] text-[#7B3F00] focus:outline-none focus:ring-1 focus:ring-[#7B3F00]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#7B3F00] text-white rounded-lg hover:bg-[#9C5A1F]"
          >
            Search
          </button>
        </form>

        {/* Tombol All + Kategori */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-[#7B3F00] bg-white mb-2 text-center">Categories</h3>
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-1 rounded-lg border ${
                selectedCategory === null
                  ? "bg-[#B67438] text-white"
                  : "bg-[#FFF9F3] text-[#7B3F00] border-[#B67438]"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.KategoriID}
                onClick={() => setSelectedCategory(cat.KategoriID)}
                className={`px-4 py-1 rounded-lg border ${
                  selectedCategory === cat.KategoriID
                    ? "bg-[#B67438] text-white"
                    : "bg-[#FFF9F3] text-[#7B3F00] border-[#B67438]"
                }`}
              >
                {cat.NamaKategori}
              </button>
            ))}
          </div>
        </div>

        {/* Display buku model horizontal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredBooks.map((book) => {
            const isBorrowing = borrowingIds.includes(book.BukuID);
            const isBorrowed = borrowed.includes(book.BukuID);
            return (
              <BookCard
                key={book.BukuID}
                book={book}
                handlePinjamBuku={handlePinjamBuku}
                isBorrowing={isBorrowing}
                isBorrowed={isBorrowed}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;
