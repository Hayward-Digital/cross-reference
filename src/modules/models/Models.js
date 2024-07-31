import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ModelsCard from './ModelsCard';
import ModelDetails from './ModelDetails';
import modelsData from './models.json';
import seriesData from '../series/series.json'; // Importar datos de series
import manufacturersData from '../manufacturers/manufacturers.json'; // Importar datos de fabricantes
import Pagination from '../../components/pagination/Pagination';
import './Models.css';

const Models = ({ onSelectModel }) => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const seriesId = params.get('series');
  const [selectedModel, setSelectedModel] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const modelsPerPage = 12;

  useEffect(() => {
    setCurrentPage(1);
  }, [seriesId]);

  // Obtener el fabricante y la serie
  const series = seriesData.series.find(s => s.id === parseInt(seriesId));
  const manufacturer = manufacturersData.manufacturers.find(m => m.id === series?.manufacturerId);

  const filteredModels = modelsData.models.filter(
    (model) => model.seriesId === parseInt(seriesId)
  ).filter(
    (model) => searchTerm.length < 3 || 
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    model.sku.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.name.localeCompare(b.name));

  const totalPages = Math.ceil(filteredModels.length / modelsPerPage);
  const displayedModels = filteredModels.slice((currentPage - 1) * modelsPerPage, currentPage * modelsPerPage);

  const handleSelectModel = (model) => {
    if (Object.keys(model.additionalAttribute).length === 0) {
      onSelectModel(model);
    } else {
      setSelectedModel(model);
    }
  };

  const handleDeselectModel = () => {
    setSelectedModel(null);
  };

  const handleConfirmModel = () => {
    if (selectedModel) {
      onSelectModel(selectedModel);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedModel(null);
  };

  const startModel = (currentPage - 1) * modelsPerPage + 1;
  const endModel = Math.min(startModel + modelsPerPage - 1, filteredModels.length);

  return (
    <div className="container-fluid mb-5">
      <div className="row d-flex align-items-end">
        <div className="col-6 d-flex flex-wrap align-items-center">
          <img src={manufacturer?.logo} alt={manufacturer?.name} className="img-fluid me-2 border" style={{ height: '100px' }} />
          <div className='ps-2'>
            <h4 className='m-0'>{manufacturer?.name} <span className='fw-bold'>Models</span></h4>
            <p className='w-100 m-0'>We found {filteredModels.length} elements</p>
          </div>
        </div>
        <div className="col-6 d-flex justify-content-end">
          <div className="filter-container">
            <input
              type="text"
              placeholder="Filter..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <i className="bi bi-search"></i>
          </div>  
        </div>
      </div>
      <div className="row d-flex flex-wrap p-2">
        {displayedModels.map(model => (
          <ModelsCard
            key={model.id}
            model={model}
            isActive={selectedModel && selectedModel.id === model.id}
            onSelect={() => handleSelectModel(model)}
          />
        ))}
      </div>
      <div className="row">
        <div className='col-12'>
          {filteredModels.length > modelsPerPage && (
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          )}
        </div>
      </div>

      <div className='row'>
        {selectedModel && (
          <div className="model-details-overlay">
            <ModelDetails model={selectedModel} onDeselect={handleDeselectModel} onConfirm={handleConfirmModel} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Models;