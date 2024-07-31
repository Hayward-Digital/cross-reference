import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './Alternatives.css';
import modelsData from './models.json';
import mockData from './mockData.json'; // Importa el archivo JSON con los datos simulados
import categoriesData from '../categories/categories.json';
import manufacturersData from '../manufacturers/manufacturers.json';
import seriesData from '../series/series.json';

// Variable para alternar entre mockData y API
const USE_MOCK_DATA = false; // Cambia esto a true para usar los datos simulados

const fetchHaywardProduct = async (sku) => {
  try {
    console.log("Fetching SKU:", sku);
    const response = await fetch(
      `https://mcstaging.hayward.com/rest/default/V1/products?searchCriteria[filterGroups][0][filters][0][field]=sku&searchCriteria[filterGroups][0][filters][0][value]=${sku}`,
      {
        headers: {
          Authorization: "Bearer 3b5kg5eu34t3gdmkiph3m1aqcgun8cu6",
        },
      }
    );
    console.log("Response status:", response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.log("Response text:", errorText);
      throw new Error('Network response was not ok');
    }
    const result = await response.json();
    return result.items[0]; // Asumiendo que la respuesta contiene un array llamado "items"
  } catch (error) {
    console.error("Fetch error: ", error);
    throw error;
  }
};

const truncateDescription = (description, maxLength) => {
  if (description.length <= maxLength) return description;
  return description.slice(0, maxLength) + '...';
};

const Alternatives = ({ onRestart }) => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const modelId = params.get('model');
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
        const results = await Promise.all(
          ['good', 'better', 'best'].map(async key => {
            const sku = model.relatedModels[key];
            if (sku && sku.trim()) {
              try {
                if (USE_MOCK_DATA) {
                  const result = mockData[sku.trim()]; // Usa los datos simulados
                  if (!result) {
                    throw new Error('Please try other product');
                  }
                  return { key, result };
                } else {
                  const result = await fetchHaywardProduct(sku.trim()); // Usa la API
                  if (!result) {
                    throw new Error('Please try other product');
                  }
                  return { key, result };
                }
              } catch (err) {
                return { key, error: err.message };
              }
            }
            return null;
          })
        );
        const filteredResults = results.filter(result => result !== null);
        if (filteredResults.length === 0) {
          throw new Error('No related models found.');
        }

        // Ensure best is always present
        if (!filteredResults.some(({ key }) => key === 'best')) {
          if (filteredResults.length === 1) {
            filteredResults[0].key = 'best';
          } else if (filteredResults.length === 2) {
            filteredResults[1].key = 'best';
            filteredResults[0].key = 'better';
          }
        } else if (filteredResults.length === 2) {
          filteredResults[1].key = 'best';
          filteredResults[0].key = 'better';
        }
        setRelatedModels(filteredResults);
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
        {relatedModels.map(({ key, result, error }, index) => {
          if (error) {
            return (
              <div key={index} className={`col-12 col-md-3 model-card ${key} d-flex flex-wrap justify-content-center`}>
                <h3 className='d-flex justify-content-center align-items-center'>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
                <p>{error}</p>
              </div>
            );
          }

          const descriptionAttribute = result.custom_attributes.find(attr => attr.attribute_code === 'marketing_short_description');
          const description = descriptionAttribute ? descriptionAttribute.value : 'No description available';
          const truncatedDescription = truncateDescription(description, 150); // Limita la descripción a 150 caracteres

          return (
            <div key={index} className={`col-12 col-md-3 model-card ${key} d-flex flex-wrap justify-content-center`}>
              <h3 className='d-flex justify-content-center align-items-center'>{key.charAt(0).toUpperCase() + key.slice(1)}</h3>
              <img src={`/media/catalog/product/${result.media_gallery_entries[0]?.file}`} alt={result.name} />
              <h4>{result.name}</h4>
              <p>SKU: {result.sku}</p>
              <p className='description'>{truncatedDescription}</p>
              <a 
                className='rounded-pill' 
                href={`../../../../../${result.custom_attributes.find(attr => attr.attribute_code === 'url_key')?.value || '#'}-${result.sku}.html`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                View Details
              </a>
            </div>
          );
        })}
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