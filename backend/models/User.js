const mongoose =require( "mongoose");
const bcrypt =require( "bcrypt");

// ...existing code...
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileCompleted: { type: Boolean, default: false } // <-- Add this line
});


// hash password before saving
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);
// This code defines a Mongoose schema for a User model, which includes fields for name, email, and password.
// The password is hashed before being saved to the database using bcrypt.