const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const users = [
  {
    username: 'Rizwan',
    password: '1234',
    profilePic: 'rizwan.jpg'
  },
  {
    username: 'Jami',
    password: '1234',
    profilePic: 'jami.jpg'
  },
  {
    username: 'Ali',
    password: '1234',
    profilePic: 'ali.jpg'
  }
];

const createUsers = async () => {
  for (let userData of users) {
    const existing = await User.findOne({ username: userData.username });
    if (!existing) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({ ...userData, password: hashedPassword });
      await user.save();
      console.log(`Added: ${user.username}`);
    } else {
      console.log(`${userData.username} already exists.`);
    }
  }
  mongoose.disconnect();
};

createUsers();
