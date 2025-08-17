const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');
const User = require('../models/User');

// Save or update profile
router.post('/profile', async (req, res) => {
  try {
    const { name, age, gender, height, weight, activityLevel, goal, dietaryRestrictions } = req.body;

    let profile = await UserProfile.findOne({ name });
    if (profile) {
      profile.age = age;
      profile.gender = gender;
      profile.height = height;
      profile.weight = weight;
      profile.activityLevel = activityLevel;
      profile.goal = goal;
      profile.dietaryRestrictions = dietaryRestrictions;
      await profile.save();
    } else {
      profile = new UserProfile({
        name,
        age,
        gender,
        height,
        weight,
        activityLevel,
        goal,
        dietaryRestrictions
      });
      await profile.save();
    }

    // Mark user's profile as completed
    const user = await User.findOne({ name });
    if (user && !user.profileCompleted) {
      user.profileCompleted = true;
      await user.save();
    }

    res.json({ success: true, message: 'Profile saved successfully' });
  } catch (error) {
    console.error('Error saving profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get existing profile by name (simple lookup to support editing)
router.get('/profile', async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ success: false, message: 'name query param is required' });
    }
    const profile = await UserProfile.findOne({ name });
    if (!profile) {
      return res.json({ success: true, profile: null, profileCompleted: false });
    }
    const user = await User.findOne({ name });
    const profileCompleted = !!(user && user.profileCompleted);
    res.json({ success: true, profile, profileCompleted });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
