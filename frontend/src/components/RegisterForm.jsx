import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // To navigate after successful registration
import { register } from '../services/authService'; // Assuming you have a register function in your service

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNum, setPhoneNum] = useState('');
  const [role, setRole] = useState('customer');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();  // For navigation after registration

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUser = {
        email,
        username,
        password,
        phone_num: phoneNum,
        role,
        address: role === 'customer' ? address : undefined, // Only include address for 'customer'
      };

      const response = await register(newUser);
      console.log('Backend response:', response);  // Log the backend response for debugging

      if (response && response.user) {
        navigate('/login'); // Redirect to login after successful registration
      }
    } catch (err) {
      console.error('Registration error:', err);  // Log detailed error
      setError(err.message);  // Display error if registration fails
    }
  };

  return (
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Display error if any */}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Phone Number</label>
          <input
            type="text"
            value={phoneNum}
            onChange={(e) => setPhoneNum(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {role === 'customer' && (
          <div>
            <label>Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
        )}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;
