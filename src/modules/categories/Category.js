import React from 'react';
import SelectionList from '../shared/SelectionList';
import categoriesData from './categories.json';

const Category = ({ onSelect }) => {
  return (
    <SelectionList
      data={categoriesData.categories}
      onSelect={onSelect}
      title="Category"
    />
  );
};

export default Category;