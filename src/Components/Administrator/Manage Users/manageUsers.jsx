import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import SidebarAdmin from "../Sidebar/sidebarAdmin";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const roleDisplayMap = {
  administrator: "Admin",
  petugas: "Staff",
  peminjam: "Member"
};

const roleBackendMap = {
  Admin: "Administrator",
  Staff: "Petugas",
  Member: "Peminjam"
};

function toDisplayRole(role) {
  return roleDisplayMap[role?.toLowerCase()] || "Member";
}

function toBackendRole(role) {
  return roleBackendMap[role] || "Peminjam";
}

function normalizeRoleKey(role) {
  const r = role?.toLowerCase();
  if (r === "administrator") return "admin";
  if (r === "petugas") return "officer";
  return "member";
}

const RoleBadge = ({ role }) => {
  const base = "inline-block text-xs font-semibold px-2 py-1 rounded-full";
  const display = toDisplayRole(role);

  if (display === "Admin") return <span className={base + " bg-[#7B3F00] text-white"}>Admin</span>;
  if (display === "Staff") return <span className={base + " bg-[#D29D6A] text-white"}>Staff</span>;
  return <span className={base + " bg-gray-300 text-gray-800"}>Member</span>;
};

const Avatar = ({ name }) => {
  const initials = (name || "")
    .split(" ")
    .map(n => n && n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="w-9 h-9 rounded-full bg-[#D29D6A] text-white flex items-center justify-center font-bold">
      {initials || "?"}
    </div>
  );
};

const ManageUsers = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const headers = { headers: { Authorization: `Bearer ${token}` } };

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    alamat: "",
    role: "Member"
  });

  const [page, setPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    if (!token) {
      toast.info("Please login first");
      navigate("/login");
    }
  }, [token]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/users`, headers);
      setUsers(res.data || []);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const counts = useMemo(() => {
    const c = { admin: 0, officer: 0, member: 0, total: users.length };
    users.forEach(u => {
      const key = normalizeRoleKey(u.Role || "");
      if (key === "admin") c.admin++;
      else if (key === "officer") c.officer++;
      else c.member++;
    });
    return c;
  }, [users]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let out = users;

    if (activeTab !== "all") {
      out = out.filter(u => normalizeRoleKey(u.Role || "") === activeTab);
    }

    if (q) {
      out = out.filter(u =>
        `${u.NamaLengkap || ""} ${u.Email || ""}`.toLowerCase().includes(q)
      );
    }

    return out;
  }, [users, activeTab, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  const openAdd = () => {
    setEditUser(null);
    setForm({ name: "", username: "", email: "", password: "", alamat: "", role: "Admin" });
    setModalOpen(true);
  };

  const openEdit = (u) => {
    setEditUser(u);
    setForm({
      name: u.NamaLengkap || "",
      username: u.Username || "",
      email: u.Email || "",
      password: "",
      alamat: u.Alamat || "",
      role: toDisplayRole(u.Role)
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      NamaLengkap: form.name,
      Username: form.username,
      Email: form.email,
      Alamat: form.alamat,
      Role: toBackendRole(form.role)
    };
    if (form.password) payload.Password = form.password;

    try {
      if (editUser) {
        await axios.put(`${API_URL}/users/${editUser.UserID}`, payload, headers);
        toast.success("User updated");
      } else {
        await axios.post(`${API_URL}/users`, payload, headers);
        toast.success("User added");
      }

      setModalOpen(false);
      setEditUser(null);
      setForm({ name: "", username: "", email: "", password: "", alamat: "", role: "Admin" });
      fetchUsers();
    } catch (err) {
      toast.error("Save failed");
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name || "this user"}?`)) return;
    try {
      await axios.delete(`${API_URL}/users/${id}`, headers);
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Delete failed");
    }
  };

  const tabs = [
    { key: "all", label: `All (${counts.total})` },
    { key: "admin", label: `Admin (${counts.admin})` },
    { key: "officer", label: `Staff (${counts.officer})` },
    { key: "member", label: `Member (${counts.member})` },
  ];

  return (
    <div className="flex min-h-screen">
      <SidebarAdmin />
      <main className="flex-1 ml-64 bg-[#F5E6D3] p-8">
        <ToastContainer />
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[#7B3F00]">Manage Users</h1>
          <button onClick={openAdd} className="bg-[#D29D6A] text-white px-4 py-2 rounded hover:bg-[#b37a56]">
            + Add User
          </button>
        </div>

        {/* summary */}
        <div className="flex gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 shadow flex-1">
            <div className="text-sm text-gray-500">Total Users</div>
            <div className="text-2xl font-bold text-[#7B3F00]">{counts.total}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-sm text-gray-500">Admins</div>
            <div className="text-xl font-semibold text-[#7B3F00]">{counts.admin}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-sm text-gray-500">Staff</div>
            <div className="text-xl font-semibold text-[#7B3F00]">{counts.officer}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <div className="text-sm text-gray-500">Members</div>
            <div className="text-xl font-semibold text-[#7B3F00]">{counts.member}</div>
          </div>
        </div>

        {/* tabs + search */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => { setActiveTab(t.key); setPage(1); }}
                className={`px-4 py-2 rounded-full font-medium ${
                  activeTab === t.key ? "bg-[#7B3F00] text-white" : "bg-white text-[#7B3F00] hover:bg-[#f0e6de]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search name or email..."
            className="p-2 bg-white rounded-md border px-10 outline-none border-amber-800"
          />
        </div>

        {/* table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-[#D29D6A] text-white">
              <tr>
                <th className="p-3 text-left">No</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-600">
                    {loading ? "Loading..." : "No users found."}
                  </td>
                </tr>
              )}

              {paginated.map((u, idx) => (
                <tr key={u.UserID} className="border-b hover:bg-gray-50">
                  <td className="p-3">{(page - 1) * perPage + idx + 1}</td>
                  <td className="p-3 flex items-center gap-3">
                    <Avatar name={u.NamaLengkap} />
                    <div>
                      <div className="font-semibold text-[#7B3F00]">{u.NamaLengkap}</div>
                      <div className="text-sm text-gray-500">ID: {u.UserID}</div>
                    </div>
                  </td>
                  <td className="p-3">{u.Email}</td>
                  <td className="p-3"><RoleBadge role={u.Role} /></td>
                  <td className="p-3 flex gap-2">
                    <button onClick={() => openEdit(u)} className="px-3 py-1 bg-green-600 text-white rounded">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(u.UserID, u.NamaLengkap)} className="px-3 py-1 bg-red-600 text-white rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* pagination */}
          <div className="p-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Showing {(filtered.length === 0 ? 0 : (page - 1) * perPage + 1)} - {Math.min(page * perPage, filtered.length)} of {filtered.length}
            </span>

            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1 rounded bg-white shadow">
                Prev
              </button>
              <span className="px-3 py-1 bg-white shadow rounded">Page {page} / {totalPages}</span>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1 rounded bg-white shadow">
                Next
              </button>
            </div>
          </div>
        </div>

        {/* modal */}
        {modalOpen && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] p-6 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4 text-[#7B3F00]">{editUser ? "Edit User" : "Add User"}</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="text-sm font-medium">Username</label>
        <input
          required
          value={form.username}
          onChange={(e) => setForm(f => ({ ...f, username: e.target.value }))}
          className="p-2 border rounded"
        />

        <label className="text-sm font-medium">Full Name</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
          className="p-2 border rounded"
        />

        <label className="text-sm font-medium">Email</label>
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
          className="p-2 border rounded"
        />

        <label className="text-sm font-medium">Password</label>
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm(f => ({ ...f, password: e.target.value }))}
          className="p-2 border rounded"
        />

        <label className="text-sm font-medium">Address</label>
        <textarea
          value={form.alamat}
          onChange={(e) => setForm(f => ({ ...f, alamat: e.target.value }))}
          className="p-2 border rounded"
        />

        <label className="text-sm font-medium">Role</label>
        <select
          value={form.role}
          onChange={(e) => setForm(f => ({ ...f, role: e.target.value }))}
          className="p-2 border rounded"
        >
          <option value="Admin">Admin</option>
          <option value="Staff">Staff</option>
       
        </select>

        <div className="flex gap-2 mt-3">
          <button type="submit" className="flex-1 bg-[#D29D6A] text-white py-2 rounded">
            Save
          </button>
          <button type="button" onClick={() => { setModalOpen(false); setEditUser(null); }} className="flex-1 border rounded py-2">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
)}


      </main>
    </div>
  );
};

export default ManageUsers;
