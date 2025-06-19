import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB');
};
const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get(`/trips/${user._id}`);
        setTrips(res.data);
      } catch (err) {
        console.error('Error fetching trips:', err);
      }
    };

    fetchTrips();
  }, [user._id]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };
  

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Welcome, {user?.name || "User"}!</h2>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>

      <h4 className="mb-3">Your Trips:</h4>
      <div className="mb-3">
        <a href="/create-trip" className="btn btn-primary me-2">Create New Trip</a>
        <a href="/explore" className="btn btn-outline-primary me-2">Explore Users</a>
        <a href="/match" className="btn btn-outline-success me-2">Find Matches</a>
        <a href="/inbox" className="btn btn-outline-secondary">Inbox</a>
      </div>

      {trips.length === 0 ? (
        <p>No trips created yet.</p>
      ) : (
        <ul>
          {trips.map((trip) => (
            <li key={trip._id}>
              <strong>{trip.destination}</strong><br />
              {formatDate(trip.startDate)} to {formatDate(trip.endDate)}<br />
              {trip.travelType && <em>{trip.travelType}</em>}<br />
              {trip.description && <p>{trip.description}</p>}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dashboard;