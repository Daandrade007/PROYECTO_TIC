import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DetallesNodo = ({ nodoSeleccionado }) => {
  const [nodoData, setNodoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (nodoSeleccionado) {
      setLoading(true);
      axios.get(`http://localhost:5001/api/data?Nodo=${nodoSeleccionado}`)
        .then(response => {
          setNodoData(response.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error al cargar los datos del nodo:", err);
          setError('Error al cargar los datos del nodo');
          setLoading(false);
        });
    }
  }, [nodoSeleccionado]);

  if (loading) {
    return <div>Cargando datos del nodo...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h3>Detalles del Nodo {nodoSeleccionado}</h3>
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Mass PM2.5 Max</th>
            <th>Mass PM2.5 Min</th>
            <th>Mass PM2.5 Avg</th>
            <th>Mass PM10 Max</th>
            <th>Mass PM10 Min</th>
            <th>Mass PM10 Avg</th>
          </tr>
        </thead>
        <tbody>
          {nodoData.map((item, index) => (
            <tr key={index}>
              <td>{new Date(item.timestamp).toLocaleString()}</td>
              <td>{item.massPM2_5Max.toFixed(1)}</td>
              <td>{item.massPM2_5Min.toFixed(1)}</td>
              <td>{item.massPM2_5Avg.toFixed(1)}</td>
              <td>{item.massPM10_0Max.toFixed(1)}</td>
              <td>{item.massPM10_0Min.toFixed(1)}</td>
              <td>{item.massPM10_0Avg.toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DetallesNodo;
