import React, { useState, useEffect } from "react";
import { User, MapPin, CreditCard, Users, FileText, Settings, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import "./register.css";

const districts = [
  "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam", 
  "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram", 
  "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
];

const panchayatSamples = ["Panchayat 1", "Panchayat 2", "Panchayat 3"];

const specialOptions = [
  "Elderly", "Disabled", "Caregiver", "Orphaned", "Widow", "Single Parent"
];

function Register({ onRegister }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    userId: "",
    name: "",
    dateOfBirth: "",
    age: "",
    gender: "",
    address: "",
    district: "",
    panchayat: "",
    areaType: "urban",
    income: "",
    rationCardType: "",
    povertyStatus: "",
    familyMembers: "",
    dependents: "",
    specialStatus: [],
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setForm(prev => ({
        ...prev,
        [name]: checked 
          ? [...prev[name], value]
          : prev[name].filter(item => item !== value)
      }));
    } else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateStep = () => {
    const newErrors = {};
    
    if (step === 0) {
      if (!form.name) newErrors.name = 'Name is required';
      if (!form.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!form.gender) newErrors.gender = 'Gender is required';
    } else if (step === 1) {
      if (!form.address) newErrors.address = 'Address is required';
      if (!form.district) newErrors.district = 'District is required';
      if (!form.panchayat) newErrors.panchayat = 'Panchayat is required';
    } else if (step === 2) {
      if (!form.email) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid';
      if (!form.phone) newErrors.phone = 'Phone number is required';
      if (!form.password) newErrors.password = 'Password is required';
      else if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateStep()) {
      setSubmitting(true);
      
      try {
        // Here you would typically make an API call to register the user
        console.log('Form submitted:', form);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Call the onRegister callback with the form data
        onRegister(form);
      } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
      } finally {
        setSubmitting(false);
      }
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="form-step">
            <h3>Personal Information</h3>
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <label>Date of Birth *</label>
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                className={errors.dateOfBirth ? 'error' : ''}
              />
              {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
            </div>
            
            <div className="form-group">
              <label>Gender *</label>
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className={errors.gender ? 'error' : ''}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && <span className="error-message">{errors.gender}</span>}
            </div>
          </div>
        );
        
      case 1:
        return (
          <div className="form-step">
            <h3>Address Information</h3>
            <div className="form-group">
              <label>Address *</label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter your full address"
                className={errors.address ? 'error' : ''}
                rows="3"
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>
            
            <div className="form-group">
              <label>District *</label>
              <select
                name="district"
                value={form.district}
                onChange={handleChange}
                className={errors.district ? 'error' : ''}
              >
                <option value="">Select District</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
              {errors.district && <span className="error-message">{errors.district}</span>}
            </div>
            
            <div className="form-group">
              <label>Panchayat *</label>
              <select
                name="panchayat"
                value={form.panchayat}
                onChange={handleChange}
                className={errors.panchayat ? 'error' : ''}
              >
                <option value="">Select Panchayat</option>
                {panchayatSamples.map(panchayat => (
                  <option key={panchayat} value={panchayat}>{panchayat}</option>
                ))}
              </select>
              {errors.panchayat && <span className="error-message">{errors.panchayat}</span>}
            </div>
            
            <div className="form-group">
              <label>Area Type</label>
              <div className="radio-group">
                <label>
                  <input
                    type="radio"
                    name="areaType"
                    value="urban"
                    checked={form.areaType === 'urban'}
                    onChange={handleChange}
                  />
                  Urban
                </label>
                <label>
                  <input
                    type="radio"
                    name="areaType"
                    value="rural"
                    checked={form.areaType === 'rural'}
                    onChange={handleChange}
                  />
                  Rural
                </label>
              </div>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="form-step">
            <h3>Account Information</h3>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={errors.email ? 'error' : ''}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
            
            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && <span className="error-message">{errors.password}</span>}
            </div>
            
            <div className="form-group">
              <label>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={errors.confirmPassword ? 'error' : ''}
              />
              {errors.confirmPassword && (
                <span className="error-message">{errors.confirmPassword}</span>
              )}
            </div>
            
            <div className="form-group">
              <label>Special Status (if any)</label>
              <div className="checkbox-group">
                {specialOptions.map(option => (
                  <label key={option} className="checkbox-label">
                    <input
                      type="checkbox"
                      name="specialStatus"
                      value={option}
                      checked={form.specialStatus.includes(option)}
                      onChange={handleChange}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <h2>Create an Account</h2>
        <p>Join us to access government schemes and benefits</p>
      </div>
      
      <div className="progress-bar">
        <div 
          className="progress" 
          style={{ width: `${(step + 1) * 33.33}%` }}
        ></div>
        <div className="step-indicator">
          <div className={`step ${step >= 0 ? 'active' : ''}`}>1</div>
          <div className={`step ${step >= 1 ? 'active' : ''}`}>2</div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>3</div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        {renderStep()}
        
        <div className="form-navigation">
          {step > 0 && (
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={prevStep}
              disabled={submitting}
            >
              <ChevronLeft size={18} /> Back
            </button>
          )}
          
          {step < 2 ? (
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={nextStep}
              disabled={submitting}
            >
              Next <ChevronRight size={18} />
            </button>
          ) : (
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? 'Creating Account...' : 'Create Account'}
            </button>
          )}
        </div>
      </form>
      
      <div className="login-link">
        Already have an account? <a href="#/login">Sign In</a>
      </div>
    </div>
  );
}

export default Register;
