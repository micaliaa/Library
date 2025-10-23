import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Components/Peminjam/User/Login";
import Register from "./Components/Peminjam/User/Register";
import LandingPage from "./Components/page/landingPage";
import Dashboard from "./Components/Peminjam/Dashboard/DashboardPeminjam";
import UserDetail from "./Components/Peminjam/User/UserDetail";
import HeroCard from "./Components/Peminjam/Hero/hero";
import Book from "./Components/Peminjam/Buku/books";
import Buku from "./Components/Peminjam/Detail/buku"; // ✅ tambahkan ini
import Detail from "./Components/Peminjam/Detail/buku"; // atau bisa pakai Buku aja
import Search from "./Components/Peminjam/Buku/search";
import Categories from "./Components/Peminjam/Categori/categories";
import Peminjaman from "./Components/Peminjam/Peminjaman/peminjaman";
import Collection from "./Components/Peminjam/Collection/collection";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<UserDetail />} />
        <Route path="/hero" element={<HeroCard />} />
        <Route path="/buku/:id" element={<Buku />} />
        <Route path="/books" element={<Book />} />
        <Route path="/detail/:id" element={<Detail />} /> {/* ✅ diperbaiki */}
        <Route path="/search/:keyword" element={<Search />} />
        <Route path="/categori" element={<Categories />} />
        <Route path="/peminjaman" element={<Peminjaman />} />
        <Route path="/collection" element={<Collection />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
