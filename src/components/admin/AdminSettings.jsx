import React from 'react';
import BackButton from '../BackButton';

const AdminSettings = () => {
  return (
    <div className="page-container-with-back-button" style={{ padding: '2rem' }}>
      <BackButton />
      <h1>Admin Settings</h1>
      <p>This is the admin settings page. More settings will be added here soon.</p>
    </div>
  );
};

export default AdminSettings;
