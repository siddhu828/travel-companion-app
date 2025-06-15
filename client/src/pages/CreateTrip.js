import React, { useState } from 'react';
import api from '../services/api';

const CreateTrip = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [tripData, setTripData] = useState({
    userId: user._id,
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
        interests: tripData.interests.split(',').map(i => i.trim())
      };
      const res = await api.post('/trips', payload);
      alert('Trip created!');
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert('Error creating trip');
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create Trip</h2>
      <form onSubmit={handleSubmit}>
        <input name="destination" placeholder="Destination" onChange={handleChange} /><br />
        <input type="date" name="startDate" onChange={handleChange} /><br />
        <input type="date" name="endDate" onChange={handleChange} /><br />
        <input name="interests" placeholder="Interests (comma separated)" onChange={handleChange} /><br />
        <input name="travelType" placeholder="Travel Type (e.g., Adventure, Leisure)" onChange={handleChange} /><br />
        <textarea name="description" placeholder="Trip Description" onChange={handleChange} /><br />
        <button type="submit">Save Trip</button>
      </form>
    </div>
  );
};

export default CreateTrip;