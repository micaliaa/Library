import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Hero2 from "../../../Components/Peminjam/Hero/heroBooks";
import {api,authHeaders} from "../../../../src/api"
import SidebarPeminjam from "../Dashboard/sidebarPeminjam";

const API_URL = import.meta.env.VITE_API_URL;


const Book = () => {
  const [booksData, setBooksData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [borrowingIds, setBorrowingIds] = useState([]);
  const [borrowed, setBorrowed] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== "") navigate(`/search/${search}`);
  };


  useEffect(() => {
    const fetchBooks = async () => {
      try {  const response = await api.get("/buku", { headers: authHeaders() });
     
        setBooksData(response.data);
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data buku. Silakan login terlebih dahulu.");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

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

      alert(
        `Buku berhasil dipinjam!\nID Peminjaman: ${PeminjamanID}\nTanggal Pengembalian: ${
          TanggalPengembalian || "Belum ditentukan"
        }`
      );
      setBorrowed((prev) => [...prev, BukuID]);
    } catch (err) {
      console.error(err);
      alert("Gagal meminjam buku! Silakan coba lagi.");
    } finally {
      setBorrowingIds((prev) => prev.filter((id) => id !== BukuID));
    }
  };

  if (loading) return <p className="text-center mt-6">Loading data buku...</p>;
  if (error) return <p className="text-center text-red-600 mt-6">{error}</p>;
  if (booksData.length === 0)
    return <p className="text-center mt-6">Buku tidak ditemukan.</p>;

  // 🔹 Pisahkan buku per baris (misal 3 buku per baris)
  const booksPerRow = 3;
  const rows = [];
  for (let i = 0; i < booksData.length; i += booksPerRow) {
    rows.push(booksData.slice(i, i + booksPerRow));
  }

  return (
      <div className="min-h-screen bg-[#F5E6D3] text-white flex">
      {/* Sidebar */}
      <SidebarPeminjam />


      <div className="flex-1 mt-10 px-4">
        <Hero2 />


        {/*  Search Bar */}
        <form onSubmit={handleSearch} className="flex justify-center mb-10 gap-2">
          <input
            type="text"
            placeholder="Search for books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-[400px] px-4 py-2 rounded-lg  border-2 border-[#7B3F00] text-[#7B3F00] focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#7B3F00] text-white rounded-md hover:bg-[#9C5A1F]"
          >
            Search
          </button>
        </form>

        {/*  Book Display (Grouped by rows) */}
        <div className="space-y-6 border-t-10 border-[#B67438] pt-4">
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex justify-center gap-6 pb-4 border-b-10 border-[#B67438]"
            >
              {row.map((book) => {
                const isBorrowing = borrowingIds.includes(book.BukuID);
                const isBorrowed = borrowed.includes(book.BukuID);

                return (
                  <div
                    key={book.BukuID}
                    className="flex bg-white border border-[#B67438] shadow-md hover:shadow-lg transition flex-shrink-0"
                    style={{
                      width: "280px",
                      height: "160px",
                      overflow: "hidden",
                    }}
                  >
                    {/* Gambar Buku */}
                    
                    <img
                      
                          
                      src={`${API_URL}/${book.Gambar}`}
                      alt={book.Judul}
                      className="w-[110px] h-full object-cover"
                    />

                    {/* Detail Buku */}
                    <div className="flex flex-col justify-between p-3 flex-1">
                      <div>
                        <h3 className="text-base font-bold text-gray-900 truncate">
                          {book.Judul}
                        </h3>
                        <p className="text-xs text-gray-700 mt-1">
                          <strong>Author:</strong> {book.Penulis}
                        </p>
                        <p className="text-xs text-gray-700">
                          <strong>Publisher:</strong> {book.Penerbit}
                        </p>
                        <p className="text-xs text-yellow-600 mt-1">
                          ⭐{" "}
                          {book.RataRataRating
                            ? Number(book.RataRataRating).toFixed(1)
                            : "4.5"}
                        </p>
                      </div>

                      {/* Tombol */}
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
                          {isBorrowed
                            ? "✅ Borrowed"
                            : isBorrowing
                            ? "⏳..."
                            : "Borrow"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Book;
