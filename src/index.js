import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './index.css';

ReactDOM.render(
  <BrowserRouter basename="/cross-reference">
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);