import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SidebarPetugas from '../Sidebar/sidebarPetugas';
import { toast } from 'react-toastify';
import SearchReturns from './SearchReturns';

const API_URL = import.meta.env.VITE_API_URL;

const Borrowings = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [filteredBorrowings, setFilteredBorrowings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 8; // jumlah data per halaman

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const fetchBorrowings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/peminjaman`, headers);
      setBorrowings(res.data);
      setFilteredBorrowings(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load borrowings!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowings();
  }, []);

  // Pagination
  const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredBorrowings.length / perPage)), [filteredBorrowings]);
  const paginatedBorrowings = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredBorrowings.slice(start, start + perPage);
  }, [filteredBorrowings, page]);

  // Reset page saat filteredBorrowings berubah
  useEffect(() => {
    setPage(1);
  }, [filteredBorrowings]);

  return (
    <div className="flex min-h-screen">
      <SidebarPetugas />
      <main className="flex-1 bg-[#F5E6D3] p-8 py-15">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#7B3F00]">Borrowings</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate('/returns')}
          >
            View Returns
          </button>
        </div>

        <div className="mb-6">
          {/* 🔍 Search */}
          <SearchReturns
            borrowingsData={borrowings}
            setFilteredBorrowings={setFilteredBorrowings}
          />
        </div>

        {loading ? (
          <p>Loading borrowings...</p>
        ) : (
          <>
            <div className="overflow-x-auto bg-white rounded-2xl shadow">
              <table className="min-w-full">
                <thead className="bg-[#D29D6A] text-white">
                  <tr>
                    <th className="p-3 text-left">No</th>
                    <th className="p-3 text-left">Book Title</th>
                    <th className="p-3 text-left">Borrower</th>
                    <th className="p-3 text-left">Borrow Date</th>
                    <th className="p-3 text-left">Return Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBorrowings.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-6 text-center text-gray-500">
                        No borrowings found.
                      </td>
                    </tr>
                  ) : (
                    paginatedBorrowings.map((item, idx) => (
                      <tr key={item.PeminjamanID} className="border-b hover:bg-[#fdf6ef] transition">
                        <td className="p-3">{(page - 1) * perPage + idx + 1}</td>
                        <td className="p-3">{item.buku?.Judul || '-'}</td>
                        <td className="p-3">{item.User?.NamaLengkap || '-'}</td>
                        <td className="p-3">
                          {item.TanggalPeminjaman
                            ? new Date(item.TanggalPeminjaman).toLocaleDateString()
                            : '-'}
                        </td>
                        <td className="p-3">
                          {item.TanggalPengembalian
                            ? new Date(item.TanggalPengembalian).toLocaleDateString()
                            : '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredBorrowings.length > perPage && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`px-3 py-1 rounded ${page === 1 ? "bg-gray-200 cursor-not-allowed" : "bg-white shadow"}`}
                >
                  Prev
                </button>

                <span className="px-2">
                  Page <strong>{page}</strong> / {totalPages}
                </span>

                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`px-3 py-1 rounded ${page === totalPages ? "bg-gray-200 cursor-not-allowed" : "bg-white shadow"}`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Borrowings;
