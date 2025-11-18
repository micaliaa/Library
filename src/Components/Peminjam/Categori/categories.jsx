import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../Hero/heroCategories";
import { api, authHeaders } from "../../../../src/api";
import SidebarPeminjam from "../Dashboard/sidebarPeminjam";
import { ToastContainer, toast } from "react-toastify";
import { CiBookmarkCheck } from "react-icons/ci";
import SearchBuku from "../Buku/search";
import { normalizeStatuses } from "../../utils/translateStatus";
import "react-toastify/dist/ReactToastify.css";

const API_URL = import.meta.env.VITE_API_URL;

const BookCard = ({ book, handleBorrowBook, handleAddToCollection, collection, isBorrowing, isBorrowed, user }) => (
  <div className="flex bg-white border border-[#B67438] shadow-md hover:shadow-lg transition flex-shrink-0 mb-4 w-full sm:w-[300px] h-[160px] overflow-hidden">
    <img src={`${API_URL}/${book.Gambar}`} alt={book.Judul} className="w-[110px] h-full object-cover" />
    <div className="flex flex-col justify-between p-3 flex-1">
      <div>
        <h3 className="text-base font-bold text-gray-900 truncate">{book.Judul}</h3>
        <p className="text-xs text-gray-700 mt-1"><strong>Author:</strong> {book.Penulis}</p>
        <p className="text-xs text-gray-700"><strong>Publisher:</strong> {book.Penerbit}</p>
        <p className="text-xs text-yellow-600 mt-1">⭐ {book.RataRataRating ? Number(book.RataRataRating).toFixed(1) : "4.5"}</p>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <Link to={`/detail/${book.BukuID}`} className="flex-1 text-center px-3 py-1 text-xs bg-[#D29D6A] text-white hover:bg-[#B67438] transition rounded">View</Link>

        <button
          onClick={() => handleBorrowBook(book.BukuID)}
          className={`flex-1 text-center px-3 py-1 text-xs transition rounded ${
            isBorrowed
              ? "bg-green-400 text-white"
              : isBorrowing
              ? "bg-gray-300 text-gray-700 cursor-not-allowed"
              : "bg-[#7B3F00] text-white hover:bg-[#A15C2D]"
          }`}
          disabled={isBorrowing || isBorrowed || !user}
        >
          {isBorrowed ? "Borrowed" : isBorrowing ? "⏳..." : "Borrow"}
        </button>

        <button
          onClick={() => handleAddToCollection(book.BukuID)}
          disabled={collection.includes(book.BukuID)}
          className={`flex-1 text-center px-1 py-1 text-xs transition rounded ${
            collection.includes(book.BukuID)
              ? "bg-[#ad6826] text-white"
              : "bg-[#D29D6A] text-white hover:bg-[#ad6826]"
          }`}
        >
          {collection.includes(book.BukuID) ? <CiBookmarkCheck className="mx-auto" /> : "+"}
        </button>
      </div>
    </div>
  </div>
);

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [categoryRelations, setCategoryRelations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borrowingIds, setBorrowingIds] = useState([]);
  const [borrowed, setBorrowed] = useState([]);
  const [collection, setCollection] = useState([]);
  const [user, setUser] = useState(null);
  const [filteredBooks, setFilteredBooks] = useState([]);

  // Merge borrowings dari localStorage jika Status = Finished
  const mergeLocalBorrowings = (serverBorrowings) => {
    const saved = JSON.parse(localStorage.getItem("borrowings") || "[]");
    return serverBorrowings.map((item) => {
      const localItem = saved.find(b => b.PeminjamanID === item.PeminjamanID);
      return localItem && localItem.StatusPeminjaman === "Finished" ? { ...item, ...localItem } : item;
    });
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const month = "" + (d.getMonth() + 1);
    const day = "" + d.getDate();
    const year = d.getFullYear();
    return [year, month.padStart(2, "0"), day.padStart(2, "0")].join("-");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const UserID = localStorage.getItem("UserID");
        if (!UserID) throw new Error("User not logged in");

        const [booksRes, categoriesRes, relationsRes, userRes, collectionRes, borrowRes] = await Promise.all([
          api.get("/buku", { headers: authHeaders() }),
          api.get("/kategori", { headers: authHeaders() }),
          api.get("/kategoriRelasi", { headers: authHeaders() }),
          api.get(`/users/${UserID}`, { headers: authHeaders() }),
          api.get(`/koleksi/user/${UserID}`, { headers: authHeaders() }),
          api.get(`/peminjaman/user/${UserID}`, { headers: authHeaders() }),
        ]);

        const normalizedBorrowings = mergeLocalBorrowings(normalizeStatuses(borrowRes.data));

        const activeBorrowedBooks = normalizedBorrowings.filter(b => {
          const status = b.StatusPeminjaman?.toLowerCase();
          const notReturned = !b.TanggalDikembalikan || b.TanggalDikembalikan === "0000-00-00";
          return ["borrowed", "late"].includes(status) && notReturned;
        }).map(b => b.BukuID);

        setBorrowed(activeBorrowedBooks);
        setUser({
          ...userRes.data,
          Borrowings: normalizedBorrowings,
          ActiveBorrowCount: activeBorrowedBooks.length,
          CollectionCount: collectionRes.data.length,
        });

        setBooks(booksRes.data);
        setCategories(categoriesRes.data);
        setCategoryRelations(relationsRes.data);
        setCollection(collectionRes.data.map(item => item.BukuID));
        setFilteredBooks(booksRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter books by category
  useEffect(() => {
    if (selectedCategory === null) setFilteredBooks(books);
    else {
      const relatedBookIds = categoryRelations.filter(rel => rel.KategoriID === selectedCategory).map(rel => rel.BukuID);
      setFilteredBooks(books.filter(book => relatedBookIds.includes(book.BukuID)));
    }
  }, [selectedCategory, books, categoryRelations]);

  // Polling update borrowings setiap 5 detik
  useEffect(() => {
    const UserID = localStorage.getItem("UserID");
    if (!UserID) return;

    const updateBorrowings = async () => {
      try {
        const res = await api.get(`/peminjaman/user/${UserID}`, { headers: authHeaders() });
        const normalized = mergeLocalBorrowings(normalizeStatuses(res.data));
        const activeBorrowedBooks = normalized.filter(b => {
          const status = b.StatusPeminjaman?.toLowerCase();
          const notReturned = !b.TanggalDikembalikan || b.TanggalDikembalikan === "0000-00-00";
          return ["borrowed", "late"].includes(status) && notReturned;
        });
        setBorrowed(activeBorrowedBooks.map(b => b.BukuID));
        setUser(prev => prev ? ({ ...prev, Borrowings: normalized, ActiveBorrowCount: activeBorrowedBooks.length }) : null);
      } catch (err) {
        console.error("Failed to update borrowings:", err);
      }
    };

    updateBorrowings();
    const interval = setInterval(updateBorrowings, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleBorrowBook = async (BukuID) => {
    const UserID = localStorage.getItem("UserID");
    if (!UserID) return toast.warning("⚠️ Please log in first");

    // Cek Late & Limit
    const hasLateBook = user?.Borrowings?.some(b => (b.StatusPeminjaman || "").toLowerCase() === "late");
    if (hasLateBook) return toast.error("❌ You cannot borrow a new book because you have a Late book.");

    if ((user?.ActiveBorrowCount || 0) >= 3) return toast.error("You have reached the maximum limit of 3 active books.");

    setBorrowingIds(prev => [...prev, BukuID]);
    try {
      const today = new Date();
      const sevenDaysLater = new Date();
      sevenDaysLater.setDate(today.getDate() + 7);

      await api.post("/peminjaman", {
        UserID,
        BukuID,
        TanggalPeminjaman: formatDate(today),
        TanggalPengembalian: formatDate(sevenDaysLater),
        StatusPeminjaman: "Dipinjam",
      }, { headers: authHeaders() });

      toast.success("✅ Book borrowed successfully!");
      setBorrowed(prev => [...prev, BukuID]);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to borrow the book.");
    } finally {
      setBorrowingIds(prev => prev.filter(id => id !== BukuID));
    }
  };

  const handleAddToCollection = async (BukuID) => {
    const UserID = localStorage.getItem("UserID");
    if (!UserID) return toast.warning("⚠️ Please log in first");

    if (collection.includes(BukuID)) return toast.info("ℹ️ This book is already in your collection.");

    try {
      await api.post("/koleksi", { UserID, BukuID }, { headers: authHeaders() });
      setCollection(prev => [...prev, BukuID]);
      toast.success("✅ Book added to your collection!");
      setUser(prev => ({ ...prev, CollectionCount: (prev?.CollectionCount || 0) + 1 }));
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to add book to collection.");
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#F5E6D3] text-white flex flex-col md:flex-row">
      <SidebarPeminjam className="hidden md:flex" />
      <div className="flex-1 p-4 sm:p-8 overflow-y-auto md:pl-72 relative">
        <Hero />
        <SearchBuku booksData={books} setFilteredBooks={setFilteredBooks} />

        {/* Categories */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-[#7B3F00] bg-white mb-2 text-center">Categories</h3>
          <div className="flex gap-2 overflow-x-auto">
            <button onClick={() => setSelectedCategory(null)} className={`px-4 py-1 rounded-lg border ${selectedCategory === null ? "bg-[#B67438] text-white" : "bg-[#FFF9F3] text-[#7B3F00] border-[#B67438]"}`}>All</button>
            {categories.map(cat => (
              <button key={cat.KategoriID} onClick={() => setSelectedCategory(cat.KategoriID)} className={`px-4 py-1 rounded-lg border ${selectedCategory === cat.KategoriID ? "bg-[#B67438] text-white" : "bg-[#FFF9F3] text-[#7B3F00] border-[#B67438]"}`}>{cat.NamaKategori}</button>
            ))}
          </div>
        </div>

        {/* Books */}
        {filteredBooks.length === 0 ? (
          <p className="text-center py-6 text-[#7B3F00] font-semibold">No books found.</p>
        ) : (
          <div className="space-y-6">
            {Array.from({ length: Math.ceil(filteredBooks.length / 3) }, (_, i) => filteredBooks.slice(i * 3, i * 3 + 3)).map((row, rowIndex) => (
              <div key={rowIndex} className={`flex justify-center gap-6 pt-4 ${rowIndex > 0 ? "border-t-10 border-[#B67438]" : ""}`}>
                {row.map(book => {
                  const isBorrowing = borrowingIds.includes(book.BukuID);
                  const isBorrowed = borrowed.includes(book.BukuID);
                  return <BookCard key={book.BukuID} book={book} handleBorrowBook={handleBorrowBook} handleAddToCollection={handleAddToCollection} collection={collection} isBorrowing={isBorrowing} isBorrowed={isBorrowed} user={user} />;
                })}
              </div>
            ))}
          </div>
        )}

        <ToastContainer position="top-center" autoClose={2500} hideProgressBar />
      </div>
    </div>
  );
};

export default Categories;
