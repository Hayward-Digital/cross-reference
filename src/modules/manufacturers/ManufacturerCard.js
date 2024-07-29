import React from 'react';
import './ManufacturerCard.css';

const ManufacturerCard = ({ manufacturer, onSelect }) => {
  return (
    <div className='col-12 col-md-6 col-lg-4 m-0 p-2'>
      <div className={`card manufacturer`} onClick={onSelect}>
        <div className="row g-0">
          <div className="col-4 d-flex justify-content-center align-items-center p-3">
            <img src={manufacturer.logo} alt={manufacturer.name} className="img-fluid"/>
          </div>
          <div className="col-8 d-flex align-items-center">
            <div className="ps-0 card-body">
              <h5 className="card-title m-0">{manufacturer.name}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerCard;