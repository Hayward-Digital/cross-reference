import React from 'react';
import { useLocation } from 'react-router-dom';
import ManufacturerCard from './ManufacturerCard';
import manufacturersData from './manufacturers.json';
import categoriesData from '../categories/categories.json'; // Importar datos de categorías
import './Manufacturer.css';

const Manufacturer = ({ onSelectManufacturer }) => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const categoryCode = params.get('category');

  // Obtener la categoría seleccionada
  const selectedCategory = categoriesData.categories.find(category => category.code === categoryCode);

  if (!selectedCategory) {
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
      <div className="row d-flex flex-wrap p-2">
        {filteredManufacturers.map(manufacturer => (
          <ManufacturerCard
            key={manufacturer.id}
            manufacturer={manufacturer}
            onSelect={() => onSelectManufacturer(categoryCode, manufacturer)}
          />
        ))}
      </div>
    </div>
  );
};

export default Manufacturer;