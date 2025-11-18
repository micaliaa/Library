
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import SidebarPetugas from "../Sidebar/sidebarPetugas";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;


const CoverPreview = ({ src, alt }) => (
  <div className="w-20 h-28 bg-gray-100 rounded overflow-hidden flex items-center justify-center border">
    {src ? <img src={src} alt={alt} className="object-cover w-full h-full" /> : <div className="text-xs text-gray-500 p-2 text-center">No cover</div>}
  </div>
);

const CategoryBadge = ({ name }) => (
  <span className="inline-block text-xs font-semibold px-2 py-1 rounded-full bg-[#D29D6A] text-white mr-1 mb-1">{name}</span>
);

// Add/Edit Book
const BookModal = ({ mode = "add", book = null, categories = [], API_URL, headers, onClose, onSuccess }) => {
  const [judul, setJudul] = useState(book?.Judul || "");
  const [penulis, setPenulis] = useState(book?.Penulis || "");
  const [penerbit, setPenerbit] = useState(book?.Penerbit || "");
  const [tahun, setTahun] = useState(book?.TahunTerbit || "");
  const [selectedCats, setSelectedCats] = useState(() => {
    if (!book) return [];
    
    if (book.Kategori) return book.Kategori.map(k => k.KategoriID || k.id || k.KategoriID);
    if (book.KategoriBukuRelasis) return book.KategoriBukuRelasis.map(r => r.KategoriBuku?.KategoriID).filter(Boolean);
    return [];
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(book?.Gambar ? (book.Gambar.startsWith("http") ? book.Gambar : `${API_URL}/${book.Gambar}`) : null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const toggleCat = (id) => {
    setSelectedCats(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      
      if (file) {
        const fd = new FormData();
        fd.append("Judul", judul);
        fd.append("Penulis", penulis);
        fd.append("Penerbit", penerbit);
        fd.append("TahunTerbit", tahun || "");
        fd.append("Gambar", file);
        fd.append("KategoriIDs", JSON.stringify(selectedCats)); 
        if (mode === "add") {
          await axios.post(`${API_URL}/buku`, fd, { headers: { ...headers.headers, "Content-Type": "multipart/form-data" } });
          toast.success("Book added");
        } else {
          await axios.put(`${API_URL}/buku/${book.BukuID}`, fd, { headers: { ...headers.headers, "Content-Type": "multipart/form-data" } });
          toast.success("Book updated");
        }
      } else {
        // JSON payload
        const payload = {
          Judul: judul,
          Penulis: penulis,
          Penerbit: penerbit,
          TahunTerbit: tahun || null,
          KategoriIDs: selectedCats
        };
        if (mode === "add") {
          await axios.post(`${API_URL}/buku`, payload, headers);
          toast.success("Book added");
        } else {
          await axios.put(`${API_URL}/buku/${book.BukuID}`, payload, headers);
          toast.success("Book updated");
        }
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Operation failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };
  

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl w-full max-w-2xl p-6">
        <div className="flex items-start justify-between">
          <h2 className="text-xl font-bold text-[#7B3F00]">{mode === "add" ? "Add New Book" : "Edit Book"}</h2>
          <div className="flex items-center gap-2">
            {preview && <CoverPreview src={preview} alt={judul} />}
            <button type="button" onClick={onClose} className="text-sm px-3 py-1 border rounded">Close</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="md:col-span-2 space-y-3">
            <div>
              <label className="text-sm font-medium">Title</label>
              <input required value={judul} onChange={e => setJudul(e.target.value)} className="w-full p-2 border rounded" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Author</label>
                <input value={penulis} onChange={e => setPenulis(e.target.value)} className="w-full p-2 border rounded" />
              </div>
              <div>
                <label className="text-sm font-medium">Publisher</label>
                <input value={penerbit} onChange={e => setPenerbit(e.target.value)} className="w-full p-2 border rounded" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Year</label>
              <input type="number" value={tahun} onChange={e => setTahun(e.target.value)} className="w-32 p-2 border rounded" />
            </div>

            <div>
              <label className="text-sm font-medium">Categories</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {categories.map(cat => (
                  <label key={cat.KategoriID} className={`cursor-pointer py-1 px-2 rounded border ${selectedCats.includes(cat.KategoriID) ? "bg-[#7B3F00] text-white" : "bg-white text-[#7B3F00]"}`}>
                    <input type="checkbox" checked={selectedCats.includes(cat.KategoriID)} onChange={() => toggleCat(cat.KategoriID)} className="hidden" />
                    {cat.NamaKategori}
                  </label>
                ))}
                {categories.length === 0 && <div className="text-sm text-gray-500">No categories. Add some below.</div>}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium">Cover Image</label>
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="w-full" />
            <div className="text-xs text-gray-500">Max recommended 2MB. If left empty when editing, cover won't change.</div>

            <div className="flex gap-2 mt-4">
              <button type="submit" disabled={submitting} className="flex-1 bg-[#D29D6A] text-white py-2 rounded hover:bg-[#b37a56]">
                {submitting ? "Saving..." : "Save"}
              </button>
              <button type="button" onClick={onClose} className="flex-1 border rounded py-2">Cancel</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};


const CategoryManager = ({ open, onClose, onReload, API_URL, headers }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState("");
  const [edit, setEdit] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchCats = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/kategori`, headers);
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) fetchCats();
  }, [open]);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      await axios.post(`${API_URL}/kategori`, { NamaKategori: newName }, headers);
      setNewName("");
      fetchCats();
      onReload();
      toast.success("Category added");
    } catch (err) {
      console.error(err);
      toast.error("Add failed");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!edit || !edit.NamaKategori.trim()) return;
    setSaving(true);
    try {
      await axios.put(`${API_URL}/kategori/${edit.KategoriID}`, { NamaKategori: edit.NamaKategori }, headers);
      setEdit(null);
      fetchCats();
      onReload();
      toast.success("Updated");
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete category?")) return;
    try {
      await axios.delete(`${API_URL}/kategori/${id}`, headers);
      fetchCats();
      onReload();
      toast.success("Deleted");
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#7B3F00]">Manage Categories</h3>
          <button onClick={onClose} className="px-3 py-1 border rounded">Close</button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            {loading ? <p>Loading...</p> : (


             <ul className="space-y-2 max-h-96 overflow-y-auto">
  {categories.map(cat => (
    <li key={cat.KategoriID} className="flex items-center justify-between p-2 border rounded">
      <div className="font-medium">{cat.NamaKategori}</div>
      <div className="flex gap-2">
        <button className="text-blue-600" onClick={() => setEdit(cat)}>Edit</button>
        <button className="text-red-600" onClick={() => handleDelete(cat.KategoriID)}>Delete</button>
      </div>
    </li>
  ))}
  {categories.length === 0 && <div className="text-sm text-gray-500">No categories yet.</div>}
</ul>


            )}
          </div>

          <div className="space-y-3">
            {edit ? (
              <>
                <input value={edit.NamaKategori} onChange={(e) => setEdit({...edit, NamaKategori: e.target.value})} className="w-full p-2 border rounded" />
                <div className="flex gap-2">
                  <button onClick={handleUpdate} className="flex-1 bg-[#D29D6A] text-white py-2 rounded">Save</button>
                  <button onClick={() => setEdit(null)} className="flex-1 border rounded py-2">Cancel</button>
                </div>
              </>
            ) : (
              <>
                <input placeholder="New category name" value={newName} onChange={e => setNewName(e.target.value)} className="w-full p-2 border rounded" />
                <button onClick={handleAdd} disabled={saving} className="w-full bg-[#7B3F00] text-white py-2 rounded">Add Category</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---
const ManageBooks = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // UI states
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all"); // or KategoriID
  const [page, setPage] = useState(1);
  const perPage = 8;

  // modals
  const [showAdd, setShowAdd] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.info("Please login first");
      navigate("/login");
    }
  }, [token]);

  const fetchBooks = async () => {
  setLoading(true);
  try {
    // Ambil semua data sekaligus
    const [booksRes, categoriesRes, relationsRes] = await Promise.all([
      axios.get(`${API_URL}/buku`, headers),
      axios.get(`${API_URL}/kategori`, headers),
      axios.get(`${API_URL}/kategoriRelasi`, headers),
    ]);

    const booksData = booksRes.data || [];
    const categoriesData = categoriesRes.data || [];
    const relationsData = relationsRes.data || [];

    // Map buku dengan kategori
    const booksWithCats = booksData.map(book => {
      const relatedCatIds = relationsData
        .filter(rel => rel.BukuID === book.BukuID)
        .map(rel => rel.KategoriID);

      const relatedCats = categoriesData.filter(cat =>
        relatedCatIds.includes(cat.KategoriID)
      );

      return { ...book, Kategori: relatedCats };
    });

    setBooks(booksWithCats);
    setCategories(categoriesData);

  } catch (err) {
    console.error(err);
    toast.error("Failed to load books");
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      navigate("/login");
    }
  } finally {
    setLoading(false);
  }
};


  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/kategori`, headers);
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // derived data
  const counts = useMemo(() => {
    const c = { total: books.length };
    categories.forEach(cat => {
      c[cat.KategoriID] = books.filter(b => (b.Kategori || []).some(k => k.KategoriID === cat.KategoriID)).length;
    });
    return c;
  }, [books, categories]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = books;

    if (activeCategory !== "all") {
      out = out.filter(b => (b.Kategori || []).some(k => k.KategoriID === activeCategory));
    }

    if (q) {
      out = out.filter(b =>
        `${b.Judul || ""} ${b.Penulis || ""} ${b.Penerbit || ""}`.toLowerCase().includes(q)
      );
    }

    return out;
  }, [books, activeCategory, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure want to delete this book?")) return;
    try {
      await axios.delete(`${API_URL}/buku/${id}`, headers);
      toast.success("Book deleted");
      // adjust page if needed
      const newLen = filtered.length - 1;
      const newTotalPages = Math.max(1, Math.ceil(newLen / perPage));
      if (page > newTotalPages) setPage(newTotalPages);
      fetchBooks();
    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="flex min-h-screen overflow-hidden">
  <SidebarPetugas />
  <main className="flex-1 bg-[#F5E6D3] md:pl-72 p-8 overflow-x-hidden">
     <div className="flex items-center justify-between mb-6">
  <div className="flex items-center gap-20">
    <h1 className="text-3xl font-bold text-[#7B3F00]">Manage Books</h1>
    <input
      value={query}
      onChange={(e) => { setQuery(e.target.value); setPage(1); }}
      placeholder="Search..."
  className="p-2 border border-[#D29D6A] rounded-md outline-none shadow-sm w-100 bg-white"


    />
  </div>
  <button
    onClick={() => setShowCategoryManager(true)}
   className="px-4 py-2 border border-[#7B3F00] text-[#7B3F00] rounded-md bg-white shadow hover:bg-[#f0e6de] font-medium"

  >
    Manage Categories
  </button>
</div>

{/* summary */}
<div className="flex gap-4 mb-6">
  <div className="bg-white rounded-lg p-4 shadow flex-1">
    <div className="text-sm text-gray-500">Total Books</div>
    <div className="text-2xl font-bold text-[#7B3F00]">{counts.total}</div>
  </div>
  <div className="bg-white rounded-lg p-4 shadow">
    <div className="text-sm text-gray-500">Categories</div>
    <div className="text-xl font-semibold text-[#7B3F00]">{categories.length}</div>
  </div>
</div>

{/* kategori */}
<div className="flex gap-2 overflow-x-auto mb-4 pb-2">
  <button
    onClick={() => { setActiveCategory("all"); setPage(1); }}
    className={`flex-shrink-0 px-4 py-2 rounded-full font-medium ${
      activeCategory === "all"
        ? "bg-[#7B3F00] text-white"
        : "bg-white text-[#7B3F00] hover:bg-[#f0e6de]"
    }`}
  >
    All ({counts.total})
  </button>

  {categories.map(cat => (
    <button
      key={cat.KategoriID}
      onClick={() => { setActiveCategory(cat.KategoriID); setPage(1); }}
      className={`flex-shrink-0 px-4 py-2 rounded-full font-medium ${
        activeCategory === cat.KategoriID
          ? "bg-[#7B3F00] text-white"
          : "bg-white text-[#7B3F00] hover:bg-[#f0e6de]"
      }`}
    >
      {cat.NamaKategori} ({counts[cat.KategoriID] || 0})
    </button>
  ))}
</div>


         

        {/* table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-[#7B3F00] text-white">
              <tr>
                <th className="p-3 text-left">No</th>
                <th className="p-3 text-left">Cover</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Author</th>
                <th className="p-3 text-left">Publisher / Year</th>
                <th className="p-3 text-left">Categories</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-gray-600">
                    {loading ? "Loading..." : "No books found."}
                  </td>
                </tr>
              )}

              {paginated.map((b, idx) => (
                <tr key={b.BukuID} className="border-b hover:bg-gray-50">
                  <td className="p-3 align-middle">{(page - 1) * perPage + idx + 1}</td>
                  <td className="p-3">
              <CoverPreview 
  src={`${API_URL}/${b.Gambar}`} 
  alt={b.Judul}
/>

                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-[#7B3F00]">{b.Judul}</div>
                    <div className="text-sm text-gray-500">ID: {b.BukuID}</div>
                  </td>
                  <td className="p-3">{b.Penulis || "-"}</td>
                  <td className="p-3">{(b.Penerbit || "-")} / {b.TahunTerbit || "-"}</td>
                  <td className="p-3">
                    {(b.Kategori || []).length > 0 ? (b.Kategori.map(k => <CategoryBadge key={k.KategoriID} name={k.NamaKategori} />)) : "-"}
                  </td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => setEditBook(b)} className="px-3 py-1 rounded bg-[#7B3F00] text-white hover:bg-[#D29D6A] ">Edit</button>
                    <button onClick={() => handleDelete(b.BukuID)} className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* pagination */}
          <div className="p-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filtered.length === 0 ? 0 : (page - 1) * perPage + 1} - {Math.min(page * perPage, filtered.length)} of {filtered.length}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className={`px-3 py-1 rounded ${page === 1 ? "bg-gray-200" : "bg-white shadow"}`}>Prev</button>
              <div className="flex items-center gap-1 px-3 py-1 rounded bg-white shadow">
                <span className="text-sm">Page</span>
                <strong className="px-2">{page}</strong>
                <span className="text-sm">/ {totalPages}</span>
              </div>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className={`px-3 py-1 rounded ${page === totalPages ? "bg-gray-200" : "bg-white shadow"}`}>Next</button>
            </div>
          </div>
        </div>

        {/* modals */}
       

        {editBook && (
          <BookModal
            mode="edit"
            book={editBook}
            API_URL={API_URL}
            headers={headers}
            categories={categories}
            onClose={() => setEditBook(null)}
            onSuccess={() => { setEditBook(null); fetchBooks(); fetchCategories(); }}
          />
        )}

        {showCategoryManager && (
          <CategoryManager
            open={showCategoryManager}
            onClose={() => setShowCategoryManager(false)}
            onReload={() => { fetchCategories(); fetchBooks(); }}
            API_URL={API_URL}
            headers={headers}
          />
        )}
      </main>
    </div>
  );
};

export default ManageBooks;

