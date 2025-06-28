import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './createTrip.css';

const CreateTrip = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [tripData, setTripData] = useState({
    userId: user?.user?._id || user?.user?.id,
    destination: '',
    startDate: '',
    endDate: '',
    interests: '',
    travelType: '',
    description: ''
  });

  const handleChange = (e) => {
    setTripData({ ...tripData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...tripData,
        interests: tripData.interests.split(',').map((i) => i.trim())
      };
      await api.post('/trips', payload);
      alert('🎉 Trip created successfully!');
    } catch (err) {
      console.error(err);
      alert('❌ Error creating trip');
    }
  };

  return (
    <div className="create-trip-outer-border">
      <div className="create-trip-navbar">
        <div className="welcome-user" onClick={() => navigate('/dashboard')}>
          <img src="/uuss.svg" alt="User Icon" className="user-icon" />
          <span>Welcome {user?.user?.name || 'User'}</span>
        </div>
        <div className="navbar-buttons">
          <button className="profile-btn" onClick={() => navigate(`/user/${tripData.userId}`)}>Profile</button>
          <button className="logout-btn" onClick={() => { localStorage.clear(); navigate('/login'); }}>Logout</button>
        </div>
      </div>

      <div className="dashboard-actions">
        <button className='btn-imp'>CREATE TRIP</button>
        <button onClick={() => navigate('/explore')}>EXPLORE</button>
        <button onClick={() => navigate('/match')}>FIND MATCHES</button>
        <button onClick={() => navigate('/inbox')}>INBOX</button>
        <button onClick={() => navigate('/edit-profile')}>EDIT PROFILE</button>
        <button onClick={() => navigate('/trips/' + tripData.userId)}>TRIP DETAILS</button>
      </div>

      <div className="go-back" onClick={() => navigate('/dashboard')}>← Go Back</div>
      <h2 className="trip-title">Create New Trip</h2>

      <div className="trip-form-wrapper">
        <img src="/1p.svg" className="trip-doodle left" alt="left" />
        <form className="trip-form" onSubmit={handleSubmit}>
          <input type="text" name="destination" placeholder="Destination*" required onChange={handleChange} />
          <input type="date" name="startDate" required onChange={handleChange} />
          <input type="date" name="endDate" required onChange={handleChange} />
          <input type="text" name="interests" placeholder="Interests*" onChange={handleChange} />
          <input type="text" name="travelType" placeholder="Travel Type" onChange={handleChange} />
          <textarea name="description" placeholder="Trip Description" rows={3} onChange={handleChange}></textarea>
          <button type="submit" className="save-btn">Save</button>
        </form>
        <img src="/2p.svg" className="trip-doodle right" alt="right" />
      </div>
    </div>
  );
};

export default CreateTrip;