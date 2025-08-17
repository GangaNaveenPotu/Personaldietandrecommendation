const mongoose = require("mongoose");

const userProfileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number },
  weight: { type: Number },
  height: { type: Number },
  gender: { type: String },
  activityLevel: { type: String }, // sedentary, light, moderate, active
  goal: { type: String }, // lose, maintain, gain
  dietaryRestrictions: { type: [String] } // ["vegan", "low-carb"]
});

module.exports = mongoose.model("UserProfile", userProfileSchema);
