const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
  try {
    const { content, chatRoom } = req.body;
    const message = new Message({
      content,
      sender: req.user.userId,
      chatRoom
    });
    await message.save();
    
    const populatedMessage = await Message.findById(message._id).populate('sender', 'username');
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message' });
  }
});

router.get('/:chatRoom', auth, async (req, res) => {
  try {
    const messages = await Message.find({ chatRoom: req.params.chatRoom })
      .populate('sender', 'username')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

module.exports = router;