import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const ChatPage = () => {
  const [users, setUsers] = useState([]);
  const [receiver, setReceiver] = useState(null); // username or 'ALL'
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');

  const username = localStorage.getItem('username');
  const messagesEndRef = useRef(null);

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:5000/api/auth/users');
    setUsers(res.data.filter(u => u.username !== username));
  };

  const fetchMessages = async () => {
    if (!receiver) return;
    if (receiver === 'ALL') {
      const res = await axios.get('http://localhost:5000/api/messages/broadcast');
      setMessages(res.data);
    } else {
      const res = await axios.get(
        `http://localhost:5000/api/messages/conversation?senderUsername=${username}&receiverUsername=${receiver}`
      );
      setMessages(res.data);
    }
  };

  const handleSend = async () => {
    if (!content.trim()) return;

    const payload = {
      senderUsername: username,
      receiverUsername: receiver === 'ALL' ? null : receiver,
      content,
    };

    // Save to DB
    await axios.post('http://localhost:5000/api/messages/send', payload);

    // Emit through socket
    socket.emit('sendMessage', {
      ...payload,
      createdAt: new Date().toISOString(),
    });

    setContent('');
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchMessages();
  }, [receiver]);

  useEffect(() => {
    if (!username) return;

    // Listen to private messages
    socket.on(`privateMessage:${username}`, (msg) => {
      if (msg.senderUsername === receiver || msg.receiverUsername === username) {
        setMessages(prev => [...prev, msg]);
      }
    });

    // Listen to broadcast messages
    socket.on('broadcastMessage', (msg) => {
      if (receiver === 'ALL') {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => {
      socket.off(`privateMessage:${username}`);
      socket.off('broadcastMessage');
    };
  }, [receiver, username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex h-screen bg-gray-100 animate-fade-in">
      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-md p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Contacts</h2>

        <div
          className={`flex items-center gap-3 p-2 mb-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-green-50 ${
            receiver === 'ALL' ? 'bg-green-100 shadow-md' : ''
          }`}
          onClick={() => setReceiver('ALL')}
        >
          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
            ALL
          </div>
          <div>
            <p className="font-medium">Send to All</p>
          </div>
        </div>

        {users.map(user => (
          <div
            key={user._id}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-green-50 ${
              receiver === user.username ? 'bg-green-100 shadow-md' : ''
            }`}
            onClick={() => setReceiver(user.username)}
          >
            <img
              src={`http://localhost:5000/uploads/${user.profilePic}`}
              alt="pic"
              className="w-10 h-10 rounded-full border-2 border-green-500"
            />
            <div>
              <p className="font-medium">{user.username}</p>
              <div className="flex items-center gap-1">
                {user.isOnline && (
                  <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                )}
                <span className="text-sm text-gray-500">
                  {user.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white p-4 shadow-md flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {receiver
              ? receiver === 'ALL'
                ? 'Broadcast to All'
                : `Chat with ${receiver}`
              : 'Select a user to start chat'}
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 max-w-xs p-2 rounded-lg transition-all duration-300 ${
                msg.senderUsername === username
                  ? 'bg-green-100 ml-auto'
                  : 'bg-white'
              }`}
            >
              <p className="text-xs text-gray-500 mb-1">{msg.senderUsername}</p>
              <p className="text-sm">{msg.content}</p>
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input */}
        <div className="p-4 bg-white flex items-center gap-2">
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message"
            className="flex-1 px-4 py-2 border rounded"
          />
          <button
            onClick={handleSend}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
