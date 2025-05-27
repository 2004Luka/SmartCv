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

// Update username
router.put('/name', protect, async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ success: false, message: 'No name provided' });
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true }
    );
    res.json({ success: true, name: user.name });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update name' });
  }
});

// Unified profile update (name and profilePicture)
router.put('/profile', protect, async (req, res) => {
  try {
    const { name, profilePicture } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (profilePicture !== undefined) update.profilePicture = profilePicture;
    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
});

module.exports = router; 