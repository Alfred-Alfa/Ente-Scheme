import React from 'react';
import BackButton from './BackButton';
import './EligibilityMatchedScheme.css';

const EligibilityMatchedScheme = () => {
  return (
    <div className="page-container-with-back-button">
      <BackButton />
      <div className="eligibility-page-container">
        <header className="eligibility-header">
          <h1>Check Your Scheme Eligibility</h1>
          <p>Discover the welfare schemes you are matched with based on your profile.</p>
        </header>
        <div className="eligibility-content">
          {/* Placeholder for matched schemes */}
          <p>Matched schemes will be displayed here soon.</p>
        </div>
      </div>
    </div>
  );
};

export default EligibilityMatchedScheme;
