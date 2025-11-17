import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/search', authenticate, async (req, res) => {
  try {
    const { q } = req.query;
    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { phoneNumber: { $regex: q, $options: 'i' } }
      ],
      _id: { $ne: req.user._id }
    }).select('-password').limit(20);
    
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/contacts', authenticate, async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    
    const contact = await User.findOne({ phoneNumber });
    if (!contact) {
      return res.status(404).json({ error: 'User not found on platform' });
    }

    if (req.user.contacts.includes(contact._id)) {
      return res.status(400).json({ error: 'Already in contacts' });
    }

    req.user.contacts.push(contact._id);
    await req.user.save();

    res.json({ message: 'Contact added', contact: {
      id: contact._id,
      username: contact.username,
      phoneNumber: contact.phoneNumber,
      avatar: contact.avatar,
      status: contact.status
    }});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/contacts', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('contacts', 'username phoneNumber avatar status lastSeen');
    res.json(user.contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/settings', authenticate, async (req, res) => {
  try {
    const { theme, darkMode } = req.body;
    
    if (theme) req.user.theme = theme;
    if (darkMode !== undefined) req.user.darkMode = darkMode;
    
    await req.user.save();
    res.json({ message: 'Settings updated', user: req.user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/me', authenticate, async (req, res) => {
  res.json(req.user);
});

export default router;
