import React, { useState, useEffect } from 'react';
import ProfileView from './ProfileView';
import EnteSchemeProfileForm from './EnteSchemeProfileForm';
import BackButton from './BackButton';
import { apiRequest, API_ENDPOINTS } from '../config/api';

const ProfilePage = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const profileData = await apiRequest(API_ENDPOINTS.GET_PROFILE(user.id));
        if (profileData && profileData.profile) {
          setProfile(profileData.profile);
        } else {
          // If no profile exists, go directly to edit/create mode
          setIsEditing(true);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        // If the profile is not found (404), we want to initiate creation mode.
        // For any other error, we show a message.
        if (err.message.includes('404') || err.message.toLowerCase().includes('not found')) {
          setIsEditing(true);
        } else {
          setError('Failed to load your profile. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleProfileSave = (savedProfile) => {
    setProfile(savedProfile);
    setIsEditing(false);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 2000);
  };

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const renderContent = () => {
    if (loading) {
      return <div>Loading your profile...</div>;
    }

    if (error) {
      return <div style={{ color: 'red' }}>{error}</div>;
    }

    if (isEditing) {
      return (
        <EnteSchemeProfileForm
          user={user}
          existingProfile={profile}
          onProfileComplete={handleProfileSave}
          onCancel={() => profile && setIsEditing(false)}
        />
      );
    }

    if (showSuccessMessage) {
      return (
        <div className="profile-view-container">
          <div className="profile-header">
            <h2>Profile Saved!</h2>
          </div>
        </div>
      );
    }

    if (profile) {
      return <ProfileView profile={profile} onEdit={() => setIsEditing(true)} theme={theme} toggleTheme={toggleTheme} />;
    }

    return <div>Could not determine profile state.</div>;
  };

  return (
    <div className="page-container-with-back-button">
      <BackButton />
      {renderContent()}
    </div>
  );





};

export default ProfilePage;
