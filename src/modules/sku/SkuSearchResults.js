import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ModelsCard from '../models/ModelsCard';
import modelsData from '../models/models.json';
import Pagination from '../../components/pagination/Pagination';
import './SkuSearch.css';

const SkuSearchResults = ({ onSelectModel }) => {
  const { sku } = useParams();
  const navigate = useNavigate();

  const filteredModels = modelsData.models.filter(model => 
    (model.sku && typeof model.sku === 'string' && model.sku.toLowerCase().includes(sku.toLowerCase())) ||
    (model.name && typeof model.name === 'string' && model.name.toLowerCase().includes(sku.toLowerCase()))
  );

  const [currentPage, setCurrentPage] = useState(1);
  const modelsPerPage = 12;

  const totalPages = Math.ceil(filteredModels.length / modelsPerPage);
  const displayedModels = filteredModels.slice((currentPage - 1) * modelsPerPage, currentPage * modelsPerPage);

  if (filteredModels.length === 0) {
    return <div>No models found for: {sku}</div>;
  }

  const handleSelectModel = (selectedModel) => {
    navigate(`/sku/${selectedModel.id}/alternatives`);
    onSelectModel(selectedModel);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container-fluid mb-5 mt-5">
      <div className="row">
        <h4>Your search: <span className='fw-bold'>{sku}</span></h4>
      </div>
      <div className="row d-flex flex-wrap p-2">
        {displayedModels.map(model => (
          <ModelsCard
            key={model.id}
            model={model}
            isActive={false}
            onSelect={() => handleSelectModel(model)}
          />
        ))}
      </div>
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default SkuSearchResults;