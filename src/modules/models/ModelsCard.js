import React from 'react';
import './ModelsCard.css';

const ModelsCard = ({ model, isActive, onSelect }) => {
  return (
    <div className='col-12 col-md-6 col-lg-4 m-0 p-2'>
      <div className={`card model ${isActive ? 'active' : ''}`} onClick={onSelect}>
        <div className="row g-0">
          <div className="col-12 d-flex align-items-center">
            <div className="card-body">
              <h5 className="card-title m-0">{model.name}</h5>
              <p>Code: {model.sku}</p>
              <p>{model.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default ModelsCard;