const Message = require('../models/Message');
const User = require('../models/User');

// Send a message
const sendMessage = async (req, res) => {
  try {
    const { senderUsername, receiverUsername, content } = req.body;

    const sender = await User.findOne({ username: senderUsername });
    if (!sender) return res.status(404).json({ msg: 'Sender not found' });

    let receiver = null;

    if (receiverUsername) {
      receiver = await User.findOne({ username: receiverUsername });
      if (!receiver) return res.status(404).json({ msg: 'Receiver not found' });
    }

    const newMessage = new Message({
      sender: sender._id,
      receiver: receiver ? receiver._id : null,
      content,
    });

    await newMessage.save();

    res.status(201).json({ msg: 'Message sent', message: newMessage });
  } catch (err) {
    res.status(500).json({ msg: 'Server error', err });
  }
};

// Get messages between two users
const getMessages = async (req, res) => {
  try {
    const { senderUsername, receiverUsername } = req.query;

    const sender = await User.findOne({ username: senderUsername });
    const receiver = await User.findOne({ username: receiverUsername });

    if (!sender || !receiver) return res.status(404).json({ msg: 'Users not found' });

    const messages = await Message.find({
      $or: [
        { sender: sender._id, receiver: receiver._id },
        { sender: receiver._id, receiver: sender._id },
      ],
    }).sort('createdAt');

    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', err });
  }
};

// Get all messages (for broadcast view)
const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find({ receiver: null }).sort('createdAt');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: 'Server error', err });
  }
};

module.exports = { sendMessage, getMessages, getAllMessages };
