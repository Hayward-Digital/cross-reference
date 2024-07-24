import React from 'react';
import { useParams } from 'react-router-dom';
import SeriesCard from './SeriesCard';
import seriesData from './series.json';
import categoriesData from '../categories/categories.json';
import manufacturersData from '../manufacturers/manufacturers.json';
import './Series.css';

const Series = ({ onSelectSeries }) => {
  const { categoryCode, manufacturerCode } = useParams();

  // Convert categoryCode and manufacturerCode to IDs
  const categoryId = categoriesData.categories.find(category => category.code === categoryCode)?.id;
  const manufacturerId = manufacturersData.manufacturers.find(manufacturer => manufacturer.code === manufacturerCode)?.id;

  console.log('Series component, categoryId and manufacturerId:', categoryId, manufacturerId);

  const filteredSeries = seriesData.series.filter(
    (seriesItem) => 
      seriesItem.categoryId === categoryId && 
      seriesItem.manufacturerId === manufacturerId
  ).sort((a, b) => a.name.localeCompare(b.name)); // Ordenar alfabéticamente por nombre

  console.log('Filtered Series:', filteredSeries);

  return (
    <div className="container-fluid mb-5">
      <div className="row"><h3>Select Series</h3></div>
      <div className="row d-flex flex-wrap p-2">
      {filteredSeries.length > 0 ? (
            filteredSeries.map(seriesItem => (
              <SeriesCard
                key={seriesItem.id}
                series={seriesItem}
                onSelect={() => onSelectSeries(categoryCode, manufacturerCode, seriesItem.id)}
              />
            ))
          ) : (
            <div>No se encontraron series para la categoría y fabricante seleccionados.</div>
          )}
      </div>
    </div>
  );
};

export default Series;
