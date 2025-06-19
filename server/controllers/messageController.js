const Message = require('../models/Message');
const User = require('../models/User'); 
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

// Get unique chat contacts for a user
exports.getChatContacts = async (req, res) => {
  try {
    const { userId } = req.params;

    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }]
    });

    const contactIds = new Set();
    messages.forEach(msg => {
      if (msg.senderId.toString() !== userId) contactIds.add(msg.senderId.toString());
      if (msg.receiverId.toString() !== userId) contactIds.add(msg.receiverId.toString());
    });

    const contacts = await User.find({ _id: { $in: Array.from(contactIds) } }).select('-password');
    res.json(contacts);
  } catch (err) {
    console.error("❌ Chat List Error:", err);
    res.status(500).json({ msg: 'Error fetching chat contacts' });
  }
};