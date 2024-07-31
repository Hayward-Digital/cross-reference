import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Footer.css';

const Footer = ({ onRestart }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleRestart = () => {
    onRestart();
    navigate('/');
  };

  const isHome = location.pathname === '/' && !location.search;

  return (
    <div className="footer d-flex align-items-center py-2 px-4">
     
      <div className="col-6 need-help">
        <h3>NEED HELP?</h3>
        <p>Can't find your current model? <button className="link-button">Contact us</button></p>
      </div>
      {!isHome && (
        <div className='col-6 d-flex justify-content-end px-2'>
          <button className='btn btn-light rounded-pill px-5 py-3' onClick={handleRestart}>
            Start Again
            <img src="/media/wysiwyg/cms/tools/cross-reference/start-again.png" alt="Start Again" className="ms-3" style={{ width: '16px', height: '16px' }} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Footer;