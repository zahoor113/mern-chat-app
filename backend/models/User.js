const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePic: { type: String }, // File name or path
  isOnline: { type: Boolean, default: false },
});

module.exports = mongoose.model('User', userSchema);
