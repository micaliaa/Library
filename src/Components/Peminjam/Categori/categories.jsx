
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../Hero/heroCategories";
import { api, authHeaders } from "../../../../src/api";
import SidebarPeminjam from "../Dashboard/sidebarPeminjam";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CiBookmarkCheck } from "react-icons/ci";
import SearchBuku from "../Buku/search";

const BookCard = ({
  book,
  handleBorrowBook,
  handleAddToCollection,
  collection,
  isBorrowing,
  isBorrowed,
}) => (
  <div className="flex bg-white border border-[#B67438] shadow-md hover:shadow-lg transition flex-shrink-0 mb-4 w-full sm:w-[300px] h-[160px] overflow-hidden">
    <img
      src={`${api.defaults.baseURL}/${book.Gambar}`}
      alt={book.Judul}
      className="w-[110px] h-full object-cover"
    />
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
          ⭐ {book.RataRataRating ? Number(book.RataRataRating).toFixed(1) : "4.5"}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-2">
        <Link
          to={`/buku/${book.BukuID}`}
          className="px-3 py-1 text-xs bg-[#D29D6A] text-white hover:bg-[#B67438] transition"
        >
          View
        </Link>
        <button
          onClick={() => handleBorrowBook(book.BukuID)}
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
        <button
          onClick={() => handleAddToCollection(book.BukuID)}
          disabled={collection.includes(book.BukuID)}
          className={`px-3 py-1 text-xs transition ${
            collection.includes(book.BukuID)
              ? "bg-[#ad6826] text-white text-xl"
              : "bg-[#D29D6A] text-white hover:bg-[#ad6826]"
          }`}
        >
          {collection.includes(book.BukuID) ? <CiBookmarkCheck /> : "+"}
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


  useEffect(() => {
    const fetchData = async () => {
      try {
        const UserID = localStorage.getItem("UserID");
        if (!UserID) throw new Error("User not logged in");

        const [
          booksRes,
          categoriesRes,
          relationsRes,
          userRes,
          collectionRes,
          borrowRes,
        ] = await Promise.all([
          api.get("/buku", { headers: authHeaders() }),
          api.get("/kategori", { headers: authHeaders() }),
          api.get("/kategoriRelasi", { headers: authHeaders() }),
          api.get(`/users/${UserID}`, { headers: authHeaders() }),
          api.get(`/koleksi/user/${UserID}`, { headers: authHeaders() }),
          api.get(`/peminjaman/user/${UserID}`, { headers: authHeaders() }),
        ]);

        
        const borrowData = borrowRes.data.map((item) => ({
          ...item,
          StatusPeminjaman: item.StatusPeminjaman?.toLowerCase(),
        }));

        const activeCount = borrowData.filter(
          (b) =>
            b.StatusPeminjaman === "borrowed" ||
            b.StatusPeminjaman === "dipinjam"
        ).length;

        setBooks(booksRes.data);
        setCategories(categoriesRes.data);
        setCategoryRelations(relationsRes.data);
        setCollection(collectionRes.data.map((b) => b.BukuID));
        setUser({
          ...userRes.data,
          ActiveBorrowCount: activeCount,
          CollectionCount: collectionRes.data.length,
        });
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


  useEffect(() => {
    if (selectedCategory === null) {
      setFilteredBooks(books);
    } else {
      const relatedBookIds = categoryRelations
        .filter((rel) => rel.KategoriID === selectedCategory)
        .map((rel) => rel.BukuID);

      const filtered = books.filter((book) =>
        relatedBookIds.includes(book.BukuID)
      );

      setFilteredBooks(filtered);
    }
  }, [selectedCategory, books, categoryRelations]);


  const handleBorrowBook = async (BukuID) => {
    const UserID = localStorage.getItem("UserID");
    if (!UserID) {
      toast.warning("⚠️ Please log in first!");
      return;
    }

    const activeCount = user?.ActiveBorrowCount || 0;
    if (activeCount >= 3) {
      toast.error(
        "❌ You have reached the maximum limit of 3 active books. Please return one before borrowing again."
      );
      return;
    }

    setBorrowingIds((prev) => [...prev, BukuID]);
    try {
      await api.post("/peminjaman", { UserID, BukuID }, { headers: authHeaders() });
      toast.success("📚 Book borrowed successfully!");
      setBorrowed((prev) => [...prev, BukuID]);
      setUser((prev) => ({
        ...prev,
        ActiveBorrowCount: (prev?.ActiveBorrowCount || 0) + 1,
      }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to borrow book!");
    } finally {
      setBorrowingIds((prev) => prev.filter((id) => id !== BukuID));
    }
  };


  const handleAddToCollection = async (BukuID) => {
    const UserID = localStorage.getItem("UserID");
    if (!UserID) {
      toast.warning("⚠️ Please log in first!");
      return;
    }

    if (collection.includes(BukuID)) {
      toast.info("This book is already in your collection!");
      return;
    }

    try {
      await api.post("/koleksi", { UserID, BukuID }, { headers: authHeaders() });
      setCollection((prev) => [...prev, BukuID]);
      toast.success("📚 Book added to collection!");
      setUser((prev) => ({
        ...prev,
        CollectionCount: (prev?.CollectionCount || 0) + 1,
      }));
    } catch (err) {
      console.error(err);
      toast.error("Failed to add book to collection!");
    }
  };

  

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;


  
  return (
    <div className="min-h-screen bg-[#F5E6D3] text-white flex flex-col md:flex-row">
      <SidebarPeminjam className="hidden md:flex" />
      <div className="flex-1 mt-10 px-4">
        <Hero />

        {/* SearchBuku */}
        <SearchBuku booksData={books} setFilteredBooks={setFilteredBooks} />

        {/* Categories */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-[#7B3F00] bg-white mb-2 text-center">
            Categories
          </h3>
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

        {/* Books */}
        {filteredBooks.length === 0 ? (
          <p className="text-center py-6 text-[#7B3F00] font-semibold">
            No books found.
          </p>
        ) : (
          <div className="space-y-6">
            {Array.from(
              { length: Math.ceil(filteredBooks.length / 3) },
              (_, i) => filteredBooks.slice(i * 3, i * 3 + 3)
            ).map((row, rowIndex) => (
              <div
                key={rowIndex}
                className={`flex justify-center gap-6 pt-4 ${
                  rowIndex > 0 ? "border-t-10 border-[#B67438]" : ""
                }`}
              >
                {row.map((book) => {
                  const isBorrowing = borrowingIds.includes(book.BukuID);
                  const isBorrowed = borrowed.includes(book.BukuID);
                  return (
                    <BookCard
                      key={book.BukuID}
                      book={book}
                      handleBorrowBook={handleBorrowBook}
                      handleAddToCollection={handleAddToCollection}
                      collection={collection}
                      isBorrowing={isBorrowing}
                      isBorrowed={isBorrowed}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        )}

        <ToastContainer position="top-right" autoClose={2500} hideProgressBar />
      </div>
    </div>
  );
};

export default Categories;
