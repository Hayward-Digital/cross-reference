import React from 'react';
import CategoryCard from './CategoryCard';
import './Category.css';
import categoriesData from './categories.json';

const Category = ({ onSelect }) => {
  return (
    <div className="container-fluid mb-5">
      <div className="row">
        <h4>Select <span className='fw-bold'>Category</span></h4>
      </div>
      <div className="row d-flex flex-wrap p-2">
        {categoriesData.categories.map(category => (
          <CategoryCard
            key={category.id}
            category={category}
            onSelect={() => onSelect(category)}
          />
        ))}
      </div>
    </div>
  );
};

export default Category;