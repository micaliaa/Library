// SearchBuku.js
import React, { useState } from "react";

const SearchBuku = ({ booksData, setFilteredBooks }) => {
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!booksData) return;

    const filtered = booksData.filter((book) => {
      const data = book.buku || book;
      return (
        (data.Judul || "").toLowerCase().includes(search.toLowerCase()) ||
        (data.Penulis || "").toLowerCase().includes(search.toLowerCase()) ||
        (data.Penerbit || "").toLowerCase().includes(search.toLowerCase())
      );
    });

    setFilteredBooks(filtered);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value === "") {
      setFilteredBooks(booksData);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
      <form onSubmit={handleSearch} className="flex w-full sm:w-auto gap-2">
        <input
          type="text"
          placeholder="Search for books..."
          value={search}
          onChange={handleChange}
          className="w-full sm:w-[300px] px-4 py-2 rounded-lg border-2 border-[#7B3F00] text-[#7B3F00] focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[#7B3F00] text-white rounded-lg hover:bg-[#9C5A1F]"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBuku;
