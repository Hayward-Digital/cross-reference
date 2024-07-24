import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ModelsCard from './ModelsCard';
import ModelDetails from './ModelDetails';
import modelsData from './models.json';
import './Models.css';

const Models = ({ onSelectModel }) => {
  const { seriesId } = useParams();
  const [selectedModel, setSelectedModel] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const modelsPerPage = 12; // Número de modelos por página

  useEffect(() => {
    setCurrentPage(1); // Resetear a la primera página al cambiar de serie
  }, [seriesId]);

  const filteredModels = modelsData.models.filter(
    (model) => model.seriesId === parseInt(seriesId)
  ).filter(
    (model) => searchTerm.length < 3 || 
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    model.sku.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => a.name.localeCompare(b.name)); // Ordenar alfabéticamente por nombre

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
    setCurrentPage(1); // Resetear a la primera página en cada búsqueda
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedModel(null); // Deseleccionar modelo al cambiar de página
  };

  const startModel = (currentPage - 1) * modelsPerPage + 1;
  const endModel = Math.min(startModel + modelsPerPage - 1, filteredModels.length);

  return (
    <div className="container-fluid mb-5">
      <div className="row d-flex align-items-end">
        <div className="col-6">
          <h3>Select Model</h3>
          <p>We find {filteredModels.length} elements</p>
        </div>
        <div className="col-6 d-flex justify-content-end">
          <div className="filter-container">
            <input
              type="text"
              placeholder="Search..."
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
            <div className="pagination">
              <span>This page: {startModel} - {endModel} of {filteredModels.length}</span>
              <div>
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={currentPage === index + 1 ? 'active' : ''}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
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
