import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SelectionList from '../shared/SelectionList';
import { dataPromise } from '../../utils/api';
import { STORE_SUFFIX, ALL_STORE_SUFFIXES } from '../../config';

const Manufacturer = ({ onSelectManufacturer }) => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const categoryCode = params.get('category');

  // States for fetched data
  const [categories, setCategories] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories and manufacturers data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch categories
        const preloadedData = await dataPromise; // Access preloaded data
        setCategories(preloadedData.categories || []);
        // Fetch manufacturers
        setManufacturers(preloadedData.manufacturers || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array ensures the effect runs once on mount

  // Get selected category
  const selectedCategory = categories.find(category => category.code === categoryCode);

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center">Error: {error}</div>;
  }

  if (!selectedCategory) {
    console.error("Category not found");
    return <div>Category not found.</div>;
  }

  // Filter manufacturers based on the selected category and store suffix
  let filteredManufacturers = manufacturers.filter(manufacturer => {
    // 1. Check store suffix match
    let isStoreMatch = false;
    if (STORE_SUFFIX) {
      isStoreMatch = manufacturer.code && manufacturer.code.toUpperCase().endsWith(STORE_SUFFIX.toUpperCase());
    } else {
      isStoreMatch = manufacturer.code && !ALL_STORE_SUFFIXES.some(suffix => manufacturer.code.toUpperCase().endsWith(suffix.toUpperCase()));
    }
    
    if (!isStoreMatch) return false;
    
    // 2. Check category association match
    return manufacturer.categories.some(cat => cat.code === categoryCode && cat.active);
  }).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="container-fluid mb-5">
      <div className="row">
        <div className="col-10 d-flex align-items-center">
          <h4>Select {selectedCategory?.name} <span className="fw-bold">Manufacturers</span></h4>
        </div>
      </div>
      <SelectionList
        data={filteredManufacturers}
        onSelect={(manufacturer) => onSelectManufacturer(categoryCode, manufacturer)}
        title={null}  // Remove "Select Manufacturers" title
      />
    </div>
  );
};

export default Manufacturer;