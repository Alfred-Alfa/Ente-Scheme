import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const keralDistricts = [
  'All', 'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam',
  'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram', 'Kozhikode',
  'Wayanad', 'Kannur', 'Kasaragod'
];

const documentOptions = ['Aadhaar Card', 'Ration Card', 'Income Certificate', 'Caste Certificate', 'Disability Certificate', 'Bank Passbook'];

const maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];
const rationCardTypes = ['AAY', 'PHH', 'NPHH', 'NPS'];
const housingStatusOptions = ['Own House', 'Renting', 'Homeless'];
const occupationOptions = ['Farmer', 'Fisherman', 'Artisan', 'Labourer', 'Student', 'Unemployed', 'Self Employed', 'Retired', 'Other'];
const schemeCategories = ['Education', 'Healthcare', 'Agriculture', 'Housing', 'Employment', 'Welfare', 'Pension'];

const SchemeFormModal = ({ isOpen, onClose, onSave, scheme }) => {
  const initialState = {
    schemeName: '',
    department: '',
    description: '',
    schemeUrl: '',
    category: '',
    startDate: '',
    endDate: '',
    eligibility: {
      minAge: '',
      maxAge: '',
      maxIncome: '',
      gender: 'Any',
      districts: [],
      casteCategory: [],
      requiresWidow: false,
      requiresSeniorCitizen: false,
      requiresDisabled: false,
      requiresOrphan: false,
      educationLevel: [],
      occupation: [],
      maritalStatus: [],
      rationCardType: [],
      isBPL: false,
      housingStatus: [],
      minMarks: '',
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
    setFormData(prev => ({
      ...prev,
      eligibility: {
        ...prev.eligibility,
        [name]: type === 'checkbox' ? checked : value,
      }
    }));
  };

  const handleMultiSelectChange = (field, subfield, value) => {
    const currentValues = subfield ? formData[field][subfield] : formData[field];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(item => item !== value)
      : [...currentValues, value];

    if (subfield) {
      setFormData(prev => ({ ...prev, [field]: { ...prev[field], [subfield]: newValues } }));
    } else {
      setFormData(prev => ({ ...prev, [field]: newValues }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };
  
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <button type="button" className="modal-close-btn" onClick={onClose}><X size={24} /></button>
          <h2>{scheme ? 'Edit Scheme' : 'Add New Scheme'}</h2>
          
          <div className="modal-body">
            <fieldset>
              <legend>Basic Information</legend>
              <div className="form-group">
                <label>Scheme Name</label>
                <input type="text" name="schemeName" value={formData.schemeName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Department</label>
                <input type="text" name="department" value={formData.department} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
              </div>
              <div className="form-group">
                <label>Official URL</label>
                <input type="url" name="schemeUrl" value={formData.schemeUrl} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange} required>
                  <option value="">Select a Category</option>
                  {schemeCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Start Date</label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                </div>
              </div>
            </fieldset>
            
            <fieldset>
              <legend>Eligibility Criteria</legend>
              <div className="form-grid">
                <div><label>Min Age</label><input type="number" name="minAge" value={formData.eligibility.minAge} onChange={handleEligibilityChange} /></div>
                <div><label>Max Age</label><input type="number" name="maxAge" value={formData.eligibility.maxAge} onChange={handleEligibilityChange} /></div>
                <div><label>Max Annual Income (₹)</label><input type="number" name="maxIncome" value={formData.eligibility.maxIncome} onChange={handleEligibilityChange} /></div>
              </div>

              <label>Gender</label>
              <div className="radio-group">
                {['Any', 'Male', 'Female'].map(g => (
                  <label key={g}><input type="radio" name="gender" value={g} checked={formData.eligibility.gender === g} onChange={handleEligibilityChange} /><span>{g}</span></label>
                ))}
              </div>
              
              <label>Districts</label>
              <div className="checkbox-group">
                  {keralDistricts.map(d => (
                      <label key={d}><input type="checkbox" checked={formData.eligibility.districts.includes(d)} onChange={() => handleMultiSelectChange('eligibility', 'districts', d)} /><span>{d}</span></label>
                  ))}
              </div>

              <label>Caste Category</label>
               <div className="checkbox-group">
                  {['SC', 'ST', 'OBC', 'General'].map(c => (
                      <label key={c}><input type="checkbox" checked={formData.eligibility.casteCategory.includes(c)} onChange={() => handleMultiSelectChange('eligibility', 'casteCategory', c)} /><span>{c}</span></label>
                  ))}
              </div>

              <div className="checkbox-group special-categories">
                <label><input type="checkbox" name="requiresWidow" checked={formData.eligibility.requiresWidow} onChange={handleEligibilityChange} /><span>Widow / Single Parent</span></label>
                <label><input type="checkbox" name="requiresSeniorCitizen" checked={formData.eligibility.requiresSeniorCitizen} onChange={handleEligibilityChange} /><span>Senior Citizen (60+)</span></label>
                <label><input type="checkbox" name="requiresDisabled" checked={formData.eligibility.requiresDisabled} onChange={handleEligibilityChange} /><span>Differently Abled</span></label>
                <label><input type="checkbox" name="requiresOrphan" checked={formData.eligibility.requiresOrphan} onChange={handleEligibilityChange} /><span>Orphan / Caregiver</span></label>
            </div>

            <label>Marital Status</label>
            <div className="checkbox-group">
              {maritalStatusOptions.map(status => (
                <label key={status}><input type="checkbox" checked={formData.eligibility.maritalStatus.includes(status)} onChange={() => handleMultiSelectChange('eligibility', 'maritalStatus', status)} /><span>{status}</span></label>
              ))}
            </div>

            <label>Ration Card Type</label>
            <div className="checkbox-group">
              {rationCardTypes.map(type => (
                <label key={type}><input type="checkbox" checked={formData.eligibility.rationCardType.includes(type)} onChange={() => handleMultiSelectChange('eligibility', 'rationCardType', type)} /><span>{type}</span></label>
              ))}
            </div>

            <label>Housing Status</label>
            <div className="checkbox-group">
              {housingStatusOptions.map(status => (
                <label key={status}><input type="checkbox" checked={formData.eligibility.housingStatus.includes(status)} onChange={() => handleMultiSelectChange('eligibility', 'housingStatus', status)} /><span>{status}</span></label>
              ))}
            </div>

            <label>Occupation</label>
            <div className="checkbox-group">
              {occupationOptions.map(occ => (
                <label key={occ}><input type="checkbox" checked={formData.eligibility.occupation.includes(occ)} onChange={() => handleMultiSelectChange('eligibility', 'occupation', occ)} /><span>{occ}</span></label>
              ))}
            </div>

            <label>Below Poverty Line (BPL)</label>
            <div className="checkbox-group">
              <label><input type="checkbox" name="isBPL" checked={formData.eligibility.isBPL} onChange={handleEligibilityChange} /><span>Required</span></label>
            </div>

            {formData.eligibility.occupation.includes('Student') && (
              <>
                <label>Minimum Marks (%)</label>
                <input type="number" name="minMarks" value={formData.eligibility.minMarks} onChange={handleEligibilityChange} />
              </>
            )}
            </fieldset>

            <fieldset>
              <legend>Required Documents</legend>
              <div className="checkbox-group">
                {documentOptions.map(doc => (
                  <label key={doc}><input type="checkbox" checked={formData.requiredDocuments.includes(doc)} onChange={() => handleMultiSelectChange('requiredDocuments', null, doc)} /><span>{doc}</span></label>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-btn cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="modal-btn save">Save Scheme</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SchemeFormModal;
