import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api, authHeaders } from "../../../../src/api";
import SidebarPeminjam from "../Dashboard/sidebarPeminjam";
import Footer from "../../../Components/Peminjam/Footer/footer";


const BookCard = ({ book, navigate }) => (
  <div className="bg-[#d3a678] p-4 rounded-xl shadow hover:shadow-lg transition flex flex-col min-w-[200px] max-w-[220px]">
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
    <p className="text-xs sm:text-sm text-white mt-1 line-clamp-2" title={book.Penulis}>
      By : {book.Penulis}
    </p>
    <p className="text-xs sm:text-sm text-white line-clamp-1" title={book.Penerbit}>
      Publisher: {book.Penerbit}
    </p>
    <p className="text-xs sm:text-white mt-1">⭐ {book.RataRataRating ? Number(book.RataRataRating).toFixed(1) : "4.5"}</p>

    <button
      className="mt-2 bg-[#7B3F00]  text-white px-2 py-1 rounded-lg text-xs sm:text-sm hover:bg-[#B67438]"
      onClick={() => navigate(`/buku/${book.BukuID || ""}`)}
    >
      View Details
    </button>
  </div>
);

const SearchResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get("query") || "";
  const [books, setBooks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get("/buku", { headers: authHeaders() });
        const allBooks = res.data;

        if (query.trim() === "") {
          setFiltered(allBooks);
        } else {
          const q = query.toLowerCase();
          setFiltered(
            allBooks.filter(
              (b) =>
                (b.Judul || "").toLowerCase().includes(q) ||
                (b.Penulis || "").toLowerCase().includes(q) ||
                (b.Penerbit || "").toLowerCase().includes(q)
            )
          );
        }

        setBooks(allBooks);
      } catch (err) {
        console.error("Gagal memuat data buku:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [query]);

  return (
    <div className="flex min-h-screen bg-[#F5E6D3] ">
      <SidebarPeminjam />

      <div className="flex-1 p-8 overflow-y-auto md:pl-72">
        <h2 className="text-2xl font-semibold text-white bg-[#B67438] px-6 py-2 rounded mb-4">
          🔍 Search Result: "{query}"
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="text-gray-500 text-center">No Books Found.</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {filtered.map((book) => (
              <BookCard key={book.BukuID} book={book} navigate={navigate} />
            ))}
          </div>
        )}

        <div className="mt-10">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default SearchResult;
