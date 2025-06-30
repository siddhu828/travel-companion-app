import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import './inbox.css';

const Inbox = () => {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  const currentUser = storedUser?.user || storedUser;
  const [contacts, setContacts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser?._id) return;

    const fetchContacts = async () => {
      try {
        const res = await api.get(`/api/messages/contacts/${currentUser._id}`);
        setContacts(res.data);
      } catch (err) {
        console.error('❌ Error fetching chat contacts:', err);
      }
    };

    fetchContacts();
  }, [currentUser]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleProfile = () => {
    navigate(`/user/${currentUser?._id}`);
  };

  return (
    <div className="dashboard-outer-border">
      {/* NAVBAR */}
      <div className="dashboard-navbar">
        <div className="welcome-user" onClick={() => navigate('/dashboard')}>
          <img src="/uuss.svg" alt="User Icon" className="user-icon" />
          <span>Welcome {currentUser?.name || 'User'}</span>
        </div>
        <div className="navbar-buttons">
          <button className="profile-btn" onClick={handleProfile}>Profile</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* CENTERED ORANGE BUTTONS */}
      <div className="dashboard-actions">
        <button onClick={() => navigate('/create-trip')}>CREATE TRIP</button>
        <button onClick={() => navigate('/explore')}>EXPLORE</button>
        <button onClick={() => navigate('/match')}>FIND MATCHES</button>
        <button onClick={() => navigate('/inbox')}>INBOX</button>
        <button onClick={() => navigate('/edit-profile')}>EDIT PROFILE</button>
        <button onClick={() => navigate('/trips/' + currentUser._id)}>TRIP DETAILS</button>
      </div>

      {/* GO BACK */}
      <div className="go-back-container">
        <button className="go-back-btn" onClick={() => navigate('/dashboard')}>
          ← Go Back
        </button>
      </div>

      {/* TITLE */}
      <h2 className="your-chats-title">Your Chats:</h2>

      {/* CHAT CARDS SECTION */}
      <div className="inbox-cards-container">
        <img src="/3p.svg" alt="left" className="inbox-doodle left" />
        
        <div className="chat-cards">
          {contacts.length === 0 ? (
            <p>You haven’t chatted with anyone yet.</p>
          ) : (
            contacts.map((user) => (
              <div key={user._id} className="chat-card">
                <div className="chat-details">
                  <p className="chat-name">{user.name}</p>
                  <p className="chat-email">{user.email}</p>
                </div>
                <button className="chat-action-btn" onClick={() => navigate(`/chat/${user._id}`)}>
                  CHAT
                </button>
              </div>
            ))
          )}
        </div>

        <img src="/4p.svg" alt="right" className="inbox-doodle right" />
      </div>
    </div>
  );
};

export default Inbox;