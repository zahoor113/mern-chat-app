import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import RegisterPage from './pages/RegisterPage'; // optional if you have a register page
import UserList from './components/UserList';
import MessageBubble from './components/MessageBubble';

const App = () => {
  const username = localStorage.getItem('username');

  return (
    <Routes>
      <Route
        path="/"
        element={!username ? <LoginPage /> : <Navigate to="/chat" />}
      />

      <Route
        path="/chat"
        element={
          username ? (
            <div className="app-container flex h-screen">
              {/* Sidebar */}
              <div className="sidebar w-1/4 bg-gray-100 p-4 flex flex-col">
                <h2 className="text-xl font-bold mb-4">Users</h2>
                <UserList />

                {/* Add User Button */}
                <button
                  onClick={() => window.location.href = "/register"}
                  className="bg-green-500 text-white px-3 py-1 rounded mt-4 hover:bg-green-600"
                >
                  Add New User
                </button>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    localStorage.removeItem('username');
                    window.location.reload();
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded mt-2 hover:bg-red-600"
                >
                  Logout
                </button>
              </div>

              {/* Chat Window */}
              <div className="chat-window flex-1 p-4 bg-white overflow-y-auto">
                {/* Assuming messages are passed from ChatPage or stored in state */}
                {/* Replace this with your actual messages mapping */}
                {/* Example below */}
                {/* messages.map(msg => <MessageBubble key={msg._id} message={msg} />) */}
                <ChatPage />
              </div>
            </div>
          ) : (
            <Navigate to="/" />
          )
        }
      />

      {/* Optional route for register page if exists */}
      {
      <Route
        path="/register"
        element={<RegisterPage />}
      />
      }
    </Routes>
  );
};

export default App;
