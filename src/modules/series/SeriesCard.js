// SeriesCard.js
import React from 'react';
import './SeriesCard.css';

const SeriesCard = ({ series, onSelect }) => {
  return (
    <div className='col-12 col-md-6 col-lg-4 m-0 p-2'>
      <div className={`card series`} onClick={() => onSelect(series.id)}>
        <div className="row g-0">
          <div className="col-12 d-flex align-items-center">
            <div className="card-body">
              <h5 className="card-title m-0">{series.name}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeriesCard;
