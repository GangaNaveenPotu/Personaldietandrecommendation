const express =require( "express");
const User =require ("../models/User.js");
const bcrypt = require("bcrypt");
const UserProfile = require("../models/UserProfile");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.json({ success: false, message: "Email already exists" });

    const user = new User({ name, email, password });
    await user.save();
    res.json({ success: true, user: { name: user.name, email: user.email, profileCompleted: user.profileCompleted } });
  } catch (err) {
    res.json({ success: false, message: "Registration failed" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.json({ success: false, message: "Incorrect password" });

    // Determine profile completion by either user flag or existing profile document
    let completed = !!user.profileCompleted;
    if (!completed) {
      const existingProfile = await UserProfile.findOne({ name: user.name });
      completed = !!existingProfile;
      // Optionally persist the completion flag for future logins
      if (completed && !user.profileCompleted) {
        user.profileCompleted = true;
        await user.save();
      }
    }

    res.json({ success: true, user: { name: user.name, email: user.email, profileCompleted: completed } });
  } catch (err) {
    res.json({ success: false, message: "Login failed" });
  }
});

module.exports= router;
