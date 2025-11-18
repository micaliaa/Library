import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import { TbBooks, TbFolder } from "react-icons/tb";
import SidebarPeminjam from "./sidebarPeminjam";
import Hero from "../Hero/hero";
import Footer from "../../../Components/Peminjam/Footer/footer";
import { api, authHeaders } from "../../../../src/api";
import { normalizeStatuses } from "../../utils/translateStatus";



const CategoryDashboard = ({ categories, selectedCategory, onSelect }) => (
  <div className="mt-6">
    <h3 className="text-2xl font-semibold text-white mb-1 bg-[#B67438] px-6 py-1 rounded">
      Categories
    </h3>
    <div className="flex gap-2 mt-3 overflow-x-auto">
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

const BookCard = ({ book, navigate }) => (
  <div className="bg-[#d3a678] p-4 mt-7 rounded-xl shadow hover:shadow-lg transition flex flex-col min-w-[200px] max-w-[220px]">
    
    <img
      src={`${api.defaults.baseURL}/${book.Gambar}`}
      alt={book.Judul || "Book"}
      className="w-full h-36 object-cover rounded-lg mb-3 hover:scale-105 transition"
    />

    {/* *** FIXED HEIGHT WRAPPER *** */}
    <div className="flex flex-col gap-1 min-h-[120px]">
      <h4
        className="font-semibold text-[#7b3f00] text-sm sm:text-base line-clamp-2"
        title={book.Judul}
      >
        {book.Judul}
      </h4>

      <p className="text-xs sm:text-sm text-white line-clamp-2" title={book.Penulis}>
        By : {book.Penulis}
      </p>

      <p className="text-xs sm:text-sm text-white line-clamp-1" title={book.Penerbit}>
        Publisher: {book.Penerbit}
      </p>

      <p className="text-xs sm:text-white">
        ⭐{book.RataRataRating ? Number(book.RataRataRating).toFixed(1) : "4.5"}
      </p>
    </div>

    {/* Tombol di bawah, selalu rata */}
    <button
      className="mt-3 bg-white text-orange-950 px-4 py-2 rounded-lg text-xs sm:text-sm hover:bg-[#B67438] hover:text-white transition"
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
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userID = localStorage.getItem("UserID");
        if (!token || !userID) return;

        const [userRes, bookRes, categoryRes, relasiRes, peminjamanRes, koleksiRes] =
          await Promise.all([
            api.get(`/users/${userID}`, { headers: authHeaders() }),
            api.get("/buku", { headers: authHeaders() }),
            api.get("/kategori", { headers: authHeaders() }),
            api.get("/kategoriRelasi", { headers: authHeaders() }),
            api.get(`/peminjaman/user/${userID}`, { headers: authHeaders() }),
            api.get(`/koleksi/user/${userID}`, { headers: authHeaders() }),
          ]);

        const normalizedBorrowings = normalizeStatuses(peminjamanRes.data);
        const saved = JSON.parse(localStorage.getItem("borrowings") || "[]");

        const mergedBorrowings = normalizedBorrowings.map((item) => {
          const localItem = saved.find((b) => b.PeminjamanID === item.PeminjamanID);
          return localItem && localItem.StatusPeminjaman === "Finished"
            ? { ...item, ...localItem }
            : item;
        });

        const activeCount = mergedBorrowings.filter(
          (b) => b.StatusPeminjaman?.toLowerCase() === "borrowed"
        ).length;

        setUser({
          ...userRes.data,
          ActiveBorrowCount: activeCount,
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


  
  const newBooks = books.slice(-5).reverse();

  const handleSelectCategory = (kategoriID) => {
    setSelectedCategory(kategoriID);
    if (kategoriID === null) {
      setFilterBook(books);
    } else {
      setFilterBook(
        books.filter((b) =>
          kategoriRelasi.some(
            (rel) => rel.BukuID === b.BukuID && rel.KategoriID === kategoriID
          )
        )
      );
    }
  };

  return (
    <>
   
{/* Header bar mobile */}
<div className="flex items-center justify-between md:hidden px-4 py-3 bg-[#F5E6D3] sticky top-0 z-50">
  <button onClick={() => setMobileSidebarOpen(true)} className="text-[#7B3F00] text-2xl">
    <FaBars />
  </button>

  <h1 className="text-lg font-semibold  text-[#7B3F00]">M-Libry</h1>

  <FaUserCircle
    onClick={() => navigate("/profile")}
    className="text-3xl text-[#7B3F00] hover:text-[#B67438] cursor-pointer"
  />
</div>

      <div className="flex min-h-screen bg-[#F5E6D3] relative">
      
<SidebarPeminjam
  isOpen={mobileSidebarOpen}
  onClose={() => setMobileSidebarOpen(false)}
/>


{mobileSidebarOpen && (
  <div
    className="fixed inset-0 bg-black bg-opacity-40 md:hidden z-40"
    onClick={() => setMobileSidebarOpen(false)}
  />
)}


    <div className="flex-1 p-4 sm:p-8 overflow-y-auto relative md:pl-72">

         
      
<div className="hidden md:flex items-center justify-between mb-6">
  {/* Search bar */}
  <form
    onSubmit={(e) => {
      e.preventDefault();
      if (search.trim() !== "") {
        navigate(`/search?query=${encodeURIComponent(search)}`);
      }
    }}
    className="flex items-center gap-2 w-[70%]"
  >
    <input
      type="text"
      placeholder="Search..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="flex-1 border border-[#D29D6A] rounded-lg px-3 py-2"
    />
    <button
      type="submit"
      className="bg-[#B67438] text-white px-4 py-2 rounded-lg hover:bg-[#D29D6A]"
    >
      Search
    </button>
  </form>

  {/* Profile Icon */}
  <FaUserCircle
    onClick={() => navigate("/profile")}
    className="text-4xl text-[#7B3F00] hover:text-[#B67438] cursor-pointer"
  />
</div>



          <Hero username={user?.Username || "Guest"} />

          {/* Count Active Borrow & Collection */}
          {user && (
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mt-6 mb-8 text-[#7B3F00] font-semibold">
              <div className="flex items-center gap-3 bg-[#FFF2E0] rounded-2xl shadow-sm border border-[#D29D6A] px-6 py-4 hover:shadow-md transition">
                <TbBooks className="text-2xl text-[#B67438]" />
                <div>
                  <p className="text-sm text-[#5A4A42]">My Active Borrowing</p>
                  <p className="text-lg font-bold text-[#7B3F00]">{user.ActiveBorrowCount}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#FFF2E0] rounded-2xl shadow-sm border border-[#D29D6A] px-6 py-4 hover:shadow-md transition">
                <TbFolder className="text-2xl text-[#B67438]" />
                <div>
                  <p className="text-sm text-[#5A4A42]">My Collection</p>
                  <p className="text-lg font-bold text-[#7B3F00]">{user.CollectionCount}</p>
                </div>
              </div>
            </div>
          )}

          {/* New Books */}
          <section className="mb-10">
            <h3 className="text-2xl font-semibold text-white mb-1 bg-[#B67438] px-6 py-1 rounded">
              📖 New Books
            </h3>
            <div className="flex gap-6 overflow-x-auto py-2">
              {loading
                ? Array.from({ length: 5 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="bg-[#EDE0D4] p-4 rounded-xl animate-pulse min-w-[200px] max-w-[220px] h-56"
                    ></div>
                  ))
                : newBooks.length === 0
                ? <p className="text-gray-500">No books found</p>
                : newBooks.map((book) => <BookCard key={book.BukuID} book={book} navigate={navigate} />)}
            </div>
          </section>

          <CategoryDashboard
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={handleSelectCategory}
          />

          {/* Filtered Books */}
          {filterBook.length > 0 && (
            <section className="flex gap-6 overflow-x-auto py-2 mt-4">
              {filterBook.map((book) => <BookCard key={book.BukuID} book={book} navigate={navigate} />)}
            </section>
          )}

          <div className="mt-10">
            <Footer />
          </div>

          {error && <p className="text-red-600 mt-4">{error}</p>}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
