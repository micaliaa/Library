import React, { useEffect, useState } from "react";
import SidebarPeminjam from "../Dashboard/sidebarPeminjam";
import Hero2 from "../../../Components/Peminjam/Hero/heroBooks";
import { api, authHeaders } from "../../../../src/api";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Collection = () => {
  const [collection, setCollection] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const UserID = localStorage.getItem("UserID");

  const fetchCollection = async () => {
    if (!UserID) return;
    try {
      const res = await api.get(`/koleksi/user/${UserID}`, {
        headers: authHeaders(),
      });
      // res.data sekarang sudah array Buku dengan RataRataRating
      setCollection(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil koleksi.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollection();
  }, []);

  const handleRemove = async (BukuID) => {
    const confirmRemove = window.confirm(
      "Apakah kamu yakin ingin menghapus buku dari koleksi?"
    );
    if (!confirmRemove) return;

    try {
      await api.delete(`/koleksi/koleksi`, {
        headers: authHeaders(),
        data: { UserID, BukuID },
      });

      setCollection((prev) => prev.filter((b) => b.BukuID !== BukuID));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus buku dari koleksi.");
    }
  };

  const filteredBooks = collection.filter(
    (book) =>
      book.Judul.toLowerCase().includes(search.toLowerCase()) ||
      (book.Penulis || "").toLowerCase().includes(search.toLowerCase()) ||
      (book.Penerbit || "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="text-center mt-6">Loading koleksi...</p>;
  if (error) return <p className="text-center mt-6 text-red-600">{error}</p>;
  if (collection.length === 0)
    return (
      <div className="flex flex-col items-center justify-center mt-20 text-gray-700">
        <img src="/empty-state.png" alt="No collection" className="w-64 mb-4" />
        <p className="text-xl font-semibold">Koleksi kosong</p>
        <p className="text-center text-gray-500 mt-2">
          Tambahkan buku dari halaman katalog untuk membuat koleksimu!
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

        <div className="flex justify-center mb-6 gap-2">
          <input
            type="text"
            placeholder="Cari buku dalam koleksi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-[400px] px-4 py-2 rounded-lg border-2 border-[#7B3F00] text-[#7B3F00] focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"
          />
        </div>

        <div className="space-y-6 border-t-10 border-[#B67438] pt-4">
          {rows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="flex justify-center gap-6 pb-4 border-b-10 border-[#B67438]"
            >
              {row.map((book) => (
                <div
                  key={book.BukuID}
                  className="flex bg-white border border-[#B67438] shadow-md hover:shadow-lg transition flex-shrink-0"
                  style={{ width: "280px", height: "160px", overflow: "hidden" }}
                >
                  <img
                    src={book.Gambar ? `${API_URL}/${book.Gambar}` : "/placeholder.png"}
                    alt={book.Judul}
                    className="w-[110px] h-full object-cover"
                  />
                  <div className="flex flex-col justify-between p-3 flex-1">
                    <div>
                      <h3 className="text-base font-bold text-gray-900 truncate">
                        {book.Judul}
                      </h3>
                      <p className="text-xs text-gray-700 mt-1">
                        <strong>Author:</strong> {book.Penulis || "-"}
                      </p>
                      <p className="text-xs text-gray-700">
                        <strong>Publisher:</strong> {book.Penerbit || "-"}
                      </p>
                      {/* <p className="text-xs text-yellow-600 mt-1">
                        ⭐ {book.RataRataRating ? Number(book.RataRataRating).toFixed(1) : "0.0"}
                      </p> */}
                    </div>
                    <div className="flex gap-2 mt-2">
                      <Link
                        to={`/buku/${book.BukuID}`}
                        className="px-3 py-1 text-xs bg-[#D29D6A] text-white hover:bg-[#B67438] transition"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleRemove(book.BukuID)}
                        className="px-3 py-1 text-xs bg-red-500 text-white hover:bg-red-600 transition"
                      >
                        ❌ Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
