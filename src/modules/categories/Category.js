import React from 'react';
import CategoryCard from './CategoryCard';
import './Category.css';

const Category = ({ categories, onSelect }) => {
  const activeCategories = categories.filter(category => category.active)
    .sort((a, b) => a.name.localeCompare(b.name)); // Ordenar alfabéticamente por nombre
  
  return (
    <div className="container-fluid mb-5">
      <div className="row"><h3>Select One Category</h3> <p>Discover Your Perfect Match: Choose a Category to Kickstart Your Product Search!</p></div>
      <div className="row d-flex flex-wrap p-2">
        {activeCategories.map(category => (
          <CategoryCard key={category.id} category={category} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
};

export default Category;
