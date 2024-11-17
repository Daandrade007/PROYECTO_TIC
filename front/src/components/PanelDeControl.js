// src/components/PanelDeControl.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Asegúrate de que Bootstrap está instalado
import DataCard from './DataCard'; // Importamos el componente DataCard

const PanelDeControl = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nodosCriticos, setNodosCriticos] = useState([]);
  const navigate = useNavigate();

  // Cargar los datos desde la API al cargar el componente
  useEffect(() => {
    axios.get('http://localhost:5001/api/data')
      .then(response => {
        setData(response.data);
        setLoading(false);
        identificarNodosCriticos(response.data); // Llamamos a la función que identifica los nodos críticos
      })
      .catch(err => {
        console.error("Error al cargar los datos:", err);
        setError('Error al cargar los datos');
        setLoading(false);
      });
  }, []);

  // Función para identificar nodos críticos
  const identificarNodosCriticos = (data) => {
    const nodosCriticos = [];
    // Establecemos los umbrales para PM2.5 y PM10
    const umbralPM25 = 35.5; // Umbral de PM2.5 (Insalubre para personas sensibles)
    const umbralPM10 = 150.4; // Umbral de PM10 (Insalubre para personas sensibles)

    // Agrupamos los datos por nodo y calculamos el promedio
    const nodos = data.reduce((acc, item) => {
      if (!acc[item.Nodo]) {
        acc[item.Nodo] = { pm25Total: 0, pm10Total: 0, count: 0 };
      }
      acc[item.Nodo].pm25Total += item.massPM2_5Avg || 0;
      acc[item.Nodo].pm10Total += item.massPM10_0Avg || 0;
      acc[item.Nodo].count += 1;
      return acc;
    }, {});

    // Verificamos si el promedio de PM2.5 o PM10 supera los umbrales
    for (const [nodo, valores] of Object.entries(nodos)) {
      const avgPM25 = valores.pm25Total / valores.count;
      const avgPM10 = valores.pm10Total / valores.count;

      if (avgPM25 > umbralPM25 || avgPM10 > umbralPM10) {
        nodosCriticos.push({ nodo, avgPM25, avgPM10 });
      }
    }

    setNodosCriticos(nodosCriticos);  // Actualizamos el estado con los nodos críticos
  };

  // Función de cierre de sesión
  const cerrarSesion = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Extraer nodos únicos para mostrar las tarjetas
  const nodosUnicos = [...new Set(data.map(item => item.Nodo))];

  // Ordenar los nodos manualmente
  const nodosOrdenadosManualmente = [
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", 
    "11", "12", "13", "14", "15", "16", "17"
  ];

  return (
    <div>
      <h2>Panel de Control - Nodos</h2>
    
      <div className="row">
        {nodosOrdenadosManualmente.map((nodo, index) => (
          <div className="col-md-3 mb-3" key={index}>
            <DataCard nodo={nodo} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PanelDeControl;
