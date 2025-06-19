import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

const UserProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/user/profile/${userId}`);
        setUser(res.data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };
    fetchUser();
  }, [userId]);

  if (!user) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <Link to="/dashboard" className="btn btn-link mb-3">← Back to Dashboard</Link>
      <h2>{user.name}'s Profile</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Age:</strong> {user.age || 'N/A'}</p>
      <p><strong>Gender:</strong> {user.gender || 'N/A'}</p>
      <p><strong>Bio:</strong> {user.bio || 'No bio'}</p>
      <p><strong>Interests:</strong> {user.interests?.join(', ') || 'None'}</p>
      {user.profilePicture && (
        <img src={user.profilePicture} alt="Profile" height={150} />
      )}
      <br />
      <Link to={`/chat/${user._id}`} className="btn btn-primary mt-3">
        Start Chat
      </Link>
    </div>
  );
};

export default UserProfile;