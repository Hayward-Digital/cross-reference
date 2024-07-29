import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Alternatives.css';
import modelsData from './models.json';
import mockData from './mockData.json'; // Importa el archivo JSON con los datos simulados
import categoriesData from '../categories/categories.json';
import manufacturersData from '../manufacturers/manufacturers.json';
import seriesData from '../series/series.json';

const Alternatives = ({ onRestart }) => {
  const { modelId } = useParams();
  const navigate = useNavigate();
  const [relatedModels, setRelatedModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const model = modelsData.models.find(model => model.id === parseInt(modelId));

  useEffect(() => {
    if (!model) {
      setLoading(false);
      setError('Model not found');
      return;
    }

    const fetchRelatedModels = async () => {
      try {
        const results = ['good', 'better', 'best'].map(key => {
          const sku = model.relatedModels[key];
          const result = mockData[sku]; // Usa los datos simulados
          if (!result) {
            throw new Error('Data not found for SKU: ' + sku);
          }
          return result;
        });
        setRelatedModels(results);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedModels();
  }, [model]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const category = categoriesData.categories.find(category => category.id === model.categoryId);
  const manufacturer = manufacturersData.manufacturers.find(manufacturer => manufacturer.id === model.manufacturerId);
  const series = seriesData.series.find(series => series.id === model.seriesId);

  return (
    <div className="alternatives-container">
      <h2 className='title mt-3 mb-5'>Our Best-in-Class Options</h2>
      <div className="flex-container">
        {relatedModels.map((relatedModel, index) => (
          <div key={index} className={`model-card ${['good', 'better', 'best'][index]} d-flex flex-wrap justify-content-center`}>
            <h3 className='d-flex justify-content-center align-items-center'>{['Good', 'Better', 'Best'][index]}</h3>
            <img src={`${relatedModel.media_gallery_entries[0]?.file}`} alt={relatedModel.name} />
            <h4>{relatedModel.name}</h4>
            <p>SKU: {relatedModel.sku}</p>
            <p className='description' dangerouslySetInnerHTML={{ __html: relatedModel.custom_attributes.find(attr => attr.attribute_code === 'description').value }}></p>
            <a className='rounded-pill' href={`/product/${relatedModel.custom_attributes.find(attr => attr.attribute_code === 'url_key').value}`} target="_blank" rel="noopener noreferrer">View Details</a>
          </div>
        ))}
      </div>
      <div className="col-12 p-5 mt-4 bg-light d-flex flex-wrap">
        <h3 className='w-100'>Current Product to Replace</h3>
        <p className='w-100'>The product you wish to replace is shown below. We have listed on top the alternatives for your selection</p>
        <div className='d-flex align-items-center'>
          <img src={manufacturer?.logo} alt={manufacturer?.name} className="manufacturer-logo p-3 bg-white rounded shadow-sm mb-3"/>
        </div>
        <div className='d-flex flex-column justify-content-center ps-3 flex-fill '>
          <p className='m-0'><strong>Category:</strong> {category?.name}</p>
          <p className='m-0'><strong>Manufacturer:</strong> {manufacturer?.name}</p>
          <p className='m-0'><strong>Series:</strong> {series?.name}</p>
          <p className='m-0'><strong>Model:</strong> {model?.name}</p>
        </div>
      </div>
    </div>
  );
};

export default Alternatives;