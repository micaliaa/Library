import React,{useState} from 'react';
import Library from '../../../../src/assets/Library2_.jpg'; 

const HeroCard = ({username}) => {
  return (

    <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg mb-8">
      
      
      <img
        src={Library}
        alt="Library"
        className="absolute inset-0 w-full h-full object-cover"
      />


      <div className="absolute inset-0 bg-gradient-to-r from-[#B67438]/80 to-black/60"></div>

      {/* teks di tengah */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white">
        <h2 className="text-4xl font-bold">
          Welcome {username||"Guest"}!
        </h2>
        <p className="mt-2 text-lg max-w-xl">
          Find the best collection of books to broaden your knowledge.
        </p>
      </div>
    </div>
  );
};

export default HeroCard;
