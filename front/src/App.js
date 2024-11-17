import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Home from './components/Home';

import Login from './components/Login';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [username, setUsername] = useState(localStorage.getItem('username'));

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setUsername('');
    window.location.href = '/login';  // Redirigir al login
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/home" 
          element={<Home isLoggedIn={isLoggedIn} username={username} handleLogout={handleLogout} />} 
        />
        <Route 
          path="/login" 
          element={<Login setLoggedIn={setIsLoggedIn} />}  // Pasamos la función setLoggedIn
        />
        <Route path="*" element={<Login setLoggedIn={setIsLoggedIn} />} /> {/* Redirige a login si la ruta no es encontrada */}
      </Routes>
    </Router>
  );
}

export default App;
