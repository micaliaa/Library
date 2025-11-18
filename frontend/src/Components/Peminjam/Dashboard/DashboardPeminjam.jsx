import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarPeminjam from "./sidebarPeminjam";
import Userdetail from "../User/UserDetail";
import { FaUserCircle } from "react-icons/fa";
import Hero from "../Hero/hero";
import { useNavigate } from "react-router-dom";
import Footer from "../../../Components/Peminjam/Footer/footer";

const CategoryDashboard = ({ categories, selectedCategory, onSelect }) => (
  <div className="mt-6 ">
  <h3 className="text-xl font-semibold text-[#7B3F00] mb-2">Categories</h3>
    {/* Tombol All di paling kiri */}
    <div className="flex gap-2 overflow-x-auto">
    <button
      onClick={() => onSelect(null)} // <<< tombol All
      className={`px-4 py-1 rounded-lg border ${
        selectedCategory === null
          ? "bg-[#B67438] text-white"
          : "bg-[#FFF9F3] text-[#7B3F00] border-[#B67438]"
      }`}
    >
      All
    </button>

    {/* Tombol kategori lain */}
    {categories.map((cat) => (
      <button
        key={cat.KategoriID} // <<< tombol kategori
        onClick={() => onSelect(cat.KategoriID)}
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
);


// Component kartu buku
const BookCard = ({ book, navigate }) => (
  <div className="bg-[#F5E6D3] p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col min-w-[200px] max-w-[220px]">
    <img
      src={`http://localhost:3000/${book.Gambar || "uploads/default-book.jpg"}`}
      alt={book.Judul || "Book"}
      className="w-full h-36 object-cover rounded-lg mb-3 hover:scale-105 transition"
    />
    <h4 className="font-semibold text-[#7B3F00] text-sm sm:text-base">{book.Judul}</h4>
    <p className="text-xs sm:text-sm text-[#5A4A42] mt-1">By {book.Penulis}</p>
    <button
      className="mt-2 bg-[#D29D6A] text-white px-2 py-1 rounded-lg text-xs sm:text-sm hover:bg-[#B67438]"
      onClick={() => navigate(`/buku/${book.BukuID || ""}`)}
    >
      View Details
    </button>
  </div>
);

const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [filterBook, setFilterBook] = useState([]);
  const [categories, setCategories] = useState([]);
  const [kategoriRelasi, setKategoriRelasi] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch semua data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userID = localStorage.getItem("UserID");
        if (!token || !userID) return;

        const [userRes, bookRes, categoryRes, relasiRes] = await Promise.all([
          axios.get(`http://localhost:3000/users/${userID}`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:3000/buku", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:3000/kategori", { headers: { Authorization: `Bearer ${token}` } }),
          axios.get("http://localhost:3000/kategoriRelasi", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setUser(userRes.data);
        setBooks(bookRes.data);
        setFilterBook(bookRes.data);
        setCategories(categoryRes.data);
        setKategoriRelasi(relasiRes.data);
      } catch (err) {
        console.error(err);
        setError("Gagal mengambil data");
      }
    };
    fetchData();
  }, []);

  const newBooks = books.slice(-6).reverse();

  // Handle filter kategori
  const handleSelectCategory = (kategoriID) => {
    setSelectedCategory(kategoriID);
    if (kategoriID === null) {
      setFilterBook(books);
    } else {
      setFilterBook(
        books.filter((b) =>
          kategoriRelasi.some((rel) => rel.BukuID === b.BukuID && rel.KategoriID === kategoriID)
        )
      );
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim() !== "") {
      navigate(`/search/${search}`);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FFF9F3] relative">
      <SidebarPeminjam />

      {showProfile && (
        <div className="absolute right-4 top-16 w-80 rounded-md z-50">
          <Userdetail />
        </div>
      )}

      <div className="flex-1 p-8 overflow-y-auto">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-[#D29D6A] rounded-lg px-4 w-100 focus:outline-none focus:ring-2 focus:ring-[#D29D6A]"
          />
          <button type="submit" className="bg-[#B67438] text-white px-4 py-2 rounded-lg hover:bg-[#D29D6A]">
            Enter
          </button>
        </form>

        {/* Profile Icon */}
        <div className="mt-3 flex items-center justify-between mb-6 w-full">
          <div className="absolute top-9 right-10 cursor-pointer" onClick={() => setShowProfile(!showProfile)}>
            <FaUserCircle className="text-4xl text-[#7B3F00]" />
          </div>
        </div>

        <Hero username={user?.Username || "Guest"} />

        {/* New Books */}
        <section className="mb-10">
          <h3 className="text-2xl font-semibold text-[#FFF9F3] mb-4 bg-[#B67438] p-2 rounded">
            📖 New Books
          </h3>
          <div className="overflow-x-auto">
            <div className="flex gap-4 w-max flex-wrap max-h-[480px]">
              {newBooks.length === 0 ? (
                <p className="text-gray-500">Loading books...</p>
              ) : (
                newBooks.map((book) => <BookCard key={book.BukuID} book={book} navigate={navigate} />)
              )}
            </div>
          </div>
        </section>

        {/* Categories */}
        <CategoryDashboard
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={handleSelectCategory}
        />

        {/* Filtered Books */}
        {filterBook.length > 0 && (
          <section className="overflow-x-auto mt-4">
            <div className="flex gap-4 w-max flex-wrap max-h-[480px]">
              {filterBook.map((book) => (
                <BookCard key={book.BukuID} book={book} navigate={navigate} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-10">
          <Footer />
        </div>

        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    </div>
  );
};

export default Dashboard;
