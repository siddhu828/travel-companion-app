const Message = require('../models/Message');

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { senderId, receiverId, message } = req.body;
    const newMessage = new Message({ senderId, receiverId, message });
    const saved = await newMessage.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("❌ Message Send Error:", err);
    res.status(500).json({ msg: 'Error sending message' });
  }
};

// Get chat between two users
exports.getMessages = async (req, res) => {
  try {
    const { userId, contactId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: contactId },
        { senderId: contactId, receiverId: userId }
      ]
    }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (err) {
    console.error("❌ Message Fetch Error:", err);
    res.status(500).json({ msg: 'Error fetching messages' });
  }
};