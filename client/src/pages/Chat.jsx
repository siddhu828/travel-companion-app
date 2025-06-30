import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { io } from 'socket.io-client';
import './chat.css'; 

const socket = io("https://travel-companion-app-1nns.onrender.com");

const Chat = () => {
  const { contactId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const userRaw = JSON.parse(localStorage.getItem('user'));
  const currentUser = {
    ...userRaw,
    _id: userRaw?._id || userRaw?.user?._id || userRaw?.user?.id || userRaw?.id,
  };

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!contactId || !currentUser._id) return;

    const fetchChat = async () => {
      try {
        const res = await api.get(`/api/messages/${currentUser._id}/${contactId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("❌ Error fetching messages:", err);
      }
    };

    fetchChat();

    socket.on('receive_message', (data) => {
      const isMatch =
        (data.senderId === currentUser._id && data.receiverId === contactId) ||
        (data.senderId === contactId && data.receiverId === currentUser._id);

      if (isMatch) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => socket.off('receive_message');
  }, [contactId, currentUser._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const newMsg = {
      senderId: currentUser._id,
      receiverId: contactId,
      message: text,
    };

    try {
      await api.post('/api/messages/send', newMsg);
      socket.emit('send_message', newMsg);
      setMessages((prev) => [...prev, newMsg]);
      setText('');
    } catch (err) {
      console.error("❌ Error sending message:", err.response?.data || err.message);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleProfile = () => {
    navigate(`/user/${currentUser?._id}`);
  };

  return (
    <div className="dashboard-outer-border">
      {/* Navbar */}
      <div className="dashboard-navbar">
        <div className="welcome-user" onClick={() => navigate('/dashboard')}>
          <img src="/uuss.svg" alt="User Icon" className="user-icon" />
          <span>Welcome {currentUser?.name}</span>
        </div>
        <div className="navbar-buttons">
          <button className="profile-btn" onClick={handleProfile}>Profile</button>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Dashboard Action Buttons */}
      <div className="dashboard-actions">
        <button onClick={() => navigate('/create-trip')}>CREATE TRIP</button>
        <button onClick={() => navigate('/explore')}>EXPLORE</button>
        <button onClick={() => navigate('/match')}>FIND MATCHES</button>
        <button onClick={() => navigate('/inbox')}>INBOX</button>
        <button onClick={() => navigate('/edit-profile')}>EDIT PROFILE</button>
        <button onClick={() => navigate('/trips/' + currentUser._id)}>TRIP DETAILS</button>
      </div>

      {/* Go Back */}
      <div className="go-back-container">
        <button className="go-back-btn" onClick={() => navigate("/inbox")}>
          ← Go Back
        </button>
      </div>

      {/* Chat Box */}
      <h2 className="chat-heading">Chat :</h2>

      <div className="chat-window">
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-bubble ${msg.senderId === currentUser._id ? 'sent' : 'received'}`}
            >
              {msg.message}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input-area">
          <input
            type="text"
            placeholder="Type your message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;