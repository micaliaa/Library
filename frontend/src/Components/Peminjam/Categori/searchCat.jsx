import React from 'react';

const CategorySearch = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="max-w-md mx-auto my-6">
      <input
        type="text"
        placeholder="Search..."
        className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default CategorySearch;
