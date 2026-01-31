import { useEffect, useState } from "react";
import axios from "axios";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await axios.get("http://localhost:5000/api/auth/users");
      setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <ul>
      {users.map(user => (
        <li key={user._id} className="flex items-center gap-2">
          <img src={`http://localhost:5000/uploads/${user.profilePic}`} className="w-8 h-8 rounded-full"/>
          <span>{user.username}</span>
        </li>
      ))}
    </ul>
  );
}

export default UserList;
