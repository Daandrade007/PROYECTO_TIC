// src/components/Sidebar.js
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt,   // Panel de control
  faChartLine,       // Métricas
  faChartBar         // Gráficos
} from '@fortawesome/free-solid-svg-icons';
import './Sidebar.css';  // Archivo de estilos
import logo from './logoWeb.jpg';  // Tu logo aquí

const Sidebar = ({ onChangeView }) => {
  return (
    <div className="sidebar">
      <img src={logo} alt="Logo" className="logo" />
      <ul>
        <li>
          <a href="#panel" onClick={() => onChangeView('panel')}>
            <FontAwesomeIcon icon={faTachometerAlt} />
            <span> Panel de Control</span>
          </a>
        </li>
        <li>
          <a href="#calendario" onClick={() => onChangeView('calendario')}>
            <FontAwesomeIcon icon={faChartLine} />
            <span> Métricas</span>
          </a>
        </li>
        <li>
          <a href="#graficos" onClick={() => onChangeView('graficos')}>
            <FontAwesomeIcon icon={faChartBar} />
            <span> Gráficos</span>
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
