import { useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await axios.post(`${API_URL}/akun/forgot-password`, { Email:email });
      setMessage("Jika email terdaftar, link reset password dikirim.");
    } catch (err) {
      setMessage("Terjadi kesalahan. Coba lagi.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-[#F5E6D3] p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-[#7B3F00]">Forgot Password</h2>
        <input
          type="email"
          placeholder="Masukkan email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-[#7B3F00]"
          required
        />
        <button
          type="submit"
          className="w-full bg-[#7B3F00] text-white py-2 rounded hover:bg-[#D29D6A] transition"
        >
          Kirim Link Reset
        </button>
        {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
      </form>
    </div>
  );
}
