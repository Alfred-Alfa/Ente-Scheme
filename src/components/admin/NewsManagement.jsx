import React, { useState, useEffect } from 'react';
import { apiRequest, API_ENDPOINTS } from '../../config/api';
import { Plus, Trash2, Edit, AlertTriangle, Star } from 'lucide-react';
import BackButton from '../BackButton';
import './NewsManagement.css';

const NewsManagement = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    startDate: '',
    endDate: '',
    isImportant: false,
    category: 'Update',
  });
  const [editingId, setEditingId] = useState(null);

  const newsCategories = ['Update', 'Breaking', 'New', 'Announcement', 'Reminder', 'Policy', 'Exclusive', 'Extended'];

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setIsLoading(true);
      const data = await apiRequest(API_ENDPOINTS.GET_NEWS);
      setNewsItems(data.news || []);
    } catch (err) {
      setError('Failed to fetch news items. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.title || !formData.content) {
      setError('Title and content are required.');
      return;
    }

    try {
      if (editingId) {
        await apiRequest(API_ENDPOINTS.UPDATE_NEWS(editingId), {
          method: 'PUT',
          body: JSON.stringify(formData),
        });
      } else {
        await apiRequest(API_ENDPOINTS.CREATE_NEWS, { 
          method: 'POST', 
          body: JSON.stringify(formData) 
        });
      }
      setFormData({ title: '', content: '', startDate: '', endDate: '', isImportant: false, category: 'Update' });
      setEditingId(null);
      fetchNews();
    } catch (err) {
      setError(editingId ? 'Failed to update news item.' : 'Failed to add news item.');
      console.error(err);
    }
  };

  const handleDelete = async (newsId) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      try {
        await apiRequest(API_ENDPOINTS.DELETE_NEWS(newsId), { method: 'DELETE' });
        fetchNews(); // Refresh list
      } catch (err) {
        setError('Failed to delete news item.');
        console.error(err);
      }
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setFormData({
      title: item.title,
      content: item.content,
      startDate: item.startDate ? new Date(item.startDate).toISOString().split('T')[0] : '',
      endDate: item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : '',
      isImportant: item.isImportant,
      category: item.category,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ title: '', content: '', startDate: '', endDate: '', isImportant: false, category: 'Update' });
  };

  return (
    <div className="news-management-container page-container-with-back-button">
      <BackButton />
      <header className="nm-header">
        <h1>News & Updates Management</h1>
        <p>Create, edit, and manage news items for the portal.</p>
      </header>
      <div className="nm-content">
        {/* Add News Form */}
        <div className="nm-form-card">
          <h2>{editingId ? 'Edit News Item' : 'Add New News Item'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea id="content" name="content" value={formData.content} onChange={handleInputChange} rows="4" required></textarea>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <input type="date" id="startDate" name="startDate" value={formData.startDate} onChange={handleInputChange} />
              </div>
              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <input type="date" id="endDate" name="endDate" value={formData.endDate} onChange={handleInputChange} />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={formData.category} onChange={handleInputChange}>
                {newsCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="form-group checkbox-group">
              <input type="checkbox" id="isImportant" name="isImportant" checked={formData.isImportant} onChange={handleInputChange} />
              <label htmlFor="isImportant">Mark as Important</label>
            </div>
            {error && <p className="error-message"><AlertTriangle size={16} /> {error}</p>}
            <div className="form-actions">
              <button type="submit" className="submit-btn">{editingId ? 'Update News' : <><Plus size={18} /> Add News</>}</button>
              {editingId && <button type="button" className="cancel-btn" onClick={handleCancelEdit}>Cancel</button>}
            </div>
          </form>
        </div>

        {/* News List */}
        <div className="nm-list-card">
          <h2>Existing News Items</h2>
          {isLoading ? (
            <p>Loading news...</p>
          ) : newsItems.length === 0 ? (
            <p>No news items found.</p>
          ) : (
            <ul className="news-item-list">
              {newsItems.map(item => (
                <li key={item._id} className={`news-item ${item.isImportant ? 'important' : ''}`}>
                  <div className="news-item-content">
                    <h3>
                      {item.title}
                      {item.isImportant && <span title="Important"><Star size={16} className="important-icon" /></span>}
                    </h3>
                    <p>{item.content}</p>
                    <div className="news-item-meta">
                      {item.category && <span className={`news-tag ${item.category.toLowerCase()}`}>{item.category}</span>}
                      <span><strong>Starts:</strong> {item.startDate ? new Date(item.startDate).toLocaleDateString() : 'N/A'}</span>
                      <span><strong>Ends:</strong> {item.endDate ? new Date(item.endDate).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  </div>
                  <div className="news-item-actions">
                    <button className="action-btn edit-btn" onClick={() => handleEdit(item)}><Edit size={16} /> Edit</button>
                    <button className="action-btn delete-btn" onClick={() => handleDelete(item._id)}><Trash2 size={16} /> Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewsManagement;
