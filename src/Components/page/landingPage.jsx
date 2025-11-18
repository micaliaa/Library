import React from 'react';
import landingImage from '../../assets/landingImage.png';
import logo from '../../assets/logo.png';
import Footer from '../Peminjam/Footer/footer'; 

const LandingPage = () => {
  return (
    <div className='min-h-screen bg-[#FFF9F3] flex flex-col'>
      <nav className='flex justify-between items-center px-8 py-0 bg-[#7B3F00]'>
        <div className='flex items-center space-x-0'>
          <img src={logo} className="w-18 h-18 rounded-full" />
          <h1 className='text-2xl font-bold text-[#F5E6D3]'>M-Libry</h1>
        </div>
        <div className='space-x-4'>
          <a href="/login" className='text-[#7B3F00] font-medium hover:text-[#B67438]'>Login</a>
          <a href="/register" className='bg-[#D29D6A] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#B67438] transition'>Sign Up</a>
        </div>
      </nav>

      <main className='flex flex-col md:flex-row flex-1 items-center justify-between px-10 md:px-20 py-10'>
        <div className='md:w-1/2 text-center md:text-left mb-10 md:mb-0'>
          <h1 className='text-5xl font-bold text-[#7B3F00] mb-4 leading-snug'>
            Explore knowlage <br /> Anytime, Anywhere
          </h1>
          <p className='mb-4 text-[#B67438]'>
            Discover, Borrow, and read your favorit books in our digital library. Simple, fast, and accessible for everyone.
          </p>
          <a href="/login" className='bg-[#D29D6A] rounded-lg text-white font-semibold px-6 py-3 hover:bg-[#B67438]'>
            Get Started
          </a>
        </div>

        <div className='md:w-1/2 flex justify-center'>
          <img src={landingImage} className='w-4/5 max-w-lg bg-[#F5E6D3] rounded-2xl shadow-md' />
        </div>
      </main>

      <section className='bg-[#FFF1E1] py-16 px-6 text-center md:px-20'>
        <h3 className='text-[#7B3F00] font-bold text-2xl mb-3'>Why choose a digital library?</h3>
        <p className='text-[#5A4A42] max-w-2xl mx-auto leading-relaxed'>
          A digital library allows you to access thousands of books anytime and anywhere.
          It's eco-friendly, convenient, and helps promote lifelong learning without the limits of physical shelves.
        </p>
      </section>
{/* footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
