import React from 'react';
import { X, Star, Calendar, Flag } from 'lucide-react';
import './NewsModal.css';

const NewsModal = ({ newsItem, onClose }) => {
  if (!newsItem) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        <header className="modal-header">
          <h2>
            {newsItem.title}
            {newsItem.isImportant && <Star size={20} className="important-icon-modal" />}
          </h2>
          <div className="modal-meta">
            {newsItem.category && (
              <span className={`news-tag modal-tag ${newsItem.category.toLowerCase()}`}>
                <Flag size={14} /> {newsItem.category}
              </span>
            )}
          </div>
        </header>
        <div className="modal-body">
          <div className="modal-dates">
            {newsItem.startDate && (
              <span className="date-info">
                <Calendar size={14} />
                <strong>Effective from:</strong> {formatDate(newsItem.startDate)}
              </span>
            )}
            {newsItem.endDate && (
              <span className="date-info deadline">
                <Calendar size={14} />
                <strong>Deadline:</strong> {formatDate(newsItem.endDate)}
              </span>
            )}
          </div>
          <p>{newsItem.content}</p>
        </div>
      </div>
    </div>
  );
};

export default NewsModal;
