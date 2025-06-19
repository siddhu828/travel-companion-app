import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
const Match = () => {
  const [matches, setMatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!currentUser || !currentUser._id) {
      window.location.href = '/login';
      return;
    }

    const fetchMatches = async () => {
      try {
        const res = await api.get(`/user/matches/${currentUser._id}`);
        setMatches(res.data);
      } catch (err) {
        console.error('Error fetching matches:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  if (loading) {
    return <div className="container mt-4"><h4>Loading...</h4></div>;
  }

  if (matches.length === 0 || currentIndex >= matches.length) {
    return (
      <div className="container mt-4">
        <Link to="/dashboard" className="btn btn-link mb-3">← Back to Dashboard</Link>
        <h3>No more matches.</h3>
      </div>
    );
  }

  const handleLike = async () => {
    try {
      const targetId = matches[currentIndex]._id;
      await api.post('/user/like', { userId: currentUser._id, targetId });
      alert('Liked!');
      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      console.error('Error liking user:', err);
    }
  };

  const handleSkip = async () => {
    try {
      const targetId = matches[currentIndex]._id;
      await api.post('/user/skip', { userId: currentUser._id, targetId });
      alert('Skipped.');
      setCurrentIndex(prev => prev + 1);
    } catch (err) {
      console.error('Error skipping user:', err);
    }
  };

  const match = matches[currentIndex];

  return (
    <div className="container mt-4">
      <h2>Potential Match</h2>
      <p><strong>Name:</strong> {match.name}</p>
      <p><strong>Gender:</strong> {match.gender}</p>
      <p><strong>Bio:</strong> {match.bio}</p>
      <p><strong>Interests:</strong> {match.interests?.join(', ')}</p>
      {match.profilePicture && (
        <img src={match.profilePicture} alt="Profile" height={150} />
      )}
      <br />
      <button onClick={handleLike}>❤️ Like</button>
      <button onClick={handleSkip} className="ms-2">❌ Skip</button>
    </div>
  );
};

export default Match;