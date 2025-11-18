import React, { useState } from "react";

const SearchReturns = ({ borrowingsData, setFilteredBorrowings, isReturnsPage = false }) => {
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!borrowingsData) return;

    const filtered = borrowingsData.filter((item) => {
      const book = item.buku || {};
      const borrower = item.User || {};

      // ambil tanggal sesuai halaman
      const borrowDate = item.TanggalPeminjaman
        ? new Date(item.TanggalPeminjaman)
        : item.peminjaman?.TanggalPeminjaman
        ? new Date(item.peminjaman.TanggalPeminjaman)
        : null;

      const returnDate = item.TanggalPengembalian
        ? new Date(item.TanggalPengembalian)
        : null;

      // 🔍 filter text
      const textMatch =
        (book.Judul || "").toLowerCase().includes(searchText.toLowerCase()) ||
        (book.Penulis || "").toLowerCase().includes(searchText.toLowerCase()) ||
        (borrower.NamaLengkap || "")
          .toLowerCase()
          .includes(searchText.toLowerCase());

      // tentukan tanggal yang mau dicek
      const checkDate = isReturnsPage ? returnDate : borrowDate;

      // 📅 perbaikan logika filter tanggal
      let dateMatch = true;
      if (startDate || endDate) {
        const start = startDate ? new Date(startDate + "T00:00:00") : null;
        const end = endDate ? new Date(endDate + "T23:59:59") : null;

        if (!checkDate) {
          dateMatch = false;
        } else {
          if (start && !end) {
            // hanya start → tampilkan data >= start
            dateMatch = checkDate >= start;
          } else if (!start && end) {
            // hanya end → tampilkan data <= end
            dateMatch = checkDate <= end;
          } else if (start && end) {
            // dua-duanya → tampilkan di antara
            dateMatch = checkDate >= start && checkDate <= end;
          }
        }
      }

      return textMatch && dateMatch;
    });

    setFilteredBorrowings(filtered);
  };

  const resetFilters = () => {
    setSearchText("");
    setStartDate("");
    setEndDate("");
    setFilteredBorrowings(borrowingsData);
  };

  return (
    <>
      <form
        onSubmit={handleSearch}
        className="flex flex-col md:flex-row md:items-end gap-3 bg-white p-4 rounded-lg shadow mb-6"
      >
        {/* 🔍 Search Text */}
        <div className="flex flex-col w-full md:w-1/3">
          <label className="text-sm font-medium text-[#7B3F00] mb-1">Search</label>
          <input
            type="text"
            placeholder="Search by title, author, or borrower..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#7B3F00] focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"
          />
        </div>

        {/* 📅 Start Date */}
        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-sm font-medium text-[#7B3F00] mb-1">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#7B3F00] focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"
          />
        </div>

        {/* 📅 End Date */}
        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-sm font-medium text-[#7B3F00] mb-1">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#7B3F00] focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"
          />
        </div>

        {/* 🔘 Buttons */}
        <div className="flex gap-2 w-full md:w-auto">
          <button
            type="submit"
            className="px-4 py-2 bg-[#7B3F00] text-white rounded-lg hover:bg-[#9C5A1F] transition"
          >
            Search
          </button>
          <button
            type="button"
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
          >
            Reset
          </button>
        </div>
      </form>
    </>
  );
};

export default SearchReturns;
