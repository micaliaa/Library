import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SidebarAdmin from '../Sidebar/sidebarAdmin';
import { toast } from 'react-toastify';
import SearchReturns from '../../Petugas/Borrowings/SearchReturns';

const API_URL = import.meta.env.VITE_API_URL;

const BorrowingsAd = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [filteredBorrowings, setFilteredBorrowings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Pagination logic
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredBorrowings.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredBorrowings.length / itemsPerPage);

  return (
    <div className="flex min-h-screen">
      <SidebarAdmin/>
      <main className="flex-1 bg-[#F5E6D3] p-8 py-15">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-[#7B3F00]">Borrowings</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => navigate('/admin/returns')}
          >
            View Returns
          </button>
        </div>

        {/* Search */}
        <div className='mb-6'>
          <SearchReturns
            borrowingsData={borrowings}
            setFilteredBorrowings={setFilteredBorrowings}
          />
        </div>

        {loading ? (
          <p>Loading borrowings...</p>
        ) : (
          <>
            <table className="min-w-full bg-white rounded-2xl shadow overflow-hidden">
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
                {currentItems.map((item, idx) => (
                  <tr key={item.PeminjamanID} className="border-b hover:bg-[#fdf6ef] transition">
                    <td className="p-3">{indexOfFirst + idx + 1}</td>
                    <td className="p-3">{item.buku?.Judul || '-'}</td>
                    <td className="p-3">{item.User?.NamaLengkap || '-'}</td>
                    <td className="p-3">{item.TanggalPeminjaman ? new Date(item.TanggalPeminjaman).toLocaleDateString() : '-'}</td>
                    <td className={`p-3 ${!item.TanggalPengembalian ? 'text-red-500 font-semibold' : ''}`}>
                      {item.TanggalPengembalian ? new Date(item.TanggalPengembalian).toLocaleDateString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

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

export default BorrowingsAd;
