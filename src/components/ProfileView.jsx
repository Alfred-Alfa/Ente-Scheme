import React from 'react';
import { User, Mail, Phone, MapPin, Edit, Sun, Moon, Briefcase, GraduationCap, Shield } from 'lucide-react';
import './ProfileView.css';

const ProfileView = ({ profile, onEdit, theme, toggleTheme }) => {
  if (!profile) {
    return <div className="profile-view-container">Loading profile...</div>;
  }

  const { fullName, email, phone, address, district, pinCode, age, gender, maritalStatus, annualIncome, isBPL, rationCardType, housingStatus, casteCategory, educationLevel, occupation, currentCourse, marksPercentage, isStudent, isWidow, isSeniorCitizen, isDisabled, isOrphan } = profile;

  const specialCategories = [
    isStudent && 'Student',
    isWidow && 'Widow / Single Parent',
    isSeniorCitizen && 'Senior Citizen',
    isDisabled && 'Differently Abled',
    isOrphan && 'Orphan / Caregiver',
  ].filter(Boolean);

  const DetailItem = ({ icon: Icon, label, value }) => (
    <div className="detail-item">
      <Icon className="detail-icon" size={20} />
      <div className="detail-content">
        <span className="detail-label">{label}</span>
        <span className="detail-value">{value || 'Not provided'}</span>
      </div>
    </div>
  );

  return (
    <div className={`profile-view-container ${theme}`}>
      <button onClick={toggleTheme} className="theme-toggle-btn">
        {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
      </button>
      <div className="profile-header">
        <div className="profile-avatar">
          {fullName && fullName.substring(0, 2).toUpperCase()}
        </div>
        <div className="profile-title">
          <h2>{fullName}</h2>
          <p>Your personal account details</p>
        </div>
        <button onClick={onEdit} className="edit-profile-btn">
          <Edit size={16} />
          <span>Edit Profile</span>
        </button>
      </div>

      <div className="profile-section">
        <h3 className="section-title">Personal Information</h3>
        <div className="profile-details-grid">
          <DetailItem icon={User} label="Full Name" value={fullName} />
          <DetailItem icon={User} label="Age" value={age} />
          <DetailItem icon={User} label="Gender" value={gender} />
          <DetailItem icon={User} label="Marital Status" value={maritalStatus} />
        </div>
      </div>

      <div className="profile-section">
        <h3 className="section-title">Contact Details</h3>
        <div className="profile-details-grid">
          <DetailItem icon={Mail} label="Email Address" value={email} />
          <DetailItem icon={Phone} label="Phone Number" value={phone} />
        </div>
      </div>

      <div className="profile-section">
        <h3 className="section-title">Residential Information</h3>
        <div className="profile-details-grid">
          <DetailItem icon={MapPin} label="Address" value={`${address}, ${district} - ${pinCode}`} />
          <DetailItem icon={MapPin} label="Housing Status" value={housingStatus} />
        </div>
      </div>

      <div className="profile-section">
        <h3 className="section-title">Financial Information</h3>
        <div className="profile-details-grid">
          <DetailItem icon={User} label="Annual Income" value={`₹ ${annualIncome}`} />
          <DetailItem icon={Shield} label="BPL Status" value={isBPL ? 'Yes' : 'No'} />
          <DetailItem icon={Shield} label="Ration Card Type" value={rationCardType} />
        </div>
      </div>

      <div className="profile-section">
        <h3 className="section-title">Special Categories</h3>
        <div className="profile-details-grid">
          {specialCategories.length > 0 ? (
            specialCategories.map(category => <DetailItem key={category} icon={Shield} label="Category" value={category} />)
          ) : (
            <DetailItem icon={Shield} label="Categories" value="No special categories selected" />
          )}
        </div>
      </div>

      <div className="profile-section">
        <h3 className="section-title">Additional Information</h3>
        <div className="profile-details-grid">
          <DetailItem icon={Shield} label="Caste Category" value={casteCategory} />
          <DetailItem icon={GraduationCap} label="Education Level" value={educationLevel} />
          <DetailItem icon={Briefcase} label="Occupation" value={occupation} />
          {occupation === 'Student' && (
            <>
              <DetailItem icon={GraduationCap} label="Current Course" value={currentCourse} />
              <DetailItem icon={GraduationCap} label="Marks Percentage" value={`${marksPercentage}%`} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
