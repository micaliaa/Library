import React from "react";
import { Link } from "react-router-dom";
import { CiBookmarkCheck } from "react-icons/ci";
import { api } from "../../../../src/api";

const BookCard = ({
  book,
  handleBorrowBook,
  handleToggleCollection,
  collection,
  isBorrowing,
  isBorrowed,
}) => {
  if (!book) return null;

  const inCollection = (collection || []).includes(book.BukuID);

  return (
    <div className="flex bg-white border mt-4 border-[#B67438] shadow-md hover:shadow-lg transition flex-shrink-0 mb-4 w-full sm:w-[282px] h-[160px] overflow-hidden     ">
      <img
        src={book.Gambar ? `${api.defaults.baseURL}/${book.Gambar}` : "/placeholder.png"}
        alt={book.Judul || "Book"}
        className="w-[110px] h-full object-cover"
      />
      <div className="flex flex-col justify-between p-3 flex-1">
        <div>
          <h3 className="text-base font-bold text-gray-900 truncate">{book.Judul || "Loading..."}</h3>
          <p className="text-xs text-gray-700 mt-1">
            <strong>Author:</strong> {book.Penulis || "-"}
          </p>
          <p className="text-xs text-gray-700">
            <strong>Publisher:</strong> {book.Penerbit || "-"}
          </p>
          <p className="text-xs text-yellow-600 mt-1">
            ⭐ {book.RataRataRating ? Number(book.RataRataRating).toFixed(1) : "4.5"}
          </p>
        </div>

        <div className="flex justify-start items-center gap-2 mt-2">
          <Link
            to={book.BukuID ? `/buku/${book.BukuID}` : "#"}
            className="px-2 py-1 text-xs bg-[#D29D6A] text-white hover:bg-[#B67438] transition rounded"
          >
            View
          </Link>

          <button
            onClick={() => book.BukuID && handleBorrowBook(book.BukuID)}
            disabled={isBorrowing || isBorrowed}
            className={`px-2 py-1 text-xs rounded transition ${
              isBorrowed
                ? "bg-green-500 text-white"
                : isBorrowing
                ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                : "bg-[#7B3F00] text-white hover:bg-[#A15C2D]"
            }`}
          >
            {isBorrowed ? "Borrowed" : isBorrowing ? "⏳..." : "Borrow"}
          </button>

          <button
            onClick={() => book.BukuID && handleToggleCollection(book.BukuID)}
            className={`px-2 py-1 text-xs flex items-center justify-center rounded transition ${
              inCollection
                ? "bg-[#ad6826] text-white"
                : "bg-[#D29D6A] text-white hover:bg-[#ad6826]"
            }`}
          >
            {inCollection ? <CiBookmarkCheck size={16} /> : <span className="inline-block w-4 text-center">+</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
