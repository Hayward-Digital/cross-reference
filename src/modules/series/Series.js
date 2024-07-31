import React from 'react';
import { useLocation } from 'react-router-dom';
import SeriesCard from './SeriesCard';
import seriesData from './series.json';
import categoriesData from '../categories/categories.json';
import manufacturersData from '../manufacturers/manufacturers.json';
import './Series.css';

const Series = ({ manufacturerName, manufacturerLogo, onSelectSeries }) => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const categoryCode = params.get('category');
  const manufacturerCode = params.get('manufacturer');

  const categoryId = categoriesData.categories.find(category => category.code === categoryCode)?.id;
  const manufacturerId = manufacturersData.manufacturers.find(manufacturer => manufacturer.code === manufacturerCode)?.id;

  const filteredSeries = seriesData.series.filter(
    (seriesItem) => 
      seriesItem.categoryId === categoryId && 
      seriesItem.manufacturerId === manufacturerId
  ).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="container-fluid mb-5">
      <div className="row">
        <div className="d-flex align-items-center">
          <img src={manufacturerLogo} alt={manufacturerName} className="img-fluid me-2 border" style={{ height: '100px' }} />
          <h4 className='ps-2'>{manufacturerName} <span className='fw-bold'>Series</span></h4>
        </div>
      </div>
      <div className="row d-flex flex-wrap p-2">
        {filteredSeries.length > 0 ? (
          filteredSeries.map(seriesItem => (
            <SeriesCard
              key={seriesItem.id}
              series={seriesItem}
              onSelect={() => onSelectSeries(categoryCode, manufacturerCode, seriesItem.id)}
            />
          ))
        ) : (
          <div>No series found for the selected category and manufacturer.</div>
        )}
      </div>
    </div>
  );
};

export default Series;