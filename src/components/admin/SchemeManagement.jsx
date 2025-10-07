import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import './SchemeManagement.css';

// Constants from your request
const keralDistricts = [
  'All', 'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam',
  'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram', 'Kozhikode',
  'Wayanad', 'Kannur', 'Kasaragod'
];
const documentOptions = ['Aadhaar Card', 'Ration Card', 'Income Certificate', 'Caste Certificate', 'Disability Certificate', 'Bank Passbook'];

// Modal Component from your request
const SchemeFormModal = ({ isOpen, onClose, onSave, scheme }) => {
  const initialState = {
    schemeName: '', department: '', description: '', schemeUrl: '',
    eligibility: {
      minAge: '', maxAge: '', maxIncome: '', districts: [], casteCategory: [],
      requiresWidow: false, requiresSeniorCitizen: false, requiresDisabled: false, requiresOrphan: false,
    },
    requiredDocuments: [],
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (scheme) {
      setFormData({ ...initialState, ...scheme });
    } else {
      setFormData(initialState);
    }
  }, [scheme, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEligibilityChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, eligibility: { ...prev.eligibility, [name]: type === 'checkbox' ? checked : value } }));
  };

  const handleMultiSelectChange = (field, subfield, value) => {
    const currentValues = subfield ? formData[field][subfield] : formData[field];
    const newValues = currentValues.includes(value) ? currentValues.filter(item => item !== value) : [...currentValues, value];
    if (subfield) {
      setFormData(prev => ({ ...prev, [field]: { ...prev[field], [subfield]: newValues } }));
    } else {
      setFormData(prev => ({ ...prev, [field]: newValues }));
    }
  };

  const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
  
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <form onSubmit={handleSubmit}>
          <h2>{scheme ? 'Edit Scheme' : 'Add New Scheme'}</h2>
          <fieldset>
            <legend>Basic Information</legend>
            <label>Scheme Name</label>
            <input type="text" name="schemeName" value={formData.schemeName} onChange={handleChange} required />
            <label>Department</label>
            <input type="text" name="department" value={formData.department} onChange={handleChange} required />
            <label>Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
            <label>Official URL</label>
            <input type="url" name="schemeUrl" value={formData.schemeUrl} onChange={handleChange} />
          </fieldset>
          <fieldset>
            <legend>Eligibility Criteria</legend>
            <div className="form-grid">
              <div><label>Min Age</label><input type="number" name="minAge" value={formData.eligibility.minAge} onChange={handleEligibilityChange} /></div>
              <div><label>Max Age</label><input type="number" name="maxAge" value={formData.eligibility.maxAge} onChange={handleEligibilityChange} /></div>
              <div><label>Max Annual Income (₹)</label><input type="number" name="maxIncome" value={formData.eligibility.maxIncome} onChange={handleEligibilityChange} /></div>
            </div>
            <label>Districts</label>
            <div className="checkbox-group">{keralDistricts.map(d => (<label key={d}><input type="checkbox" checked={formData.eligibility.districts.includes(d)} onChange={() => handleMultiSelectChange('eligibility', 'districts', d)} />{d}</label>))}</div>
            <label>Caste Category</label>
            <div className="checkbox-group">{['SC', 'ST', 'OBC', 'General'].map(c => (<label key={c}><input type="checkbox" checked={formData.eligibility.casteCategory.includes(c)} onChange={() => handleMultiSelectChange('eligibility', 'casteCategory', c)} />{c}</label>))}</div>
            <label>Special Categories</label>
            <div className="checkbox-group special-categories">
              <label><input type="checkbox" name="requiresWidow" checked={formData.eligibility.requiresWidow} onChange={handleEligibilityChange} />Widow / Single Parent</label>
              <label><input type="checkbox" name="requiresSeniorCitizen" checked={formData.eligibility.requiresSeniorCitizen} onChange={handleEligibilityChange} />Senior Citizen (60+)</label>
              <label><input type="checkbox" name="requiresDisabled" checked={formData.eligibility.requiresDisabled} onChange={handleEligibilityChange} />Differently Abled</label>
              <label><input type="checkbox" name="requiresOrphan" checked={formData.eligibility.requiresOrphan} onChange={handleEligibilityChange} />Orphan / Caregiver</label>
            </div>
          </fieldset>
          <fieldset>
            <legend>Required Documents</legend>
            <div className="checkbox-group">{documentOptions.map(doc => (<label key={doc}><input type="checkbox" checked={formData.requiredDocuments.includes(doc)} onChange={() => handleMultiSelectChange('requiredDocuments', null, doc)} />{doc}</label>))}</div>
          </fieldset>
          <div className="modal-actions">
            <button type="button" className="modal-btn cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="modal-btn save">Save Scheme</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Page Component
const SchemeManagement = () => {
  const [schemes, setSchemes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);

  // Dummy data for now
  useEffect(() => {
    setSchemes([
      { id: 1, schemeName: 'Vidhya Samunnathi Scholarship', department: 'Higher Education', eligibility: { minAge: 18, maxAge: 25 } },
      { id: 2, schemeName: 'Karunya Health Scheme', department: 'Health & Family Welfare', eligibility: { maxIncome: 300000 } },
    ]);
  }, []);

  const handleOpenModal = (scheme = null) => {
    setEditingScheme(scheme);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingScheme(null);
  };

  const handleSaveScheme = (schemeData) => {
    if (editingScheme) {
      setSchemes(schemes.map(s => s.id === editingScheme.id ? { ...s, ...schemeData } : s));
    } else {
      setSchemes([...schemes, { ...schemeData, id: Date.now() }]);
    }
    handleCloseModal();
  };

  return (
    <div className="admin-page-container">
      <header className="admin-header">
        <div>
          <h1>Scheme Management</h1>
          <p>Add, edit, or remove welfare schemes from the portal.</p>
        </div>
        <button className="add-scheme-btn" onClick={() => handleOpenModal()}>
          <Plus size={20} />
          Add New Scheme
        </button>
      </header>

      <div className="admin-toolbar">
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input type="text" placeholder="Search schemes..." className="search-input" />
        </div>
      </div>

      <div className="admin-table-container">
        <table className="schemes-table">
          <thead>
            <tr>
              <th>Scheme Name</th>
              <th>Department</th>
              <th>Eligibility</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schemes.map(scheme => (
              <tr key={scheme.id}>
                <td>{scheme.schemeName}</td>
                <td>{scheme.department}</td>
                <td>
                  {scheme.eligibility.minAge && `Age: ${scheme.eligibility.minAge}-${scheme.eligibility.maxAge || ''}`}
                  {scheme.eligibility.maxIncome && `Income < ₹${scheme.eligibility.maxIncome}`}
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn edit" onClick={() => handleOpenModal(scheme)}><Edit size={16} /></button>
                    <button className="action-btn delete"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SchemeFormModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSaveScheme} 
        scheme={editingScheme} 
      />
    </div>
  );
};

export default SchemeManagement;
