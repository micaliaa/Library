import React,{useState} from 'react';
import LibraryBook from '../../../../src/assets/Librarybook.jpg'; 

const HeroCard = ({username}) => {
  return (

    <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg mb-8">
      
      
      <img
        src={LibraryBook}
        alt="Library"
        className="absolute inset-0 w-full h-full object-cover"
      />


      <div className="absolute inset-0 bg-gradient-to-r from-[#B67438]/80 to-black/45"></div>

      {/* teks di tengah */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
       <h1 className="text-3xl font-bold text-center mb-8 text-white">
          Explore Our Collection of Books
        </h1>
        <p className="mt-2 text-lg max-w-xl">
          Find the best collection of books to broaden your knowledge.
        </p>
      </div>
    </div>
  );
};

export default HeroCard;
