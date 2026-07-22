import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ItemCard from '../shared/ItemCard';
import Pagination from '../../components/pagination/Pagination';
import { dataPromise } from '../../utils/api';

const Series = ({ manufacturerName, manufacturerLogo, onSelectSeries }) => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const categoryCode = params.get('category');
  const manufacturerCode = params.get('manufacturer');

  // States for fetched data
  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [manufacturer, setManufacturer] = useState([]);
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories, manufacturers, and series data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const preloadedData = await dataPromise;

        // Fetch categories
        setCategories(preloadedData.categories || []);
        setManufacturers(preloadedData.manufacturers || []);
        setManufacturer(preloadedData.manufacturers.find(manufacturer => manufacturer.code === manufacturerCode));
        setSeries(preloadedData.series || []);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures this runs once on mount

  // Get categoryId and manufacturerId
  const categoryId = categories.find(category => category.code === categoryCode)?.id;
  const manufacturerId = parseInt(manufacturers.find(manufacturer => manufacturer.code === manufacturerCode)?.id);

  // Filter series data
  const filteredSeries = series
    .filter(
      (seriesItem) =>
        seriesItem.categoryId === categoryId &&
        seriesItem.manufacturerId === manufacturerId
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const seriesPerPage = 12;
  const totalPages = Math.ceil(filteredSeries.length / seriesPerPage);
  const displayedSeries = filteredSeries.slice(
    (currentPage - 1) * seriesPerPage,
    currentPage * seriesPerPage
  );

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
            src={manufacturer?.logo}
            alt={manufacturer?.name}
            className="img-fluid me-2 border"
            style={{ height: '100px' }}
          />
          <h4 className="ps-2">
            {manufacturer?.name} <span className="fw-bold">Series</span>
          </h4>
        </div>
      </div>
      <div className="row d-flex flex-wrap p-2">
        {displayedSeries.length > 0 ? (
          displayedSeries.map((seriesItem) => (
            <ItemCard
              key={seriesItem.id}
              item={seriesItem}
              onSelect={() =>
                onSelectSeries(categoryCode, manufacturerCode, seriesItem,manufacturer)
              }
            />
          ))
        ) : (
          <div>No series found for the selected category and manufacturer.</div>
        )}
      </div>
      {filteredSeries.length > seriesPerPage && (
        <div className="row">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Series;
``