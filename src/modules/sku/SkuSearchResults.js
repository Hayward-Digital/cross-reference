import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ItemCard from '../shared/ItemCard';
import Pagination from '../../components/pagination/Pagination';
import { dataPromise } from '../../utils/api';
import { fetchAPI } from '../../utils/fetchApi';
import './SkuSearch.css';

const SkuSearchResults = ({ onSelectModel }) => {
  const [searchParams] = useSearchParams();
  const sku = searchParams.get('sku') || '';
  const navigate = useNavigate(); 
  // States for fetched data
  const [models, setModels] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [series, setSeries] = useState(null);
  const [categories, setCategory] = useState(null);
  const [manufacturers, setManufacturer] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const preloadedData = await dataPromise;

        const query = buildQuery([
          { field: "sku", value: `%${sku.toLowerCase()}%`, condition_type: "like" },
          { field: "name", value: `%${sku.toLowerCase()}%`, condition_type: "like" },
        ]);

        const modelsResponse = await fetchAPI('models', query);
        const modelData = await modelsResponse;

        // Set models in state
        setModels(modelData.models);
        setFilteredModels(modelData.models ?? []);
        setSeries(preloadedData.series  ?? []);
        setCategory(preloadedData.categories  ?? []);
        setManufacturer(preloadedData.manufacturers  ?? []);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sku]); // Dependency on SKU ensures the effect re-runs if SKU changes

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const modelsPerPage = 12;
  const totalPages = Math.ceil(filteredModels.length / modelsPerPage);
  const displayedModels = filteredModels.slice((currentPage - 1) * modelsPerPage, currentPage * modelsPerPage);


  const buildQuery = (params) => {
    const searchParams = new URLSearchParams();
    params.forEach(({ field, value, condition_type }, index) => {
      searchParams.append(`searchCriteria[filterGroups][${index}][filters][0][field]`, field);
      searchParams.append(`searchCriteria[filterGroups][${index}][filters][0][value]`, value);
      searchParams.append(`searchCriteria[filterGroups][${index}][filters][0][condition_type]`, condition_type);
    });
    return searchParams.toString();
  };
  


  const handleSelectModel = (selectedModel) => {
    navigate(`/?tab=alternative&model=${selectedModel.id}`);
    onSelectModel(selectedModel,categories,manufacturers, series);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  // Handle loading and error states
  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center">Error: {error}</div>;

  return (
    <div className="container-fluid mb-5 mt-5">
      <div className="row">
        <h4>Your search: <span className="fw-bold">{sku}</span></h4>
      </div>
      <div className="row d-flex flex-wrap p-2">
        {displayedModels.length > 0 ? (
          displayedModels.map((model) => (
            <ItemCard
              key={model.id}
              item={model}
              onSelect={() => handleSelectModel(model)}
            />
          ))
        ) : (
          <div>No models found for: {sku}</div>
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

export default SkuSearchResults;