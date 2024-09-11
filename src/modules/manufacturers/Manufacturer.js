import React from 'react';
import { useLocation } from 'react-router-dom';
import manufacturersData from './manufacturers.json';
import categoriesData from '../categories/categories.json';
import SelectionList from '../shared/SelectionList';

const Manufacturer = ({ onSelectManufacturer }) => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const categoryCode = params.get('category');

  // Obtener la categoría seleccionada
  const selectedCategory = categoriesData.categories.find(category => category.code === categoryCode);

  if (!selectedCategory) {
    console.error("Category not found");
    return <div>Category not found.</div>;
  }

  const filteredManufacturers = manufacturersData.manufacturers
    .filter(manufacturer =>
      manufacturer.categories.some(cat => cat.code === categoryCode && cat.active)
    )
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="container-fluid mb-5">
      <div className="row">
        <div className="col-10 d-flex align-items-center">
          <h4>Select {selectedCategory.name} <span className='fw-bold'>Manufacturers</span></h4>
        </div>
      </div>
      <SelectionList
        data={filteredManufacturers}
        onSelect={(manufacturer) => onSelectManufacturer(categoryCode, manufacturer)}
        title={null}  // Eliminar el título "Select Manufacturers"
      />
    </div>
  );
};

export default Manufacturer;