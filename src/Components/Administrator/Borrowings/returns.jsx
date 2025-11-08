import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from '../Sidebar/sidebarAdmin';
import { toast } from 'react-toastify';
import SearchReturns from '../../Petugas/Borrowings/SearchReturns';

const API_URL = import.meta.env.VITE_API_URL;

const ReturnsAd = () => {
  const [returns, setReturns] = useState([]);
  const [filteredReturns, setFilteredReturns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredReturns.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredReturns.length / itemsPerPage);

  return (
    <div className="flex min-h-screen bg-[#F5E6D3]">
      <SidebarAdmin />
      <main className="flex-1 p-8 py-15">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold text-[#7B3F00]">Returned Books</h1>
          <button
            className="bg-[#D29D6A] text-white px-4 py-2 rounded hover:bg-[#b37a56] transition"
            onClick={() => navigate("/admin/borrowings")}
          >
            Back to Borrowings
          </button>
        </div>

        {/* Search */}
        <div className='mb-6'>
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
                  {currentItems.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center text-gray-600">
                        No returned books found
                      </td>
                    </tr>
                  ) : (
                    currentItems.map((item, idx) => (
                      <tr
                        key={item.PengembalianID}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="p-4">{indexOfFirst + idx + 1}</td>
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

            {/* Pagination */}
            <div className="flex gap-2 justify-center mt-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-3 py-1 bg-[#7B3F00] text-white rounded disabled:opacity-50"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-[#D29D6A] text-white" : "bg-gray-200"}`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-3 py-1 bg-[#7B3F00] text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default ReturnsAd;
