// src/components/AdminDashboard.js

import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <ul>
        <li>
          <Link to="/admin/menu">View Menu</Link>
        </li>
        <li>
          <Link to="/admin/reservations">Manage Reservations</Link>
        </li>
        <li>
          <Link to="/admin/menu">Update Menu</Link>
        </li>
        <li>
          <Link to="/admin/feedbacks">View Feedback</Link>
        </li>
          <li>
            <Link to="/account">Account</Link>
          </li>
      </ul>
    </div>
  );
};

export default AdminDashboard;
