import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './userprofile.css';

const toSentenceCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const stored = JSON.parse(localStorage.getItem('user'));
  const loggedInUser = stored?.user || stored;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/api/user/profile/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };
    fetchUser();
  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleProfile = () => {
    setTimeout(() => {
      navigate(`/user/${loggedInUser?._id || loggedInUser?.id}`);
    }, 150);
  };

  if (!user) return <p className="loading">Loading...</p>;

  return (
    <div className="profile-outer-border">
      {/* Navbar */}
      <div className="profile-navbar">
        <div className="welcome-user" onClick={() => navigate('/dashboard')}>
          <img src="/uuss.svg" alt="User Icon" className="user-icon" />
          <span>Welcome {loggedInUser?.name || 'User'}</span>
        </div>
        <div className="navbar-buttons">
          <button className="profile-btn" onClick={handleProfile}>Profile</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Centered Buttons */}
      <div className="dashboard-actions">
        <button onClick={() => navigate('/create-trip')}>CREATE TRIP</button>
        <button onClick={() => navigate('/explore')}>EXPLORE</button>
        <button onClick={() => navigate('/match')}>FIND MATCHES</button>
        <button onClick={() => navigate('/inbox')}>INBOX</button>
        <button onClick={() => navigate('/edit-profile')}>EDIT PROFILE</button>
        <button onClick={() => navigate('/trips/' + userId)}>TRIP DETAILS</button>
      </div>

      {/* Profile Card */}
      <div className="user-profile-card">
        {user.profilePicture ? (
          <img src={user.profilePicture} alt="Profile" className="user-profile-pic" />
        ) : (
          <div className="user-profile-pic fallback">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <h2>{toSentenceCase(user.name)}</h2>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Age:</strong> {user.age || 'N/A'}</p>
        <p><strong>Gender:</strong> {user.gender || 'N/A'}</p>
        <p><strong>Bio:</strong> {user.bio || 'No bio'}</p>
        <p><strong>Hobbies:</strong> {user.interests?.join(', ') || 'None'}</p>

        <button
          className="edit-btn"
          onClick={() => navigate('/edit-profile')}
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default UserProfile;