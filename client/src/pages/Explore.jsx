import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import './explore.css';

const toSentenceCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const Explore = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user'));
    const id = stored?.user?._id || stored?.user?.id;
    if (id) {
      setCurrentUserId(id);
    }
  }, []);

  useEffect(() => {
    if (!currentUserId) return;
    const fetchUsers = async () => {
      try {
        const res = await api.get(`/user/all?exclude=${currentUserId}`);
        setUsers(res.data);
      } catch (err) {
        console.error('❌ Error fetching users:', err);
      }
    };
    fetchUsers();
  }, [currentUserId]);

  const stored = JSON.parse(localStorage.getItem('user'));
  const user = stored?.user || stored;

  return (
    <div className="explore-outer-border">
      <div className="explore-navbar">
        <div className="welcome-user" onClick={() => navigate('/dashboard')}>
          <img src="/uuss.svg" alt="User Icon" className="user-icon" />
          <span>Welcome {user?.name || 'User'}</span>
        </div>
        <div className="navbar-buttons">
          <button className="profile-btn" onClick={() => navigate(`/user/${currentUserId}`)}>Profile</button>
          <button className="logout-btn" onClick={() => { localStorage.clear(); navigate('/login'); }}>Logout</button>
        </div>
      </div>

      <div className="dashboard-actions">
        <button onClick={() => navigate('/create-trip')}>CREATE TRIP</button>
        <button>EXPLORE</button>
        <button onClick={() => navigate('/match')}>FIND MATCHES</button>
        <button onClick={() => navigate('/inbox')}>INBOX</button>
        <button onClick={() => navigate('/edit-profile')}>EDIT PROFILE</button>
        <button onClick={() => navigate('/trips/' + currentUserId)}>TRIP DETAILS</button>
      </div>
      
      <div className="go-back" onClick={() => navigate('/dashboard')}>← Go Back</div>
      <h2 className="explore-title">Explore Users</h2>
      <div className="user-grid">
        {users.map((user) => (
          <div key={user._id} className="user-card">
            <div className="avatar-circle">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.name} className="profile-img" />
              ) : (
                user.name?.charAt(0).toUpperCase()
              )}
            </div>
            <h3>{toSentenceCase(user.name)}</h3>
            <p>{user.bio || 'No bio yet'}</p>
            <p><strong>Gender:</strong> {user.gender || 'N/A'}</p>
            <p><strong>Age:</strong> {user.age || 'N/A'}</p>
            <div className="card-buttons">
              <button onClick={() => navigate(`/user-trips/${user._id}`)}>Trips</button>
              <button onClick={() => navigate(`/chat/${user._id}`)}>Chat</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;