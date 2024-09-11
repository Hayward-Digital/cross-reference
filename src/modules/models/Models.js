import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ItemCard from '../shared/ItemCard';
import modelsData from './models.json';
import seriesData from '../series/series.json';
import manufacturersData from '../manufacturers/manufacturers.json';
import Pagination from '../../components/pagination/Pagination';

const Models = ({ manufacturerName, manufacturerLogo, onSelectModel }) => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const seriesId = params.get('series');

  const series = seriesData.series.find(s => s.id === parseInt(seriesId));
  const manufacturer = manufacturersData.manufacturers.find(m => m.id === series?.manufacturerId);

  const filteredModels = modelsData.models.filter(
    (model) => model.seriesId === parseInt(seriesId)
  ).sort((a, b) => a.name.localeCompare(b.name));

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const modelsPerPage = 12;
  const totalPages = Math.ceil(filteredModels.length / modelsPerPage);
  const displayedModels = filteredModels.slice((currentPage - 1) * modelsPerPage, currentPage * modelsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container-fluid mb-5">
      <div className="row">
        <div className="d-flex align-items-center">
          <img src={manufacturerLogo} alt={manufacturerName} className="img-fluid me-2 border" style={{ height: '100px' }} />
          <h4 className='ps-2'>{manufacturerName} <span className='fw-bold'>Models</span></h4>
        </div>
      </div>
      <div className="row d-flex flex-wrap p-2">
        {displayedModels.length > 0 ? (
          displayedModels.map(model => (
            <ItemCard
              key={model.id}
              item={model}
              onSelect={() => onSelectModel(model)}
            />
          ))
        ) : (
          <div>No models found for the selected series.</div>
        )}
      </div>
      {filteredModels.length > modelsPerPage && (
        <div className="row">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
};

export default Models;