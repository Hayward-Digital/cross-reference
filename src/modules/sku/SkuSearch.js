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
    <div className="sku-search-container">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          placeholder="Enter SKU"
          className="search-input"
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>
    </div>
  );
};

export default SkuSearch;