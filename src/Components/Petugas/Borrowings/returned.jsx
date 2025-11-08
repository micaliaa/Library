import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SidebarPetugas from '../Sidebar/sidebarPetugas';
import { toast } from 'react-toastify';
import SearchReturns from './SearchReturns';

const API_URL = import.meta.env.VITE_API_URL;

const Returns = () => {
  const [returns, setReturns] = useState([]);
  const [filteredReturns, setFilteredReturns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 8;

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/pengembalian`, headers);
      setReturns(res.data);
      setFilteredReturns(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load returns!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? "-" : date.toLocaleDateString();
  };

  // Pagination
  const totalPages = useMemo(() => Math.max(1, Math.ceil(filteredReturns.length / perPage)), [filteredReturns]);
  const paginatedReturns = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredReturns.slice(start, start + perPage);
  }, [filteredReturns, page]);

  useEffect(() => {
    setPage(1); // reset page saat filteredReturns berubah
  }, [filteredReturns]);

  return (
    <div className="flex min-h-screen bg-[#F5E6D3]">
      <SidebarPetugas />
      <main className="flex-1 p-8 py-15">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-[#7B3F00]">Returned Books</h1>
          <button
            className="bg-[#D29D6A] text-white px-4 py-2 rounded hover:bg-[#b37a56] transition"
            onClick={() => navigate("/petugas/borrowings")}
          >
            Back to Borrowings
          </button>
        </div>

        {/* Search */}
        <div className='mb-10'>
          <SearchReturns
            borrowingsData={returns}
            setFilteredBorrowings={setFilteredReturns}
          />
        </div>

        {loading ? (
          <p className="text-[#7B3F00] mt-4">Loading returns...</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-2xl shadow-lg">
                <thead className="bg-[#D29D6A] text-white">
                  <tr>
                    <th className="p-4 text-left">No</th>
                    <th className="p-4 text-left">Book Title</th>
                    <th className="p-4 text-left">Borrower</th>
                    <th className="p-4 text-left">Borrow Date</th>
                    <th className="p-4 text-left">Return Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedReturns.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-gray-600">
                        No returned books found
                      </td>
                    </tr>
                  ) : (
                    paginatedReturns.map((item, idx) => (
                      <tr
                        key={item.PengembalianID}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="p-4">{(page - 1) * perPage + idx + 1}</td>
                        <td className="p-4 font-medium">{item.buku?.Judul || '-'}</td>
                        <td className="p-4">{item.User?.NamaLengkap || '-'}</td>
                        <td className="p-4">{formatDate(item.peminjaman?.TanggalPeminjaman)}</td>
                        <td className="p-4">{formatDate(item.TanggalPengembalian)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredReturns.length > perPage && (
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

export default Returns;
