import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem('admin'));
  const [users, setUsers] = useState([]);
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    if (!admin || !admin.token) {
      alert('Unauthorized access');
      navigate('/admin-login');
    } else {
      fetchUsers();
      fetchTrips();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/user/all'); 
      setUsers(res.data);
      setFilteredUsers(res.data); // Initialize with all users
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchTrips = async () => {
    try {
      const res = await api.get('/trips');
      setTrips(res.data);
    } catch (err) {
      console.error('Error fetching trips:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Delete this user?')) {
      try {
        await api.delete(`/user/${userId}`);
        fetchUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (window.confirm('Delete this trip?')) {
      try {
        await api.delete(`/trips/${tripId}`);
        fetchTrips();
      } catch (err) {
        console.error('Error deleting trip:', err);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
    navigate('/admin-login');
  };

  const handleSearch = () => {
    const results = users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(results);
  };

  const handleToggleBan = async (userId) => {
    try {
      await api.put(`/user/ban/${userId}`);
      fetchUsers(); // refresh
    } catch (err) {
      console.error("Error banning/unbanning user:", err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Admin Dashboard</h2>
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>

      {/* ✅ Total Counts */}
      <div className="mt-3">
        <p><strong>Total Users:</strong> {users.length}</p>
        <p><strong>Total Trips:</strong> {trips.length}</p>
      </div>

      {/* ✅ Users Section */}
      <div className="mt-4">
        <h4>All Users</h4>
        <div className="d-flex mb-3">
          <input
            type="text"
            className="form-control me-2"
            style={{ maxWidth: '300px' }}
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-primary" onClick={handleSearch}>Search</button>
        </div>
        <ul className="list-group">
          {filteredUsers.map(user => (
            <li key={user._id} className="list-group-item d-flex justify-content-between align-items-center">
              <span>
                {user.name} ({user.email}) {user.isAdmin && <strong>[Admin]</strong>}
                {user.isBanned && <span className="badge bg-danger ms-2">BANNED</span>}
              </span>
              <div>
                <button
                  className={`btn btn-sm me-2 ${user.isBanned ? 'btn-success' : 'btn-warning'}`}
                  onClick={() => handleToggleBan(user._id)}
                >
                  {user.isBanned ? 'Unban' : 'Ban'}
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDeleteUser(user._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ✅ Trips Section with Sort */}
      <div className="mt-5">
        <div className="d-flex justify-content-between align-items-center">
          <h4>All Trips</h4>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => {
              const sorted = [...trips].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
              setTrips(sorted);
            }}
          >
            Sort by Latest
          </button>
        </div>

        {trips.length === 0 ? (
          <p>No trips found.</p>
        ) : (
          <ul className="list-group mt-2">
            {trips.map(trip => (
              <li key={trip._id} className="list-group-item d-flex justify-content-between align-items-start">
                <div>
                  <strong>{trip.destination}</strong> <br />
                  {new Date(trip.startDate).toLocaleDateString()} to {new Date(trip.endDate).toLocaleDateString()}<br />
                  Created by: <strong>{trip.user?.name || 'Unknown'}</strong> <br />
                  Type: {trip.travelType} <br />
                  Interests: {trip.interests?.join(', ')}
                </div>
                <button className="btn btn-sm btn-outline-danger mt-2" onClick={() => handleDeleteTrip(trip._id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;