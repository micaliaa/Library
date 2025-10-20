import React from "react";
import Login from "./Components/Peminjam/User/Login";
import Register from "./Components/Peminjam/User/Register";
import LandingPage from "./Components/page/landingPage";
import Dashboard from "./Components/Peminjam/Dashboard/DashboardPeminjam";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import UserDetail from "./Components/Peminjam/User/UserDetail";
import HeroCard from "./Components/Peminjam/Hero/hero";
import Buku from"./Components/Peminjam/Detail/buku";
import Book from "./Components/Peminjam/Buku/books";
import Detail from "./Components/Peminjam/Detail/buku"
import Search from "./Components/Peminjam/Buku/search";
import Categories from "./Components/Peminjam/Categori/categories";
import Peminjaman from "./Components/Peminjam/Peminjaman/peminjaman"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/profile" element={<UserDetail/>}/>
        <Route path="/hero" element={<HeroCard/>}/>
        <Route path="/buku/:id" element={<Buku />} />
        <Route path="/books" element={< Book/>} />
        <Route path="/detail" element={< Detail/>} />
        <Route path="/search/:keyword" element={<Search />} />
        <Route path="/categori" element={<Categories/>} />
        <Route path="/peminjaman" element={<Peminjaman/>} />

      </Routes>
   </BrowserRouter>
  )
}

export default App
