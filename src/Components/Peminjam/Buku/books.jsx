
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Hero2 from "../../../Components/Peminjam/Hero/heroBooks";
import { api, authHeaders } from "../../../../src/api";
import SidebarPeminjam from "../Dashboard/sidebarPeminjam";
import {  TbBooks, TbFolder } from "react-icons/tb";
import { CiBookmarkCheck } from "react-icons/ci";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchBuku from "../Buku/search";
import { normalizeStatuses } from "../../utils/translateStatus";

const API_URL = import.meta.env.VITE_API_URL;

const Book = () => {
  const [booksData, setBooksData] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borrowingIds, setBorrowingIds] = useState([]);
  const [borrowed, setBorrowed] = useState([]);
  const [collection, setCollection] = useState([]);
  const [user, setUser] = useState(null);
 
const mergeLocalBorrowings = (serverBorrowings) => {
  const saved = JSON.parse(localStorage.getItem("borrowings") || "[]");

  return serverBorrowings.map((item) => {
    const localItem = saved.find(b => b.PeminjamanID === item.PeminjamanID);

    return localItem && localItem.StatusPeminjaman === "Finished"
      ? { ...item, ...localItem } // pakai data local (Status + pengembalian)
      : item;
  });
};


   useEffect(() => {
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const userID = localStorage.getItem("UserID");
      if (!token || !userID) return;

      const [userRes, bookRes, peminjamanRes, koleksiRes] = await Promise.all([
        api.get(`/users/${userID}`, { headers: authHeaders() }),
        api.get("/buku", { headers: authHeaders() }),
        api.get(`/peminjaman/user/${userID}`, { headers: authHeaders() }),
        api.get(`/koleksi/user/${userID}`, { headers: authHeaders() }),
      ]);

  const normalizedBorrowings = mergeLocalBorrowings(
  normalizeStatuses(peminjamanRes.data)
);

console.log("Normalized borrowings:", normalizedBorrowings);


console.log(
  "Borrowings detail:",
  normalizedBorrowings.map(b => ({
    BukuID: b.BukuID,
    Status: b.StatusPeminjaman,
    TglPengembalian: b.TanggalPengembalian,
    TglDikembalikan: b.TanggalDikembalikan
  }))
);


      // Ambil yang benar-benar aktif
   const activeBorrowedBooks = normalizedBorrowings.filter(b => {
  const status = b.StatusPeminjaman?.toLowerCase();
  return (
    (status === "borrowed" || status === "late") &&
    b.TanggalDikembalikan === null
  );
});



      setUser({
        ...userRes.data,
          Borrowings: normalizedBorrowings, 
        ActiveBorrowCount: activeBorrowedBooks.length,
        CollectionCount: koleksiRes.data.length,
      });

      setBooksData(bookRes.data);
      setFilteredBooks(bookRes.data);
      setBorrowed(activeBorrowedBooks.map(b => b.BukuID));
      setCollection(koleksiRes.data.map(item => item.BukuID));

    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);



 // POLLING agar halaman Book update otomatis jika ada perubahan peminjaman
useEffect(() => {
  const userID = localStorage.getItem("UserID");
  if (!userID) return;

  const updateBorrowings = async () => {
    try {
      const res = await api.get(`/peminjaman/user/${userID}`, { headers: authHeaders() });
 const normalized = mergeLocalBorrowings(normalizeStatuses(res.data));

      const activeBorrowedBooks = normalized.filter(b => {
        const status = b.StatusPeminjaman?.toLowerCase();
       const isBorrowed = ["borrowed", "late"].includes(status);


     
      const notReturned =
  !b.TanggalDikembalikan ||
  b.TanggalDikembalikan === null ||
  b.TanggalDikembalikan === "null" ||
  b.TanggalDikembalikan === "" ||
  b.TanggalDikembalikan === "0000-00-00";

        return isBorrowed && notReturned;
      });

      setUser(prev => prev ? ({
        ...prev,
        ActiveBorrowCount: activeBorrowedBooks.length,
      }) : null);

    setBorrowed(
  activeBorrowedBooks.length > 0
    ? activeBorrowedBooks.map(b => b.BukuID)
    : []
);


    } catch (err) {
      console.error("Gagal update peminjaman:", err);
    }
  };

  // Fetch pertama
  updateBorrowings();

  // Polling setiap 5 detik
  const interval = setInterval(updateBorrowings, 5000);

  return () => clearInterval(interval);
}, []);

 





  // helper format date
  const formatDate = (date) => {
    const d = new Date(date);
    const month = "" + (d.getMonth() + 1);
    const day = "" + d.getDate();
    const year = d.getFullYear();
    return [year, month.padStart(2, "0"), day.padStart(2, "0")].join("-");
  };


  // Borrow Book
  const handlePinjamBuku = async (BukuID) => {
    const UserID = localStorage.getItem("UserID");
    if (!UserID) {
      toast.warning("⚠️ Please log in first.");
      return;
    }



    // CEK ADA BUKU LATE
const hasLateBook = Array.isArray(user?.Borrowings)
  ? user.Borrowings.some(
      (b) => (b.StatusPeminjaman || "").toLowerCase().trim() === "late"
    )
  : false;

if (hasLateBook) {
  toast.error("❌ You cannot borrow a new book because you have a Late book.");
  return;
}


    const activeCount = user?.ActiveBorrowCount || 0;
    if (activeCount >= 3) {
      toast.error("You have reached the maximum limit of 3 active books. Please return one before borrowing again.");
      return;
    }

    setBorrowingIds((prev) => [...prev, BukuID]);
    try {
      const today = new Date();
      const sevenDaysLater = new Date();
      sevenDaysLater.setDate(today.getDate() + 7);

      const response = await api.post(
        "/peminjaman",
        {
          UserID,
          BukuID,
          TanggalPeminjaman: formatDate(today),
          TanggalPengembalian: formatDate(sevenDaysLater),
          StatusPeminjaman: "Dipinjam",
        },
        { headers: authHeaders() }
      );

      const { PeminjamanID, TanggalPengembalian } = response.data;
      toast.success(
        `✅ Book borrowed successfully!
        `
      );

      setBorrowed((prev) => [...prev, BukuID]);
     
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("❌ Failed to borrow the book.");
    } finally {
      setBorrowingIds((prev) => prev.filter((id) => id !== BukuID));
    }
  };

  console.log(borrowingIds);
  // Add to Collection
  const handleAddToCollection = async (BukuID) => {
    const UserID = localStorage.getItem("UserID");
    if (!UserID) {
      toast.warning("⚠️ Please log in first.");
      return;
    }

    if (collection.includes(BukuID)) {
      toast.info("ℹ️ This book is already in your collection.");
      return;
    }

    try {
      await api.post("/koleksi", { UserID, BukuID }, { headers: authHeaders() });
      setCollection((prev) => [...prev, BukuID]);
      toast.success("✅ Book added to your collection!");
      setUser((prev) => ({
        ...prev,
        CollectionCount: (prev?.CollectionCount || 0) + 1,
      }));
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to add book to collection.");
    }
  };

  if (loading) return <p className="text-center mt-6">Loading book data...</p>;
  if (error) return <p className="text-center text-red-600 mt-6">{error}</p>;

  const booksPerRow = 3;
  const rows = [];
  for (let i = 0; i < filteredBooks.length; i += booksPerRow) {
    rows.push(filteredBooks.slice(i, i + booksPerRow));
  }

  return (
    <div className="min-h-screen bg-[#F5E6D3] text-white flex flex-col md:flex-row">
      <SidebarPeminjam className="hidden md:flex" />
   <div className="flex-1 p-4 sm:p-8 overflow-y-auto md:pl-72 relative">
        <Hero2 />

        {/* User Info */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-10">
          {user && (
            <div className="flex flex-wrap gap-6 mt-6 mb-8 text-[#7B3F00] font-semibold">
              <div className="flex items-center gap-3 bg-[#FFF2E0] rounded-2xl shadow-sm border border-[#D29D6A] px-6 py-4">
                <TbBooks className="text-2xl text-[#B67438]" />
                <div>
                  <p className="text-sm text-[#5A4A42]">My Active Borrowings</p>
                  <p className="text-lg font-bold text-[#7B3F00]">
                    {user.ActiveBorrowCount}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-[#FFF2E0] rounded-2xl shadow-sm border border-[#D29D6A] px-6 py-4">
                <TbFolder className="text-2xl text-[#B67438]" />
                <div>
                  <p className="text-sm text-[#5A4A42]">My Collection</p>
                  <p className="text-lg font-bold text-[#7B3F00]">
                    {user.CollectionCount}
                  </p>
                </div>
              </div>
            </div>
          )}
          <SearchBuku booksData={booksData} setFilteredBooks={setFilteredBooks} />
        </div>

        {/* Books Grid */}

        <div className="space-y-6 border-t-4  border-[#B67438] pt-4 ">
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex flex-wrap gap-6 justify-start pb-4 border-b-4 border-[#B67438]"
            >

              {row.map((book) => {
                const isBorrowing = borrowingIds.includes(book.BukuID);
                const isBorrowed = borrowed.includes(book.BukuID);

                return (
                  <div
                    key={book.BukuID}
                    className="flex bg-white border border-[#B67438] shadow-md hover:shadow-lg transition flex-shrink-0 w-full sm:w-[293px] h-[160px] overflow-hidden"
                  >
                    <img
                      src={`${API_URL}/${book.Gambar}`}
                      alt={book.Judul}
                      className="w-[110px] h-full object-cover"
                    />
                    <div className="flex flex-col justify-between p-3 flex-1">
                      <div>
                        <h3
                          className="text-base font-bold text-gray-900 truncate"
                          title={book.Judul}
                        >
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




                     <div className="flex items-center gap-2 mt-2">
                        <Link
                                to={`/detail/${book.BukuID}`}
                                className="flex-1 text-center px-3 py-1 text-xs bg-[#D29D6A] text-white hover:bg-[#B67438] transition rounded"
                              >
                                View
                              </Link>

                        <button
                           onClick={() => handlePinjamBuku(book.BukuID)}
                          // disabled={isBorrowing || isBorrowed}
                          className={`flex-1 text-center px-3 py-1 text-xs transition rounded ${isBorrowed
                            ? "bg-green-400 text-white"
                            : isBorrowing
                              ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                              : "bg-[#7B3F00] text-white hover:bg-[#A15C2D]"
                            }`}
                        >
                          {isBorrowed ? "Borrowed" : isBorrowing ? "⏳..." : "Borrow"}
                        </button>

                        <button
                          onClick={() => handleAddToCollection(book.BukuID)}
                          disabled={collection.includes(book.BukuID)}
                          className={`flex-1 text-center px-1 py-1 text-xs transition rounded  ${collection.includes(book.BukuID)
                            ? "bg-[#ad6826] text-white"
                            : "bg-[#D29D6A] text-white hover:bg-[#ad6826]"
                            }`}
                        >
                          {collection.includes(book.BukuID) ?  <CiBookmarkCheck className="mx-auto " /> : "+"}
                        </button>
                      </div>

                    </div>
                  </div>



                );


              })}
            </div>
          ))}
        </div>

        <ToastContainer position="top-center"autoClose={2500} hideProgressBar />
      </div>
    </div>
  );
};

export default Book;