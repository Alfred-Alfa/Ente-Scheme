import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, ShieldCheck } from 'lucide-react';
import { API_ENDPOINTS, apiRequest } from '../config/api';
import BackButton from './BackButton';
import './CombinedLogin.css';

const Particles = () => (
  <canvas id="particles-canvas" className="particles"></canvas>
);

const FloatingShapes = () => (
  <div className="floating-shapes">
    <div className="shape shape1"></div>
    <div className="shape shape2"></div>
    <div className="shape shape3"></div>
    <div className="shape shape4"></div>
  </div>
);

const CombinedLogin = ({ onLogin }) => {
  const [activeTab, setActiveTab] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Both email and password are required.');
      return;
    }

    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = activeTab === 'admin' ? API_ENDPOINTS.ADMIN_LOGIN : API_ENDPOINTS.LOGIN;
      const response = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.success) {
        if (remember) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        onLogin(response.user);
        navigate(activeTab === 'admin' ? '/admin/dashboard' : '/dashboard');
      } else {
        throw new Error(response.error || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  const isUserTab = activeTab === 'user';

  return (
    <div className="login-container page-container-with-back-button">
      <BackButton />
      <Particles />
      <FloatingShapes />
      <div className="login-card">
        <div className="login-header">
          <div className="header-icon-wrapper">
            {isUserTab ? <User size={32} /> : <ShieldCheck size={32} />}
          </div>
          <h1 className="login-title">{isUserTab ? 'Welcome Back' : 'Admin Portal'}</h1>
          <p className="login-subtitle">{isUserTab ? 'Sign in to access your schemes' : 'Ente Scheme Management'}</p>
        </div>

        <div className="login-tabs">
          <button className={`tab-btn ${isUserTab ? 'active' : ''}`} onClick={() => handleTabChange('user')}>User</button>
          <button className={`tab-btn ${!isUserTab ? 'active' : ''}`} onClick={() => handleTabChange('admin')}>Admin</button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {error && <span className="error-text submit-error">{error}</span>}
          <div className="input-group">
            <span className="input-icon-left">
              <Mail size={20} />
            </span>
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <div className="input-group">
            <span className="input-icon-left">
              <Lock size={20} />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <span className="input-icon-right" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
          
          <div className="login-options">
            <label className="remember-me">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <span>Remember Me</span>
            </label>
            <Link to="/forgot-password" className="forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit" className={`login-btn ${!isUserTab ? 'admin' : ''}`} disabled={isLoading}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        {isUserTab && (
          <p className="signup-link">
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default CombinedLogin;
