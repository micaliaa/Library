import React from 'react';

const Footer = () => {
  return (
    <footer className='bg-[#F5E6D3] py-2 text-[#B67438] text-center text-sm'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-sm'>
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
        </div>
      </div>
      <p>© 2025 Digital Library. All rights reserved</p>
    </footer>
  );
};

export default Footer;
