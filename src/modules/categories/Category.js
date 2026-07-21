import React, { useState, useEffect } from 'react';
import SelectionList from '../shared/SelectionList';
import { dataPromise } from '../../utils/api';

const Category = ({ onSelect }) => {
  const [categories, setCategories] = useState([]); // State to hold categories data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true); // Start loading
        const preloadedData = await dataPromise; // Access preloaded data
        setCategories(preloadedData.categories || []); // Set categories data
      } catch (err) {
        setError(err.message); // Handle errors
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchCategories();
  }, []); // Empty dependency array ensures the effect runs once on mount

  if (loading) {
    return <div class="text-center">Loading categories...</div>;
  }

  if (error) {
    return <div class="text-center">Error: {error}</div>;
  }

  return (
    <SelectionList
      data={categories}
      onSelect={onSelect}
      title="Category"
    />
  );
};

export default Category;