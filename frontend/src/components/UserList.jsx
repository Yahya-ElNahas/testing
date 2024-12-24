import React, { useEffect, useState } from 'react';
import { getAllUsers } from '../services/userService';
import { Link } from 'react-router-dom';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map(user => (
          <li key={user._id}>
            {user.username} ({user.role})
            <Link to={`/user/${user._id}`}>View</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
