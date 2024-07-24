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

  return (
    <div className="tab-nav">
      <div className={getTabClassName('category')} onClick={() => handleTabClick('category')}>
        Category <span className="tab-subtitle">{categoryName}</span>
      </div>
      <div className={getTabClassName('manufacturer')} onClick={() => handleTabClick('manufacturer')}>
        Manufacturer <span className="tab-subtitle">{manufacturerName}</span>
      </div>
      <div className={getTabClassName('series')} onClick={() => handleTabClick('series')}>
        Series <span className="tab-subtitle">{seriesName}</span>
      </div>
      <div className={getTabClassName('model')} onClick={() => handleTabClick('model')}>
        Model <span className="tab-subtitle">{modelName}</span>
      </div>
    </div>
  );
};

export default TabNav;
