import React, { useState, useEffect } from 'react';
import { XIcon } from './icons';
import FormField from './FormField';
import CheckboxPill from './CheckboxPill';

const SchemeFormModal = ({ isOpen, onClose, onSave, scheme }) => {
    const initialFormState = {
        schemeName: '', department: '', description: '', url: '',
        eligibility: {
            age: { min: '', max: '' },
            maxIncome: '',
            gender: 'Any',
            maritalStatus: [],
            districts: [],
            requiresBPL: false,
            rationCardTypes: [],
            casteCategories: [],
            requiresDisability: false,
            minDisabilityPercentage: '',
            occupations: [],
            educationLevels: [],
            requiredDocuments: []
        }
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (isOpen) {
            setFormData(scheme ? JSON.parse(JSON.stringify(scheme)) : initialFormState); // Deep copy
        }
    }, [scheme, isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const keys = name.split('.');

        setFormData(prev => {
            let updated = { ...prev };
            let current = updated;
            for(let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = type === 'checkbox' ? checked : value;
            return updated;
        });
    };

    const handleArrayChange = (e) => {
        const { name, value, checked } = e.target;
        const keys = name.split('.'); // e.g., 'eligibility.districts'
        
        setFormData(prev => {
            let updated = JSON.parse(JSON.stringify(prev)); // Deep copy
            let current = updated;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            const arrayField = keys[keys.length - 1];
            const currentArray = current[arrayField] || [];
            
            if (checked) {
                current[arrayField] = [...currentArray, value];
            } else {
                current[arrayField] = currentArray.filter(item => item !== value);
            }
            
            return updated;
        });
    };

    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };
    
    // Data for options
    const keralDistricts = ['Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam', 'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram', 'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'];
    const maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed'];
    const rationTypes = ['APL', 'BPL', 'AAY', 'PHH', 'NPHH', 'NPS'];
    const castes = ['SC', 'ST', 'OBC', 'General', 'General (EWS)'];
    const occupations = ['Farmer', 'Fisherman', 'Artisan', 'Labourer', 'Student', 'Unemployed', 'Self Employed', 'Retired', 'Other'];
    const educations = ['Below SSLC', 'SSLC', 'Plus Two', 'Graduate', 'Post Graduate', 'Currently Student'];
    const documents = ['Aadhaar Card', 'Ration Card', 'Income Certificate', 'Caste Certificate', 'Disability Certificate', 'Bank Passbook', 'Educational Certificates'];
    
    return (
        <div className="modal-overlay modal-overlay-animated">
            <div className="modal-content modal-content-animated">
                <header className="modal-header"><h2 className="modal-title">{scheme ? 'Edit Scheme' : 'Add New Scheme'}</h2><button onClick={onClose} className="modal-close-btn"><XIcon s={20}/></button></header>
                <form onSubmit={handleSubmit} className="modal-form">
                   <div className="modal-body">
                        <fieldset>
                            <legend className="modal-legend">Basic Scheme Details</legend>
                            <div className="form-grid-2">
                                <FormField label="Scheme Name"><input type="text" name="schemeName" value={formData.schemeName} onChange={handleInputChange} className="form-input" required /></FormField>
                                <FormField label="Department"><input type="text" name="department" value={formData.department} onChange={handleInputChange} className="form-input" required /></FormField>
                                <FormField label="Description"><textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" className="form-textarea"></textarea></FormField>
                                <FormField label="Official URL"><input type="url" name="url" value={formData.url} onChange={handleInputChange} className="form-input" /></FormField>
                            </div>
                        </fieldset>

                        <fieldset className="fieldset-separator">
                            <legend className="modal-legend">Eligibility Criteria</legend>
                            <div className="space-y-6">
                                <div className="form-grid-4">
                                    <FormField label="Min Age" tip="Leave blank for no minimum age."><input type="number" name="eligibility.age.min" value={formData.eligibility.age.min} onChange={handleInputChange} className="form-input" /></FormField>
                                    <FormField label="Max Age" tip="Leave blank for no maximum age."><input type="number" name="eligibility.age.max" value={formData.eligibility.age.max} onChange={handleInputChange} className="form-input" /></FormField>
                                    <FormField label="Max Annual Income (₹)" tip="Maximum household income allowed."><input type="number" name="eligibility.maxIncome" value={formData.eligibility.maxIncome} onChange={handleInputChange} className="form-input" /></FormField>
                                    <FormField label="Gender"><select name="eligibility.gender" value={formData.eligibility.gender} onChange={handleInputChange} className="form-select"><option>Any</option><option>Male</option><option>Female</option><option>Other</option></select></FormField>
                                </div>
                                <FormField label="Marital Status" tip="Select all that apply. Leave blank if not applicable.">
                                    <div className="form-field-group">{maritalStatuses.map(s => <CheckboxPill key={s} id={`ms-${s}`} name="eligibility.maritalStatus" value={s} checked={formData.eligibility.maritalStatus.includes(s)} onChange={handleArrayChange}>{s}</CheckboxPill>)}</div>
                                </FormField>
                                <FormField label="Applicable Districts" tip="Select all that apply. Leave blank for statewide schemes.">
                                    <div className="form-field-group districts">{keralDistricts.map(d => <CheckboxPill key={d} id={`dist-${d}`} name="eligibility.districts" value={d} checked={formData.eligibility.districts.includes(d)} onChange={handleArrayChange}>{d}</CheckboxPill>)}</div>
                                </FormField>
                                <div className="form-grid-2">
                                    <div>
                                        <label className="checkbox-label"><input type="checkbox" name="eligibility.requiresBPL" checked={formData.eligibility.requiresBPL} onChange={handleInputChange} /> Must be Below Poverty Line (BPL)</label>
                                        <FormField label="Ration Card Types" tip="Select applicable ration card types.">
                                            <div className="form-field-group">{rationTypes.map(r => <CheckboxPill key={r} id={`rat-${r}`} name="eligibility.rationCardTypes" value={r} checked={formData.eligibility.rationCardTypes.includes(r)} onChange={handleArrayChange}>{r}</CheckboxPill>)}</div>
                                        </FormField>
                                    </div>
                                    <div>
                                        <label className="checkbox-label"><input type="checkbox" name="eligibility.requiresDisability" checked={formData.eligibility.requiresDisability} onChange={handleInputChange} /> Must be Differently-Abled</label>
                                        {formData.eligibility.requiresDisability && <FormField label="Min Disability %" tip="Minimum disability percentage to qualify."><input type="number" name="eligibility.minDisabilityPercentage" value={formData.eligibility.minDisabilityPercentage} onChange={handleInputChange} className="form-input" /></FormField>}
                                    </div>
                                </div>
                                <FormField label="Caste Categories" tip="Select applicable caste categories."><div className="form-field-group castes">{castes.map(c => <CheckboxPill key={c} id={`caste-${c}`} name="eligibility.casteCategories" value={c} checked={formData.eligibility.casteCategories.includes(c)} onChange={handleArrayChange}>{c}</CheckboxPill>)}</div></FormField>
                                <FormField label="Target Occupations"><div className="form-field-group occupations">{occupations.map(o => <CheckboxPill key={o} id={`occ-${o}`} name="eligibility.occupations" value={o} checked={formData.eligibility.occupations.includes(o)} onChange={handleArrayChange}>{o}</CheckboxPill>)}</div></FormField>
                                <FormField label="Education Levels"><div className="form-field-group educations">{educations.map(e => <CheckboxPill key={e} id={`edu-${e}`} name="eligibility.educationLevels" value={e} checked={formData.eligibility.educationLevels.includes(e)} onChange={handleArrayChange}>{e}</CheckboxPill>)}</div></FormField>
                                <FormField label="Required Documents"><div className="form-field-group documents">{documents.map(d => <CheckboxPill key={d} id={`doc-${d}`} name="eligibility.requiredDocuments" value={d} checked={formData.eligibility.requiredDocuments.includes(d)} onChange={handleArrayChange}>{d}</CheckboxPill>)}</div></FormField>
                            </div>
                        </fieldset>
                    </div>
                    <footer className="modal-footer"><button type="button" onClick={onClose} className="modal-btn cancel">Cancel</button><button type="submit" className="modal-btn save">Save Scheme</button></footer>
                </form>
            </div>
        </div>
    );
};

export default SchemeFormModal;
