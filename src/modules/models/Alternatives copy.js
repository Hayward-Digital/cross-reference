import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Alternatives.css';
import modelsData from './models.json';

const Alternatives = ({ onRestart }) => {
  const { modelId } = useParams();
  const navigate = useNavigate();

  const model = modelsData.models.find(model => model.id === parseInt(modelId));

  if (!model) {
    return <div>No se encontraron alternativas para este modelo.</div>;
  }

  const relatedModels = ['good', 'better', 'best'].map(key => {
    return modelsData.models.find(m => m.id === model.relatedModels[key]);
  });

  const handleRestart = () => {
    onRestart();
    navigate('/');
  };

  return (
    <div className="alternatives-container">
      <h2>HAYWARD Alternatives</h2>
      <div className="flex-container">
        {relatedModels.map((relatedModel, index) => (
          <div key={index} className={`model-card ${['good', 'better', 'best'][index]}`}>
            <h3>{['Good', 'Better', 'Best'][index]}</h3>
            <img src={`/images/${relatedModel.image}`} alt={relatedModel.name} />
            <h4>{relatedModel.name}</h4>
            <p>SKU: {relatedModel.sku}</p>
            <p>{relatedModel.description}</p>
            <a href={relatedModel.productDetailUrl} target="_blank" rel="noopener noreferrer">View Details</a>
          </div>
        ))}
      </div>
      <button onClick={handleRestart}>Start Again</button>
    </div>
  );
};

export default Alternatives;
