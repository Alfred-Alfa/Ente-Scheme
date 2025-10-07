import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle, ArrowRight } from 'lucide-react';
import { API_ENDPOINTS, apiRequest } from '../config/api';
import BackButton from './BackButton';
import './Register.css';

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

const PasswordStrengthMeter = ({ password }) => {
  const getStrength = () => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = getStrength();
  const strengthMap = {
    0: { text: '', color: '', width: '0%' },
    1: { text: 'Weak', color: 'weak', width: '20%' },
    2: { text: 'Fair', color: 'fair', width: '40%' },
    3: { text: 'Good', color: 'good', width: '60%' },
    4: { text: 'Strong', color: 'strong', width: '80%' },
    5: { text: 'Very Strong', color: 'strong', width: '100%' },
  };

  const { text, color, width } = strengthMap[strength];

  return (
    <div className="password-strength-meter">
      <div className={`strength-bar ${color}`} style={{ width }}></div>
    </div>
  );
};

function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.username || formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters.';
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email address.';
    if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters.';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await apiRequest(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        body: JSON.stringify({ username: formData.username, email: formData.email, password: formData.password }),
      });
      if (response.success) {
        setIsSuccess(true);
      } else {
        setErrors({ form: response.error || 'Registration failed. Please try again.' });
      }
    } catch (err) {
      setErrors({ form: 'Network error. Please check your connection.' });
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="register-container">
        <Particles />
        <FloatingShapes />
        <div className="register-card success-container">
          <div className="success-icon"><CheckCircle size={40} /></div>
          <h1 className="success-title">Registration Successful!</h1>
          <p className="success-message">Welcome to EnteScheme. You can now log in to discover schemes tailored for you.</p>
          <Link to="/login" className="back-to-home-btn">Go to Login <ArrowRight size={20} /></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="register-container page-container-with-back-button">
      <BackButton />
      <Particles />
      <FloatingShapes />
      <div className="register-card">
        <div className="register-header">
          <h1 className="register-title">Create Your Account</h1>
          <p className="register-subtitle">Unlock personalized Kerala welfare schemes</p>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <span className="input-icon-left">
              <User size={20} />
            </span>
            <input type="text" name="username" placeholder="Username" className="input-field" value={formData.username} onChange={handleChange} />
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>
          <div className="input-group">
            <span className="input-icon-left">
              <Mail size={20} />
            </span>
            <input type="email" name="email" placeholder="Email Address" className="input-field" value={formData.email} onChange={handleChange} />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          <div className="input-group">
            <span className="input-icon-left">
              <Lock size={20} />
            </span>
            <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Password" className="input-field" value={formData.password} onChange={handleChange} />
            <span className="input-icon-right" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
            <PasswordStrengthMeter password={formData.password} />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          <div className="input-group">
            <span className="input-icon-left">
              <Lock size={20} />
            </span>
            <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" placeholder="Confirm Password" className="input-field" value={formData.confirmPassword} onChange={handleChange} />
            <span className="input-icon-right" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>
          {errors.form && <span className="error-text submit-error">{errors.form}</span>}
          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="login-link">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
