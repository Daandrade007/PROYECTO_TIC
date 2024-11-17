import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSignOutAlt, faKey } from '@fortawesome/free-solid-svg-icons';
import './Header.css';

const Header = ({ setLoggedIn, username }) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getUserInitials = (username) => {
    if (!username) return 'I';
    const names = username.split(' ');
    return names.map((name) => name.charAt(0)).join('').toUpperCase();
  };

  const handleLogout = () => {
    // Eliminar los datos de sesión
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');

    // Actualizar el estado global de la sesión
    setLoggedIn(false); // Aquí usamos la función recibida como prop

    // Redirigir al login
    window.location.href = '/'; // Redirigir a la página de login
  };

  return (
    <header className="header">
      <form className="search-container">
        <div className="search-input-container">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </form>

      <div className="user-info">
        <div className="user-icon">{getUserInitials(username)}</div>
        <span className="user-name">{username || 'Invitado'}</span>
        <button
          className="menu-button"
          onClick={() => setDropdownVisible(!isDropdownVisible)}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 19.1C15.0258 19.1 19.1 15.0258 19.1 10C19.1 4.97421 15.0258 0.9 10 0.9C4.97421 0.9 0.9 4.97421 0.9 10C0.9 15.0258 4.97421 19.1 10 19.1Z" stroke="#5C5C5C" strokeWidth="0.2"/>
            <path d="M10 10.7929L7.73162 8.14645C7.56425 7.95118 7.29289 7.95118 7.12553 8.14645C6.95816 8.34171 6.95816 8.65829 7.12553 8.85355L9.69695 11.8536C9.86432 12.0488 10.1357 12.0488 10.303 11.8536L12.8745 8.85355C13.0418 8.65829 13.0418 8.34171 12.8745 8.14645C12.7071 7.95118 12.4358 7.95118 12.2684 8.14645L10 10.7929Z" fill="#565656"/>
          </svg>
        </button>

        {/* Menú desplegable */}
        {isDropdownVisible && (
          <div className="dropdown-menu show">
            <button onClick={() => console.log("Cambiar contraseña")}>
              <FontAwesomeIcon icon={faKey} className="menu-icon" /> Cambiar contraseña
            </button>
            <button onClick={handleLogout}>
              <FontAwesomeIcon icon={faSignOutAlt} className="menu-icon" /> Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
