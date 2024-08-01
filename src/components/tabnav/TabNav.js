import React from 'react';
import './TabNav.css';

const TabNav = ({ activeTab, category, manufacturer, series, model, categoryName, manufacturerName, seriesName, modelName, handleTabClick }) => {

  const getTabClassName = (tab) => {
    return `tab-item ${activeTab === tab ? 'active' : ''} ${!isTabEnabled(tab) ? 'disabled' : ''}`;
  };

  const isTabEnabled = (tab) => {
    if (tab === 'manufacturer') return !!category;
    if (tab === 'series') return !!manufacturer;
    if (tab === 'model') return !!series;
    if (tab === 'alternative') return !!model;
    return true;
  };

  const handleClick = (tab) => {
    if (isTabEnabled(tab)) {
      handleTabClick(tab);
    }
  };

  const handleBackClick = () => {
    if (activeTab === 'category') {
      handleTabClick('home');
    } else if (activeTab === 'manufacturer') {
      handleTabClick('category');
    } else if (activeTab === 'series') {
      handleTabClick('manufacturer');
    } else if (activeTab === 'model') {
      handleTabClick('series');
    } else if (activeTab === 'alternative') {
      handleTabClick('model');
    }
  };

  return (
    <div className="tab-nav">
      <div className="back-button" onClick={handleBackClick}>
        &larr;
      </div>
      <div className={getTabClassName('category')} onClick={() => handleClick('category')}>
        Category <span className="tab-subtitle">{categoryName}</span>
      </div>
      <div className={getTabClassName('manufacturer')} onClick={() => handleClick('manufacturer')}>
        Manufacturer <span className="tab-subtitle">{manufacturerName}</span>
      </div>
      <div className={getTabClassName('series')} onClick={() => handleClick('series')}>
        Series <span className="tab-subtitle">{seriesName}</span>
      </div>
      <div className={getTabClassName('model')} onClick={() => handleClick('model')}>
        Model <span className="tab-subtitle">{modelName}</span>
      </div>
    </div>
  );
};

export default TabNav;