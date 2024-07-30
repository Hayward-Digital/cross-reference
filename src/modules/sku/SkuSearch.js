import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SkuSearch.css';

const SkuSearch = () => {
  const [sku, setSku] = useState('');
  const navigate = useNavigate();

  const handleSearch = (event) => {
    event.preventDefault();
    if (sku.trim()) {
      navigate(`/sku/${sku}`);
    }
  };

  return (
    <div className="col-12 sku-search-container">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          placeholder="Type here"
          className="search-input rounded-pill border px-3"
        />
        <button type="submit" className="btn btn-dark px-5 rounded-pill">Search</button>
      </form>
    </div>
  );
};

export default SkuSearch;