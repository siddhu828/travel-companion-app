import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Explore = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      const id = storedUser._id || storedUser.id;
      console.log("✅ Setting current user with ID:", id);
      setCurrentUser({ ...storedUser, _id: id });
    }
  }, []);
  useEffect(() => {
    console.log("👤 currentUser:", currentUser);
  }, [currentUser]);
  
  useEffect(() => {
    console.log("📦 fetched users:", users);
  }, [users]);

  useEffect(() => {
    const userId = currentUser?._id || currentUser?.id;
    if (!userId) return;

    const fetchUsers = async () => {
      try {
        const res = await api.get(`/user/all?exclude=${userId}`);
        setUsers(res.data);
      } catch (err) {
        console.error("❌ Error fetching users:", err);
      }
    };
    fetchUsers();
  }, [currentUser]);

  return (
    <div className="container mt-4">
      <Link to="/dashboard" className="btn btn-link mb-3">← Back to Dashboard</Link>
      <h3>Explore Users</h3>
      <div className="row">
        {users.map((user) => (
          <div key={user._id} className="col-md-4 mb-3">
            <div className="card p-3 shadow-sm">
              <h5>{user.name}</h5>
              <p>{user.bio || "No bio yet"}</p>
              <p><strong>Gender:</strong> {user.gender || 'N/A'}</p>
              <p><strong>Age:</strong> {user.age || 'N/A'}</p>
              {user.profilePicture && (
                <img src={user.profilePicture} alt="Profile" height={100} />
              )}
              <Link to={`/chat/${user._id}`} className="btn btn-primary mt-2">
                Chat
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;