import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import SidebarPetugas from '../Sidebar/sidebarPetugas';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const BorrowersData = () => {
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 8; // jumlah data per halaman

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const fetchBorrowers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/users/borrowers`, headers);
      setBorrowers(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load borrowers!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowers();
  }, []);

  // Pagination
  const totalPages = useMemo(() => Math.max(1, Math.ceil(borrowers.length / perPage)), [borrowers]);
  const paginatedBorrowers = useMemo(() => {
    const start = (page - 1) * perPage;
    return borrowers.slice(start, start + perPage);
  }, [borrowers, page]);

  return (
    <div className="flex min-h-screen md:pl-72 bg-[#F5E6D3]">
      <SidebarPetugas />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-[#7B3F00] mb-6">Borrower Data</h1>

        <div className="overflow-x-auto bg-white rounded-2xl shadow">
          <table className="min-w-full">
            <thead className="bg-[#D29D6A] text-white">
              <tr>
                <th className="p-3 text-left">No</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Active Loans</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBorrowers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-500">
                    {loading ? "Loading borrowers..." : "No borrowers found."}
                  </td>
                </tr>
              ) : (
                paginatedBorrowers.map((user, idx) => (
                  <tr key={user.UserID} className="border-b hover:bg-gray-50">
                    <td className="p-3">{(page - 1) * perPage + idx + 1}</td>
                    <td className="p-3 font-medium">{user.NamaLengkap}</td>
                    <td className="p-3">{user.Email}</td>
                    <td className="p-3 text-center">{user.activeLoans || 0}</td>
                    <td className="p-3">
                      <button
                        onClick={() => navigate('/returns')}
                        className="bg-[#D29D6A] text-white px-3 py-1 rounded hover:bg-[#b37a56]"
                      >
                        Go to Returns
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {borrowers.length > perPage && (
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

        {loading && borrowers.length > 0 && (
          <p className="mt-4 text-[#7B3F00]">Refreshing data...</p>
        )}
      </main>
    </div>
  );
};

export default BorrowersData;
