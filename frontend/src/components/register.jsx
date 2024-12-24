import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './register.css'; // Ensure to import the styles

const RegisterPage = ({ user, onSubmit }) => {
  const [formData, setFormData] = useState(
    user || { email: '', username: '', password: '', role: 'customer', phone_num: '', address: '' }
  );
  const [statusMessage, setStatusMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(user ? `http://localhost:5000/user/${user._id}` : 'http://localhost:5000/user/register', {
        method: user ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setStatusMessage(user ? 'User updated successfully!' : 'User created successfully!');
        if (onSubmit) onSubmit(result);
      } else {
        const errorData = await response.json();
        setStatusMessage(`Error: ${errorData.message}`);
      }
    } catch (error) {
      setStatusMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">{user ? 'Update User' : 'Sign Up'}</h2>
        <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group-row">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone_num">Phone Number</label>
            <input
              type="text"
              id="phone_num"
              name="phone_num"
              value={formData.phone_num}
              onChange={handleChange}
              placeholder="Phone Number"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {formData.role === 'customer' && (
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                required
              />
            </div>
          )}
          <button type="submit" className="login-button">
            {user ? 'Update' : 'Create'} User
          </button>
          {statusMessage && (
            <div
              className={
                statusMessage.startsWith('Error')
                  ? 'error-message'
                  : 'success-message'
              }
            >
              {statusMessage}
            </div>
          )}
          <div className="register-link">
          Already have an account? 
          <button onClick={() => navigate('/login')} className="register-button">
            Login
          </button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
