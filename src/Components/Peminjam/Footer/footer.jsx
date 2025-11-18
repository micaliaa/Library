import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className='bg-[#f7f0eb] text-[#B67438] text-center text-sm mt-auto'>
      <div className='max-w-6xl mx-auto py-6 grid grid-cols-1 md:grid-cols-3 gap-6'>
        <div>
          <h4 className='font-semibold text-[#B67438] mb-2'>Libry</h4>
          <p className='px-2'>
            A digital library platform that makes reading easy, accessible, and enjoyable for everyone.
          </p>
        </div>
        <div>
          <h4 className='font-semibold text-[#B67438] mb-2'>About</h4>
          <ul className='space-y-1'>
            <li><a href="#" className='hover:underline'>About us</a></li>
            <p>Contact: +6200899204734</p>
          </ul>
        </div>
        <div>
          <h3 className='font-semibold text-[#B67438] mb-2'>Get in touch</h3>
          <p>Email: Support@libraryapp.com</p>
          <div className='flex justify-center mt-2 gap-3'>
            <a href="#" className='p-2 rounded-full bg-[#B67438] text-white hover:bg-[#7B3F00] transition'>
              <FaFacebookF />
            </a>
            <a href="#" className='p-2 rounded-full bg-[#B67438] text-white hover:bg-[#7B3F00] transition'>
              <FaTwitter />
            </a>
            <a href="#" className='p-2 rounded-full bg-[#B67438] text-white hover:bg-[#7B3F00] transition'>
              <FaInstagram />
            </a>
          </div>
        </div>
      </div>
      <p className='py-2 border-t border-[#B67438]'>© 2025 Digital Library. All rights reserved</p>
    </footer>
  );
};

export default Footer;
  