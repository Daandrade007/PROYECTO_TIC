import React, { useState, useEffect } from 'react';
import './Home.css';
import Sidebar from './Sidebar';
import Header from './Header';
import PanelDeControl from './PanelDeControl';
import Graficos from './Graficos';
import Calendario from './Calendario';

const Home = ({ isLoggedIn, username, handleLogout }) => {
  const [vistaSeleccionada, setVistaSeleccionada] = useState(() => {
    const vistaGuardada = localStorage.getItem('vistaSeleccionada');
    return vistaGuardada ? vistaGuardada : 'panel';
  });

  useEffect(() => {
    localStorage.setItem('vistaSeleccionada', vistaSeleccionada);
  }, [vistaSeleccionada]);

  const renderizarContenido = () => {
    switch (vistaSeleccionada) {
      case 'panel':
        return <PanelDeControl />;
      case 'graficos':
        return <Graficos />;
      case 'calendario':
        return <Calendario />;
      default:
        return <PanelDeControl />;
    }
  };

  return (
    <div className="home-container">
      <Sidebar onChangeView={setVistaSeleccionada} />
      <div className="main-content">
        <Header setLoggedIn={handleLogout} username={username} />
        <div className="content-container">
          <h2>{vistaSeleccionada.replace('-', ' ')}</h2>
          {renderizarContenido()}
        </div>
      </div>
    </div>
  );
};

export default Home;
