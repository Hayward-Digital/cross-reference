import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ItemCard from '../shared/ItemCard';
import seriesData from './series.json';
import categoriesData from '../categories/categories.json';
import manufacturersData from '../manufacturers/manufacturers.json';
import Pagination from '../../components/pagination/Pagination';

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

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const seriesPerPage = 12;
  const totalPages = Math.ceil(filteredSeries.length / seriesPerPage);
  const displayedSeries = filteredSeries.slice((currentPage - 1) * seriesPerPage, currentPage * seriesPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container-fluid mb-5">
      <div className="row">
        <div className="d-flex align-items-center">
          <img src={manufacturerLogo} alt={manufacturerName} className="img-fluid me-2 border" style={{ height: '100px' }} />
          <h4 className='ps-2'>{manufacturerName} <span className='fw-bold'>Series</span></h4>
        </div>
      </div>
      <div className="row d-flex flex-wrap p-2">
        {displayedSeries.length > 0 ? (
          displayedSeries.map(seriesItem => (
            <ItemCard
              key={seriesItem.id}
              item={seriesItem}
              onSelect={() => onSelectSeries(categoryCode, manufacturerCode, seriesItem.id)}
            />
          ))
        ) : (
          <div>No series found for the selected category and manufacturer.</div>
        )}
      </div>
      {filteredSeries.length > seriesPerPage && (
        <div className="row">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
};

export default Series;