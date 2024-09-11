import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SkuSearch from '../modules/sku/SkuSearch';
import './Home.css';

const Home = ({ onSelectCategory }) => {
  const navigate = useNavigate();
  

  useEffect(() => {
    localStorage.removeItem('appState');
  }, []);

  const handleCategoryClick = () => {
    onSelectCategory();
  };

  return (
    <div className="container-fluid my-0 my-sm-2 py-0 py-sm-2">
      <div className="row d-flex flex-wrap">
        <div className='col-12 col-md-5 p-5 d-flex flex-column justify-content-center align-items-center align-items-sm-start'>
          <h3>Find your Product</h3>
          <p className='text-center text-sm-start'>We will guide you to find your current product and show you the best alternatives to improve your pool</p>
          <button className="btn btn-dark px-5 py-3 rounded-pill" onClick={handleCategoryClick}>Let's start</button>
        </div>
        <div className='col-12 col-md-2 d-flex align-items-center justify-content-center'>
          <h1>or</h1>
        </div>
        <div className='col-12 col-md-5 p-5 d-flex flex-column  justify-content-start'>
          <h3>Search</h3>
          <p>non-Hayward Name, SKU, Part Number</p>
          <SkuSearch />
        </div>
      </div>
    </div>
  );
};

export default Home;