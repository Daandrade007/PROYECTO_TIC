import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Importamos useNavigate para redirigir

const DataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Función para cargar los datos
  useEffect(() => {
    axios.get('http://localhost:5001/api/data')
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error al cargar los datos:", err);
        setError('Error al cargar los datos');
        setLoading(false);
      });
  }, []);

  // Función para formatear el timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // Función para redondear los datos a un solo decimal
  const formatDataWithDecimal = (value) => {
    return value !== null && value !== undefined ? value.toFixed(1) : '-';  // Verifica si el valor es válido
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');  // Eliminar el flag de autenticación
    navigate('/');  // Redirigir al login
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Datos del Sensor</h2>
      <button onClick={handleLogout}>Cerrar sesión</button>
      <table border="1">
        <thead>
          <tr>
            <th>Nodo</th>
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
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.Nodo}</td>
              <td>{formatDate(item.timestamp)}</td> {/* Mostrar el timestamp formateado */}
              <td>{formatDataWithDecimal(item.massPM2_5Max)}</td> {/* Mostrar Mass PM2.5 Max con un decimal */}
              <td>{formatDataWithDecimal(item.massPM2_5Min)}</td> {/* Mostrar Mass PM2.5 Min con un decimal */}
              <td>{formatDataWithDecimal(item.massPM2_5Avg)}</td> {/* Mostrar Mass PM2.5 Avg con un decimal */}
              <td>{formatDataWithDecimal(item.massPM10_0Max)}</td> {/* Mostrar Mass PM10 Max con un decimal */}
              <td>{formatDataWithDecimal(item.massPM10_0Min)}</td> {/* Mostrar Mass PM10 Min con un decimal */}
              <td>{formatDataWithDecimal(item.massPM10_0Avg)}</td> {/* Mostrar Mass PM10 Avg con un decimal */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
