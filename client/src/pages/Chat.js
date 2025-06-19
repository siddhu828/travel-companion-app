import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { io } from 'socket.io-client';

const socket = io("http://localhost:5050"); // backend server

const Chat = ({ contactId }) => {
    
    const userRaw = JSON.parse(localStorage.getItem('user'));
    const currentUser = { ...userRaw, _id: userRaw._id || userRaw.id };
    const isValidUser = contactId && currentUser && currentUser._id;

    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const bottomRef = useRef(null);

    useEffect(() => {
      if (!contactId || !currentUser || !currentUser._id) {
        console.error("❌ Missing user info:", { contactId, currentUser });
      }
    }, [contactId, currentUser]);

  useEffect(() => {
    // Fetch existing chat history
    const fetchChat = async () => {
      console.log("📩 Fetching messages between", currentUser._id, "and", contactId);
      try {
        const res = await api.get(`/messages/${currentUser._id}/${contactId}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };

    if (contactId) fetchChat();

    // Listen for incoming messages
    socket.on('receive_message', (data) => {
      const isMatch =
        (data.senderId === currentUser._id && data.receiverId === contactId) ||
        (data.senderId === contactId && data.receiverId === currentUser._id);
      if (isMatch) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off('receive_message');
    };
  }, [contactId, currentUser._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  console.log("📤 currentUser:", currentUser);
  console.log("📤 currentUser._id:", currentUser?._id);
  console.log("📤 contactId:", contactId);
  console.log("👤 Logged in user:", currentUser);
  console.log("💬 Chatting with contactId:", contactId);

  const sendMessage = async () => {
    if (!text.trim()) return;

    const senderId = currentUser?._id;
    if (!senderId || !contactId) {
      console.error("❌ senderId or contactId is undefined.", { senderId, contactId });
      return;
    }

    if (!senderId || !contactId) {
      console.error("❌ Cannot send message — senderId or contactId missing", { senderId, contactId });
      alert("Cannot send message. Missing user data.");
      return;
    }

    const newMsg = {
      senderId,
      receiverId: contactId,
      message: text
    };

    console.log("📤 Sending message to server:", newMsg);

    try {
      await api.post('/messages/send', newMsg);
      socket.emit('send_message', newMsg);
      console.log("✅ Emitted socket message");
      setMessages((prev) => [...prev, newMsg]);
      setText('');
    } catch (err) {
      console.error("❌ Error sending message:", err.response?.data || err.message);
    }
  };

  if (!isValidUser) {
    return (
      <div className="container mt-4">
        <p>Error: Missing user info — see console.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <Link to="/dashboard" className="btn btn-link mb-3">← Back to Dashboard</Link>
      <h3>Chat</h3>
      <div className="border p-3 mb-3" style={{ height: '300px', overflowY: 'auto', background: '#f9f9f9' }}>
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 ${msg.senderId === currentUser._id ? 'text-end' : 'text-start'}`}>
            <span className={`badge ${msg.senderId === currentUser._id ? 'bg-primary' : 'bg-secondary'}`}>
              {msg.message}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="d-flex">
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          className="form-control me-2"
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} className="btn btn-success">Send</button>
      </div>
    </div>
  );
};

export default Chat;