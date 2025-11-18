import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
// import { FaBookOpen } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

//peminjam
import Login from "./Components/Peminjam/User/Login";
import Register from "./Components/Peminjam/User/Register";
import LandingPage from "./Components/page/landingPage";
import Dashboard from "./Components/Peminjam/Dashboard/DashboardPeminjam";
import HeroCard from "./Components/Peminjam/Hero/hero";
import Book from "./Components/Peminjam/Buku/books";
import Buku from "./Components/Peminjam/Detail/buku";
import Detail from "./Components/Peminjam/Detail/buku";
import Search from "./Components/Peminjam/Buku/search";
import Categories from "./Components/Peminjam/Categori/categories";
import Peminjaman from "./Components/Peminjam/Peminjaman/peminjaman";
import Collection from "./Components/Peminjam/Collection/collection";
import SearchResult from "./Components/Peminjam/Dashboard/SearchResult";
import UserDetail from "./Components/Peminjam/User/UserDetail";
import ForgotPassword from "./Components/Peminjam/User/ForgotPassword";
import ResetPassword from "./Components/Peminjam/User/ResetPassword";

//  Petugas
import DashboardPetugas from "./Components/Petugas/Dashboard/dashboardPetugas";
import SidebarPetugas from "./Components/Petugas/Sidebar/sidebarPetugas";
import BorrowerData from "./Components/Petugas/BorrowerData/borrowerData";
import Borrowings from "./Components/Petugas/Borrowings/borrowings";
import ManageBooks from "./Components/Petugas/ManageBooks/manageBooks";
import Returned from "./Components/Petugas/Borrowings/returned";

// Admin 
import DashboardAdmin from "./Components/Administrator/Dashboard/dashboardAdmin";
import ManageUsers from "./Components/Administrator/Manage Users/manageUsers";
import ManageBooksAdmin from "./Components/Administrator/Manage BooksAdmin/manageBooks";
import BorrowingsAd from "./Components/Administrator/Borrowings/borrowings";
import ReturnsAd from "./Components/Administrator/Borrowings/returns";
import Reports from "./Components/Administrator/Report/reports";

function App() {
  
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);
  
 

 
  return (
    <>
    <BrowserRouter>
      <Routes>
        {/* Peminjam */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<UserDetail />} />
        <Route path="/hero" element={<HeroCard />} />
        <Route path="/buku/:id" element={<Buku />} />
        <Route path="/books" element={<Book />} />
        <Route path="/detail/:id" element={<Detail />} />
        <Route path="/search/:keyword" element={<Search />} />
        <Route path="/categori" element={<Categories />} />
        <Route path="/peminjaman" element={<Peminjaman />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/search" element={<SearchResult />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
         <Route path="/reset-password" element={<ResetPassword />} />

        {/* Petugas */}
        <Route path="/sidebarPetugas" element={<SidebarPetugas />} />
        <Route path="/petugas/dashboard" element={<DashboardPetugas />} />
        <Route path="/petugas/peminjam" element={<BorrowerData />} />
        <Route path="/petugas/borrowings" element={<Borrowings />} />
        <Route path="/petugas/books" element={<ManageBooks />} />
        <Route path="/returns" element={<Returned />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />
        <Route path="/admin/users" element={<ManageUsers />} />
        <Route path="/admin/books" element={<ManageBooksAdmin />} />
        <Route path="/admin/borrowings" element={<BorrowingsAd />} />
        <Route path="/admin/returns" element={<ReturnsAd />} />
        <Route path="/admin/reports" element={<Reports />} />
      </Routes>

    </BrowserRouter>
      <ToastContainer position="top-center" autoClose={3000} />
      
      </>
  );
}

export default App;
