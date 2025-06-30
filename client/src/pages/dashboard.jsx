import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './dashboard.css';

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB');
};

const toSentenceCase = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const Dashboard = () => {
  const navigate = useNavigate();
  const stored = JSON.parse(localStorage.getItem('user'));
  const user = stored?.user || stored;
  const userId = user?._id || user?.id;
  const [trips, setTrips] = useState([]);
  const [bgOrange, setBgOrange] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const fetchTrips = async () => {
      try {
        const res = await api.get(`/api/trips/${userId}`);
        setTrips(res.data);
      } catch (err) {
        console.error('Error fetching trips:', err);
      }
    };
    fetchTrips();
  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleProfile = () => {
    setBgOrange(true);
    setTimeout(() => {
      navigate(`/user/${userId}`);
    }, 150);
  };

  return (
    <div className={`dashboard-outer-border ${bgOrange ? 'orange-bg' : ''}`}>
      <div className="dashboard-navbar">
        <div className="welcome-user" onClick={() => navigate('/dashboard')}>
          <img src="/uuss.svg" alt="User Icon" className="user-icon" />
          <span>Welcome {user?.name || 'User'}</span>
        </div>
        <div className="navbar-buttons">
          <button className="profile-btn" onClick={handleProfile}>Profile</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* CENTERED BUTTONS */}
      <div className="dashboard-actions">
        <button onClick={() => navigate('/create-trip')}>CREATE TRIP</button>
        <button onClick={() => navigate('/explore')}>EXPLORE</button>
        <button onClick={() => navigate('/match')}>FIND MATCHES</button>
        <button onClick={() => navigate('/inbox')}>INBOX</button>
        <button onClick={() => navigate('/edit-profile')}>EDIT PROFILE</button>
        <button onClick={() => navigate('/trips/' + userId)}>TRIP DETAILS</button>
      </div>

      <h2 className="your-trips-title">Your Trips:</h2>
      <div className="trip-cards">
        {trips.length === 0 ? (
          <p>No trips created yet.</p>
        ) : (
          trips.map((trip) => (
            <div className="trip-card" key={trip._id}>
              <p><strong>Destination:</strong> <span className="orange">{toSentenceCase(trip.destination)}</span></p>
              <p><strong>Dates:</strong> <span className="orange">{formatDate(trip.startDate)} to {formatDate(trip.endDate)}</span></p>
              <p><strong>Travel Type:</strong> <span className="orange">{toSentenceCase(trip.travelType)}</span></p>
              <p><strong>Description:</strong> <span className="orange">{toSentenceCase(trip.description)}</span></p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;