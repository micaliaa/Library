import React, { useEffect, useState } from "react";
import SidebarPeminjam from "../Dashboard/sidebarPeminjam";
import { api, authHeaders } from "../../../../src/api";
import Hero3 from "../../../Components/Peminjam/Hero/heroPeminjaman";

const API_URL = import.meta.env.VITE_API_URL;

const MyBorrowings = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userID = localStorage.getItem("UserID");

 
    useEffect(() => {
  const fetchBorrowings = async () => {
    try {
      const res = await api.get(`/peminjaman/user/${userID}`, {
        headers: authHeaders(),
      });
      setBorrowings(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data peminjaman.");
    } finally {
      setLoading(false);
    }
  };
  fetchBorrowings();
}, [userID]);

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (error) return <p className="text-center mt-6 text-red-600">{error}</p>;
  if (borrowings.length === 0)
    return <p className="text-center mt-6">Belum ada peminjaman.</p>;

  console.log("API_URL:", API_URL);


  return (
    <div className="min-h-screen bg-[#F5E6D3] text-white flex">
      <SidebarPeminjam />
      <div className="flex-1 mt-10 px-6">
        <Hero3 />
        <h2 className="text-2xl font-bold text-[#7B3F00] mb-6">
          My Borrowed Books
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {borrowings.map((item) => {
            const book = item.buku || item.Buku; // ✅ ambil relasi Buku
            return (
              <div
                key={item.PeminjamanID}
                className="bg-white text-gray-800 border border-[#B67438] rounded-md shadow-md p-4"
              >
                <img
                  src={book?.Gambar ? `${API_URL}/${book.Gambar}` : "/placeholder.png"}

                  alt={book?.Judul || "No Title"}
                  className="w-full h-40 object-cover mb-2 rounded-md"
                />
                <h3 className="font-bold truncate">{book?.Judul}</h3>
                <p className="text-sm">
                  <strong>Author:</strong> {book?.Penulis}
                </p>
                <p className="text-sm">
                  <strong>Publisher:</strong> {book?.Penerbit}
                </p>
                <p className="text-sm">
                  <strong>Status:</strong> {item.StatusPeminjaman}
                </p>
                <p className="text-sm">
                  <strong>Dipinjam:</strong>{" "}
                  {new Date(item.TanggalPeminjaman).toLocaleDateString()}
                </p>
                <p className="text-sm">
                  <strong>Kembali:</strong>{" "}
                  {new Date(item.TanggalPengembalian).toLocaleDateString()}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyBorrowings;
