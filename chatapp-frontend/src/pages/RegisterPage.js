import React, { useState } from "react";
import axios from "axios";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    if (profilePic) formData.append("profilePic", profilePic);

    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      alert("User registered successfully!");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Error registering user");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-4 border rounded">
        <h2 className="text-xl font-bold mb-2">Register New User</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-1 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-1 rounded"
          required
        />
        <input
          type="file"
          onChange={(e) => setProfilePic(e.target.files[0])}
          className="border p-1 rounded"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mt-2"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
