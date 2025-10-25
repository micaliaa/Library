import React, { useEffect, useState } from "react";
import { FaEdit, FaSave, FaTimes, FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { api, authHeaders } from "../../../../src/api";
import { toast } from "react-toastify";
import { IoIosLogOut } from "react-icons/io";
import { FaSpinner } from "react-icons/fa";



const UserDetail = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [formData, setFormData] = useState({
    Username: "",
    Email: "",
    NamaLengkap: "",
    Alamat: "",
  });

  // ambil data user dari backend
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userID = localStorage.getItem("UserID");
        const res = await api.get(`/users/${userID}`, { headers: authHeaders() });
        setUser(res.data);
        setFormData({
          Username: res.data.Username,
          Email: res.data.Email,
          NamaLengkap: res.data.NamaLengkap || "",
          Alamat: res.data.Alamat || "",
        });
      } catch (err) {
        console.error("Gagal mengambil data user:", err);
      }
    };
    fetchUser();
  }, []);

  // toggle edit
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };


  // handle input
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // simpan ke backend
  const handleSave = async () => {
  try {
    const userID = localStorage.getItem("UserID");
    await api.put(`/users/${userID}`, formData, { headers: authHeaders() });
    setUser(formData);
    setIsEditing(false);
    toast.success("Data berhasil diperbarui!");
  } catch (err) {
    console.error("Gagal menyimpan data:", err);
    toast.error("Gagal menyimpan data, periksa kembali input atau server API.");
  }
};

  const handleLogout = async () => {
    setLoadingLogout(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("UserID");
      setLoadingLogout(false);
      navigate("/login");
    }, 1500); // delay 
  };

  if (!user) return <p className="text-center text-gray-500 mt-10">Loading...</p>;


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF9F3] px-4 relative">
      {/* Panah kembali */}
      <button
        onClick={() => navigate("/dashboard")}
        className="absolute top-6 left-6 text-[#B67438] hover:text-[#7B3F00] flex items-center gap-2"
      >
        <FaArrowLeft size={18} />
        <span className="font-semibold">Back to Dashboard</span>
      </button>

      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg relative border border-[#EAD7C3]">
        {/* Tombol edit / batal */}
        <div
          className="absolute top-5 right-5 cursor-pointer text-[#B67438] hover:text-[#7B3F00]"
          onClick={handleEditToggle}
        >
          {isEditing ? <FaTimes size={20} /> : <FaEdit size={20} />}
        </div>

        <h2 className="text-2xl font-bold text-[#7B3F00] mb-6 text-center">
          👤 Borrower Profile
        </h2>

        <div className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-[#5A4A42] text-sm mb-1">Username</label>
            <input
              type="text"
              name="Username"
              value={formData.Username}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full p-2 rounded-lg border ${
                isEditing
                  ? "border-[#B67438] bg-[#FFF8F0]"
                  : "border-transparent bg-[#FFF2E0]"
              }`}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[#5A4A42] text-sm mb-1">Email</label>
            <input
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full p-2 rounded-lg border ${
                isEditing
                  ? "border-[#B67438] bg-[#FFF8F0]"
                  : "border-transparent bg-[#FFF2E0]"
              }`}
            />
          </div>

          {/* Nama Lengkap */}
          <div>
            <label className="block text-[#5A4A42] text-sm mb-1">Full Name</label>
            <input
              type="text"
              name="NamaLengkap"
              value={formData.NamaLengkap}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full p-2 rounded-lg border ${
                isEditing
                  ? "border-[#B67438] bg-[#FFF8F0]"
                  : "border-transparent bg-[#FFF2E0]"
              }`}
            />
          </div>

          {/* Alamat */}
          <div>
            <label className="block text-[#5A4A42] text-sm mb-1">Address</label>
            <textarea
              name="Alamat"
              value={formData.Alamat}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full p-2 rounded-lg border resize-none ${
                isEditing
                  ? "border-[#B67438] bg-[#FFF8F0]"
                  : "border-transparent bg-[#FFF2E0]"
              }`}
              rows="3"
            />
          </div>
        </div>

        {/* Tombol simpan / batal */}
        {isEditing && (
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-[#B67438] text-white px-4 py-2 rounded-lg hover:bg-[#D29D6A]"
            >
              <FaSave /> Save
            </button>
            <button
              onClick={handleEditToggle}
              className="flex items-center gap-2 bg-gray-300 text-[#5A4A42] px-4 py-2 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        )}
{/* Tombol logout */}
<div className="mt-8 text-center">
  <button
    onClick={handleLogout}
    disabled={loadingLogout}
    className={`text-white font-semibold flex items-center justify-center gap-2 mx-auto bg-red-500 px-6 rounded py-2 transition ${
      loadingLogout ? "opacity-70 cursor-not-allowed" : "hover:bg-red-600"
    }`}
  >
    {loadingLogout ? (
      <>
        <FaSpinner className="animate-spin text-lg" />
        Logging out...
      </>
    ) : (
      <>
        <IoIosLogOut className="text-lg" />
        Logout
      </>
    )}
  </button>
</div>
      </div>
    </div>
  );
};

export default UserDetail;
