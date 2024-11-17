// src/components/DataCard.js
import React from 'react';
import './DataCard.css'; // Agregamos el archivo de estilos

const DataCard = ({ nodo }) => {
  return (
    <div className="data-card">
      <div className="card-body">
        <h5 className="card-title">Nodo {nodo}</h5>
        <p className="card-description">Información sobre el nodo {nodo}...</p>
      </div>
    </div>
  );
};

export default DataCard;
