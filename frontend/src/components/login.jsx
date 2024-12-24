import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const response = await fetch('http://localhost:5000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include', // To include cookies in the request
      });

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage(data.message);
        if (data.user.role === 'customer') {
            navigate('/customer/dashboard');
          } else if (data.user.role === 'admin') {
            navigate('/admin/dashboard');
          } else {
            console.error('Unknown role');
          }
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Login failed');
      }
    } catch (error) {
      setErrorMessage('An unexpected error occurred. Please try again.');
      console.error(error);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.header}>Login</h2>
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
        <button type="submit" style={styles.submitButton}>
          Login
        </button>
        {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
        {successMessage && <p style={styles.successMessage}>{successMessage}</p>}
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
  errorMessage: {
    marginTop: '15px',
    color: '#ff6b6b',
    textAlign: 'center',
    fontSize: '14px',
  },
  successMessage: {
    marginTop: '15px',
    color: '#4caf50',
    textAlign: 'center',
    fontSize: '14px',
  },
};

export default LoginPage;
