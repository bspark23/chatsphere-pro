import express from 'express';
import Group from '../models/Group.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description, members } = req.body;
    
    const group = new Group({
      name,
      description,
      admin: req.user._id,
      members: [req.user._id, ...members]
    });
    
    await group.save();
    await group.populate('members', 'username avatar');
    
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    const groups = await Group.find({
      members: req.user._id
    }).populate('members', 'username avatar');
    
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:groupId/members', authenticate, async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId, action } = req.body;
    
    const group = await Group.findById(groupId);
    
    if (group.admin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Only admin can modify members' });
    }
    
    if (action === 'add') {
      group.members.push(userId);
    } else if (action === 'remove') {
      group.members = group.members.filter(m => m.toString() !== userId);
    }
    
    await group.save();
    await group.populate('members', 'username avatar');
    
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
