import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './editprofile.css';

const EditProfile = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.user?._id || user?.user?.id;

  const [formData, setFormData] = useState({
    userId: userId,
    name: user?.user?.name || '',
    age: '',
    gender: '',
    bio: '',
    interests: '',
    profilePicture: ''
  });

  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCloudinaryUpload = async (e) => {
    const file = e.target.files[0];
    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', 'travelapp_unsigned');
    data.append('cloud_name', 'dzve0febp');

    setUploading(true);
    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/dzve0febp/image/upload', {
        method: 'POST',
        body: data
      });
      const result = await res.json();
      setFormData((prev) => ({ ...prev, profilePicture: result.secure_url }));
    } catch (err) {
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        userId: formData.userId,
        name: formData.name,
        age: parseInt(formData.age),
        gender: formData.gender,
        bio: formData.bio,
        interests: formData.interests.split(',').map(i => i.trim()),
        profilePicture: formData.profilePicture
      };

      await api.put('/user/profile', payload);
      alert('✅ Profile updated!');
    } catch (err) {
      alert('Update failed');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleProfile = () => {
    navigate(`/user/${userId}`);
  };

  return (
    <div className="editprofile-outer-border">
      <div className="editprofile-navbar">
        <div className="welcome-user" onClick={() => navigate('/dashboard')}>
          <img src="/uuss.svg" alt="User Icon" className="user-icon" />
          <span>Welcome {user?.user?.name || 'User'}</span>
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
        <button>EDIT PROFILE</button>
        <button onClick={() => navigate('/trips/' + userId)}>TRIP DETAILS</button>
      </div>
      <div className="go-back-container">
        <button className="go-back-btn" onClick={() => navigate('/dashboard')}>
          ← Go Back
        </button>
      </div>
      <h2 className="editprofile-title">Edit Profile</h2>
      <form className="editprofile-form" onSubmit={handleSubmit}>
        {/* <label>Name:</label> */}
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />

        {/* <label>Age:</label> */}
        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleChange} />

        {/* <label>Gender:</label> */}
        <input type="text" name="gender" placeholder="Gender" value={formData.gender} onChange={handleChange} />

        {/* <label>Bio:</label> */}
        <textarea name="bio" rows="3" placeholder="Bio:" value={formData.bio} onChange={handleChange}></textarea>

        {/* <label>Hobbies:</label> */}
        <input type="text" name="hobbies" placeholder="Hobbies" value={formData.interests} onChange={handleChange} />

        <label><strong>Upload Profile Picture:</strong></label>
        <input type="file" onChange={handleCloudinaryUpload} />
        {formData.profilePicture && <img src={formData.profilePicture} alt="Uploaded" className="preview-img" />}

        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default EditProfile;