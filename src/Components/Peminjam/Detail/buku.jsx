import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { api, authHeaders } from "../../../../src/api";

const Buku = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [error, setError] = useState("");

  // Tambahan: state untuk pinjam buku
  const [isBorrowing, setIsBorrowing] = useState(false);

  // Fungsi render bintang rating
  const renderStars = (rating) => {
    const stars = [];
    const maxStars = 5;
    const rounded = Math.round(rating || 0);

    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <span key={i} className={i <= rounded ? "text-yellow-500" : "text-gray-300"}>
          ★
        </span>
      );
    }
    return stars;
  };

  // Fetch detail buku berdasarkan ID
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await api.get(`/buku/${id}`, { headers: authHeaders() });
        setBook(response.data);
        console.log("Data buku:", response.data);
      } catch (err) {
        console.error("Gagal ambil detail buku:", err);
        setError("Buku tidak ditemukan");
      }
    };
    fetchBook();
  }, [id]);

  // 🔹 Fungsi cek jumlah peminjaman aktif user
  const checkActiveBorrowings = async (UserID) => {
    try {
      const response = await api.get(`/peminjaman/user/${UserID}`, {
        headers: authHeaders(),
      });
      const activeBorrowings = response.data.filter(
        (item) => item.StatusPeminjaman === "Dipinjam"
      );
      return activeBorrowings.length;
    } catch (err) {
      console.error("Gagal cek jumlah peminjaman:", err);
      return 0;
    }
  };

  // 🔹 Fungsi pinjam buku
  const handlePinjamBuku = async () => {
    const UserID = localStorage.getItem("UserID");
    if (!UserID) {
      alert("User belum login! Silakan login terlebih dahulu.");
      return;
    }

    setIsBorrowing(true);

    const activeCount = await checkActiveBorrowings(UserID);
    if (activeCount >= 3) {
      alert("❌ Kamu sudah mencapai batas maksimal 3 buku aktif. Kembalikan salah satu buku dulu.");
      setIsBorrowing(false);
      return;
    }

    try {
      const response = await api.post(
        "/peminjaman",
        { UserID, BukuID: book.BukuID },
        { headers: authHeaders() }
      );
      const { PeminjamanID, TanggalPengembalian } = response.data;
      alert(`📚 Buku berhasil dipinjam!\nID Peminjaman: ${PeminjamanID}\nTanggal Pengembalian: ${TanggalPengembalian || "Belum ditentukan"}`);
    } catch (err) {
      console.error(err);
      alert("Gagal meminjam buku! Silakan coba lagi.");
    } finally {
      setIsBorrowing(false);
    }
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (!book) return <p className="text-gray-500">Loading book...</p>;

  const ulasan = book.Ulasan || [];

  return (
    <div className="bg-[#F5E6D3] min-h-screen flex justify-center items-start py-10 px-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden">
        
        {/* Cover Buku */}
        <div className="md:w-1/3 bg-gray-50 flex justify-center items-center p-6 border-r border-gray-100">
          <img
            src={`${api.defaults.baseURL}/${book.Gambar}`}
            alt={book.Judul}
            className="rounded-lg shadow-md object-cover w-full max-w-[260px] h-[360px]"
          />
        </div>

        {/* Detail Buku */}
        <div className="flex-1 p-8 flex flex-col justify-between">
          {/* Tombol Back */}
          <button
            onClick={() => navigate("/dashboard")}
            className="self-start text-sm text-gray-500 hover:text-[#B67438] transition"
          >
            ← Back to Dashboard
          </button>

          {/* Info Buku */}
          <div className="mt-4 space-y-3">
            <h1 className="text-2xl md:text-3xl font-bold text-[#7B3F00]">{book.Judul}</h1>
            <h2 className="text-lg text-gray-600">
              By <span className="font-semibold">{book.Penulis}</span>
            </h2>

            <div className="flex items-center gap-2 text-yellow-500">
              {renderStars(
                ulasan.length > 0
                  ? ulasan.reduce((sum, r) => sum + (r.Rating || 0), 0) / ulasan.length
                  : 0
              )}
              <span className="text-sm text-gray-500">
                {ulasan.length > 0 ? `${ulasan.length} Reviews` : "No Reviews"}
              </span>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed mt-2">
              This book was published by <strong>{book.Penerbit}</strong> in the year{" "}
              <strong>{book.TahunTerbit}</strong>.
            </p>

            {/* Tombol Pinjam */}
            <button
              onClick={handlePinjamBuku}
              disabled={isBorrowing}
              className={`mt-4 px-6 py-2 rounded-lg text-white font-semibold ${
                isBorrowing ? "bg-gray-400 cursor-not-allowed" : "bg-[#7B3F00] hover:bg-[#A15C2D]"
              }`}
            >
              {isBorrowing ? "⏳ Meminjam..." : "📘 Pinjam Buku"}
            </button>
          </div>

          {/* Info tambahan */}
          <div className="mt-6 flex flex-wrap gap-2 text-sm text-gray-500">
            <span className="px-3 py-1 bg-gray-100 rounded-full">#Literature</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">#Reading</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full">#Inspiration</span>
          </div>

          {/* Ulasan */}
          <div className="mt-10 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-[#7B3F00] mb-4">Book Reviews</h2>

            {ulasan.length > 0 ? (
              <div className="space-y-4">
                {ulasan.map((review, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-sm transition"
                  >
                    <p className="font-semibold text-[#7B3F00]">
                      {review.User?.Username || "Anonim"}
                    </p>
                    <div className="flex gap-1 text-yellow-500">
                      {renderStars(review.Rating || 0)}
                    </div>
                    <p className="text-gray-700 mt-1">{review.Ulasan}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(review.CreatedAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center bg-gray-50 border rounded-md text-gray-500">
                📖 There are no reviews for this book yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buku;
