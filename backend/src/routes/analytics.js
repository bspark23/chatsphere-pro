import express from 'express';
import { authenticate } from '../middleware/auth.js';
import Message from '../models/Message.js';
import User from '../models/User.js';
import Group from '../models/Group.js';

const router = express.Router();

router.get('/stats', authenticate, async (req, res) => {
  try {
    const now = new Date();
    const last24h = new Date(now - 24 * 60 * 60 * 1000);
    
    const [
      totalUsers,
      activeUsers,
      totalMessages,
      recentMessages,
      topGroups
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ lastSeen: { $gte: last24h } }),
      Message.countDocuments(),
      Message.countDocuments({ createdAt: { $gte: last24h } }),
      Group.aggregate([
        {
          $lookup: {
            from: 'messages',
            localField: '_id',
            foreignField: 'group',
            as: 'messages'
          }
        },
        {
          $project: {
            name: 1,
            messageCount: { $size: '$messages' }
          }
        },
        { $sort: { messageCount: -1 } },
        { $limit: 5 }
      ])
    ]);

    res.json({
      totalUsers,
      activeUsers,
      totalMessages,
      recentMessages,
      topGroups
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/leaderboard', authenticate, async (req, res) => {
  try {
    const topUsers = await User.find()
      .select('username avatar points badges')
      .sort({ points: -1 })
      .limit(10);
    
    res.json(topUsers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
