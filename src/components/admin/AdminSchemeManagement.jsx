import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import SchemeFormModal from './SchemeFormModal';
import BackButton from '../BackButton';
import './AdminSchemeManagement.css';

const AdminSchemeManagement = () => {
  const [schemes, setSchemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScheme, setEditingScheme] = useState(null);
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [schemeToDelete, setSchemeToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch schemes from the API
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        setIsLoading(true);
        // Using mock data for demonstration
        const mockSchemes = [
            { id: 'sch_001', schemeName: 'Karunya Arogya Suraksha Padhathi', department: 'Health', eligibility: { maxIncome: 100000, districts: ['All'] } },
            { id: 'sch_002', schemeName: 'Vidyajyothi Scheme', department: 'Education', eligibility: { requiresDisabled: true, educationLevel: ['Currently Student'] } },
        ];
        setSchemes(mockSchemes);

      } catch (err) {
        setError('Failed to fetch schemes.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchemes();
  }, []);

  const handleAddNewScheme = () => {
    setEditingScheme(null);
    setIsModalOpen(true);
  };

  const handleEditScheme = (scheme) => {
    setEditingScheme(scheme);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (scheme) => {
    setSchemeToDelete(scheme);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!schemeToDelete) return;
    try {
      setSchemes(prev => prev.filter(s => s.id !== schemeToDelete.id));
      setIsDeleteDialogOpen(false);
      setSchemeToDelete(null);
    } catch (error) {
      console.error('Failed to delete scheme:', error);
    }
  };

  const handleSaveScheme = (schemeData) => {
    if (editingScheme) {
      setSchemes(prev => prev.map(s => s.id === schemeData.id ? schemeData : s));
    } else {
      const newScheme = { ...schemeData, id: `sch_${Date.now()}`  };
      setSchemes(prev => [...prev, newScheme]);
    }
    setIsModalOpen(false);
  };

  const filteredSchemes = schemes.filter(scheme =>
    scheme.schemeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scheme.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page-container page-container-with-back-button">
      <BackButton />
      <header className="admin-header">
        <div className="admin-header-left">
          <h1>Scheme Management</h1>
          <p>Create, update, and manage all welfare schemes available in the system.</p>
        </div>
        <button className="add-scheme-btn" onClick={handleAddNewScheme}>
          <Plus size={18} />
          <span>Add New Scheme</span>
        </button>
      </header>

      <div className="admin-toolbar">
        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Search by name or department..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="admin-table-container">
        {isLoading ? (
          <p>Loading schemes...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <table className="schemes-table">
            <thead>
              <tr>
                <th>Scheme Name</th>
                <th>Department</th>
                <th>Eligibility Summary</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSchemes.map(scheme => (
                <tr key={scheme.id}>
                  <td>{scheme.schemeName}</td>
                  <td>{scheme.department}</td>
                  <td>
                    {scheme.eligibility?.maxIncome && `Income < ₹${scheme.eligibility.maxIncome}` }
                    {scheme.eligibility?.requiresDisabled && ', Differently Abled'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="action-btn edit" onClick={() => handleEditScheme(scheme)}>
                        <Edit size={16} />
                      </button>
                      <button className="action-btn delete" onClick={() => handleDeleteRequest(scheme)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {isModalOpen && (
        <SchemeFormModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveScheme}
          scheme={editingScheme}
        />
      )}

      {isDeleteDialogOpen && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-content">
            <Trash2 size={40} className="delete-modal-icon" />
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete the scheme "<strong>{schemeToDelete?.schemeName}</strong>"? This action cannot be undone.</p>
            <div className="delete-modal-actions">
              <button className="modal-btn cancel" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</button>
              <button className="modal-btn confirm-delete" onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSchemeManagement;
