// DashboardFinal.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { TbBooks, TbFolder } from "react-icons/tb";
import SidebarPeminjam from "./sidebarPeminjam";
import Userdetail from "../User/UserDetail";
import Hero from "../Hero/hero";
import Footer from "../../../Components/Peminjam/Footer/footer";
import { api, authHeaders } from "../../../../src/api";

// Komponen kategori tetap sama
const CategoryDashboard = ({ categories, selectedCategory, onSelect }) => (
  <div className="mt-6">
    <h3 className="text-2xl font-semibold text-white mb-2 bg-[#B67438] px-6 py-2 rounded">Categories</h3>
    <div className="flex gap-2 overflow-x-auto">
      <button
        onClick={() => onSelect(null)}
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

// Card buku final dengan line-clamp dan tooltip
const BookCard = ({ book, navigate }) => (
  <div className="bg-[#F5E6D3] p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col min-w-[200px] max-w-[220px]">
    <img
      src={`${api.defaults.baseURL}/${book.Gambar}`}
      alt={book.Judul || "Book"}
      className="w-full h-36 object-cover rounded-lg mb-3 hover:scale-105 transition"
    />
    <h4
      className="font-semibold text-[#7B3F00] text-sm sm:text-base line-clamp-2"
      title={book.Judul}
    >
      {book.Judul}
    </h4>
    <p className="text-xs sm:text-sm text-[#5A4A42] mt-1 line-clamp-2" title={book.Penulis}>
      By : {book.Penulis}
    </p>
    <p className="text-xs sm:text-sm text-[#5A4A42] line-clamp-1" title={book.Penerbit}>
      Publisher: {book.Penerbit}
    </p>
    <p className="text-xs sm:text-yellow-600 mt-1">⭐ {book.RataRataRating ? Number(book.RataRataRating).toFixed(1) : "4.5"}</p>

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userID = localStorage.getItem("UserID");
        if (!token || !userID) return;

        const [
          userRes,
          bookRes,
          categoryRes,
          relasiRes,
          peminjamanRes,
          koleksiRes
        ] = await Promise.all([
          api.get(`/users/${userID}`, { headers: authHeaders() }),
          api.get("/buku", { headers: authHeaders() }),
          api.get("/kategori", { headers: authHeaders() }),
          api.get("/kategoriRelasi", { headers: authHeaders() }),
          api.get(`/peminjaman/user/${userID}`, { headers: authHeaders() }),
          api.get(`/koleksi/user/${userID}`, { headers: authHeaders() }),
        ]);

        setUser({
          ...userRes.data,
          ActiveBorrowCount: peminjamanRes.data.filter(b => b.StatusPeminjaman === "Dipinjam").length,
          CollectionCount: koleksiRes.data.length,
        });

        setBooks(bookRes.data);
        setFilterBook(bookRes.data);
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

  const newBooks = books.slice(-6).reverse();

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
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-[#D29D6A] rounded-lg px-4 w-100 focus:outline-none focus:ring-2 focus:ring-[#D29D6A]"
          />
          <button
            type="submit"
            className="bg-[#B67438] text-white px-4 py-2 rounded-lg hover:bg-[#D29D6A]"
          >
            Enter
          </button>
        </form>

        <div className="mt-3 flex items-center justify-between mb-6 w-full">
          <div
            className="absolute top-9 right-10 cursor-pointer"
            onClick={() => setShowProfile(!showProfile)}
          >
            <FaUserCircle className="text-4xl text-[#7B3F00]" />
          </div>
        </div>

        <Hero username={user?.Username || "Guest"} />

        {/* Count Active Borrow & Collection di bawah Hero */}
        {user && (
          <div className="flex gap-6 mt-4 mb-6 text-[#7B3F00] font-semibold">
            <div className="flex items-center gap-1 bg-[#ffecd4] rounded px-6 py-4">
              <TbBooks /> <span>{user.ActiveBorrowCount} Active Borrows</span>
            </div>
            <div className="flex items-center gap-1 bg-[#ffecd4] rounded px-7 py-4">
              <TbFolder /> <span>{user.CollectionCount} Collection</span>
            </div>
          </div>
        )}

        <section className="mb-10">
          <h3 className="text-2xl font-semibold text-white mb-2 bg-[#B67438] px-6 py-2 rounded">
            📖 New Books
          </h3>
          <div className="overflow-x-auto">
            <div className="flex gap-4 w-max flex-wrap max-h-[480px]">
              {loading
                ? Array.from({ length: 6 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="bg-[#EDE0D4] p-4 rounded-xl animate-pulse min-w-[200px] max-w-[220px] h-56"
                    ></div>
                  ))
                : newBooks.length === 0
                ? <p className="text-gray-500">No books found</p>
                : newBooks.map((book) => <BookCard key={book.BukuID} book={book} navigate={navigate} />)
              }
            </div>
          </div>
        </section>

        <CategoryDashboard
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={handleSelectCategory}
        />

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
