import express from 'express';
import User from '../models/User.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification code
router.post('/send-code', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user.phoneVerified) {
      return res.status(400).json({ error: 'Phone already verified' });
    }

    const code = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.verificationCode = code;
    user.verificationExpiry = expiry;
    await user.save();

    // TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)
    // For now, return code in response (ONLY FOR DEVELOPMENT)
    console.log(`Verification code for ${user.phoneNumber}: ${code}`);
    
    res.json({ 
      message: 'Verification code sent',
      // Remove this in production - only for testing
      code: process.env.NODE_ENV === 'development' ? code : undefined
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify code
router.post('/verify-code', authenticate, async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.user._id);

    if (user.phoneVerified) {
      return res.status(400).json({ error: 'Phone already verified' });
    }

    if (!user.verificationCode || !user.verificationExpiry) {
      return res.status(400).json({ error: 'No verification code sent' });
    }

    if (new Date() > user.verificationExpiry) {
      return res.status(400).json({ error: 'Verification code expired' });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    user.phoneVerified = true;
    user.verificationCode = undefined;
    user.verificationExpiry = undefined;
    await user.save();

    res.json({ 
      message: 'Phone verified successfully',
      user: {
        id: user._id,
        phoneVerified: user.phoneVerified
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Resend verification code
router.post('/resend-code', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user.phoneVerified) {
      return res.status(400).json({ error: 'Phone already verified' });
    }

    const code = generateOTP();
    const expiry = new Date(Date.now() + 10 * 60 * 1000);

    user.verificationCode = code;
    user.verificationExpiry = expiry;
    await user.save();

    console.log(`Resent verification code for ${user.phoneNumber}: ${code}`);
    
    res.json({ 
      message: 'Verification code resent',
      code: process.env.NODE_ENV === 'development' ? code : undefined
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
