import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CombinedLogin from './components/CombinedLogin';
import Register from './components/Register';
import EnteSchemeHomePage from './components/EnteSchemeHomePage';
import ProfilePage from './components/ProfilePage';
import NewsManagement from './components/admin/NewsManagement';
import AdminSettings from './components/admin/AdminSettings';
import AdminSchemeManagement from './components/admin/AdminSchemeManagement';
import EligibilityMatchedScheme from './components/EligibilityMatchedScheme';
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

  // This handler is needed if other parts of the app need to know about profile updates.
  // For now, ProfilePage manages its own state.
  const handleProfileComplete = (profile) => {
    const updatedUser = { ...userData, profile, hasProfile: true };
    setUserData(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
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
            element={!userData ? <CombinedLogin onLogin={handleLogin} /> : <Navigate to="/" />}
          />
          <Route
            path="/register"
            element={!userData ? <Register /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={userData ? <ProfilePage user={userData} /> : <Navigate to="/login" />}
          />
          <Route 
            path="/news"
            element={userData?.role === 'admin' ? <NewsManagement /> : <Navigate to="/login" />}
          />
          <Route 
            path="/admin/settings"
            element={userData?.role === 'admin' ? <AdminSettings /> : <Navigate to="/login" />}
          />
          <Route 
            path="/admin/schemes"
            element={userData?.role === 'admin' ? <AdminSchemeManagement /> : <Navigate to="/login" />}
          />
          <Route 
            path="/check-eligibility"
            element={userData ? <EligibilityMatchedScheme /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
