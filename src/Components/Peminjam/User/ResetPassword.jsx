import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // ambil token dari URL
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!password || !confirmPassword) {
      setMessage("Password dan konfirmasi harus diisi.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Password dan konfirmasi tidak cocok.");
      return;
    }

    try {
      await axios.post(`${API_URL}/akun/reset-password`, { token, password });
      setMessage("Password berhasil diubah. Silakan login dengan password baru.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "Terjadi kesalahan. Coba lagi.");
    }
  };

  useEffect(() => {
    if (!token) {
      setMessage("Token tidak ditemukan. Link reset tidak valid.");
    }
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-[#F5E6D3] p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-[#7B3F00]">Reset Password</h2>

        <input
          type="password"
          placeholder="Password baru"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"
          required
        />

        <input
          type="password"
          placeholder="Konfirmasi password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"
          required
        />

        <button
          type="submit"
          className="w-full bg-[#7B3F00] text-white py-2 rounded hover:bg-[#D29D6A] transition"
        >
          Ubah Password
        </button>

        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
      </form>
    </div>
  );
}
