import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Alternatives.css';
import modelsData from './models.json';
import mockData from './mockData.json'; // Importa el archivo JSON con los datos simulados

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

  const handleRestart = () => {
    onRestart();
    navigate('/');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="alternatives-container">
      <h2 className='title'>Best-in-Class Hayward Options</h2>
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
      <div className='d-flex justify-content-center mt-5'>
      <button className='btn btn-dark rounded-pill px-5 py-3' onClick={handleRestart}>NEW SEARCH</button>
      </div>
    </div>
  );
};

export default Alternatives;
