import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Searchbuku = () => {
  const { keyword } = useParams();
  const [hasil, setHasil] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`http://localhost:3000/buku/book/search/${keyword}`);
      setHasil(res.data);
    };
    fetchData();
  }, [keyword]);

  return (
    <div className="p-4 pt-20">
      <h2 className="text-2xl font-semibold mb-4">Search results for: <span className="text-[#7B3F00]">{keyword}</span></h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {hasil.length === 0 ? (
          <p className="col-span-full text-gray-500">no book found</p>
        ) : (
          hasil.map((book) => (
            <Link to={`/detail/${book.BukuID}`} key={book.BukuID} className="bg-white p-4 shadow rounded">
              <img
                    src={`http://localhost:3000/${book.Gambar ? book.Gambar.replace(/\\/g, "/") : "uploads/default-book.jpg"}`}
                    alt={book.Judul}
                    className="h-[200px] sm:h-[220px] w-full object-cover"
                  />
              <h3 className="font-semibold">{book.Judul}</h3>
              <p className="text-sm text-gray-500">Author: {book.Penulis}</p>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default Searchbuku;