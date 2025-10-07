import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FileText, Bell, Settings } from 'lucide-react';

const AdminNav = ({ user, onLogout }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className="admin-nav">
      <div className="admin-user-info">
        <div className="admin-avatar">
          {user?.name?.charAt(0).toUpperCase() || 'A'}
        </div>
        <div className="admin-details">
          <div className="admin-name">{user?.name || 'Admin'}</div>
          <div className="admin-email">{user?.email || 'admin@example.com'}</div>
        </div>
      </div>

      <Link to="/schemes" className={`nav-section ${isActive('/schemes') ? 'active' : ''}`}>
        <FileText size={18} className="nav-icon" />
        <span>Manage Schemes</span>
      </Link>

      <Link to="/news" className={`nav-section ${isActive('/news') ? 'active' : ''}`}>
        <Bell size={18} className="nav-icon" />
        <span>News & Updates</span>
      </Link>

      {/* Admin Settings */}
      <Link 
        to="/admin/settings" 
        className={`nav-section ${isActive('/admin') ? 'active' : ''}`}
      >
        <Settings size={18} className="nav-icon" />
        <span>Admin Settings</span>
      </Link>
    </div>
  );
};

export default AdminNav;

// Add these styles to your AdminNav.css
/*
.admin-user-info {
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 1rem;
  background-color: rgba(13, 110, 253, 0.05);
  border-radius: 8px;
}

.admin-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #0d6efd;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 12px;
}

.admin-details {
  flex: 1;
}

.admin-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #333;
}

.admin-email {
  font-size: 0.75rem;
  color: #666;
  margin-top: 2px;
}
*/
