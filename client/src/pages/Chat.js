import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { io } from 'socket.io-client';

const socket = io("http://localhost:5050"); // backend server

const Chat = ({ contactId }) => {
    const currentUser = JSON.parse(localStorage.getItem('user'));
    console.log("👤 Logged in user:", currentUser);
    console.log("💬 Chatting with contactId:", contactId);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const bottomRef = useRef(null);

  useEffect(() => {
    // Fetch existing chat history
    const fetchChat = async () => {
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

  const sendMessage = async () => {
    if (!text.trim()) return;
  
    const newMsg = {
      senderId: currentUser._id,
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

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="container mt-4">
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