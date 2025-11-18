import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Hero from "../Hero/heroCategories";

const BookCard = ({ book }) => (
  <div className=" bg-white p-4 shadow hover:shadow-lg transition flex flex-col min-w-[180px] max-w-[200px]">
    <img
      src={`http://localhost:3000/${book.Gambar || "uploads/default-book.jpg"}`}
      alt={book.Judul || "Book"}
      className="w-full h-36 object-cover rounded-lg mb-3 hover:scale-105 transition"
    />
    <h4 className="font-semibold text-[#7B3F00] text-sm sm:text-base">{book.Judul}</h4>
    <p className="text-xs sm:text-sm text-[#5A4A42] mt-1">By {book.Penulis}</p>
  </div>
);

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [kategoriRelasi, setKategoriRelasi] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch semua data kategori + buku + relasi
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

  // Filter buku berdasarkan kategori yang dipilih
  const filteredBooks = selectedCategory
    ? books.filter((b) =>
        kategoriRelasi.some((rel) => rel.BukuID === b.BukuID && rel.KategoriID === selectedCategory)
      )
    : books;

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-[500px] bg-[#F5E6D3]  text-white pt-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Hero */}
        <Hero />

        {/* Tombol All + Kategori */}
        <div className="mt-6 mb-6">
          <h3 className="text-xl font-semibold text-[#7B3F00]  bg-white mb-2 text-center">Categories</h3>
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

        {/* Grid Buku */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
            {filteredBooks.map((book) => (
              <BookCard key={book.BukuID} book={book} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400">Tidak ada buku di kategori ini</p>
        )}
      </div>
    </div>
  );
};

export default Categories;
