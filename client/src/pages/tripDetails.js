import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Link } from 'react-router-dom';

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB');
  };

const TripDetails = () => {
  const { userId } = useParams();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get(`/trips/${userId}`);
        setTrips(res.data);
      } catch (err) {
        console.error("❌ Error fetching trips:", err);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchTrips();
  }, [userId]);

  if (loading) return <div className="container mt-4">Loading trips...</div>;

  if (trips.length === 0) return <div className="container mt-4">No trips found.</div>;

  return (
    <div className="container mt-4">
      <Link to="/dashboard" className="btn btn-link mb-3">← Back to Dashboard</Link>
      <h3>Trips</h3>
      {trips.map((trip) => (
        <div key={trip._id} className="card p-3 mb-3">
          <h5>{trip.destination}</h5>
          <p><strong>Start:</strong> {new Date(formatDate(trip.startDate)).toLocaleDateString()}</p>
          <p><strong>End:</strong> {new Date(formatDate(trip.endDate)).toLocaleDateString()}</p>
          <p><strong>Type:</strong> {trip.travelType}</p>
          <p><strong>Description:</strong> {trip.description}</p>
          <p><strong>Interests:</strong> {trip.interests.join(', ')}</p>
        </div>
      ))}
    </div>
  );
};

export default TripDetails;