import React from 'react';
import LibraryBook from '../../../../src/assets/Librarybook.jpg'; 

const HeroCard = ({ username }) => {
  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg mb-8">
      {/* Gambar hero */}
      <img
        src={LibraryBook}
        alt="Library"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay gelap supaya teks terlihat */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Teks di tengah */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        <h1 className="text-3xl font-bold mb-4 drop-shadow-lg">
          Explore Our Collection of Books
        </h1>
        <p className="mt-2 text-lg max-w-xl drop-shadow-md">
          Find the best collection of books to broaden your knowledge.
        </p>
      </div>
    </div>
  );
};

export default HeroCard;
