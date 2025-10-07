import React, { useState } from 'react';
import { ChevronRight, ChevronLeft, Check, User, Users, MapPin, Award, GraduationCap, FileText, Settings } from 'lucide-react';
import { API_ENDPOINTS, apiRequest } from '../config/api';
import './EnteSchemeProfileForm.css';

const EnteSchemeProfileForm = ({ user, onProfileComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    // Basic Details
    fullName: user?.username || '',
    dateOfBirth: '',
    age: '',
    gender: '',
    aadhaarNumber: '',
    
    // Family & Income Details
    annualIncome: '',
    rationCardType: '',
    familyMembers: '',
    dependents: '',
    
    // Location & Residence
    district: '',
    localBodyType: '',
    address: '',
    pinCode: '',
    
    // Special Categories
    isWidow: 'No',
    isSeniorCitizen: 'No',
    isDisabled: 'No',
    disabilityType: '',
    disabilityPercentage: '',
    isOrphan: 'No',
    casteCategory: '',
    
    // Education & Occupation
    educationLevel: '',
    occupation: '',
    
    // Documents
    documents: {
      aadhaarCard: false,
      rationCard: false,
      incomeCertificate: false,
      casteCertificate: false,
      disabilityCertificate: false,
      bankPassbook: false,
      educationalCertificates: false,
      other: false
    },
    
    // Preferences
    preferredLanguage: 'Malayalam',
    notificationPreference: 'Both'
  });

  const totalSteps = 7;
  
  const stepIcons = [
    User, Users, MapPin, Award, GraduationCap, FileText, Settings
  ];

  const stepTitles = [
    'Basic Details',
    'Family & Income',
    'Location & Residence', 
    'Special Categories',
    'Education & Occupation',
    'Documents',
    'Preferences'
  ];

  const keralDistricts = [
    'Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam',
    'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta',
    'Thiruvananthapuram', 'Thrissur', 'Wayanad'
  ];

  const educationLevels = [
    'No Formal Education', 'Primary School', 'SSLC / 10th', 'Plus Two / 12th',
    'Diploma', 'Graduate', 'Post Graduate', 'Doctorate'
  ];

  const occupations = [
    'Student', 'Employed (Private)', 'Employed (Government)', 'Self-employed',
    'Unemployed', 'Homemaker', 'Retired', 'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        documents: { ...prev.documents, [name]: checked }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };


  const renderProgressBar = () => (
    <div className="progress-bar-container">
      <div className="progress-bar">
        <div className="progress-bar-track"></div>
        <div 
          className="progress-bar-fill" 
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        ></div>
        <ul className="progress-bar-steps">
          {stepTitles.map((title, index) => {
            const StepIcon = stepIcons[index];
            const stepNumber = index + 1;
            const isActive = stepNumber === currentStep;
            const isCompleted = stepNumber < currentStep;
            
            return (
              <li key={title} className="step">
                <div className={`step-icon ${isCompleted ? 'completed' : isActive ? 'active' : ''}`}>
                  {isCompleted ? (
                    <svg className="icon-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  ) : (
                    <StepIcon className="icon" />
                  )}
                </div>
                <span className={`step-label ${isActive ? 'active' : ''}`}>
                  {title.split(' ')[0]}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );

  const FormField = ({ label, children, htmlFor, required = false }) => (
    <div className="form-field">
      <label htmlFor={htmlFor} className="form-label">
        {label} {required && <span style={{color: '#dc2626'}}>*</span>}
      </label>
      {children}
    </div>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentStep === totalSteps) {
      submitProfile();
    }
  };

  const submitProfile = async () => {
    setLoading(true);
    setError('');
    
    try {
      const profileData = {
        userId: user.id,
        email: user.email,
        ...formData
      };

      const response = await apiRequest(API_ENDPOINTS.CREATE_PROFILE, {
        method: 'POST',
        body: JSON.stringify(profileData),
      });

      if (response.success) {
        alert('Profile created successfully! You can now access all schemes.');
        onProfileComplete(response.profile);
      } else {
        setError(response.error || 'Failed to create profile');
      }
    } catch (err) {
      setError(err.message || 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2 className="step-title">1. Basic Details</h2>
            <div className="form-grid">
              <FormField label="Full Name" htmlFor="fullName" required>
                <input 
                  type="text" 
                  name="fullName" 
                  id="fullName" 
                  value={formData.fullName} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  required 
                />
              </FormField>
              <FormField label="Date of Birth" htmlFor="dateOfBirth" required>
                <input 
                  type="date" 
                  name="dateOfBirth" 
                  id="dateOfBirth" 
                  value={formData.dateOfBirth} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  required 
                />
              </FormField>
              <FormField label="Gender" htmlFor="gender" required>
                <select 
                  name="gender" 
                  id="gender" 
                  value={formData.gender} 
                  onChange={handleInputChange} 
                  className="form-select" 
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </FormField>
              <FormField label="Aadhaar Number (Optional)" htmlFor="aadhaarNumber">
                <input 
                  type="text" 
                  name="aadhaarNumber" 
                  id="aadhaarNumber" 
                  value={formData.aadhaarNumber} 
                  onChange={handleInputChange} 
                  className="form-input" 
                  pattern="\d{12}" 
                  title="Enter a 12-digit Aadhaar number" 
                />
              </FormField>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Family & Income Details</h2>
              <p className="text-gray-600">Tell us about your family and income</p>
            </div>
            
            {renderFormField('Annual Family Income (₹)', 'annualIncome', 'number', null, true)}
            {renderFormField('Ration Card Type', 'rationCardType', 'select', ['APL', 'BPL', 'Antyodaya', 'None'])}
            {renderFormField('Number of Family Members', 'familyMembers', 'number', null, true)}
            {renderCheckboxGroup('Dependents', 'dependents', ['Children', 'Senior Citizens', 'Disabled Members', 'None'])}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Location & Residence</h2>
              <p className="text-gray-600">Where are you located?</p>
            </div>
            
            {renderFormField('District', 'district', 'select', keralDistricts, true)}
            {renderFormField('Local Body Type', 'localBodyType', 'select', ['Urban', 'Rural', 'Panchayat'], true)}
            {renderFormField('Address', 'address', 'textarea', null, true)}
            {renderFormField('PIN Code', 'pinCode', 'text', null, true)}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Special Categories</h2>
              <p className="text-gray-600">Special circumstances and categories</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={formData.isWidow}
                  onChange={(e) => handleInputChange('isWidow', e.target.checked)}
                  className="w-4 h-4 text-blue-500"
                />
                <span>Widow / Single Parent</span>
              </label>
              
              <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={formData.isSeniorCitizen}
                  onChange={(e) => handleInputChange('isSeniorCitizen', e.target.checked)}
                  className="w-4 h-4 text-blue-500"
                />
                <span>Senior Citizen (60+)</span>
              </label>
              
              <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={formData.isDisabled}
                  onChange={(e) => handleInputChange('isDisabled', e.target.checked)}
                  className="w-4 h-4 text-blue-500"
                />
                <span>Differently Abled</span>
              </label>
              
              <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={formData.isOrphan}
                  onChange={(e) => handleInputChange('isOrphan', e.target.checked)}
                  className="w-4 h-4 text-blue-500"
                />
                <span>Orphan / Caregiver</span>
              </label>
            </div>
            
            {formData.isDisabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderFormField('Disability Type', 'disabilityType')}
                {renderFormField('Disability Percentage (%)', 'disabilityPercentage', 'number')}
              </div>
            )}
            
            {renderFormField('Caste Category', 'casteCategory', 'select', ['SC', 'ST', 'OBC', 'General'])}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Education & Occupation</h2>
              <p className="text-gray-600">Your educational and professional background</p>
            </div>
            
            {renderFormField('Highest Education Level', 'educationLevel', 'select', 
              ['SSLC', 'Plus Two', 'Graduate', 'Post Graduate', 'Currently Student'], true)}
            {renderFormField('Current Occupation', 'occupation', 'select', 
              ['Student', 'Job', 'Unemployed', 'Self Employed', 'Retired', 'Other'], true)}
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Documents</h2>
              <p className="text-gray-600">Select all documents you have available</p>
            </div>
            
            {renderCheckboxGroup('Available Documents', 'documents', [
              'Aadhaar Card', 'Ration Card', 'Income Certificate', 'Caste Certificate',
              'Disability Certificate', 'Bank Passbook', 'Educational Certificates', 'Other Relevant Documents'
            ])}
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Preferences</h2>
              <p className="text-gray-600">Choose your language and notification preferences</p>
            </div>
            
            {renderFormField('Preferred Language', 'preferredLanguage', 'select', ['Malayalam', 'English'], true)}
            {renderFormField('Notification Preference', 'notificationPreference', 'select', 
              ['SMS', 'Email', 'Both', 'None'], true)}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="page-container">
      <div className="form-wrapper">
        <h1 className="main-title">Ente Scheme Portal</h1>
        <p className="subtitle">Create Your Profile to Find Eligible Schemes</p>
        
        {renderProgressBar()}
        
        <form onSubmit={handleSubmit}>
          <div className="form-content">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            {renderStep()}
          </div>
          
          <div className="navigation-buttons">
            <button 
              type="button" 
              onClick={prevStep} 
              disabled={currentStep === 1 || loading} 
              className="btn btn-secondary"
            >
              ← Prev
            </button>
            {currentStep < totalSteps ? (
              <button 
                type="button" 
                onClick={nextStep} 
                disabled={loading}
                className="btn btn-primary"
              >
                Next →
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-submit"
              >
                {loading ? (
                  <>
                    <span className="loading-spinner"></span>
                    Creating Profile...
                  </>
                ) : (
                  'Submit '
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
