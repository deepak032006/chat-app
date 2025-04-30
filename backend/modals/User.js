const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: String,
  password: String,
  isOnline: { type: Boolean, default: false },
});

// Prevent OverwriteModelError (needed for development environments with hot reload)
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
