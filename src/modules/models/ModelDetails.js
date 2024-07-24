import React, { useState } from 'react';
import './ModelDetails.css';

const ModelDetails = ({ model, onDeselect, onConfirm }) => {
  const [selectedAttributes, setSelectedAttributes] = useState({});

  const handleAttributeSelect = (attribute, value) => {
    setSelectedAttributes(prevState => ({
      ...prevState,
      [attribute]: prevState[attribute] === value ? null : value
    }));
  };

  const isAttributesSelected = () => {
    const attributeKeys = Object.keys(model.additionalAttribute);
    return attributeKeys.every(attr => selectedAttributes[attr]);
  };

  return (
    <div className="model-details">
      <h3>Options</h3>
      <p>For {model.name}</p>
      <div className='d-flex flex-wrap'>
      {Object.keys(model.additionalAttribute).map(attr => (
        <div key={attr} className='col-4 detailItem'>
            <h5>{attr}</h5>
            <div className="attribute-options">
            {model.additionalAttribute[attr].map(option => (
              
                <div
                  key={option}
                  className={`attribute-option ${selectedAttributes[attr] === option ? 'selected' : ''}`}
                  onClick={() => handleAttributeSelect(attr, option)}
                >
                  {option}
                </div>

            ))}
          </div>
        </div>
      ))}
      </div>
      <button onClick={onDeselect}>Back</button>
      <button
        onClick={onConfirm}
        disabled={!isAttributesSelected()}
      >
        Confirm
      </button>
    </div>
  );
};

export default ModelDetails;
