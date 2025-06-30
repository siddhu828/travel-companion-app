import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import './tripdetails.css';

const toSentenceCase = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB');
};

const TripDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const stored = JSON.parse(localStorage.getItem('user'));
  const user = stored?.user || stored;
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const fetchTrips = async () => {
      try {
        const res = await api.get(`/api/trips/${userId}`);
        setTrips(res.data);
      } catch (err) {
        console.error("❌ Error fetching trips:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleProfile = () => {
    navigate(`/user/${userId}`);
  };

  if (loading) {
    return (
      <div className="tripdetails-wrapper">
        <p className="loading-text">Loading trips...</p>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="tripdetails-wrapper">
        <p className="loading-text">No trips found.</p>
      </div>
    );
  }

  return (
    <div className="tripdetails-wrapper">
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

      <div className="dashboard-actions">
        <button onClick={() => navigate('/create-trip')}>CREATE TRIP</button>
        <button onClick={() => navigate('/explore')}>EXPLORE</button>
        <button onClick={() => navigate('/match')}>FIND MATCHES</button>
        <button onClick={() => navigate('/inbox')}>INBOX</button>
        <button onClick={() => navigate('/edit-profile')}>EDIT PROFILE</button>
        <button onClick={() => navigate('/trips/' + userId)}>TRIP DETAILS</button>
      </div>
      <div className="go-back" onClick={() => navigate('/dashboard')}>← Go Back</div>
      <h2 className="tripdetails-title">Trip Details</h2>

      <div className="tripdetails-cards">
        {trips.map((trip) => (
          <div className="tripdetails-card" key={trip._id}>
            <p><strong>Destination:</strong> <span className="orange">{toSentenceCase(trip.destination)}</span></p>
            <p><strong>Dates:</strong> <span className="orange">{formatDate(trip.startDate)} to {formatDate(trip.endDate)}</span></p>
            {trip.travelType && (
              <p><strong>Travel Type:</strong> <span className="orange">{toSentenceCase(trip.travelType)}</span></p>
            )}
            {trip.description && (
              <p><strong>Description:</strong> <span className="orange">{toSentenceCase(trip.description)}</span></p>
            )}
            {trip.interests?.length > 0 && (
              <p>
                <strong>Interests:</strong>{' '}
                {trip.interests.map((interest, idx) => (
                  <span key={idx} className="interest-chip">{toSentenceCase(interest)}</span>
                ))}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TripDetails;