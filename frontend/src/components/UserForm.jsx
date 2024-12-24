import React, { useState } from 'react';

const UserForm = ({ user, onSubmit }) => {
  const [formData, setFormData] = useState(
    user || { email: '', username: '', password: '', role: 'customer', phone_num: '', address: '' }
  );
  const [statusMessage, setStatusMessage] = useState('');

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
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.header}>{user ? 'Update User' : 'Create User'}</h2>
        <div style={styles.formGroup}>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <input
            type="text"
            name="phone_num"
            value={formData.phone_num}
            onChange={handleChange}
            placeholder="Phone Number"
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {formData.role === 'customer' && (
          <div style={styles.formGroup}>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              required
              style={styles.input}
            />
          </div>
        )}
        <button type="submit" style={styles.submitButton}>
          {user ? 'Update' : 'Create'} User
        </button>
        {statusMessage && <p style={styles.statusMessage}>{statusMessage}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#121212',
    color: '#f9f9f9',
  },
  form: {
    backgroundColor: '#333',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    width: '100%',
    maxWidth: '400px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#fff',
  },
  formGroup: {
    marginBottom: '15px',
  },
  input: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #444',
    backgroundColor: '#2c2c2c',
    color: '#fff',
    fontSize: '14px',
  },
  select: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #444',
    backgroundColor: '#2c2c2c',
    color: '#fff',
    fontSize: '14px',
  },
  submitButton: {
    width: '100%',
    padding: '12px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#28a745',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
  },
  statusMessage: {
    marginTop: '15px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#f9f9f9',
  },
};

export default UserForm;
