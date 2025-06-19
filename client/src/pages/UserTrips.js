import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Link } from 'react-router-dom';
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-GB');
};
const UserTrips = () => {
  const { userId } = useParams();
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get(`/trips/${userId}`);
        setTrips(res.data);
      } catch (err) {
        console.error("❌ Error fetching trips:", err);
      }
    };

    fetchTrips();
  }, [userId]);

  return (
    <div className="container mt-4">
      <Link to="/dashboard" className="btn btn-link mb-3">← Back to Dashboard</Link>
      <h3>User's Trips</h3>
      {trips.length === 0 ? (
        <p>No trips found for this user.</p>
      ) : (
        trips.map((trip, index) => (
          <div key={index} className="card p-3 mb-3 shadow-sm">
            <h5>{trip.destination}</h5>
            <p><strong>From:</strong> {new Date(formatDate(trip.startDate)).toDateString()}</p>
            <p><strong>To:</strong> {new Date(formatDate(trip.endDate)).toDateString()}</p>
            <p><strong>Travel Type:</strong> {trip.travelType}</p>
            <p><strong>Interests:</strong> {trip.interests.join(', ')}</p>
            <p><strong>Description:</strong> {trip.description || "No description provided."}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default UserTrips;