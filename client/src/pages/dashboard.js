import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Dashboard = () => {
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
      <h2>Welcome, {user?.name || "User"}!</h2>
      <button onClick={handleLogout} className="btn btn-danger mb-4">
        Logout
      </button>

      <h4>Your Trips:</h4>
      <a href="/create-trip" className="btn btn-primary mb-3">Create New Trip</a>

      {trips.length === 0 ? (
        <p>No trips created yet.</p>
      ) : (
        <ul>
          {trips.map((trip) => (
            <li key={trip._id}>
              <strong>{trip.destination}</strong><br />
              {trip.startDate} to {trip.endDate}<br />
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