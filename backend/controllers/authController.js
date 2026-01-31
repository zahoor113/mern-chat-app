const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

// Register
const register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const profilePic = req.file?.filename;

    if (!username || !password || !profilePic) {
      return res.status(400).json({ msg: 'All fields are required' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      password: hashedPassword,
      profilePic,
    });

    await newUser.save();

    res.status(201).json({ msg: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    user.isOnline = true;
    await user.save();

    res.json({
      msg: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        profilePic: user.profilePic,
        isOnline: user.isOnline,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const { username } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.isOnline = false;
    await user.save();

    res.json({ msg: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ msg: 'Server error', error });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching users', err });
  }

};

module.exports = { register, login, logout, getAllUsers };
