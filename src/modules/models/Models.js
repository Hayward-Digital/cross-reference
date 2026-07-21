import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ItemCard from '../shared/ItemCard';
import Pagination from '../../components/pagination/Pagination';
import { dataPromise } from '../../utils/api';
import { fetchAPI } from '../../utils/fetchApi';

const Models = ({ manufacturerName, manufacturerLogo, onSelectModel }) => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const seriesId = params.get('series');
  const manufacturerCode = params.get('manufacturer');
  const categoryCode = params.get('category');

  // States for fetched data
  const [models, setModels] = useState([]);
  const [manufacturer, setManufacturer] = useState(null);
  const [category, setCategory] = useState(null);
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch models, series, and manufacturer data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const preloadedData = await dataPromise;
        
        // Fetch manufacturer data
        const selectedManufacturer = preloadedData.manufacturers.find(manufacturer => manufacturer.code === manufacturerCode);
        const selectedCategory= preloadedData.categories.find(category => category.code === categoryCode);
        const selectedSeries= preloadedData.series.find(series => parseInt(series.id) === parseInt(seriesId));

        setManufacturer(selectedManufacturer);
        setCategory(selectedCategory);
        setSeries(selectedSeries);

        // Fetch models data
        const query = buildQuery([
          { field: "series_id", value: seriesId, condition_type: "eq" },
        ]);

        const modelsResponse = await fetchAPI('models', query);
        const modelData = await modelsResponse;

        const sortedModels = modelData ? modelData.models.sort((a, b) => a.name.localeCompare(b.name)) : [];

        setModels(sortedModels || []);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [seriesId]); // Dependency on seriesId ensures the effect re-runs if seriesId changes


  const buildQuery = (params) => {
    const searchParams = new URLSearchParams();
    params.forEach(({ field, value, condition_type }, index) => {
      searchParams.append(`searchCriteria[filterGroups][${index}][filters][0][field]`, field);
      searchParams.append(`searchCriteria[filterGroups][${index}][filters][0][value]`, value);
      searchParams.append(`searchCriteria[filterGroups][${index}][filters][0][condition_type]`, condition_type);
    });
    return searchParams.toString();
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const modelsPerPage = 12;
  const totalPages = Math.ceil(models.length / modelsPerPage);
  const displayedModels = models.slice((currentPage - 1) * modelsPerPage, currentPage * modelsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle loading and error states
  if (loading) return <div class="text-center">Loading...</div>;
  if (error) return <div class="text-center">Error: {error}</div>;

  return (
    <div className="container-fluid mb-5">
      <div className="row">
        <div className="d-flex align-items-center">
          <img
            src={manufacturerLogo || manufacturer?.logo}
            alt={manufacturerName || manufacturer?.name}
            className="img-fluid me-2 border"
            style={{ height: '100px' }}
          />
          <h4 className="ps-2">
            {manufacturerName || manufacturer?.name} <span className="fw-bold">Models</span>
          </h4>
        </div>
      </div>
      <div className="row d-flex flex-wrap p-2">
        {displayedModels.length > 0 ? (
          displayedModels.map((model) => (
            <ItemCard key={model.id} item={model} onSelect={() => onSelectModel(model,category,manufacturer,series)} />
          ))
        ) : (
          <div>No models found for the selected series.</div>
        )}
      </div>
      {models.length > modelsPerPage && (
        <div className="row">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
};

export default Models;