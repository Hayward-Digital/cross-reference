import React from 'react';
import { useParams } from 'react-router-dom';
import ManufacturerCard from './ManufacturerCard';
import manufacturersData from './manufacturers.json';
import './Manufacturer.css';

const Manufacturer = ({ onSelectManufacturer }) => {
  const { categoryCode } = useParams();
  const selectedCategory = manufacturersData.manufacturers
    .flatMap(manufacturer => manufacturer.categories)
    .find(category => category.code === categoryCode);

  if (!selectedCategory) {
    return <div>Categoría no encontrada.</div>;
  }

  const filteredManufacturers = manufacturersData.manufacturers
    .filter(manufacturer =>
      manufacturer.categories.some(cat => cat.code === selectedCategory.code && cat.active)
    )
    .sort((a, b) => a.name.localeCompare(b.name)); // Ordenar alfabéticamente por nombre

  return (
    <div className="container-fluid mb-5">
      <div className="row"><h3>Select Manufacturer</h3></div>
      <div className="row d-flex flex-wrap p-2">
      {filteredManufacturers.map(manufacturer => (
          <ManufacturerCard
            key={manufacturer.id}
            manufacturer={manufacturer}
            onSelect={() => onSelectManufacturer(categoryCode, manufacturer.code)}
          />
        ))}
      </div>
    </div>
  );
};

export default Manufacturer;
