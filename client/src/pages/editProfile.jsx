import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Stack,
  Box,
  Avatar
} from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../services/api';

const EditProfile = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [formData, setFormData] = useState({
    userId: user?.user?._id || user?.user?.id,
    name: user?.user?.name || '',
    age: '',
    gender: '',
    bio: '',
    interests: '',
    profilePicture: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [uploading, setUploading] = useState(false);

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
    console.log("✅ Uploaded to Cloudinary:", result.secure_url);
    setFormData((prev) => ({ ...prev, profilePicture: result.secure_url }));
  } catch (err) {
    console.error('❌ Cloudinary upload failed:', err);
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
        interests: formData.interests.split(',').map((i) => i.trim()),
        profilePicture: formData.profilePicture
      };

      const res = await api.put('/user/profile', payload);
      alert('✅ Profile updated!');
      console.log('Updated profile:', res.data);
    } catch (err) {
      console.error('❌ React API Error:', err.response?.data || err.message);
      alert('Update failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Button component={Link} to="/dashboard" variant="outlined" sx={{ mb: 2 }}>
        ← Back to Dashboard
      </Button>

      <Typography variant="h4" gutterBottom>
        Edit Profile
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          <TextField
            name="name"
            label="Name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            name="age"
            label="Age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="gender"
            label="Gender"
            value={formData.gender}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="bio"
            label="Bio"
            multiline
            rows={3}
            value={formData.bio}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            name="interests"
            label="Interests (comma separated)"
            value={formData.interests}
            onChange={handleChange}
            fullWidth
          />

          <div>
            <label>Upload Profile Picture</label><br />
            <input type="file" onChange={handleCloudinaryUpload} />
            {formData.profilePicture && (
              <Avatar
                src={formData.profilePicture}
                alt="Preview"
                sx={{ width: 80, height: 80, mt: 1 }}
              />
            )}
          </div>

          <Button type="submit" variant="contained" color="primary" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Save Profile'}
          </Button>
        </Stack>
      </Box>
    </Container>
  );
};

export default EditProfile;