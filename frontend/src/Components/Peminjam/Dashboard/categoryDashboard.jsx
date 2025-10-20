import React from "react";

const CategoryDashboard = ({ categories, selectedCategory, onSelect }) => {
  return (
    <section className="mb-6">
      <h3 className="text-2xl font-semibold text-[#FFF9F3] mb-4 bg-[#B67438] p-2 rounded">
        📚 Categories
      </h3>

      <div className="flex gap-3 overflow-x-auto pb-2">
   
        <div
          className={`bg-[#F5E6D3] px-4 py-2 rounded-xl shadow cursor-pointer flex-shrink-0 ${
            selectedCategory === null ? "shadow-lg bg-[#D29D6A] text-white" : ""
          }`}
          onClick={() => onSelect(null)}
        >
          All
        </div>

        {categories.map((cat) => (
          <div
            key={cat.KategoriID}
            className={`bg-[#F5E6D3] px-4 py-2 rounded-xl shadow cursor-pointer flex-shrink-0 ${
              selectedCategory === cat.KategoriID ? "shadow-lg bg-[#D29D6A] text-white" : ""
            }`}
            onClick={() => onSelect(cat.KategoriID)}
          >
            {cat.NamaKategori}
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryDashboard;
