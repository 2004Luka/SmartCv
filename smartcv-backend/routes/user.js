const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Update profile picture
router.put('/profile-picture', protect, async (req, res) => {
  try {
    const { profilePicture } = req.body;
    if (!profilePicture) {
      return res.status(400).json({ success: false, message: 'No profile picture provided' });
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture },
      { new: true }
    );
    res.json({ success: true, profilePicture: user.profilePicture });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile picture' });
  }
});

// Get current user profile
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch user profile' });
  }
});

module.exports = router; 