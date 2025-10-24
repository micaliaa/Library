import React, { useEffect, useState } from "react";
import SidebarPeminjam from "../Dashboard/sidebarPeminjam";
import Hero2 from "../../../Components/Peminjam/Hero/heroBooks";
import { api, authHeaders } from "../../../../src/api";
import { Link } from "react-router-dom";
import { TbBooks, TbFolder } from "react-icons/tb";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SearchBuku from "../Buku/search";
import { normalizeStatuses } from "../../../../src/Components/utils/translateStatus";

const API_URL = import.meta.env.VITE_API_URL;

const Collection = () => {
  const [collection, setCollection] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const UserID = localStorage.getItem("UserID");

  useEffect(() => {
    const fetchCollection = async () => {
      if (!UserID) return;
      try {
        // ambil semua data paralel
        const [resCollection, resUser, resBorrow] = await Promise.all([
          api.get(`/koleksi/user/${UserID}`, { headers: authHeaders() }),
          api.get(`/users/${UserID}`, { headers: authHeaders() }),
          api.get(`/peminjaman/user/${UserID}`, { headers: authHeaders() }),
        ]);

       
        const normalizedBorrowings = normalizeStatuses(resBorrow.data, "en");

        //  merge dengan localStorage biar data "Finished" tetap sinkron
        const saved = JSON.parse(localStorage.getItem("borrowings") || "[]");
        const mergedBorrowings = normalizedBorrowings.map((item) => {
          const localItem = saved.find(
            (b) => b.PeminjamanID === item.PeminjamanID
          );
          return localItem && localItem.StatusPeminjaman === "Finished"
            ? { ...item, ...localItem }
            : item;
        });

        //  hitung berapa yang masih aktif 
        const activeCount = mergedBorrowings.filter(
          (b) => b.StatusPeminjaman?.toLowerCase() === "borrowed"
        ).length;

        // update data user
        setUser({
          ...resUser.data,
          ActiveBorrowCount: activeCount,
          CollectionCount: resCollection.data.length,
        });

        setCollection(resCollection.data);
        setFilteredBooks(resCollection.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch collection data");
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
  }, [UserID]);

  const handleRemove = async (BukuID) => {
    const confirmRemove = window.confirm(
      "Are you sure you want to remove this book from your collection?"
    );
    if (!confirmRemove) return;

    try {
      await api.delete("/koleksi/by-user-book", {
        headers: authHeaders(),
        data: { UserID, BukuID },
      });

      setCollection((prev) => prev.filter((b) => b.BukuID !== BukuID));
      setFilteredBooks((prev) => prev.filter((b) => b.BukuID !== BukuID));
      setUser((prev) => ({
        ...prev,
        CollectionCount: (prev.CollectionCount || 1) - 1,
      }));

      toast.success("📚 Book successfully removed from collection!");
    } catch (err) {
      console.error("Remove error:", err.response || err);
      toast.error("❌ Failed to remove book from collection.");
    }
  };

  if (loading) return <p className="text-center mt-6">Loading collection...</p>;
  if (error) return <p className="text-center mt-6 text-red-600">{error}</p>;
  if (collection.length === 0)
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-gray-700">
        <img src="/empty-state.png" alt="No collection" className="w-64 mb-4" />
        <p className="text-xl font-semibold">Your collection is empty</p>
        <p className="text-center text-gray-500 mt-2">
          Add books from the catalog page to start building your collection!
        </p>
      </div>
    );

  const booksPerRow = 3;
  const rows = [];
  for (let i = 0; i < filteredBooks.length; i += booksPerRow) {
    rows.push(filteredBooks.slice(i, i + booksPerRow));
  }

  return (
    <div className="min-h-screen bg-[#F5E6D3] flex text-gray-800">
      <SidebarPeminjam />
      <div className="flex-1 mt-10 px-4">
        <Hero2 />

        {/* Count + Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          {user && (
            <div className="flex flex-wrap gap-6 mt-6 mb-8 text-[#7B3F00] font-semibold">
              <div className="flex items-center gap-3 bg-[#FFF2E0] rounded-2xl shadow-sm border border-[#D29D6A] px-6 py-4 hover:shadow-md transition">
                <TbBooks className="text-2xl text-[#B67438]" />
                <div>
                  <p className="text-sm text-[#5A4A42]">My Active Borrowing</p>
                  <p className="text-lg font-bold text-[#7B3F00]">
                    {user.ActiveBorrowCount}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-[#FFF2E0] rounded-2xl shadow-sm border border-[#D29D6A] px-6 py-4 hover:shadow-md transition">
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

          <SearchBuku
            booksData={collection}
            setFilteredBooks={setFilteredBooks}
            className="ml-auto"
          />
        </div>

        {/* Book Cards per row */}
        <div className="space-y-6 border-t-10 border-[#B67438] pt-4">
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex flex-wrap justify-center gap-6 pb-4 border-b-10 border-[#B67438]"
            >
              {row.map((book) => {
                const data = book.buku || book;
                return (
                  <div
                    key={book.KoleksiID}
                    className="flex bg-white border border-[#B67438] shadow-md hover:shadow-lg transition flex-shrink-0 w-[280px] h-[160px] overflow-hidden"
                  >
                    <img
                      src={
                        data.Gambar
                          ? `${API_URL}/${data.Gambar}`
                          : "/placeholder.png"
                      }
                      alt={data.Judul}
                      className="w-[110px] h-full object-cover"
                    />
                    <div className="flex flex-col justify-between p-3 flex-1">
                      <div>
                        <h3 className="text-base font-bold text-gray-900 truncate">
                          {data.Judul}
                        </h3>
                        <p className="text-xs text-gray-700 mt-1">
                          <strong>Author:</strong> {data.Penulis || "-"}
                        </p>
                        <p className="text-xs text-gray-700">
                          <strong>Publisher:</strong> {data.Penerbit || "-"}
                        </p>
                        <p className="text-xs text-yellow-600 mt-1">
                          ⭐{" "}
                          {data.RataRataRating
                            ? Number(data.RataRataRating).toFixed(1)
                            : "0.0"}
                        </p>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Link
                          to={`/buku/${data.BukuID}`}
                          className="px-3 py-1 text-xs bg-[#D29D6A] text-white hover:bg-[#B67438] transition"
                        >
                          View
                        </Link>
                        <button
                          onClick={() => handleRemove(data.BukuID)}
                          className="px-3 py-1 text-xs bg-red-500 text-white hover:bg-red-600 transition"
                        >
                          ❌ Remove
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

export default Collection;
