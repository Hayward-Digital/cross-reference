import React from 'react';
import ItemCard from './ItemCard';
import './SelectionList.css';

const SelectionList = ({ data, onSelect, title }) => {
  return (
    <div className="container-fluid mb-5">
      <div className="row">
        {title && <h4>{title}</h4>}
      </div>
      <div className="row d-flex flex-wrap p-2">
        {data.map(item => (
          <ItemCard
            key={item.id}
            item={item}
            onSelect={() => onSelect(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default SelectionList;