import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

const Inbox = () => {
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await api.get(`/messages/contacts/${currentUser._id}`);
        setContacts(res.data);
      } catch (err) {
        console.error("Error fetching chat contacts:", err);
      }
    };

    fetchContacts();
  }, [currentUser]);

  return (
    <div className="container mt-4">
      <Link to="/dashboard" className="btn btn-link mb-3">← Back to Dashboard</Link>
      <h3>Your Chats</h3>
      <ul className="list-group">
        {contacts.map(user => (
          <li key={user._id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{user.name}</span>
            <Link to={`/chat/${user._id}`} className="btn btn-primary">Chat with {user.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Inbox;