import React from 'react';
import './CategoryCard.css';

const CategoryCard = ({ category, onSelect }) => {
  return (
    <div className='col-12 col-md-6 col-lg-4 m-0 p-2'>
      <div className={`card category ${category.code}`} onClick={() => onSelect(category)}>
        <div className="row g-0">
          <div className="col-2 d-flex justify-content-center align-items-center p-3">
            <img src={category.icon} alt={category.name} className="icon-img" />
          </div>
          <div className="col-10 d-flex align-items-center">
            <div className="ps-0 card-body">
              <h5 className="card-title m-0">{category.name}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;