import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';  // Importamos el archivo CSS
import logo from './logoWeb.jpg';  // Tu logo aquí

const Login = ({ setLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // hook para redirigir

  // Verificación si el usuario ya está autenticado al montar el componente
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      navigate('/home');  // Redirige automáticamente si ya está autenticado
    }
  }, [navigate]); // Se asegura de ejecutar una sola vez cuando se monta el componente

  const handleLogin = async (e) => {
    e.preventDefault();  // Evita el comportamiento por defecto del formulario

    try {
      // Llamada a la API de login
      const response = await axios.post('http://localhost:5001/api/login', { username, password });

      // Si el login es exitoso, cambiamos el estado de loggedIn
      if (response.data.success) {
        setLoggedIn(true);  // Aquí usamos setLoggedIn recibido de App.js
        setError('');
        // Guardar estado de login en localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username); // Guardar el username en localStorage
        localStorage.setItem('authToken', response.data.token); // Guardar el token en localStorage
        // Redirigir al home después de un login exitoso
        navigate('/home');
      }
    } catch (err) {
      setError('Credenciales inválidas');
      setLoggedIn(false);  // Si hay error, lo marcamos como no autenticado
    }
  };

  return (
    <div className="login-container">
      <div className="contenedorformulario">
        <h2>Iniciar sesión</h2>
        <img src={logo} alt="Logo" className="logo" />
        <form onSubmit={handleLogin}>
          <div className="input-container">
            <label htmlFor="username">Usuario:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="input-container">
            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
