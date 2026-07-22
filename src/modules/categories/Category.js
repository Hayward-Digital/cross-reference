import React, { useState, useEffect } from 'react';
import SelectionList from '../shared/SelectionList';
import { dataPromise } from '../../utils/api';
import { STORE_SUFFIX, ALL_STORE_SUFFIXES } from '../../config';

const Category = ({ onSelect }) => {
  const [categories, setCategories] = useState([]); // State to hold categories data
  const [loading, setLoading] = useState(true); // State to handle loading
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true); // Start loading
        const preloadedData = await dataPromise; // Access preloaded data
        let fetchedCategories = preloadedData.categories || [];
        
        let filtered = [];
        if (STORE_SUFFIX) {
          filtered = fetchedCategories.filter(c => c.code && c.code.toUpperCase().endsWith(STORE_SUFFIX.toUpperCase()));
        } else {
          filtered = fetchedCategories.filter(c => c.code && !ALL_STORE_SUFFIXES.some(suffix => c.code.toUpperCase().endsWith(suffix.toUpperCase())));
        }
        
        setCategories(filtered); // Set categories data
      } catch (err) {
        setError(err.message); // Handle errors
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchCategories();
  }, []); // Empty dependency array ensures the effect runs once on mount

  if (loading) {
    return <div className="text-center">Loading categories...</div>;
  }

  if (error) {
    return <div className="text-center">Error: {error}</div>;
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