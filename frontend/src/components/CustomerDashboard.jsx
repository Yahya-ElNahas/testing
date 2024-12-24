// src/components/CustomerDashboard.js

import React from 'react';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  return (
    <div>
      <h2>Customer Dashboard</h2>
      <ul>
        <li>
          <Link to="/customer/reserve">Reserve Table</Link>
        </li>
        <li>
          <Link to="/customer/cart">Order Food</Link>
        </li>
        <li>
          <Link to="/customer/feedback">Provide Feedback</Link>
        </li>
      </ul>
    </div>
  );
};

export default CustomerDashboard;
