import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import Register from './components/Register';
import EnteSchemeHomePage from './components/EnteSchemeHomePage';
import './App.css';

function App() {
  const [userData, setUserData] = useState(null);

  const handleLogin = (user) => {
    setUserData(user);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setUserData(null);
    localStorage.removeItem('user');
  };

  // Check for existing user session on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={<EnteSchemeHomePage user={userData} onLogout={handleLogout} />} 
          />
          <Route 
            path="/login" 
            element={!userData ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/register" 
            element={!userData ? <Register onRegister={() => window.location.href = '/login'} /> : <Navigate to="/" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
