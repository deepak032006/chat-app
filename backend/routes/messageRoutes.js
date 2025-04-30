const express = require('express');
const Message = require('../modals/Message.js');

const router = express.Router();

// 👉 Room chat history
router.get('/room/:room', async (req, res) => {
  const messages = await Message.find({ room: req.params.room }).sort({ timestamp: 1 });
  res.json(messages);
});

// 👉 Private chat history
router.get('/private/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;
  const messages = await Message.find({
    $or: [
      { sender: user1, receiver: user2 },
      { sender: user2, receiver: user1 }
    ]
  }).sort({ timestamp: 1 });
  res.json(messages);
});

module.exports = router;
