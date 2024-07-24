// src/components/footer/Footer.js
import React from 'react';
import './Footer.css'; // Si tienes estilos específicos para el footer

const Footer = () => (
  <div className="container-fluid mb-5">
      <div className="col-12 pt-3 footer">
        <h3>NEED HELP?</h3>
        <p>Can't find your current model? <button onClick={() => alert('Contact us!')} className="link-button">Contact us</button></p>
    </div>
  </div>
);

export default Footer;
