import express from 'express';
import Message from '../models/Message.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/direct/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const messages = await Message.find({
      chatType: 'direct',
      $or: [
        { sender: req.user._id, recipient: userId },
        { sender: userId, recipient: req.user._id }
      ],
      deleted: false
    })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate('sender', 'username avatar');
    
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/group/:groupId', authenticate, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const messages = await Message.find({
      chatType: 'group',
      group: groupId,
      deleted: false
    })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .populate('sender', 'username avatar');
    
    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
