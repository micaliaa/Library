import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, authHeaders } from "../../../../src/api";

const Buku = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [error, setError] = useState("");
  const [isBorrowing, setIsBorrowing] = useState(false);
  const [userID] = useState(localStorage.getItem("UserID"));
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [editingReview, setEditingReview] = useState(null);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const res = await api.get(`/buku/${id}`, { headers: authHeaders() });
      setBook(res.data);
    } catch (err) {
      setError("Book not found");
    }
  };

  const renderStars = (rating) =>
    Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < rating ? "text-yellow-500" : "text-gray-300"}>
        ★
      </span>
    ));

  //handlePinjamBuku
  const handlePinjamBuku = async () => {
    if (!userID) return alert("You must log in first!");
    setIsBorrowing(true);

    // helper format tanggal
    const formatDate = (date) => {
      const d = new Date(date);
      const month = "" + (d.getMonth() + 1);
      const day = "" + d.getDate();
      const year = d.getFullYear();
      return [year, month.padStart(2, "0"), day.padStart(2, "0")].join("-");
    };

    const today = new Date();
    const sevenDaysLater = new Date();
    sevenDaysLater.setDate(today.getDate() + 7);

    try {
      await api.post(
        "/peminjaman",
        {
          UserID: userID,
          BukuID: book.BukuID,
          TanggalPeminjaman: formatDate(today),
          TanggalPengembalian: formatDate(sevenDaysLater),
          StatusPeminjaman: "Dipinjam",
        },
        { headers: authHeaders() }
      );
      alert("Book borrowed successfully!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to borrow book!");
    } finally {
      setIsBorrowing(false);
    }
  };

  const handleAddReview = async () => {
    if (!newReview.trim() || rating === 0) return alert("Please add a review and rating!");
    try {
      await api.post(
        "/ulasan",
        { BukuID: id, UserID: userID, Ulasan: newReview, Rating: rating },
        { headers: authHeaders() }
      );
      setNewReview("");
      setRating(0);
      fetchBook(); // refresh reviews
    } catch {}
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setNewReview(review.Ulasan);
    setRating(review.Rating);
  };

  const handleUpdateReview = async () => {
    try {
      await api.put(
        `/ulasan/${editingReview.UlasanID}`,
        { Ulasan: newReview, Rating: rating },
        { headers: authHeaders() }
      );
      setEditingReview(null);
      setNewReview("");
      setRating(0);
      fetchBook();
    } catch {}
  };

  const handleDeleteReview = async (ulasanID) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await api.delete(`/ulasan/${ulasanID}`, { headers: authHeaders() });
      fetchBook();
    } catch {}
  };

  if (error) return <p className="text-red-600">{error}</p>;
  if (!book) return <p className="text-gray-500">Loading book...</p>;

  const ulasan = book.Ulasan || [];

  return (
    <div className="bg-[#FFF9F3] min-h-screen text-[#3B2F2F]">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
        <button onClick={() => navigate("/dashboard")} className="text-[#7B3F00] hover:underline">
          ← Back
        </button>
        <h1 className="text-2xl font-bold">{book.Judul}</h1>
        <button
          onClick={handlePinjamBuku}
          disabled={isBorrowing}
          className={`px-5 py-2 rounded-lg text-white ${
            isBorrowing ? "bg-gray-400" : "bg-[#7B3F00] hover:bg-[#A15C2D]"
          }`}
        >
          {isBorrowing ? "⏳..." : "📘 Borrow Book"}
        </button>
      </div>

      {/* Book Details */}
      <div className="flex flex-col md:flex-row gap-8 p-8 bg-[#FFF2E0] border-b border-gray-200">
        <img
          src={`${api.defaults.baseURL}/${book.Gambar}`}
          alt={book.Judul}
          className="w-full md:w-1/4 rounded-lg shadow-md object-cover h-[360px]"
        />
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-2">{book.Judul}</h2>
          <p className="text-gray-700 mb-1">
            Author: <strong>{book.Penulis}</strong>
          </p>
          <p className="text-gray-700 mb-1">
            Publisher: <strong>{book.Penerbit}</strong>
          </p>
          <p className="text-gray-700 mb-3">
            Published Year: <strong>{book.TahunTerbit}</strong>
          </p>
          <div className="flex items-center gap-2 text-yellow-500">
            {renderStars(
              ulasan.length > 0
                ? Math.round(ulasan.reduce((sum, r) => sum + (r.Rating || 0), 0) / ulasan.length)
                : 0
            )}
            <span className="text-sm text-gray-600">({ulasan.length} reviews)</span>
          </div>
          <p className="mt-4 text-gray-800 leading-relaxed">{book.Deskripsi}</p>
        </div>
      </div>

      {/* Reviews */}
      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-4 text-[#7B3F00]">Reader Reviews</h2>

        {ulasan.length > 0 ? (
          <div className="space-y-4">
            {ulasan.map((review) => (
              <div key={review.UlasanID} className="border-b pb-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{review.User?.Username || "Anonymous"}</p>
                    <div className="flex gap-1 text-yellow-500">
                      {renderStars(review.Rating || 0)}
                    </div>
                  </div>
                  {review.UserID === parseInt(userID) && (
                    <div className="flex gap-2 text-sm">
                      <button
                        onClick={() => handleEditReview(review)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteReview(review.UlasanID)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
                <p className="mt-2 text-gray-700">{review.Ulasan}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 italic">No reviews for this book yet.</p>
        )}

        {/* Add/Edit Review Form */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-2">
            {editingReview ? "Edit Review" : "Write a Review"}
          </h3>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                className={`cursor-pointer text-2xl ${
                  star <= rating ? "text-yellow-500" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            className="w-full p-3 border rounded-lg bg-[#FFF9F3]"
            rows="4"
            placeholder="Write your thoughts..."
          />
          <div className="mt-2">
            {editingReview ? (
              <button
                onClick={handleUpdateReview}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update Review
              </button>
            ) : (
              <button
                onClick={handleAddReview}
                className="px-4 py-2 bg-[#7B3F00] text-white rounded hover:bg-[#A15C2D]"
              >
                Submit Review
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Buku;
