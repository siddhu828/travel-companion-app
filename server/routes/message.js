const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getMessages,
  getChatContacts
} = require('../controllers/messageController');

//order matters uncle
router.get('/contacts/:userId', getChatContacts);
router.post('/send', sendMessage);
router.get('/:userId/:contactId', getMessages);

module.exports = router;