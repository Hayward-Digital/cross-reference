import React from 'react';
import { IS_LOCAL } from '../../config';
import './ItemCard.css';

const ItemCard = ({ item, onSelect }) => {
  const iconSrc = IS_LOCAL ? item.icon_local || item.logo_local : item.icon || item.logo;

  // Determinar las clases de columna basadas en el tipo de ítem
  const iconColumnClass = iconSrc ? (item.icon || item.icon_local ? 'col-2' : 'col-4') : 'col-12';
  const bodyClass = iconSrc ? (iconColumnClass === 'col-2' ? 'ps-0' : '') : '';

  // Determinar la clase de la imagen basada en el tipo de ítem
  const imgClassName = item.icon || item.icon_local ? 'icon-img' : 'img-fluid';

  return (
    <div className='col-12 col-md-6 col-lg-4 m-0 p-2'>
      <div className={`card item ${item.code}`} onClick={() => onSelect(item)}>
        <div className="row g-0">
          {iconSrc && (
            <div className={`${iconColumnClass} d-flex justify-content-center align-items-center p-3`}>
              <img src={iconSrc} alt={item.name} className={imgClassName} />
            </div>
          )}
          <div className={`col-${iconSrc ? (iconColumnClass === 'col-2' ? '10' : '8') : '12'} d-flex align-items-center`}>
            <div className={`card-body ${bodyClass}`}>
              <h5 className="card-title m-0">{item.name}</h5>
              {item.sku && (
                <p className="card-text m-0">Code: {item.sku}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;