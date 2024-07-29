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
    <div className="container-fluid my-5 py-5">
      <div className="row d-flex flex-wrap">
        <div className='col-5 p-5 d-flex flex-column justify-content-center align-items-end'>
          <h3>Guided search</h3>
          <p className='text-end'>We will guide you to find your current product and show you the best alternatives to improve your pool</p>
          <button className="btn btn-dark px-5 py-3 rounded-pill" onClick={handleCategoryClick}>Let's start</button>
        </div>
        <div className='col-2 d-flex align-items-center justify-content-center'>
          <h1>or</h1>
        </div>
        <div className='col-5 p-5 d-flex align-items-center justify-content-start'>
          <SkuSearch />
        </div>
      </div>
    </div>
  );
};

export default Home;