import React, { useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
const EditProfile = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const [formData, setFormData] = useState({
    userId: user._id,
    name: user.name,
    age: '',
    gender: '',
    bio: '',
    interests: '',
    profilePicture: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCloudinaryUpload = async (e) => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'travelapp_unsigned');
    data.append('cloud_name', 'dzve0febp');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dzve0febp/image/upload', {
        method: 'POST',
        body: data
      });
      const result = await res.json();
      console.log("✅ Uploaded to Cloudinary:", result.secure_url);
      setFormData({ ...formData, profilePicture: result.secure_url });
    } catch (err) {
      console.error('❌ Cloudinary upload failed:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/user/profile', {
        userId: formData.userId,
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        bio: formData.bio,
        interests: formData.interests.split(',').map((i) => i.trim()),
        profilePicture: formData.profilePicture
      });
      alert('Profile updated!');
      console.log('Updated profile:', res.data);
    } catch (err) {
      console.error('React API Error:', err.response?.data || err.message);
      alert('Update failed');
    }
  };

  return (
    <div className="container mt-4">
      <Link to="/dashboard" className="btn btn-link mb-3">← Back to Dashboard</Link>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} /><br />
        <input name="age" placeholder="Age" value={formData.age} onChange={handleChange} /><br />
        <input name="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} /><br />
        <textarea name="bio" placeholder="Bio" onChange={handleChange} value={formData.bio} /><br />
        <input name="interests" placeholder="Interests (comma separated)" value={formData.interests} onChange={handleChange} /><br />

        <label>Upload Profile Picture</label>
        <input type="file" onChange={handleCloudinaryUpload} /><br />
        {formData.profilePicture && <img src={formData.profilePicture} alt="Preview" height={100} />}<br />

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default EditProfile;