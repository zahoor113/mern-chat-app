const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const { register, login, logout, getAllUsers } = require('../controllers/authController');

// Multer config for profile picture upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage: storage });

// Routes
router.post('/register', upload.single('profilePic'), register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/users', getAllUsers);

module.exports = router;
