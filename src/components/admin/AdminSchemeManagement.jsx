import React, { useState, useEffect } from 'react';
import { PlusIcon, EditIcon, Trash2Icon, SearchIcon, ArrowLeftIcon } from './icons';
import SchemeFormModal from './SchemeFormModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EligibilityTag from './EligibilityTag';
import BackButton from '../BackButton';
import './EnhancedAdminScheme.css';

const MOCK_SCHEMES_DETAILED = [
    {
        id: 'sch_001',
        schemeName: 'Karunya Arogya Suraksha Padhathi',
        department: 'Health',
        description: 'Comprehensive health insurance scheme for low-income families.',
        url: 'https://sha.kerala.gov.in/karunya-arogya-suraksha-padhathi-kasp/',
        eligibility: {
            age: { min: 0, max: 100 },
            maxIncome: 100000,
            gender: 'Any',
            maritalStatus: [],
            districts: [],
            requiresBPL: true,
            rationCardTypes: ['BPL', 'AAY'],
            casteCategories: [],
            requiresDisability: false,
            minDisabilityPercentage: 0,
            occupations: [],
            educationLevels: [],
            requiredDocuments: ['Aadhaar Card', 'Ration Card', 'Income Certificate']
        }
    },
    {
        id: 'sch_002',
        schemeName: 'Vidyajyothi Scheme',
        department: 'Education',
        description: 'Financial assistance for the education of differently-abled students.',
        url: 'https://scholarship.gov.in/',
        eligibility: {
            age: { min: 5, max: 25 },
            maxIncome: 200000,
            gender: 'Any',
            maritalStatus: ['Single'],
            districts: [],
            requiresBPL: false,
            rationCardTypes: [],
            casteCategories: [],
            requiresDisability: true,
            minDisabilityPercentage: 40,
            occupations: ['Student'],
            educationLevels: ['Currently Student'],
            requiredDocuments: ['Aadhaar Card', 'Disability Certificate', 'Educational Certificates']
        }
    },
];

const EligibilitySummary = ({ eligibility }) => (
    <div>
        {eligibility.maxIncome && <EligibilityTag color="green">Income &lt; ₹{new Intl.NumberFormat('en-IN').format(eligibility.maxIncome)}</EligibilityTag>}
        {eligibility.requiresDisability && <EligibilityTag color="purple">Differently Abled {eligibility.minDisabilityPercentage && `(${eligibility.minDisabilityPercentage}%)` }</EligibilityTag>}
        {eligibility.gender !== 'Any' && <EligibilityTag color="yellow">{eligibility.gender}</EligibilityTag>}
        {eligibility.age?.min || eligibility.age?.max ? <EligibilityTag color="gray">Age: {eligibility.age.min || 'Any'} - {eligibility.age.max || 'Any'}</EligibilityTag> : null}
        {eligibility.requiresBPL && <EligibilityTag color="blue">BPL Only</EligibilityTag>}
        {eligibility.casteCategories?.length > 0 && <EligibilityTag color="gray">{eligibility.casteCategories.join(', ')}</EligibilityTag>}
    </div>
);

const AdminSchemeManagement = () => {
    const [schemes, setSchemes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingScheme, setEditingScheme] = useState(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [schemeToDelete, setSchemeToDelete] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => { setTimeout(() => { setIsLoading(false); setSchemes(MOCK_SCHEMES_DETAILED); }, 1000); }, []);

    const handleAddNewScheme = () => { setEditingScheme(null); setIsModalOpen(true); };
    const handleEditScheme = (scheme) => { setEditingScheme(scheme); setIsModalOpen(true); };
    const handleDeleteRequest = (scheme) => { setSchemeToDelete(scheme); setIsDeleteDialogOpen(true); };
    const confirmDelete = () => { setSchemes(p => p.filter(s => s.id !== schemeToDelete.id)); setIsDeleteDialogOpen(false); };
    const handleSaveScheme = (data) => {
        if (editingScheme) { setSchemes(p => p.map(s => s.id === data.id ? data : s)); } 
        else { const newScheme = { ...data, id: `sch_${Date.now()}`  }; setSchemes(p => [newScheme, ...p]); }
        setIsModalOpen(false);
    };

    const filteredSchemes = schemes.filter(s => s.schemeName.toLowerCase().includes(searchTerm.toLowerCase()) || s.department.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="admin-page-enhanced">
            <BackButton />
            <header className="admin-header-enhanced"><div className="header-content"><div><h1>Scheme Management</h1><p>Define schemes and their detailed eligibility rules for automated user matching.</p></div><button onClick={handleAddNewScheme} className="add-scheme-btn-enhanced"><PlusIcon s={16}/><span>Add New Scheme</span></button></div></header>
            <div className="search-container-enhanced"><div className="search-icon"><SearchIcon /></div><input type="text" placeholder="Search schemes..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input-enhanced"/></div>
            <div className="table-container-enhanced">
                <div className="table-wrapper-enhanced">
                    {isLoading ? <div className="loading-container"><div className="spinner"></div><p>Loading schemes...</p></div> : (
                        <table className="schemes-table-enhanced">
                            <thead><tr><th>Scheme Name</th><th>Department</th><th>Eligibility Summary</th><th className="actions-cell">Actions</th></tr></thead>
                            <tbody>
                                {filteredSchemes.length > 0 ? filteredSchemes.map(scheme => (
                                    <tr key={scheme.id}>
                                        <th className="scheme-name">{scheme.schemeName}</th>
                                        <td>{scheme.department}</td>
                                        <td className="max-w-lg"><EligibilitySummary eligibility={scheme.eligibility} /></td>
                                        <td className="actions-cell"><div className="actions-container"><button onClick={() => handleEditScheme(scheme)} className="action-btn"><EditIcon/></button><button onClick={() => handleDeleteRequest(scheme)} className="action-btn delete"><Trash2Icon/></button></div></td>
                                    </tr>
                                )) : (<tr><td colSpan="4" className="empty-state">No schemes found.</td></tr>)}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <SchemeFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveScheme} scheme={editingScheme}/>
            <DeleteConfirmationModal isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} onConfirm={confirmDelete} schemeName={schemeToDelete?.schemeName}/>
        </div>
    );
};

export default AdminSchemeManagement;
