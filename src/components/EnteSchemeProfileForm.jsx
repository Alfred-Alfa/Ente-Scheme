import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  User, 
  Users, 
  MapPin, 
  Award, 
  GraduationCap, 
  FileText, 
  Settings,
  Sparkles,
  ShieldCheck,
  Heart
} from 'lucide-react';
import './EnteSchemeProfileForm.css'; // Import the CSS file

import { apiRequest, API_ENDPOINTS } from '../config/api';

const EnteSchemeProfileForm = ({ user, existingProfile, onProfileComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(existingProfile || {
    // Basic Details
    fullName: '',
    dateOfBirth: '',
    age: '',
    gender: '',
    maritalStatus: '',
    aadhaarNumber: '',
    phone: '',

    // Family & Income Details
    annualIncome: '',
    isBPL: false,
    rationCardType: '',
    familyMembers: '',
    dependents: [],

    // Location & Residence
    district: '',
    localBodyType: '',
    address: '',
    pinCode: '',
    housingStatus: '',

    // Special Categories
    isSeniorCitizen: false,
    isDisabled: false,
    disabilityType: '',
    disabilityPercentage: '',
    isOrphan: false,
    isStudent: false,
    casteCategory: '',

    // Education & Occupation
    educationLevel: '',
    occupation: '',
    currentCourse: '',
    marksPercentage: '',

    // Documents
    documents: [],

    // Preferences
    preferredLanguage: 'Malayalam',
    notificationPreference: 'Both'
  });


  useEffect(() => {
    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, age: age.toString() }));
    }
  }, [formData.dateOfBirth]);

  const totalSteps = 7;

  const stepIcons = [User, Users, MapPin, Award, GraduationCap, FileText, Settings];
  const stepTitles = ['Basic Details', 'Family & Income', 'Location & Residence', 'Special Categories', 'Education & Occupation', 'Documents', 'Preferences'];

  const statCards = [
    {
      icon: Sparkles,
      label: 'Smart Matching',
      value: '40+ Schemes'
    },
    {
      icon: ShieldCheck,
      label: 'Secure Data',
      value: 'AES-256'
    },
    {
      icon: Heart,
      label: 'Beneficiaries Supported',
      value: '2.3M+'
    }
  ];

  const stepInsights = [
    {
      title: 'Identity Snapshot',
      description: 'Provide accurate personal details to tailor scheme recommendations specific to your profile.',
      tip: 'Tip • Ensure your full name matches as per Aadhaar or official documents.'
    },
    {
      title: 'Family & Income Metrics',
      description: 'Family size and income range help us pinpoint subsidies and support programmes you qualify for.',
      tip: 'Tip • Keep your income proof handy for faster verification.'
    },
    {
      title: 'Location Insights',
      description: 'Different districts have unique schemes. Share where you live to surface local benefits.',
      tip: 'Tip • Use the address on your ration card or recent utility bill.'
    },
    {
      title: 'Special Categories',
      description: 'Highlight unique life circumstances so we can prioritise targeted welfare schemes for you.',
      tip: 'Tip • Select all categories that apply to maximise matches.'
    },
    {
      title: 'Education & Work',
      description: 'Upskilling and employment programmes are matched based on your learning journey and profession.',
      tip: 'Tip • Include your highest completed qualification.'
    },
    {
      title: 'Document Locker',
      description: 'Select the documents you already have so we can speed up application readiness.',
      tip: 'Tip • Missing documents? We’ll guide you on how to obtain them later.'
    },
    {
      title: 'Preference Centre',
      description: 'Choose how you’d like to receive updates and guidance from the Ente Scheme concierge team.',
      tip: 'Tip • Selecting both SMS & Email ensures you never miss important alerts.'
    }
  ];

  const keralDistricts = [
    'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam',
    'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram', 'Kozhikode',
    'Wayanad', 'Kannur', 'Kasaragod'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const newState = { ...prev, [field]: value };

      // Sync isStudent checkbox with occupation dropdown
      if (field === 'occupation') {
        newState.isStudent = (value === 'Student');
      } else if (field === 'isStudent') {
        newState.occupation = value ? 'Student' : '';
      }
      
      return newState;
    });
  };

  const handleArrayChange = (field, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const requiredFields = {
    1: ['fullName', 'dateOfBirth', 'gender'],
    2: ['annualIncome', 'familyMembers', 'rationCardType'],
    3: ['district', 'localBodyType', 'address', 'pinCode'],
    5: ['educationLevel', 'occupation'],
  };

  const validateStep = (step) => {
    const currentRequired = requiredFields[step] || [];
    const newErrors = {};
    let isValid = true;

    currentRequired.forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        newErrors[field] = 'This field is required';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
        setErrors({}); // Clear errors on successful step change
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const endpoint = existingProfile 
        ? API_ENDPOINTS.UPDATE_PROFILE(user.id) 
        : API_ENDPOINTS.CREATE_PROFILE;
      
      const method = existingProfile ? 'PUT' : 'POST';

      const response = await apiRequest(endpoint, {
        method,
        body: JSON.stringify({ userId: user.id, email: user.email, ...formData }),
      });

      if (response.success) {
        onProfileComplete(response.profile);
        setSubmitted(true);
      } else {
        // Handle error display
        console.error("Failed to save profile:", response.error);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestart = () => {
    setSubmitted(false);
    setCurrentStep(1);
  };

  const renderProgressBar = () => (
    <div className="progress-bar-container">
      <div className="progress-bar-steps">
        {[...Array(totalSteps)].map((_, index) => {
          const StepIcon = stepIcons[index];
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={stepNumber} className="step-item">
              <div className={`step-icon ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}` }>
                {isCompleted ? <Check size={20} /> : <StepIcon size={20} />}
              </div>
              <span className={`step-title ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}` }>
                {stepTitles[index]}
              </span>
            </div>
          );
        })}
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${(currentStep / totalSteps) * 100}%`  }}
        ></div>
      </div>
    </div>
  );

  const renderFormField = (label, field, type = 'text', options = null, required = false, readOnly = false) => (
    <div className="form-field">
      <label className="form-label">
        {label} {required && <span className="required-asterisk">*</span>}
      </label>
      {type === 'select' ? (
        <select value={formData[field] || ''} onChange={(e) => handleInputChange(field, e.target.value)} className={`form-input ${errors[field] ? 'input-error' : ''}`}>
          <option value="">Select {label}</option>
          {options?.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          value={formData[field] || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          rows={3}
          className={`form-input form-textarea ${errors[field] ? 'input-error' : ''}`}
          placeholder={`Enter ${label.toLowerCase()}`}
        />
      ) : (
        <input
          type={type}
          value={formData[field] || ''}
          onChange={(e) => handleInputChange(field, e.target.value)}
          className={`form-input ${errors[field] ? 'input-error' : ''}`}
          placeholder={`Enter ${label.toLowerCase()}`}
          readOnly={readOnly}
        />
      )}
      {errors[field] && <span className="error-text">{errors[field]}</span>}
    </div>
  );

  const renderCheckboxGroup = (label, field, options) => (
    <div className="form-field">
      <label className="form-label">{label}</label>
      <div className="checkbox-grid">
        {options.map(option => (
          <label key={option} className="checkbox-label">
            <input
              type="checkbox"
              checked={formData[field].includes(option)}
              onChange={(e) => handleArrayChange(field, option, e.target.checked)}
              className="form-checkbox"
            />
            <span className="checkbox-text">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderStepContent = () => {
    // A helper function to render the step header
    const renderHeader = (title, subtitle) => (
      <div className="step-header">
        <h2 className="step-title-main">{title}</h2>
        <p className="step-description">{subtitle}</p>
      </div>
    );

    switch (currentStep) {
      case 1: return (
          <div className="step-container">
            {renderHeader('Basic Details', "Let's start with your basic information")}
            {renderFormField('Full Name', 'fullName', 'text', null, true)}
            {renderFormField('Date of Birth', 'dateOfBirth', 'date', null, true)}
            {renderFormField('Age', 'age', 'number', null, false, true)}
            {renderFormField('Gender', 'gender', 'select', ['Male', 'Female', 'Other'], true)}
            {renderFormField('Marital Status', 'maritalStatus', 'select', ['Single', 'Married', 'Divorced', 'Widowed'])}
            {renderFormField('Aadhaar Number', 'aadhaarNumber', 'text')}
            {renderFormField('Phone Number', 'phone', 'tel')}
          </div>);
      case 2: return (
          <div className="step-container">
            {renderHeader('Family & Income Details', "Tell us about your family and income")}
            {renderFormField('Annual Family Income (₹)', 'annualIncome', 'number', null, true)}
            <label className="checkbox-label"><input type="checkbox" className="form-checkbox" checked={formData.isBPL} onChange={(e) => handleInputChange('isBPL', e.target.checked)}/><span>Below Poverty Line (BPL)</span></label>
            {renderFormField('Ration Card Type', 'rationCardType', 'select', ['APL', 'BPL', 'AAY', 'PHH', 'NPHH', 'NPS', 'None'], true)}
            {renderFormField('Number of Family Members', 'familyMembers', 'number', null, true)}
            {renderCheckboxGroup('Dependents', 'dependents', ['Children', 'Senior Citizens', 'Disabled Members', 'None'])}
          </div>);
      case 3: return (
          <div className="step-container">
            {renderHeader('Location & Residence', 'Where are you located?')}
            {renderFormField('District', 'district', 'select', keralDistricts, true)}
            {renderFormField('Local Body Type', 'localBodyType', 'select', ['Urban', 'Rural', 'Panchayat'], true)}
            {renderFormField('Address', 'address', 'textarea', null, true)}
            {renderFormField('PIN Code', 'pinCode', 'text', null, true)}
            {renderFormField('Housing Status', 'housingStatus', 'select', ['Own House', 'Renting', 'Homeless'])}
          </div>);
      case 4: return (
          <div className="step-container">
            {renderHeader('Special Categories', 'Special circumstances and categories')}
            <div className="special-category-grid">
              <label className="checkbox-label"><input type="checkbox" className="form-checkbox" checked={formData.isWidow} onChange={(e) => handleInputChange('isWidow', e.target.checked)}/><span>Widow / Single Parent</span></label>
              <label className="checkbox-label"><input type="checkbox" className="form-checkbox" checked={formData.isSeniorCitizen} onChange={(e) => handleInputChange('isSeniorCitizen', e.target.checked)}/><span>Senior Citizen (60+)</span></label>
              <label className="checkbox-label"><input type="checkbox" className="form-checkbox" checked={formData.isDisabled} onChange={(e) => handleInputChange('isDisabled', e.target.checked)}/><span>Differently Abled</span></label>
              <label className="checkbox-label"><input type="checkbox" className="form-checkbox" checked={formData.isOrphan} onChange={(e) => handleInputChange('isOrphan', e.target.checked)}/><span>Orphan / Caregiver</span></label>
              <label className="checkbox-label"><input type="checkbox" className="form-checkbox" checked={formData.isStudent} onChange={(e) => handleInputChange('isStudent', e.target.checked)}/><span>Student</span></label>
            </div>
            {formData.isDisabled && (
              <div className="disability-details-grid">
                {renderFormField('Disability Type', 'disabilityType')}
                {renderFormField('Disability Percentage (%)', 'disabilityPercentage', 'number')}
              </div>
            )}
            {renderFormField('Caste Category', 'casteCategory', 'select', ['SC', 'ST', 'OBC', 'General', 'General (EWS)'])}
          </div>);
      case 5: return (
          <div className="step-container">
            {renderHeader('Education & Occupation', 'Your educational and professional background')}
            {renderFormField('Highest Education Level', 'educationLevel', 'select', ['SSLC', 'Plus Two', 'Graduate', 'Post Graduate', 'Currently Student'], true)}
            {renderFormField('Current Occupation', 'occupation', 'select', ['Farmer', 'Fisherman', 'Artisan', 'Labourer', 'Student', 'Unemployed', 'Self Employed', 'Retired', 'Other'], true)}
            {formData.occupation === 'Student' && (
              <>
                {renderFormField('Current Course/Standard', 'currentCourse')}
                {renderFormField('Percentage of Marks (%)', 'marksPercentage', 'number')}
              </>
            )}
          </div>);
      case 6: return (
          <div className="step-container">
            {renderHeader('Documents', 'Select all documents you have available')}
            {renderCheckboxGroup('Available Documents', 'documents', ['Aadhaar Card', 'Ration Card', 'Income Certificate', 'Caste Certificate', 'Disability Certificate', 'Bank Passbook', 'Educational Certificates', 'Other Relevant Documents'])}
          </div>);
      case 7: return (
          <div className="step-container">
            {renderHeader('Preferences', 'Choose your language and notification preferences')}
            {renderFormField('Preferred Language', 'preferredLanguage', 'select', ['Malayalam', 'English'], true)}
            {renderFormField('Notification Preference', 'notificationPreference', 'select', ['SMS', 'Email', 'Both', 'None'], true)}
          </div>);
      default: return null;
    }
  };

  const insight = stepInsights[currentStep - 1];

  return (
    <div className="page-container">
      <div className="form-wrapper">
        <div className="form-card">
          <header className="form-header">
            <div className="header-overlay"></div>
            <div className="header-content">
              <div className="header-left">
                <div className="header-chip">Smart Onboarding</div>
                {!existingProfile && <div className="header-chip">Welcome! Let's get started.</div>}
                <h1 className="form-title">{existingProfile ? 'Update Your Profile' : 'Craft Your Personalised Beneficiary Profile'}</h1>
                <p className="form-subtitle">Complete these guided steps to unlock curated Kerala welfare schemes tailored for your household.</p>
              </div>
              <div className="header-right">
                {statCards.map(({ icon: StatIcon, label, value }) => (
                  <div className="stat-card" key={label}>
                    <div className="stat-icon">
                      <StatIcon size={20} />
                    </div>
                    <div className="stat-content">
                      <span className="stat-value">{value}</span>
                      <span className="stat-label">{label}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </header>

          <section className="progress-bar-section">
            {renderProgressBar()}
          </section>

          <main className="form-content-section">
            {submitted ? (
              <div className="success-state" role="status" aria-live="polite">
                <div className="success-animation">
                  <div className="success-icon">
                    <Check size={32} />
                  </div>
                  <h2 className="success-title">Success!</h2>
                  <p className="success-message">Your details have been saved successfully.</p>
                </div>
                <div className="success-actions">
                  <button className="button-next" onClick={handleRestart}>
                    <ChevronLeft size={18} />
                    <span>Review details</span>
                  </button>
                  <button className="button-submit">
                    <Sparkles size={18} />
                    <span>Explore recommended schemes</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="form-layout">
                <div className="form-main">
                  <div className="step-content-wrapper">
                    {renderStepContent()}
                  </div>

                  <nav className="navigation-buttons">
                    {currentStep > 1 ? (
                      <button onClick={prevStep} className="button-prev" type="button">
                        <ChevronLeft size={20} />
                        <span>Previous</span>
                      </button>
                    ) : (
                      onCancel ? (
                        <button onClick={onCancel} className="button-cancel" type="button">
                          <span>Cancel</span>
                        </button>
                      ) : (
                        <div className="button-placeholder" aria-hidden="true"></div>
                      )
                    )}

                    {currentStep < totalSteps ? (
                      <button onClick={nextStep} className="button-next" type="button">
                        <span>Next step</span>
                        <ChevronRight size={20} />
                      </button>
                    ) : (
                      <button 
                        onClick={handleSubmit} 
                        className="button-submit"
                        disabled={isSubmitting}
                        type="button"
                      >
                        {isSubmitting && <span className="loading-spinner" aria-hidden="true"></span>}
                        <Check size={20} />
                        <span>{isSubmitting ? (existingProfile ? 'Updating...' : 'Submitting...') : (existingProfile ? 'Update Profile' : 'Submit Profile')}</span>
                      </button>
                    )}
                  </nav>
                </div>

                <aside className="step-side-panel">
                  <div className="insight-card">
                    <div className="insight-chip">Step {currentStep} of {totalSteps}</div>
                    <h3 className="insight-title">{insight.title}</h3>
                    <p className="insight-body">{insight.description}</p>
                    <div className="insight-tip">{insight.tip}</div>
                    <ul className="highlight-list">
                      <li><ShieldCheck size={16} /> Data stays encrypted within NIC certified infrastructure.</li>
                      <li><Sparkles size={16} /> Save progress anytime and continue where you left off.</li>
                      <li><Heart size={16} /> Dedicated volunteer support if you need assistance.</li>
                    </ul>
                  </div>
                </aside>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default EnteSchemeProfileForm;
