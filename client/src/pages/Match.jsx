import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import './match.css';

const toSentenceCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const Match = () => {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user'));
    const id = stored?.user?._id || stored?.user?.id;
    if (id) setCurrentUserId(id);
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchMatches = async () => {
      try {
        const res = await api.get(`/user/matches/${currentUserId}`);
        setMatches(res.data);
      } catch (err) {
        console.error('❌ Error fetching matches:', err);
      }
    };

    fetchMatches();
  }, [currentUserId]);

  const handleLike = async (targetId) => {
    try {
      await api.post('/user/like', {
        userId: currentUserId,
        targetId,
      });
      setMatches(matches.filter((m) => m._id !== targetId));
    } catch (err) {
      console.error('❌ Error liking user:', err);
    }
  };

  const handleSkip = async (targetId) => {
    try {
      await api.post('/user/skip', {
        userId: currentUserId,
        targetId,
      });
      setMatches(matches.filter((m) => m._id !== targetId));
    } catch (err) {
      console.error('❌ Error skipping user:', err);
    }
  };

  const stored = JSON.parse(localStorage.getItem('user'));
  const user = stored?.user || stored;

  return (
    <div className="match-outer-border">
      <div className="match-navbar">
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
        <button onClick={() => navigate('/explore')}>EXPLORE</button>
        <button>FIND MATCHES</button>
        <button onClick={() => navigate('/inbox')}>INBOX</button>
        <button onClick={() => navigate('/edit-profile')}>EDIT PROFILE</button>
        <button onClick={() => navigate('/trips/' + currentUserId)}>TRIP DETAILS</button>
      </div>

      <div className="go-back" onClick={() => navigate('/dashboard')}>← Go Back</div>
      <h2 className="match-title">Your Potential Matches</h2>

      {matches.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <h3>No more matches</h3>
        </div>
      ) : (
        <div className="user-grid">
          {matches.map((match) => (
            <div key={match._id} className="user-card">
              <div className="avatar-circle">
                {match.profilePicture ? (
                  <img src={match.profilePicture} alt={match.name} className="profile-img" />
                ) : (
                  match.name?.charAt(0).toUpperCase()
                )}
              </div>
              <h3>{toSentenceCase(match.name)}</h3>
              <p>{match.bio || 'No bio yet'}</p>
              <p><strong>Gender:</strong> {match.gender || 'N/A'}</p>
              <p><strong>Age:</strong> {match.age || 'N/A'}</p>

              <div className="card-buttons">
                <button onClick={() => handleLike(match._id)}>Like ❤️</button>
                <button onClick={() => handleSkip(match._id)}>Skip ❌</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Match;